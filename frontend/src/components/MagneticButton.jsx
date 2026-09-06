import { motion as Motion } from 'framer-motion';
import { useState } from 'react';

function MagneticButton({ children, className = '', ...props }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Magnetic effect - button follows cursor within range
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 50;

        if (distance < maxDistance) {
            setPosition({ x: x * 0.3, y: y * 0.3 });
        }
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <Motion.button
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{
                x: position.x,
                y: position.y,
            }}
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 0.1,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            {children}
        </Motion.button>
    );
}

export default MagneticButton;
