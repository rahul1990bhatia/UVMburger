import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User } from 'lucide-react';

const CommentSection = ({ moduleId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [username, setUsername] = useState('');

    // Load comments from localStorage on mount or moduleId change
    useEffect(() => {
        const savedComments = localStorage.getItem(`uvmburger_comments_${moduleId}`);
        if (savedComments) {
            setComments(JSON.parse(savedComments));
        } else {
            setComments([]);
        }
    }, [moduleId]);

    // Save comments to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(`uvmburger_comments_${moduleId}`, JSON.stringify(comments));
    }, [comments, moduleId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim() || !username.trim()) return;

        const comment = {
            id: Date.now(),
            user: username,
            text: newComment,
            date: new Date().toLocaleDateString(),
            role: 'Trainee' // Default role
        };

        setComments([comment, ...comments]);
        setNewComment('');
    };

    return (
        <div className="mt-16 border-t border-white/10 pt-12">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-burger-cheese/10 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-burger-cheese" />
                </div>
                <h2 className="text-2xl font-bold text-white">Customer Reviews</h2>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-12 bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="md:col-span-1">
                        <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">Name</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Chef Name"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/20 focus:outline-none focus:border-burger-cheese/50 transition-colors"
                            required
                        />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">Review</label>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts on this chapter..."
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/20 focus:outline-none focus:border-burger-cheese/50 transition-colors"
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2 bg-burger-cheese text-black font-bold rounded-lg hover:bg-burger-cheese/90 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                        <span>Post Review</span>
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                    {comments.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 border border-dashed border-white/10 rounded-xl text-slate-500"
                        >
                            <p>No reviews yet. Be the first to critique this chapter!</p>
                        </motion.div>
                    ) : (
                        comments.map((comment) => (
                            <motion.div
                                key={comment.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white/5 border border-white/5 rounded-xl p-6 flex gap-4"
                            >
                                <div className="shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burger-bun to-burger-patty flex items-center justify-center text-black font-bold">
                                        {comment.user.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-bold text-white">{comment.user}</h4>
                                            <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-mono text-burger-cheese uppercase tracking-wide">
                                                {comment.role}
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-500 font-mono">{comment.date}</span>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed">{comment.text}</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CommentSection;
