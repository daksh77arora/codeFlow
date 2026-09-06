import { motion as Motion } from 'framer-motion';
import { useState } from 'react';

function TiltCard({ children, className = '', intensity = 15 }) {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const tiltX = (y - 0.5) * intensity;
        const tiltY = (x - 0.5) * -intensity;

        setTilt({ x: tiltX, y: tiltY });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    return (
        <Motion.div
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{
                rotateX: tilt.x,
                rotateY: tilt.y,
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
            }}
            style={{
                transformStyle: "preserve-3d",
                perspective: 1000,
            }}
        >
            {children}
        </Motion.div>
    );
}

export default TiltCard;
