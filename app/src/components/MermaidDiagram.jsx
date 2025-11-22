import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
});

const MermaidDiagram = ({ chart }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            mermaid.run({
                nodes: [ref.current],
            });
        }
    }, [chart]);

    return (
        <div className="mermaid bg-gray-900 p-4 rounded-lg overflow-x-auto flex justify-center my-6" ref={ref}>
            {chart}
        </div>
    );
};

export default MermaidDiagram;
