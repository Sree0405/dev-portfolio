import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        sreeDev:
          "btn-sree-dev border-0 shadow-none hover:brightness-[1.02] active:scale-[0.98]",
        default:
          "btn-gradient border-0 text-primary-foreground shadow-[0_8px_28px_hsl(var(--primary)/0.35)] hover:shadow-[0_12px_36px_hsl(var(--primary)/0.42),0_0_32px_hsl(var(--primary-glow)/0.2)] hover:brightness-[1.06] active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "btn-glass border border-border/60 bg-transparent text-foreground hover:text-foreground",
        secondary:
          "border border-border/50 bg-secondary/80 text-secondary-foreground backdrop-blur-sm hover:bg-secondary hover:border-primary/25",
        ghost: "hover:bg-muted/50 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glass:
          "btn-glass rounded-xl font-medium text-foreground shadow-[0_4px_24px_rgba(0,0,0,0.2)]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
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
