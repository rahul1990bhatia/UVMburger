import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import CodeBlock from './components/CodeBlock';
import AnalogyBox from './components/AnalogyBox';
import Navigation from './components/Navigation';
import BurgerGraphic from './components/BurgerGraphic';
import CommentSection from './components/CommentSection';
import Quiz from './components/Quiz';
import UVMArchitectureViz from './components/UVMArchitectureViz';
import MermaidDiagram from './components/MermaidDiagram';
import modulesData from './data/modules.json';

function App() {
  const [currentModuleId, setCurrentModuleId] = useState(modulesData[0].id);
  const currentModuleIndex = modulesData.findIndex(m => m.id === currentModuleId);
  const currentModule = modulesData[currentModuleIndex];

  // Scroll to top when module changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentModuleId]);

  const handleNext = () => {
    if (currentModuleIndex < modulesData.length - 1) {
      setCurrentModuleId(modulesData[currentModuleIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleId(modulesData[currentModuleIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <MainLayout
      modules={modulesData}
      currentModuleId={currentModuleId}
      onSelectModule={setCurrentModuleId}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentModuleId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-12"
        >
          {/* Hero Section */}
          <header className="relative border-b border-white/10 pb-12">
            <div className="flex flex-col-reverse lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 text-burger-bun mb-6">
                  <span className="px-3 py-1 bg-burger-bun/10 border border-burger-bun/20 rounded-full text-xs font-mono font-medium tracking-wide">
                    CHAPTER {String(currentModuleIndex + 1).padStart(2, '0')}
                  </span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                  {currentModule.title}
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                  Master UVM concepts through the art of burger making.
                </p>
              </div>

              {/* Hero Graphic (Global) */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:block"
              >
                <BurgerGraphic className="w-48 h-48 lg:w-64 lg:h-64 animate-float" />
              </motion.div>
            </div>
          </header>

          {/* Analogy */}
          {currentModule.analogy && (
            <AnalogyBox
              role={currentModule.analogy.role}
              description={currentModule.analogy.description}
            />
          )}

          {/* Content */}
          <div className="text-slate-300 leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Headings
                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-white mt-12 mb-6" {...props} />,
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-bold text-burger-bun mt-12 mb-4 flex items-center gap-3 pb-2 border-b border-white/10" {...props}>
                    {props.children}
                  </h2>
                ),
                h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-white mt-8 mb-3" {...props} />,

                // Lists
                ul: ({ node, ...props }) => <ul className="space-y-3 my-6" {...props} />,
                li: ({ node, ...props }) => (
                  <li className="flex items-start gap-3" {...props}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-burger-leaf shrink-0" />
                    <span>{props.children}</span>
                  </li>
                ),

                // Text Styles
                strong: ({ node, ...props }) => <strong className="font-bold text-burger-cheese" {...props} />,
                p: ({ node, ...props }) => <p className="mb-6" {...props} />,

                // Tables
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-8 rounded-lg border border-white/10">
                    <table className="w-full text-left border-collapse" {...props} />
                  </div>
                ),
                thead: ({ node, ...props }) => <thead className="bg-white/5 text-burger-bun" {...props} />,
                tbody: ({ node, ...props }) => <tbody className="divide-y divide-white/10" {...props} />,
                tr: ({ node, ...props }) => <tr className="hover:bg-white/5 transition-colors" {...props} />,
                th: ({ node, ...props }) => <th className="p-4 font-semibold text-sm uppercase tracking-wider border-b border-white/10" {...props} />,
                td: ({ node, ...props }) => <td className="p-4 text-slate-300 border-b border-white/5" {...props} />,

                // Code
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const lang = match ? match[1] : '';

                  if (!inline && lang === 'uvm-viz') {
                    return <UVMArchitectureViz />;
                  }

                  if (!inline && lang === 'mermaid') {
                    return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
                  }

                  return !inline && match ? (
                    <CodeBlock
                      code={String(children).replace(/\n$/, '')}
                      language={match[1]}
                    />
                  ) : (
                    <code className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-burger-cheese text-sm font-mono" {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {currentModule.contentMarkdown}
            </ReactMarkdown>
          </div>

          {/* Explicit Code Snippet */}
          {currentModule.codeSnippet && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-white/10"></div>
                <h3 className="text-xl font-semibold text-white font-mono">CODE EXAMPLE</h3>
                <div className="h-px flex-1 bg-white/10"></div>
              </div>
              <CodeBlock
                code={currentModule.codeSnippet}
                language={currentModule.codeLanguage || 'systemverilog'}
              />
            </motion.div>
          )}

          {/* Quiz Section */}
          {currentModule.quiz && (
            <Quiz moduleId={currentModuleId} questions={currentModule.quiz} />
          )}

          {/* Comment Section */}
          <CommentSection moduleId={currentModuleId} />

          {/* Navigation */}
          <Navigation
            onNext={handleNext}
            onPrev={handlePrev}
            hasNext={currentModuleIndex < modulesData.length - 1}
            hasPrev={currentModuleIndex > 0}
          />
        </motion.div>
      </AnimatePresence>
    </MainLayout>
  );
}

export default App;
