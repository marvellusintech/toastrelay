import * as React from 'react';
import { cn } from '@/lib/utils';

// Converted to a clean type alias to fix the empty-object-type lint warning
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white placeholder:text-white/20 transition-all focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 font-body",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };