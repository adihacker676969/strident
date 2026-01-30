/**
 * generate-learning-path Edge Function
 * Uses Lovable AI to generate a structured learning path from a subject/syllabus
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the API key
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Parse the request body
    const { subject, level, syllabusText } = await req.json();

    if (!subject) {
      return new Response(
        JSON.stringify({ error: "Subject is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build the prompt for AI
    const systemPrompt = `You are an expert educational curriculum designer. Your task is to create a structured learning path for students.

IMPORTANT: You must respond with ONLY valid JSON, no markdown, no code blocks, just pure JSON.

For each topic, include:
- name: Clear, concise topic name
- description: 1-2 sentence description of what the student will learn
- difficulty: "easy", "medium", or "hard"
- estimated_time: Estimated study time in minutes (15-60)
- xp_reward: XP points (50-150 based on difficulty)

Create 6-12 topics that progressively build knowledge from foundational to advanced concepts.`;

    const userPrompt = `Create a learning path for: ${subject}
Learning level: ${level}
${syllabusText ? `\nSyllabus/Topics provided by user:\n${syllabusText}` : ''}

Respond with JSON in this exact format:
{
  "topics": [
    {
      "name": "Topic Name",
      "description": "What the student will learn",
      "difficulty": "easy",
      "estimated_time": 30,
      "xp_reward": 100
    }
  ]
}`;

    // Call Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    // Handle rate limiting
    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle payment required
    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }),
        {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate learning path");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the AI response
    // Handle potential markdown code blocks
    let jsonContent = content.trim();
    if (jsonContent.startsWith("```json")) {
      jsonContent = jsonContent.slice(7);
    }
    if (jsonContent.startsWith("```")) {
      jsonContent = jsonContent.slice(3);
    }
    if (jsonContent.endsWith("```")) {
      jsonContent = jsonContent.slice(0, -3);
    }
    jsonContent = jsonContent.trim();

    const parsedContent = JSON.parse(jsonContent);

    // Validate the response structure
    if (!parsedContent.topics || !Array.isArray(parsedContent.topics)) {
      throw new Error("Invalid response structure from AI");
    }

    // Return the parsed learning path
    return new Response(
      JSON.stringify(parsedContent),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("generate-learning-path error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to generate learning path" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
