import React from 'react';
import { motion } from 'framer-motion';

const BurgerGraphic = ({ className }) => {
    return (
        <div className={`relative w-64 h-64 ${className}`}>
            <motion.svg
                viewBox="0 0 200 200"
                className="w-full h-full drop-shadow-2xl"
                initial="initial"
                animate="animate"
            >
                {/* Bottom Bun */}
                <motion.path
                    d="M20,140 Q100,180 180,140 L180,120 Q100,160 20,120 Z"
                    fill="#F59E0B"
                    variants={{
                        initial: { y: 100, opacity: 0 },
                        animate: { y: 0, opacity: 1, transition: { delay: 0.1, duration: 0.5 } }
                    }}
                />

                {/* Lettuce */}
                <motion.path
                    d="M15,125 Q40,110 60,125 T100,125 T140,125 T185,125 L180,135 Q100,145 20,135 Z"
                    fill="#10B981"
                    variants={{
                        initial: { y: 100, opacity: 0 },
                        animate: { y: 0, opacity: 1, transition: { delay: 0.2, duration: 0.5 } }
                    }}
                />

                {/* Patty */}
                <motion.rect
                    x="25" y="100" width="150" height="25" rx="10"
                    fill="#78350F"
                    variants={{
                        initial: { y: 100, opacity: 0 },
                        animate: { y: 0, opacity: 1, transition: { delay: 0.3, duration: 0.5 } }
                    }}
                />

                {/* Cheese */}
                <motion.path
                    d="M25,100 L175,100 L165,115 L140,100 L115,115 L90,100 L65,115 L40,100 L35,115 Z"
                    fill="#FCD34D"
                    variants={{
                        initial: { y: 100, opacity: 0 },
                        animate: { y: 0, opacity: 1, transition: { delay: 0.4, duration: 0.5 } }
                    }}
                />

                {/* Tomato */}
                <motion.rect
                    x="35" y="85" width="130" height="15" rx="5"
                    fill="#EF4444"
                    variants={{
                        initial: { y: 100, opacity: 0 },
                        animate: { y: 0, opacity: 1, transition: { delay: 0.5, duration: 0.5 } }
                    }}
                />

                {/* Top Bun */}
                <motion.path
                    d="M20,85 Q100,10 180,85 Z"
                    fill="#F59E0B"
                    variants={{
                        initial: { y: 100, opacity: 0 },
                        animate: { y: 0, opacity: 1, transition: { delay: 0.6, duration: 0.5 } }
                    }}
                />

                {/* Sesame Seeds */}
                <motion.g
                    fill="#FEF3C7"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.8 } }}
                >
                    <circle cx="60" cy="50" r="2" />
                    <circle cx="80" cy="40" r="2" />
                    <circle cx="100" cy="35" r="2" />
                    <circle cx="120" cy="40" r="2" />
                    <circle cx="140" cy="50" r="2" />
                    <circle cx="70" cy="60" r="2" />
                    <circle cx="130" cy="60" r="2" />
                </motion.g>
            </motion.svg>
        </div>
    );
};

export default BurgerGraphic;
