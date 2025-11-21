import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const MainLayout = ({ children, modules, currentModuleId, onSelectModule }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="flex min-h-screen bg-dark-bg text-slate-200 font-sans selection:bg-burger-bun selection:text-white overflow-hidden relative">

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-burger-bun/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-burger-leaf/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <Sidebar
                modules={modules}
                currentModuleId={currentModuleId}
                onSelectModule={onSelectModule}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 relative z-10 h-screen overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden p-4 flex items-center justify-between bg-dark-bg/80 backdrop-blur-md border-b border-white/5 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-white tracking-tight">
                        <span className="text-burger-bun">UVM</span> Burger
                    </span>
                    <div className="w-8" /> {/* Spacer */}
                </div>

                <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8 xl:p-12">
                    <div className="max-w-5xl mx-auto w-full pb-20">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
