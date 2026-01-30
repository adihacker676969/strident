-- Fix the security definer view issue
-- Drop the existing leaderboard view
DROP VIEW IF EXISTS public.leaderboard;

-- Recreate as a security invoker view (default, no security definer)
CREATE VIEW public.leaderboard 
WITH (security_invoker = true) AS
SELECT 
  p.id,
  p.user_id,
  p.username,
  p.full_name,
  p.avatar_url,
  p.xp,
  p.level,
  p.streak,
  p.badges,
  RANK() OVER (ORDER BY p.xp DESC) as rank
FROM public.profiles p
WHERE p.xp > 0
ORDER BY p.xp DESC;