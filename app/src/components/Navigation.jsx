import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Navigation = ({ onNext, onPrev, hasNext, hasPrev }) => {
    return (
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-800">
            <button
                onClick={onPrev}
                disabled={!hasPrev}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${hasPrev
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-600 cursor-not-allowed'
                    }`}
            >
                <ChevronLeft size={20} />
                Previous
            </button>

            <button
                onClick={onNext}
                disabled={!hasNext}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${hasNext
                        ? 'bg-amber-500 text-gray-900 hover:bg-amber-400'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
            >
                Next
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default Navigation;
