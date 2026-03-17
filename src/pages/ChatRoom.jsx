import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, File, Paperclip, LogOut, Moon, Sun, Volume2, VolumeX, Share2 } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';

export default function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [userName, setUserName] = useState('');

  // Audio for notifications
  const notifySound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3'));

  useEffect(() => {
    const savedName = localStorage.getItem('convo_sharing_name');
    if (!savedName) {
      navigate('/');
      return;
    }
    setUserName(savedName);

    // Dark mode check
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, [navigate]);

  useEffect(() => {
    if (!roomId) return;

    const q = query(
      collection(db, 'rooms', roomId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setMessages(p => {
        // Play sound if new message arrived and it's not from us
        if (soundEnabled && newMessages.length > p.length && newMessages[newMessages.length - 1].sender !== userName) {
          notifySound.current.play().catch(() => {});
        }
        return newMessages;
      });
    });

    return () => unsubscribe();
  }, [roomId, userName, soundEnabled]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleSendText = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !roomId) return;

    const textToSend = newMessage;
    setNewMessage(''); // optimistic clear

    try {
      await addDoc(collection(db, 'rooms', roomId, 'messages'), {
        text: textToSend,
        sender: userName,
        timestamp: serverTimestamp(),
        type: 'text'
      });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !roomId) return;

    try {
      const isImage = file.type.startsWith('image/');
      const storageRef = ref(storage, `rooms/${roomId}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, 'rooms', roomId, 'messages'), {
        text: isImage ? 'Shared an image' : 'Shared a file',
        sender: userName,
        timestamp: serverTimestamp(),
        type: isImage ? 'image' : 'file',
        fileUrl: downloadURL,
        fileName: file.name
      });
    } catch (err) {
      console.error('Error uploading file:', err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const leaveRoom = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-50 transition-colors duration-500 dark:bg-zinc-950">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/50 bg-white/80 px-6 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/80">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/20">
            <Share2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Convo: {roomId}</h2>
            <p className="text-xs font-medium text-brand-500">Secure connection</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)} aria-label="Toggle sound">
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-zinc-400" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <div className="mx-2 h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
          <Button variant="ghost" size="icon" onClick={leaveRoom} aria-label="Leave room" className="text-red-500 hover:text-red-600 dark:hover:text-red-400">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => {
              const isMine = msg.sender === userName;
              const showName = idx === 0 || messages[idx - 1].sender !== msg.sender;
              
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  {!isMine && showName && (
                    <span className="mb-1 ml-2 text-xs font-medium text-zinc-500">
                      {msg.sender}
                    </span>
                  )}
                  
                  <div
                    className={`group relative max-w-[80%] rounded-3xl px-5 py-3 shadow-sm transition-shadow hover:shadow-md ${
                      isMine
                        ? 'rounded-tr-sm bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-brand-500/20'
                        : 'rounded-tl-sm bg-white text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:shadow-black/20 text-balance border border-zinc-100 dark:border-zinc-800/50'
                    }`}
                  >
                    {msg.type === 'image' && msg.fileUrl ? (
                      <div className="mb-2 overflow-hidden rounded-xl">
                        <img src={msg.fileUrl} alt="Shared" className="max-h-64 object-cover" loading="lazy" />
                      </div>
                    ) : msg.type === 'file' && msg.fileUrl ? (
                      <a 
                        href={msg.fileUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className={`mb-2 flex items-center gap-3 rounded-xl p-3 transition-colors ${isMine ? 'bg-white/10 hover:bg-white/20' : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700'}`}
                      >
                        <File className="h-5 w-5 opacity-80" />
                        <span className="truncate text-sm font-medium">{msg.fileName}</span>
                      </a>
                    ) : null}

                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                    
                    <span className={`absolute bottom-1 right-3 text-[10px] opacity-0 transition-opacity group-hover:opacity-100 ${isMine ? 'text-brand-100' : 'text-zinc-400'}`}>
                      {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Now'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-4 gap-4" />
        </div>
      </main>

      {/* Input Area */}
      <footer className="shrink-0 border-t border-zinc-200/50 bg-white/50 p-4 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/50">
        <form onSubmit={handleSendText} className="mx-auto flex max-w-3xl items-end gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            className="shrink-0 mb-1" 
            onClick={() => fileInputRef.current?.click()}
            title="Attach file or image"
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="h-14 rounded-3xl"
          />

          <Button type="submit" size="icon" className="mb-1 shrink-0 h-12 w-12 rounded-full" disabled={!newMessage.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
