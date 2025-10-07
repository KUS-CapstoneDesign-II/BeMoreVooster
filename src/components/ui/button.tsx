import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary action - Dusty Teal
        default: "bg-primary text-primary-foreground hover:bg-primary/90",

        // Destructive action - Coral
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",

        // Outline style
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",

        // Secondary action - Muted Lavender
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        // Ghost style
        ghost: "hover:bg-accent hover:text-accent-foreground",

        // Link style - Sky Blue
        link: "text-highlight underline-offset-4 hover:underline",

        // Brand variants - Direct brand color usage
        "brand-teal": "bg-brand-teal text-white hover:bg-brand-teal/90",
        "brand-navy": "bg-brand-navy text-white hover:bg-brand-navy/90",
        "brand-slate": "bg-brand-slate text-brand-navy hover:bg-brand-slate/90",

        // Semantic action variants
        success: "bg-success text-white hover:bg-success/90",
        warning: "bg-warning text-white hover:bg-warning/90",
        highlight: "bg-highlight text-white hover:bg-highlight/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
