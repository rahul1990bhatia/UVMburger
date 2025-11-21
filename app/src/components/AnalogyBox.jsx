import React from 'react';
import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const AnalogyBox = ({ role, description }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="relative group my-10"
        >
            {/* Gradient Border Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-burger-bun to-burger-leaf rounded-2xl opacity-30 group-hover:opacity-70 blur transition duration-500"></div>

            <div className="relative bg-dark-card rounded-xl p-6 lg:p-8 border border-white/10 shadow-xl">
                <div className="flex items-start gap-6">
                    <div className="p-4 bg-burger-bun/10 rounded-2xl text-burger-bun shrink-0 border border-burger-bun/20 shadow-inner">
                        <Lightbulb size={28} />
                    </div>
                    <div>
                        <h4 className="text-burger-bun font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                            <span className="w-8 h-px bg-burger-bun/50"></span>
                            The Analogy: {role}
                        </h4>
                        <p className="text-slate-200 text-xl leading-relaxed font-light">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AnalogyBox;
