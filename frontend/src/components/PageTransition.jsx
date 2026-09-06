import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router';

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
    },
    exit: {
        opacity: 0,
        y: -20,
    },
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4,
};

function PageTransition({ children }) {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Motion.div
                key={location.pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
            >
                {children}
            </Motion.div>
        </AnimatePresence>
    );
}

export default PageTransition;
