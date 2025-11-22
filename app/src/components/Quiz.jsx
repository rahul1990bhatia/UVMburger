import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react';

const Quiz = ({ moduleId, questions }) => {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    // Load previous attempt if exists
    useEffect(() => {
        const savedQuiz = localStorage.getItem(`uvmburger_quiz_${moduleId}`);
        if (savedQuiz) {
            const { answers, wasSubmitted, finalScore } = JSON.parse(savedQuiz);
            setSelectedAnswers(answers);
            setSubmitted(wasSubmitted);
            setScore(finalScore);
        }
    }, [moduleId]);

    if (!questions || questions.length === 0) {
        return null; // No quiz for this chapter
    }

    const handleAnswerSelect = (questionIndex, optionIndex) => {
        if (submitted) return; // Can't change after submission

        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: optionIndex
        }));
    };

    const handleSubmit = () => {
        let correct = 0;
        questions.forEach((q, idx) => {
            if (selectedAnswers[idx] === q.correct) {
                correct++;
            }
        });

        setScore(correct);
        setSubmitted(true);

        // Save to localStorage
        localStorage.setItem(`uvmburger_quiz_${moduleId}`, JSON.stringify({
            answers: selectedAnswers,
            wasSubmitted: true,
            finalScore: correct
        }));
    };

    const handleReset = () => {
        setSelectedAnswers({});
        setSubmitted(false);
        setScore(0);
        localStorage.removeItem(`uvmburger_quiz_${moduleId}`);
    };

    const allAnswered = Object.keys(selectedAnswers).length === questions.length;
    const percentage = submitted ? Math.round((score / questions.length) * 100) : 0;

    return (
        <div className="mt-16 border-t border-white/10 pt-12">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-burger-bun/10 rounded-lg">
                        <ClipboardCheck className="w-6 h-6 text-burger-bun" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Health Inspection Quiz</h2>
                </div>
                {submitted && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-slate-300"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Retake</span>
                    </button>
                )}
            </div>

            {/* Quiz Questions */}
            <div className="space-y-8">
                {questions.map((question, qIdx) => {
                    const isAnswered = selectedAnswers[qIdx] !== undefined;
                    const isCorrect = submitted && selectedAnswers[qIdx] === question.correct;

                    return (
                        <motion.div
                            key={qIdx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: qIdx * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-xl p-6"
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <span className="px-3 py-1 bg-burger-bun/10 border border-burger-bun/20 rounded-full text-xs font-mono text-burger-bun">
                                    Q{qIdx + 1}
                                </span>
                                <p className="flex-1 text-white font-medium leading-relaxed">{question.question}</p>
                                {submitted && (
                                    isCorrect ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                                    )
                                )}
                            </div>

                            <div className="space-y-2 ml-16">
                                {question.options.map((option, optIdx) => {
                                    const isSelected = selectedAnswers[qIdx] === optIdx;
                                    const isCorrectOption = optIdx === question.correct;
                                    const showAsCorrect = submitted && isCorrectOption;
                                    const showAsWrong = submitted && isSelected && !isCorrect;

                                    return (
                                        <button
                                            key={optIdx}
                                            onClick={() => handleAnswerSelect(qIdx, optIdx)}
                                            disabled={submitted}
                                            className={`
                        w-full text-left p-4 rounded-lg border transition-all
                        ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}
                        ${isSelected && !submitted ? 'bg-burger-cheese/10 border-burger-cheese/50 text-white' : ''}
                        ${!isSelected && !submitted ? 'bg-black/20 border-white/10 text-slate-300 hover:border-white/30' : ''}
                        ${showAsCorrect ? 'bg-green-500/10 border-green-500/50 text-green-400' : ''}
                        ${showAsWrong ? 'bg-red-500/10 border-red-500/50 text-red-400' : ''}
                        ${submitted && !isSelected && !isCorrectOption ? 'bg-black/20 border-white/5 text-slate-500' : ''}
                      `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0">
                                                    {isSelected && <span className="w-3 h-3 rounded-full bg-current" />}
                                                </span>
                                                <span>{option}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Submit Button / Results */}
            <div className="mt-8">
                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.button
                            key="submit"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleSubmit}
                            disabled={!allAnswered}
                            className={`
                w-full py-4 rounded-lg font-bold text-lg transition-all
                ${allAnswered
                                    ? 'bg-burger-cheese text-black hover:bg-burger-cheese/90 cursor-pointer'
                                    : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/10'
                                }
              `}
                        >
                            {allAnswered ? 'Submit Answers' : `Answer All Questions (${Object.keys(selectedAnswers).length}/${questions.length})`}
                        </motion.button>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-r from-burger-bun/10 to-burger-cheese/10 border border-burger-bun/20 rounded-xl p-8"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-burger-bun/20 rounded-full">
                                        <Award className="w-8 h-8 text-burger-bun" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">
                                            {percentage >= 80 ? '🌟 Excellent!' : percentage >= 60 ? '👍 Good Job!' : '📚 Keep Learning!'}
                                        </h3>
                                        <p className="text-slate-400">
                                            You scored <span className="font-bold text-burger-cheese">{score}/{questions.length}</span> ({percentage}%)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Quiz;
