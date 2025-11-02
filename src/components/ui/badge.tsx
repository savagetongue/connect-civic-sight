import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-smooth",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        success: "border-transparent bg-success text-success-foreground",
        warning: "border-transparent bg-warning text-warning-foreground",
        info: "border-transparent bg-info text-info-foreground",
        outline: "border-border text-foreground",
        "status-submitted": "border-transparent bg-info/10 text-info border border-info/20",
        "status-triaged": "border-transparent bg-warning/10 text-warning border border-warning/20",
        "status-assigned": "border-transparent bg-primary/10 text-primary border border-primary/20",
        "status-in_progress": "border-transparent bg-secondary/10 text-secondary border border-secondary/20",
        "status-resolved": "border-transparent bg-success/10 text-success border border-success/20",
        "status-closed": "border-transparent bg-muted text-muted-foreground border border-border",
        "status-rejected": "border-transparent bg-destructive/10 text-destructive border border-destructive/20",
        "status-escalated": "border-transparent bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
