import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-primary hover:text-black shadow-xl shadow-white/5",
        inverse: "bg-black text-white hover:bg-primary hover:text-black border border-white/5 shadow-xl",
        destructive: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white",
        outline: "border border-white/10 bg-transparent text-white hover:bg-white/5 hover:border-white/30",
        ghost: "text-white/40 hover:text-white hover:bg-white/5",
        glass: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10",
        circle: "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20",
      },
      size: {
        default: "h-14 px-8 rounded-2xl text-[10px]",
        sm: "h-10 px-4 rounded-xl text-[9px]",
        lg: "h-16 px-10 rounded-2xl text-xs tracking-tighter",
        icon: "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };