import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-black text-white hover:bg-gray-800 rounded-sm px-6 py-3 font-medium',
        secondary:
          'bg-transparent text-black border border-black hover:bg-black hover:text-white rounded-sm px-6 py-3',
        outline:
          'border border-gray-300 bg-white hover:bg-gray-50 rounded-sm px-6 py-3',
        ghost: 'hover:bg-gray-100 rounded-sm px-6 py-3',
        link: 'text-black underline-offset-4 hover:underline px-6 py-3',
        destructive:
          'bg-gray-800 text-white hover:bg-gray-900 rounded-sm px-6 py-3',
      },
      size: {
        sm: 'h-8 px-4 py-2 text-xs',
        default: 'h-10 px-6 py-3 text-sm',
        lg: 'h-12 px-8 py-4 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
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
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
