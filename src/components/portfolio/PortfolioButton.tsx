import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const portfolioButtonVariants = cva(
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-[background,transform,border-color,color,box-shadow] duration-[var(--motion-normal,250ms)] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary px-6 py-2.5 text-primary-foreground shadow-[0_8px_22px_hsl(var(--primary)/0.28)] hover:bg-[hsl(var(--primary-light))] hover:shadow-[0_10px_28px_hsl(var(--primary)/0.34)] active:bg-[hsl(var(--primary-pressed))] active:scale-[0.98] hover:scale-[1.02]",
        secondary:
          "border border-primary/35 bg-primary/5 px-5 py-2.5 text-foreground hover:border-primary/55 hover:bg-primary/12 active:scale-[0.98]",
        ghost:
          "bg-transparent px-4 py-2.5 portfolio-text-muted hover:bg-primary/8 hover:text-primary",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "primary",
      fullWidth: false,
    },
  },
);

export type PortfolioButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof portfolioButtonVariants> & {
    asChild?: boolean;
  };

/**
 * Portfolio-only button — solid brand, teal tokens, richer light/dark presence.
 */
export function PortfolioButton({
  className,
  variant,
  fullWidth,
  asChild = false,
  ...props
}: PortfolioButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(portfolioButtonVariants({ variant, fullWidth }), className)}
      {...props}
    />
  );
}
