import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      size: {
        default: "px-2.5 py-0.5", // Default size styles
        large: "px-4 py-2", // Larger size styles
        xl: "px-6 py-3", // Extra large size styles
      },
      variant: {
        default:
          "border-black bg-white text-black hover:bg-black/80", // Default variant styles
        secondary:
          "border-black bg-white text-black hover:bg-black/80", // Secondary variant styles
        destructive:
          "border-black bg-white text-black hover:bg-black/80", // Destructive variant styles
        outline: "text-black", // Outline variant styles
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  size,
  ...props
}) {
  return (
    <div className={cn(badgeVariants({ size, variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
