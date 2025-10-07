import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Default - Dusty Teal
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",

        // Secondary - Muted Lavender
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",

        // Destructive - Coral
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",

        // Outline
        outline: "text-foreground",

        // Semantic variants
        success:
          "border-transparent bg-success text-white hover:bg-success/80",
        warning:
          "border-transparent bg-warning text-white hover:bg-warning/80",
        highlight:
          "border-transparent bg-highlight text-white hover:bg-highlight/80",

        // Brand variants
        "brand-navy":
          "border-transparent bg-brand-navy text-white hover:bg-brand-navy/80",
        "brand-teal":
          "border-transparent bg-brand-teal text-white hover:bg-brand-teal/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
