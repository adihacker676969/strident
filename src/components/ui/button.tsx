import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Enhanced button variants for StudyFlow AI
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Default primary button with gradient effect
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md active:scale-[0.98]",
        
        // Destructive/danger actions
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        
        // Outline style
        outline: "border-2 border-input bg-background hover:bg-secondary hover:border-primary/50 text-foreground",
        
        // Secondary muted style
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
        
        // Ghost - minimal hover effect
        ghost: "hover:bg-secondary hover:text-foreground",
        
        // Link style
        link: "text-primary underline-offset-4 hover:underline",
        
        // Hero button - prominent gradient style for CTAs (purple to blue)
        hero: "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] font-bold",
        
        // Success button for positive actions
        success: "bg-studyflow-success text-primary-foreground hover:bg-studyflow-success/90 shadow-sm",
        
        // XP/Gamification themed button
        xp: "bg-gradient-to-r from-studyflow-xp to-studyflow-badge text-primary-foreground shadow-lg hover:shadow-md font-bold",
        
        // Streak themed button
        streak: "bg-gradient-to-r from-studyflow-streak to-studyflow-warning text-primary-foreground shadow-lg hover:shadow-md font-bold",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
