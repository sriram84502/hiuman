import React from 'react';
import { cn } from '../../lib/utils';

const Card = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
    const variants = {
        default: "bg-card text-card-foreground border border-white/10 shadow-sm",
        glass: "bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl",
        neon: "bg-black/80 border border-neon-purple/50 shadow-[0_0_15px_rgba(217,70,239,0.15)]",
    };

    return (
        <div
            ref={ref}
            className={cn(
                "rounded-xl p-6",
                variants[variant] || variants.default,
                className
            )}
            {...props}
        />
    );
});

Card.displayName = "Card";

export { Card };
