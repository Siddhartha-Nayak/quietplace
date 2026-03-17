import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';

export default function LandingPage() {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState('join');
  const navigate = useNavigate();

  useEffect(() => {
    const savedName = localStorage.getItem('convo_sharing_name');
    if (savedName) setName(savedName);
  }, []);

  const handleAction = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    localStorage.setItem('convo_sharing_name', name.trim());

    if (mode === 'join' && roomCode.trim()) {
      navigate(`/room/${roomCode.trim()}`);
    } else if (mode === 'create') {
      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      navigate(`/room/${newCode}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 selection:bg-brand-500/30">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100/50 via-zinc-50 to-zinc-50 dark:from-brand-900/20 dark:via-zinc-950 dark:to-zinc-950"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="mb-10 text-center">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-xl shadow-brand-500/10 dark:bg-zinc-900 dark:shadow-brand-900/20"
          >
            <Share2 className="h-8 w-8 text-brand-500" strokeWidth={1.5} />
          </motion.div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Convo Sharing
          </h1>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Secure, instant, and private conversations.
          </p>
        </div>

        <Card className="overflow-hidden">
          <form onSubmit={handleAction} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Your Name</label>
                <Input
                  placeholder="How should they call you?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <AnimatePresence mode="popLayout">
                {mode === 'join' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Room Code</label>
                    <Input
                      placeholder="Enter the secret code"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      maxLength={6}
                      required={mode === 'join'}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button type="submit" className="w-full" size="lg">
              {mode === 'join' ? 'Enter Room' : 'Create New Space'}
            </Button>

            <div className="relative mt-6 text-center text-sm">
              <span className="text-zinc-500">
                {mode === 'join' ? "Don't have a code? " : "Already have a code? "}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'join' ? 'create' : 'join')}
                  className="font-medium text-brand-500 hover:text-brand-600 transition-colors"
                >
                  {mode === 'join' ? 'Create a room' : 'Join a room'}
                </button>
              </span>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
