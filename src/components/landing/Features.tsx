'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Zap, Layers, Target, Rocket, BookOpen, CheckCircle2, ChevronRight, Play, Clock, BarChart3, Workflow, Camera, MessageSquare, ChevronDown, ListTodo, Search, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// --- Helper Components ---

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="8" r="4" strokeWidth="2" />
    <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" strokeWidth="2" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- Demo Components ---

const YourNotesDemo = () => {
  const [phase, setPhase] = useState(0); // 0: Personalize, 1: Generate, 2: Master

  useEffect(() => {
    if (phase === 1) {
      const timer = setTimeout(() => setPhase(2), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  return (
    <div className="w-full h-full p-6 flex flex-col gap-4 overflow-hidden bg-black/5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* 1. Personalize */}
        <motion.div
          animate={{ opacity: phase >= 0 ? 1 : 0.5 }}
          className={cn("bg-zinc-900/50 border rounded-2xl p-6 flex flex-col gap-6 transition-all", phase === 0 ? "border-primary/30" : "border-white/5")}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">01. Setup</span>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-zinc-500 uppercase">Style</label>
              <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-white/20">
                <span className="text-xs text-white">Humorous</span>
                <ChevronDown className="w-3 h-3 text-zinc-600" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-zinc-500 uppercase">Focus</label>
              <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-white/20">
                <span className="text-xs text-white">Advanced</span>
                <ChevronDown className="w-3 h-3 text-zinc-600" />
              </div>
            </div>
          </div>
          <Button
            onClick={() => phase === 0 && setPhase(1)}
            className={cn("h-10 mt-auto rounded-xl text-[10px] font-bold uppercase tracking-wider", phase === 0 ? "bg-primary text-white" : "bg-zinc-800 text-zinc-500")}
          >
            {phase === 0 ? "Generate" : "Ready"}
          </Button>
        </motion.div>

        {/* 2. Process */}
        <motion.div
          animate={{ opacity: phase >= 1 ? 1 : 0.5 }}
          className={cn("bg-zinc-900/50 border rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all", phase === 1 ? "border-primary/30" : "border-white/5")}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">02. Logic</span>
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            {phase === 1 ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent"
              />
            ) : phase > 1 ? (
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            ) : (
              <div className="w-10 h-10 rounded-full border-2 border-zinc-800" />
            )}
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              {phase === 1 ? "Analyzing..." : phase > 1 ? "Complete" : "Standby"}
            </p>
          </div>
        </motion.div>

        {/* 3. Output */}
        <motion.div
          animate={{ opacity: phase >= 2 ? 1 : 0.5 }}
          className={cn("bg-zinc-900/50 border rounded-2xl p-6 flex flex-col gap-4 transition-all", phase === 2 ? "border-primary/30" : "border-white/5")}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">03. Result</span>
          <AnimatePresence mode="wait">
            {phase === 2 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <p className="text-sm font-bold text-white leading-relaxed">The Alexander Strategy</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                  He named 70 cities after himself. That's branding. Let's deconstruct his legacy...
                </p>
                <Button onClick={() => setPhase(0)} variant="link" className="text-[10px] text-zinc-500 h-auto p-0 hover:text-primary">Reset Demo</Button>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                <Rocket className="w-8 h-8 text-zinc-500" />
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

const QuizDemoMatch = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const options = ["Leonardo da Vinci", "Niccolò Machiavelli", "Thomas Hobbes"];

  return (
    <div className="w-full h-full p-8 flex flex-col gap-8 justify-center h-full">
      <p className="text-lg font-bold text-white tracking-tight leading-snug">Who wrote "The Prince"?</p>
      <div className="space-y-3">
        {options.map((opt, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelected(i)}
            className={cn(
              "group border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all duration-200",
              selected === i
                ? (i === 1 ? "bg-green-500/10 border-green-500/50" : "bg-red-500/10 border-red-500/50")
                : "bg-zinc-900 border-white/5 hover:border-white/10"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                selected === i
                  ? (i === 1 ? "border-green-500" : "border-red-500")
                  : "border-zinc-800"
              )}>
                {selected === i && (
                  <div className={cn("w-2 h-2 rounded-full", i === 1 ? "bg-green-500" : "bg-red-500")} />
                )}
              </div>
              <span className={cn("text-xs font-medium transition-colors", selected === i ? "text-white" : "text-zinc-500 group-hover:text-zinc-300")}>{opt}</span>
            </div>
            {selected === i && i === 1 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          </motion.div>
        ))}
      </div>
      {selected !== null && (
        <p className={cn("text-[10px] font-bold uppercase tracking-widest", selected === 1 ? "text-green-500" : "text-red-500")}>
          {selected === 1 ? "Correct Answer" : "Try Again"}
        </p>
      )}
    </div>
  );
};

const IntegratedToolsDemo = () => {
  const [seconds, setSeconds] = useState(1500); // 25:00
  const [isActive, setIsActive] = useState(false);
  const [kanbanItems, setKanbanItems] = useState([
    { id: 1, text: "Practice problems", status: "progress" },
    { id: 2, text: "Review Chapter 1", status: "completed" }
  ]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleItem = (id: number) => {
    setKanbanItems(items => items.map(item =>
      item.id === id
        ? { ...item, status: item.status === "progress" ? "completed" : "progress" }
        : item
    ));
  };

  return (
    <div className="w-full h-full p-8 flex gap-8 select-none items-center overflow-hidden h-full">
      {/* Kanban */}
      <div className="flex-1 flex flex-col gap-4">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Study List</p>
        <div className="space-y-3">
          {kanbanItems.map(item => (
            <motion.div
              key={item.id}
              layout
              onClick={() => toggleItem(item.id)}
              className={cn(
                "cursor-pointer rounded-xl p-4 text-xs font-bold transition-all border",
                item.status === "completed"
                  ? "bg-green-500/5 border-green-500/10 text-green-500/30 line-through"
                  : "bg-zinc-950 border-white/5 text-white hover:border-white/20"
              )}
            >
              <div className="flex items-center justify-between">
                <span>{item.text}</span>
                {item.status === "completed" && <CheckCircle2 className="w-3 h-3 text-green-500" />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="w-px h-1/2 bg-white/5" />
      {/* Pomodoro */}
      <div
        className="w-2/5 flex flex-col items-center justify-center gap-4 cursor-pointer"
        onClick={() => setIsActive(!isActive)}
      >
        <span className="text-4xl font-headline font-black text-white tracking-tighter transition-all group-hover/pomo:text-primary">
          {formatTime(seconds)}
        </span>
        <div className={cn("px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all",
          isActive ? "bg-primary/10 text-primary border-primary/20" : "bg-zinc-900 border-white/5 text-zinc-600")}
        >
          {isActive ? "Active" : "Paused"}
        </div>
      </div>
    </div>
  );
};

const WisdomGPTDemo = () => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'user', text: "What's the main cause of the French Revolution?", visible: true },
    { id: 2, role: 'ai', text: "Sovereign debt and bread shortages!", visible: false }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === 2 ? { ...m, visible: true } : m));
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full p-8 flex flex-col justify-center gap-4 relative overflow-hidden bg-black/5">
      <AnimatePresence mode="popLayout">
        {messages.map((msg) => msg.visible && (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}
          >
            <div className={cn("p-4 rounded-2xl max-w-[85%] border text-xs leading-relaxed",
              msg.role === 'user'
                ? "bg-zinc-900 border-white/5 text-zinc-300"
                : "bg-primary/10 border-primary/20 text-white")}
            >
              <p>{msg.text}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
        {["Causes", "Outcomes", "Impact"].map(tag => (
          <div key={tag} className="px-3 py-1 bg-zinc-900 border border-white/5 rounded-lg text-[9px] font-bold text-zinc-500 uppercase tracking-widest hover:border-primary/30 transition-all cursor-pointer">
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

const InstantExplanationsDemo = () => {
  const [activeExplainer, setActiveExplainer] = useState<string | null>(null);

  return (
    <div className="w-full h-full p-8 flex gap-6 select-none items-stretch">
      <div className="flex-1 bg-zinc-900/50 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 relative">
        <p className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <span className="text-primary">#</span> The Renaissance
        </p>
        <div className="space-y-4 flex-1 flex flex-col justify-center">
          {[
            "Rebirth of classical art",
            "Focus on Humanism",
            "Cultural trade nodes expansion"
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-primary" />
              <p className="text-[11px] text-zinc-400 font-medium">{text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/3 flex flex-col justify-center gap-4">
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase">Context</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-relaxed italic">The biological pipeline converting photons into ATP.</p>
        </div>
      </div>
    </div>
  );
};

const CaptureDemo = () => {
  const [scanned, setScanned] = useState(false);

  return (
    <div
      className="w-full h-full p-8 flex flex-col items-center justify-center gap-6 cursor-pointer select-none"
      onClick={() => setScanned(!scanned)}
    >
      <div className="relative">
        <div className={cn("w-24 h-24 rounded-2xl bg-zinc-900 border flex items-center justify-center transition-all",
          scanned ? "border-primary shadow-[0_0_30px_rgba(220,38,38,0.2)]" : "border-white/5")}>
          <Camera className={cn("w-8 h-8", scanned ? "text-primary" : "text-zinc-700")} />
        </div>
        {scanned && (
          <motion.div
            animate={{ y: [0, 96, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-[-10px] right-[-10px] h-0.5 bg-primary shadow-[0_0_10px_#dc2626]"
          />
        )}
      </div>
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
        {scanned ? "Solving..." : "Click to Scan"}
      </p>
      <AnimatePresence>
        {scanned && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-primary/30 rounded-xl p-4 text-center mt-2"
          >
            <p className="text-xl font-black text-white tracking-tighter">X = 29.5</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FlashcardDemo = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-full h-full p-8 flex flex-col items-center justify-center relative cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="relative w-full h-[200px] preserve-3d">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="w-full h-full relative preserve-3d"
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-zinc-900 border border-white/5 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
            <p className="text-xl font-bold text-white tracking-tight">Humanism</p>
            <p className="mt-4 text-[9px] text-zinc-500 uppercase tracking-widest">Click to flip</p>
          </div>
          {/* Back */}
          <div className="absolute inset-0 backface-hidden bg-primary rounded-2xl flex flex-col items-center justify-center p-6 text-center rotate-y-180">
            <p className="text-[11px] font-bold text-white leading-relaxed">The celebration of individual human agency during the Renaissance.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const RoadmapDemo = () => {
  const [progress, setProgress] = useState(3);

  return (
    <div className="w-full h-full p-8 flex flex-col gap-4 select-none justify-center">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold text-white uppercase tracking-widest">Neural Roadmap</p>
        <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
      </div>
      <div className="space-y-3">
        {[
          { day: "01", topic: "Field Theory" },
          { day: "02", topic: "Pattern Matching" }
        ].map((item, i) => (
          <motion.div
            key={i}
            onClick={() => setProgress(i + 1)}
            className={cn("border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all",
              progress >= (i + 1) ? "bg-primary/5 border-primary/20" : "bg-black/40 border-white/5 opacity-50")}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-primary">{item.day}</span>
              <p className="text-[11px] text-zinc-400 font-medium">{item.topic}</p>
            </div>
            {progress >= (i + 1) ? <CheckCircle2 className="w-3 h-3 text-primary" /> : <Play className="w-3 h-3 text-zinc-800" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const featureItems = [
  {
    title: "Your Notes, Your Way",
    description: "Tell the AI your learning style. Get notes that are funny, formal, or anything in between.",
    className: "col-span-1 md:col-span-3 row-span-1",
    demo: <YourNotesDemo />,
    icon: <Brain className="w-5 h-5 text-primary" />
  },
  {
    title: "Instant Explanations & Notes",
    description: "From dense text to structured, scannable notes with on-demand explanations for any term.",
    className: "col-span-1 md:col-span-2 row-span-1",
    demo: <InstantExplanationsDemo />,
    icon: <Sparkles className="w-5 h-5 text-primary" />
  },
  {
    title: "Challenging Quizzes",
    description: "Test your understanding with custom quizzes.",
    className: "col-span-1 md:col-span-1 row-span-1",
    demo: <QuizDemoMatch />,
    icon: <Target className="w-5 h-5 text-primary" />
  },
  {
    title: "Personalized Roadmap",
    description: "Turn any syllabus into a day-by-day study plan.",
    className: "col-span-1 md:col-span-1 row-span-1",
    demo: <RoadmapDemo />,
    icon: <BookOpen className="w-5 h-5 text-primary" />
  },
  {
    title: "Integrated Study Tools",
    description: "Use Pomodoro timers and Kanban boards to stay on track.",
    className: "col-span-1 md:col-span-2 row-span-1",
    demo: <IntegratedToolsDemo />,
    icon: <Clock className="w-5 h-5 text-primary" />
  },
  {
    title: "Capture the Answer",
    description: "Snap a picture of a problem to get an instant solution.",
    className: "col-span-1 md:col-span-1 row-span-1",
    demo: <CaptureDemo />,
    icon: <Camera className="w-5 h-5 text-primary" />
  },
  {
    title: "WisdomGPT AI Assistant",
    description: "Your personal AI tutor, ready to answer any question.",
    className: "col-span-1 md:col-span-1 row-span-1",
    demo: <WisdomGPTDemo />,
    icon: <Sparkles className="w-5 h-5 text-primary" />
  },
  {
    title: "Interactive Flashcards",
    description: "Master key terms with active recall.",
    className: "col-span-1 md:col-span-1 row-span-1",
    demo: <FlashcardDemo />,
    icon: <Layers className="w-5 h-5 text-primary" />
  }
];

export function Features() {
  return (
    <section id="features" className="py-32 relative bg-[#0A0A0B] overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="h-px w-8 bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Capabilities</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-headline font-black tracking-tight text-white mb-6 leading-none">
            High-Performance <br />
            <span className="text-zinc-600">Learning Infrastructure.</span>
          </h2>
          <p className="text-zinc-500 text-lg font-medium leading-relaxed">
            We've deconstructed the learning process and rebuilt it with AI at the core. No fluff, just pure cognitive efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[500px]">
          {featureItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className={cn(
                "group relative bg-[#0D0D0E] border border-white/10 rounded-3xl p-8 flex flex-col overflow-hidden hover:border-primary/50 transition-all duration-300",
                item.className
              )}
            >
              <div className="flex-1 flex flex-col h-full min-h-0 relative z-10">
                <div className="flex items-start gap-4 mb-6 shrink-0">
                  <div className="p-3 rounded-2xl bg-zinc-900 border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                    {React.cloneElement(item.icon as React.ReactElement, { className: "w-5 h-5 text-primary" })}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-headline font-bold text-white mb-1 group-hover:text-primary transition-all duration-300 tracking-tight">{item.title}</h3>
                    <p className="text-zinc-500 text-[11px] font-medium leading-relaxed max-w-2xl">{item.description}</p>
                  </div>
                </div>
                <div className="flex-1 bg-black/20 rounded-2xl border border-white/5 overflow-hidden flex flex-col group-hover:border-white/10 transition-all duration-300">
                  {item.demo}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .bg-grid-pattern {
                    background-image: radial-gradient(circle, #ffffff 1px, transparent 1px);
                }
            `}</style>
    </section>
  );
}
