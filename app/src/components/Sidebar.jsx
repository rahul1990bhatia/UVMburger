import React from 'react';
import {
    Store, FlaskConical, Cpu, ScrollText, User,
    ChefHat, Eye, ClipboardCheck, Network, Play, X
} from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = {
    Store, FlaskConical, Cpu, ScrollText, User,
    ChefHat, Eye, ClipboardCheck, Network, Play
};

const Sidebar = ({ modules, currentModuleId, onSelectModule, isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {(isOpen || window.innerWidth >= 1024) && (
                <>
                    {/* Mobile Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={onClose}
                    />

                    {/* Sidebar Panel */}
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed lg:static inset-y-0 left-0 z-50 w-80 p-4 lg:p-6"
                    >
                        <div className="h-full glass rounded-2xl flex flex-col overflow-hidden">
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-burger-bun/10 to-transparent">
                                <div>
                                    <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
                                        <span className="text-burger-bun">UVM</span> Burger
                                    </h1>
                                    <p className="text-xs text-slate-400 font-mono mt-1">VERIFICATION SHOP</p>
                                </div>
                                <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                                {modules.map((module, index) => {
                                    const Icon = iconMap[module.icon] || Store;
                                    const isActive = currentModuleId === module.id;

                                    return (
                                        <button
                                            key={module.id}
                                            onClick={() => {
                                                onSelectModule(module.id);
                                                if (window.innerWidth < 1024) onClose();
                                            }}
                                            className={clsx(
                                                "w-full flex items-center gap-4 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 relative group overflow-hidden",
                                                isActive
                                                    ? "text-white shadow-lg shadow-burger-bun/20"
                                                    : "text-slate-400 hover:text-white"
                                            )}
                                        >
                                            {/* Active Background */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute inset-0 bg-gradient-to-r from-burger-bun to-burger-cheese opacity-100"
                                                    initial={false}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                />
                                            )}

                                            {/* Hover Background */}
                                            {!isActive && (
                                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            )}

                                            <span className={clsx(
                                                "relative z-10 p-2 rounded-lg transition-colors",
                                                isActive ? "bg-white/20 text-white" : "bg-dark-bg text-slate-400 group-hover:text-burger-bun"
                                            )}>
                                                <Icon size={18} />
                                            </span>

                                            <div className="relative z-10 flex-1 text-left">
                                                <span className="block text-xs opacity-60 font-mono mb-0.5">Chapter {index + 1}</span>
                                                <span className="block font-semibold truncate">{module.title}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </nav>

                            {/* Footer */}
                            <div className="p-4 border-t border-white/10 bg-black/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-burger-leaf animate-pulse"></div>
                                    <span className="text-xs text-slate-400 font-mono">System Online</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Sidebar;
