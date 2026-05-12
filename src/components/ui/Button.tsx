import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const variants = {
      primary: "bg-primary text-dark-bg hover:bg-primary/90 font-bold uppercase tracking-wider",
      secondary: "bg-secondary text-dark-bg hover:bg-secondary/90 font-bold uppercase tracking-wider",
      outline: "border-2 border-primary text-primary hover:bg-primary hover:text-dark-bg font-bold uppercase tracking-wider",
      ghost: "text-foreground hover:bg-dark-surface font-medium",
      danger: "bg-accent text-white hover:bg-accent/90 font-bold uppercase tracking-wider",
    }

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
      xl: "px-8 py-4 text-lg",
    }

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-none transition-all duration-200 active:scale-95 disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
