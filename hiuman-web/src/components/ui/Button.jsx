import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    const variants = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
        neon: "bg-neon-green text-black font-bold hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] hover:bg-neon-green/90 transition-shadow",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
    };

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8 text-lg",
        icon: "h-10 w-10",
    };

    return (
        <motion.button
            ref={ref}
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
});

Button.displayName = "Button";

export { Button };
