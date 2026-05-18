import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Users, 
  User, 
  Volume2, 
  ChevronLeft, 
  LayoutGrid,
  CircleDot,
  Plus,
  Compass,
  Music,
  Wind,
  HandMetal,
  Dices,
  Ghost,
  CircleDashed,
  Sliders
} from 'lucide-react';

// --- Types ---
type Screen = 'welcome' | 'selection' | 'toy-tilt' | 'toy-popit' | 'toy-sliders' | 'toy-spinner' | 'toy-xylophone' | 'toy-squeeze' | 'toy-bubbles' | 'toy-bubblewrap';

// --- Constants ---
const TOYS = [
  { id: 'toy-spinner', name: 'Fidget Spinner', icon: Dices, color: 'primary', locked: false },
  { id: 'toy-popit', name: 'Pop-It', icon: LayoutGrid, color: 'secondary', locked: false },
  { id: 'toy-bubblewrap', name: 'Bubble Wrap', icon: CircleDot, color: 'primary-container', locked: false, isNew: true },
  { id: 'toy-bubbles', name: 'Ethereal Blower', icon: Wind, color: 'primary-container', locked: false },
  { id: 'toy-xylophone', name: 'Xylophone', icon: Music, color: 'tertiary', locked: false },
  { id: 'toy-squeeze', name: 'Squeeze Monster', icon: Ghost, color: 'secondary', locked: false },
  { id: 'toy-wind', name: 'Wind Chimes', icon: Wind, color: 'tertiary-container', locked: false },
  { id: 'toy-tilt', name: 'Tilt & Balance', icon: Compass, color: 'primary', locked: false },
  { id: 'toy-sliders', name: 'Textured Sliders', icon: Sliders, color: 'primary', locked: false },
];

// --- Components ---

const Header = ({ onBack, title, isMusicOn, onToggleMusic }: { onBack?: () => void, title?: string, isMusicOn: boolean, onToggleMusic: () => void }) => (
  <header className="flex justify-between items-center px-4 py-3 w-full sticky top-0 z-50 bg-surface shadow-[0_4px_0_0_rgba(0,0,0,0.1)] rounded-b-lg">
    <div className="flex items-center gap-2">
      {onBack ? (
        <button onClick={onBack} className="p-1 hover:scale-110 active:scale-95 transition-transform text-primary cursor-pointer">
          <ChevronLeft size={28} />
        </button>
      ) : (
        <HandMetal className="text-primary" size={32} />
      )}
      <h1 className="comfortaa text-2xl text-primary tracking-tight">{title || 'Serenity Spin'}</h1>
    </div>
    <button 
      onClick={onToggleMusic}
      className={`p-2 rounded-full transition-all active:shadow-inner cursor-pointer ${isMusicOn ? 'bg-primary text-white shadow-lg' : 'bg-primary-container/20 text-primary'}`}
    >
      <Volume2 size={24} className={isMusicOn ? 'animate-pulse' : ''} />
    </button>
  </header>
);

const BottomNav = ({ active, onChange }: { active: Screen, onChange: (s: Screen) => void }) => (
  <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-surface-container-low shadow-[0_-4px_10px_rgba(0,0,0,0.05)] rounded-t-3xl h-20 md:hidden">
    <button onClick={() => onChange('selection')} className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${active === 'selection' ? 'bg-tertiary-container text-on-tertiary-container border-b-4 border-tertiary' : 'text-slate-500'}`}>
      <Gamepad2 size={28} />
      <span className="text-xs font-bold mt-1">Play</span>
    </button>
    <button className="flex flex-col items-center justify-center p-2 text-slate-500">
      <Users size={28} />
      <span className="text-xs font-bold mt-1">Friends</span>
    </button>
    <button className="flex flex-col items-center justify-center p-2 text-slate-500">
      <User size={28} />
      <span className="text-xs font-bold mt-1">Me</span>
    </button>
  </nav>
);

// --- Audio & Haptics Utility ---
const triggerVibration = (pattern: number | number[]) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

const playSound = (type: 'pop' | 'click' | 'slide' | 'note' | 'squeeze' | 'ridged' | 'smooth' | 'spin-neon' | 'spin-pro' | 'spin-gold', pitch = 1) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(10, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(100 * pitch, now);
      gain2.gain.setValueAtTime(0.4, now);
      gain2.gain.linearRampToValueAtTime(0, now + 0.05);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.05);
    } else if (type === 'click') {
      // ... existing click ...
      const bufferSize = ctx.sampleRate * 0.02;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 2000 * pitch;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.02);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } else if (type === 'note') {
       // ... existing note ...
       [1, 2.76, 5.4].forEach((h, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch * h, now);
        gain.gain.setValueAtTime(0.2 / (i + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (i === 0 ? 0.8 : 0.2));
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
      });
    } else if (type === 'squeeze') {
      // ... existing squeeze ...
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1200 * pitch, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'slide' || type === 'smooth') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type === 'smooth' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(150 + pitch * 100, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'ridged') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(60, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'spin-neon') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(50 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(200 * pitch, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'spin-pro') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(500 * pitch, now + 0.1);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'spin-gold') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(200 * pitch, now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch (e) {
    console.error('Audio error', e);
  }
};

// --- Ambient Music Handler ---
let bgNode: AudioScheduledSourceNode | null = null;
let bgGain: GainNode | null = null;
const toggleBackgroundMusic = (on: boolean) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (!on) {
      if (bgNode) {
        bgNode.stop();
        bgNode = null;
      }
      return;
    }

    if (bgNode) return; // Already playing

    // Create a simple warm pad
    bgGain = ctx.createGain();
    bgGain.gain.setValueAtTime(0, ctx.currentTime);
    bgGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 3);
    bgGain.connect(ctx.destination);

    const freqs = [130.81, 164.81, 196.00]; // C3 Major triad
    freqs.forEach(f => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.5;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 2;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      osc.connect(bgGain!);
      osc.start();
      bgNode = osc; // Simple tracking
    });
  } catch (e) {
    console.error('BG Music error', e);
  }
};

// --- Screen Components ---

const WelcomeScreen = ({ onStart }: { onStart: () => void, key?: string }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="flex-1 flex flex-col items-center justify-center p-6 gap-12 text-center overflow-hidden"
  >
    {/* Dynamic 3D Mascot Logo */}
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-primary/20 blur-[100px] animate-pulse rounded-full" />
      
      {/* Outer Rotating Glass Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-full h-full rounded-full border-[2px] border-white/40 shadow-xl backdrop-blur-sm"
      >
        <div className="absolute top-0 left-1/2 -ml-3 -mt-3 w-6 h-6 bg-secondary rounded-full shadow-lg border-2 border-white" />
        <div className="absolute bottom-0 left-1/2 -ml-3 -mb-3 w-8 h-8 bg-primary rounded-full shadow-lg border-2 border-white" />
      </motion.div>

      {/* Middle Orbiting Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-3/4 h-3/4 rounded-full border-[3px] border-primary-container/30"
      >
        <div className="absolute top-1/2 right-0 -mr-2 -mt-2 w-4 h-4 bg-tertiary rounded-full shadow-md" />
      </motion.div>

      {/* Central Core Toy */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotateY: [0, 180, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative z-10 w-44 h-44 bg-gradient-to-br from-primary via-primary-container to-secondary border-[8px] border-white rounded-[48px] shadow-[0_25px_60px_rgba(0,103,128,0.5),inset_0_-10px_20px_rgba(0,0,0,0.2)] flex items-center justify-center overflow-hidden"
      >
        {/* Dynamic Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.6),transparent)]" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <Dices size={90} strokeWidth={1.5} className="text-white drop-shadow-[0_8px_15px_rgba(0,0,0,0.4)]" />
        </motion.div>
        
        {/* Liquid wave effect at the bottom */}
        <motion.div 
          animate={{ x: [-100, 0, -100] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-[200%] h-1/3 bg-white/20 blur-md rounded-[100%]" 
        />
      </motion.div>
    </div>
    
    <div className="z-10">
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="comfortaa text-5xl md:text-6xl text-primary font-bold drop-shadow-sm mb-4"
      >
        Serenity Spin
      </motion.h1>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="inline-block px-4 py-1.5 bg-primary/10 rounded-full"
      >
        <p className="text-primary font-bold tracking-[0.2em] uppercase text-[10px]">Infinite Sensory Universe</p>
      </motion.div>
    </div>

    <motion.div 
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="w-full max-w-xs"
    >
      <button 
        onClick={onStart}
        className="w-full py-6 rounded-[32px] border-[4px] border-[#004e61] bg-primary text-white comfortaa text-3xl shadow-[0_12px_40px_rgba(0,103,128,0.3),0_12px_0_0_#003a49] hover:shadow-[0_15px_50px_rgba(0,103,128,0.4),0_12px_0_0_#003a49] active:translate-y-3 active:shadow-none transition-all flex items-center justify-center gap-4 group translate-y-0 cursor-pointer"
      >
        <Gamepad2 size={36} className="group-active:rotate-90 transition-transform" />
        Play
      </button>
    </motion.div>
    
    <button className="text-slate-400 font-bold underline decoration-2 underline-offset-4 hover:text-primary transition-colors cursor-pointer mt-4">
      Need help?
    </button>
  </motion.div>
);

const SelectionScreen = ({ onSelect }: { onSelect: (id: string) => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex-1 w-full max-w-5xl mx-auto px-6 pt-10 pb-32"
  >
    <div className="mb-10 text-center md:text-left">
      <h2 className="comfortaa text-3xl md:text-4xl text-on-surface">Choose Your Toy</h2>
      <p className="text-slate-500 text-lg mt-2 font-medium">Pick a toy to start your playtime!</p>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {TOYS.map((toy) => (
        <button 
          key={toy.id}
          onClick={() => onSelect(toy.id)}
          className={`relative bg-white rounded-3xl border-[4px] p-6 flex flex-col items-center justify-center gap-4 transition-all duration-150 group cursor-pointer
            ${toy.color === 'primary' ? 'border-primary shadow-[6px_6px_0_0_#004e61] text-primary hover:shadow-[8px_8px_0_0_#004e61]' : ''}
            ${toy.color === 'secondary' ? 'border-secondary shadow-[6px_6px_0_0_#8e0048] text-secondary hover:shadow-[8px_8px_0_0_#8e0048]' : ''}
            ${toy.color === 'primary-container' ? 'border-primary-container shadow-[6px_6px_0_0_#005266] text-primary hover:shadow-[8px_8px_0_0_#005266]' : ''}
            ${toy.color === 'tertiary' ? 'border-tertiary shadow-[6px_6px_0_0_#3e4c00] text-tertiary hover:shadow-[8px_8px_0_0_#3e4c00]' : ''}
            ${toy.color === 'tertiary-container' ? 'border-tertiary-container shadow-[6px_6px_0_0_#425000] text-on-tertiary-container hover:shadow-[8px_8px_0_0_#425000]' : ''}
            hover:-translate-y-1 active:translate-y-1 active:shadow-[2px_2px_0_0_currentColor]
          `}
        >
          {toy.isNew && (
            <div className="absolute -top-4 -right-4 bg-tertiary text-white border-[3px] border-surface rounded-full px-3 py-1 text-xs font-bold rotate-12 shadow-sm animate-pulse z-10">
              NEW!
            </div>
          )}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center group-active:scale-95 transition-transform
            ${toy.color === 'primary' ? 'bg-primary-fixed' : ''}
            ${toy.color === 'secondary' ? 'bg-secondary-fixed' : ''}
            ${toy.color === 'primary-container' ? 'bg-surface border-2 border-primary-container' : ''}
            ${toy.color === 'tertiary' ? 'bg-tertiary-fixed' : ''}
            ${toy.color === 'tertiary-container' ? 'bg-surface border-2 border-tertiary-container' : ''}
          `}>
            <toy.icon size={48} strokeWidth={2.5} />
          </div>
          <span className="comfortaa text-lg font-bold text-center leading-tight">
            {toy.name.split(' ').map((word, i) => <React.Fragment key={i}>{word}<br/></React.Fragment>)}
          </span>
        </button>
      ))}
    </div>
  </motion.div>
);

const TiltToy = () => {
  const [marbles, setMarbles] = useState([
    { id: 1, bg: 'bg-secondary-container', border: 'border-secondary', x: -40, y: -40 },
    { id: 2, bg: 'bg-primary-container', border: 'border-primary', x: 50, y: 30 },
    { id: 3, bg: 'bg-tertiary-fixed', border: 'border-tertiary-container', x: 20, y: 80 },
  ]);

  const addMarble = () => {
    if (marbles.length >= 8) return;
    playSound('click', 1.5);
    const colors = [
      { bg: 'bg-secondary-container', border: 'border-secondary' },
      { bg: 'bg-primary-container', border: 'border-primary' },
      { bg: 'bg-tertiary-fixed', border: 'border-tertiary-container' }
    ];
    const randColor = colors[Math.floor(Math.random() * colors.length)];
    setMarbles([...marbles, { 
      id: Date.now(), 
      ...randColor, 
      x: (Math.random() - 0.5) * 100, 
      y: (Math.random() - 0.5) * 100 
    }]);
  };

  const resetBoard = () => {
    playSound('pop', 0.5);
    setMarbles(marbles.slice(0, 3).map(m => ({ ...m, x: (Math.random() - 0.5) * 50, y: (Math.random() - 0.5) * 50 })));
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 pb-32">
      <div className="flex w-full max-w-sm gap-4 mb-4">
        <div className="flex-1 bg-white border-4 border-primary rounded-2xl p-4 shadow-[4px_4px_0_0_#006780] flex flex-col items-center justify-center">
          <CircleDot className="text-primary mb-1" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Gyroscope</span>
          <span className="comfortaa text-xl text-primary font-bold">Active</span>
        </div>
        <div className="flex-1 bg-white border-4 border-secondary-container rounded-2xl p-4 shadow-[4px_4px_0_0_#e20476] flex flex-col items-center justify-center">
          <Gamepad2 className="text-secondary-container mb-1" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Marbles</span>
          <span className="comfortaa text-xl text-secondary-container font-bold">{marbles.length}</span>
        </div>
      </div>

      <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.1),8px_8px_20px_rgba(0,0,0,0.1),-8px_-8px_20px_#fff] border-8 border-surface-container-high bg-surface flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        <div className="relative w-full h-full">
          {marbles.map((m) => (
            <motion.div
              key={m.id}
              animate={{ x: m.x, y: m.y }}
              transition={{ type: 'spring', damping: 10, stiffness: 50 }}
              className={`absolute top-1/2 left-1/2 -ml-6 -mt-6 w-12 h-12 rounded-full ${m.bg} ${m.border} border-2 shadow-lg flex items-center justify-center`}
            >
              <div className="w-3 h-3 rounded-full bg-white/40 absolute top-2 left-2" />
            </motion.div>
          ))}
        </div>
        
        <div className="absolute w-6 h-6 rounded-full bg-surface-container-highest shadow-inner border border-surface-variant flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-slate-300" />
        </div>
      </div>

      <div className="bg-tertiary-container/10 px-6 py-3 rounded-2xl border-2 border-tertiary-container/30 flex items-center gap-3">
        <Compass className="text-tertiary-container" size={24} />
        <p className="text-slate-500 font-bold text-center">Tilt your phone to roll!</p>
      </div>

      <div className="flex gap-4 w-full max-w-sm">
        <button 
          onClick={resetBoard}
          className="flex-1 bg-white border-2 border-primary-container text-primary-container rounded-xl py-3 font-bold shadow-[0_4px_0_0_#4cc9f0] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        >
          Reset Board
        </button>
        <button 
          onClick={addMarble}
          className="flex-1 bg-primary text-white rounded-xl py-3 font-bold shadow-[0_4px_0_0_#004e61] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={20} /> Add Marble
        </button>
      </div>
    </div>
  );
};

const PopItToy = () => {
  const [grid, setGrid] = useState(Array(25).fill(false));
  const [mode, setMode] = useState<'classic' | 'silicone'>('classic');

  const togglePopper = (i: number) => {
    let pitch = 1.2;
    if (mode === 'silicone') pitch = 0.8;
    
    if (grid[i]) {
       playSound('pop', 0.8 * (mode === 'silicone' ? 0.7 : 1));
    } else {
       playSound('pop', pitch);
       triggerVibration(15);
    }

    const newGrid = [...grid];
    newGrid[i] = !newGrid[i];
    setGrid(newGrid);
  };

  const getStyle = () => {
    switch(mode) {
      case 'silicone': return {
        container: 'bg-slate-400 border-slate-500 shadow-[inset_0_4px_12px_rgba(0,0,0,0.3)]',
        cell: (popped: boolean) => popped ? 'bg-slate-500 border-slate-600 shadow-inner translate-y-1' : 'bg-slate-300 border-slate-100 shadow-[0_6px_0_0_rgba(0,0,0,0.2)]',
        inner: 'bg-slate-500/20'
      };
      default: return {
        container: 'bg-secondary-container border-secondary/20 shadow-[0_12px_24px_rgba(226,4,118,0.2),inset_0_4px_8px_rgba(0,0,0,0.1)]',
        cell: (popped: boolean) => popped ? 'bg-slate-200 border-slate-300 shadow-inner translate-y-1' : 'bg-white border-slate-300 shadow-[0_4px_0_0_rgba(0,0,0,0.05)]',
        inner: 'bg-secondary-fixed'
      };
    }
  };

  const s = getStyle();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 pb-32">
      <div className="flex gap-2 mb-2 p-2 bg-slate-100 rounded-[24px] w-full max-w-sm overflow-hidden">
        {(['classic', 'silicone'] as const).map(m => (
          <button 
            key={m} 
            onClick={() => { setMode(m); setGrid(Array(25).fill(false)); playSound('click', 1); triggerVibration(10); }}
            className={`flex-1 px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all tracking-tighter ${mode === m ? 'bg-secondary text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {m === 'classic' ? 'Rainbow' : 'Silicone'}
          </button>
        ))}
      </div>

      <div className="mb-4 text-center">
        <h2 className="comfortaa text-3xl text-secondary capitalize">{mode + ' Pop-It'}</h2>
        <p className="text-slate-500 font-bold mt-1">Repetitive sensory joy.</p>
      </div>

      <div className={`p-8 rounded-[40px] border-4 transition-all duration-300 ${s.container}`}>
        <div className="grid grid-cols-5 gap-5">
          {grid.map((popped, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.85 }}
              onClick={() => togglePopper(i)}
              className={`w-14 h-14 rounded-full transition-all flex items-center justify-center cursor-pointer border-b-[4px] ${s.cell(popped)}`}
            >
              <div className={`transition-all w-10 h-10 rounded-full ${popped ? 'bg-slate-300 shadow-inner' : s.inner}`} />
            </motion.button>
          ))}
        </div>
      </div>

      <button 
        onClick={() => {
          playSound('click', 0.5);
          setGrid(Array(25).fill(false));
          triggerVibration(30);
        }}
        className="px-10 py-4 bg-secondary text-white rounded-3xl font-bold shadow-[0_8px_0_0_#8e0048] active:translate-y-2 active:shadow-none transition-all cursor-pointer flex items-center gap-2"
      >
        <LayoutGrid size={20} /> Reset Grid
      </button>
    </div>
  );
};

const BubbleWrapToy = () => {
  const [grid, setGrid] = useState(Array(36).fill(false));

  const toggleBubble = (i: number) => {
    const isPopped = grid[i];
    
    if (isPopped) {
      // Undo pop
      playSound('click', 1.5);
      triggerVibration(5);
    } else {
      // Pop
      playSound('pop', 2.4);
      triggerVibration([10, 5]);
    }

    const newGrid = [...grid];
    newGrid[i] = !newGrid[i];
    setGrid(newGrid);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 pb-32">
      <div className="text-center mb-4">
        <h2 className="comfortaa text-3xl text-primary-container">Infinite Bubble Wrap</h2>
        <p className="text-slate-500 font-bold">Pop them all! (Tap again to undo)</p>
      </div>

      <div className="bg-white/30 p-8 rounded-[40px] border-4 border-white/40 shadow-2xl backdrop-blur-sm">
        <div className="grid grid-cols-6 gap-4">
          {grid.map((popped, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.85 }}
              onClick={() => toggleBubble(i)}
              className={`w-12 h-12 rounded-full transition-all flex items-center justify-center cursor-pointer
                ${popped 
                  ? 'opacity-20 scale-90 border-0 bg-transparent shadow-inner' 
                  : 'bg-white/60 border-white/80 shadow-[0_6px_15px_rgba(0,0,0,0.08)] border-t-[2px] active:translate-y-1'
                }`}
            >
              {!popped && (
                <div className="w-8 h-8 rounded-full bg-white/40 border border-white/20 relative">
                  <div className="absolute top-1 left-2 w-2 h-2 bg-white/60 rounded-full blur-[1px]" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <button 
        onClick={() => { setGrid(Array(36).fill(false)); playSound('pop', 0.8); triggerVibration(30); }}
        className="px-10 py-4 bg-primary-container text-on-primary-container rounded-3xl font-bold shadow-[0_8px_0_0_#005266] hover:shadow-[0_12px_40px_rgba(0,103,128,0.2),0_8px_0_0_#005266] active:translate-y-2 active:shadow-none transition-all cursor-pointer flex items-center gap-2"
      >
        <Wind size={20} /> Fresh Sheet
      </button>
    </div>
  );
};

const SliderToy = () => {
  const [values, setValues] = useState({ smooth: 50, grainy: 30, ridged: 70 });
  const lastUpdate = React.useRef({ time: Date.now(), values: { smooth: 50, grainy: 30, ridged: 70 } });

  const handleSliderChange = (key: string, newVal: number) => {
    const now = Date.now();
    const dt = now - lastUpdate.current.time;
    const oldVal = (values as any)[key];
    const dx = Math.abs(newVal - oldVal);
    
    // Calculate speed (rate of change)
    const speed = dx / Math.max(dt, 1);
    
    if (dx > 0.5) {
      if (key === 'smooth') {
        // High speed smooth = higher pitch whisper
        playSound('smooth', 0.5 + speed * 2 + newVal / 100);
      } else if (key === 'grainy') {
        // Grainy feedback depends on movement speed
        playSound('slide', 0.8 + speed * 3);
        if (speed > 0.1) triggerVibration(Math.min(10, Math.ceil(speed * 20)));
      } else if (key === 'ridged') {
        // Ridged snaps to steps visually and haptically
        const step = 10;
        const snappedNew = Math.round(newVal / step) * step;
        const snappedOld = Math.round(oldVal / step) * step;
        
        if (snappedNew !== snappedOld) {
          playSound('ridged', 1);
          triggerVibration(20);
        }
      }
    }

    setValues(prev => ({ ...prev, [key]: newVal }));
    lastUpdate.current = { time: now, values: { ...values, [key]: newVal } };
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-10 pb-32">
      <div className="bg-white border-4 border-primary-container p-8 rounded-3xl shadow-xl w-full max-w-sm text-center">
        <h3 className="comfortaa text-primary-container text-xl mb-4">Tactile Lab</h3>
        <div className="flex flex-col gap-2">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Physics Profile</p>
          <div className="flex justify-center gap-4">
            <div className="flex flex-col items-center"><div className="w-8 h-1 bg-slate-100 rounded-full mb-1"/><span className="text-[8px] font-bold text-slate-300">Fluid</span></div>
            <div className="flex flex-col items-center"><div className="w-8 h-1 bg-slate-200 rounded-full mb-1"/><span className="text-[8px] font-bold text-slate-300">Grit</span></div>
            <div className="flex flex-col items-center"><div className="w-8 h-1 bg-slate-300 rounded-full mb-1"/><span className="text-[8px] font-bold text-slate-300">Snap</span></div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-12">
        {Object.entries(values).map(([key, val]) => (
          <div key={key} className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-4">
              <span className={`comfortaa font-bold uppercase tracking-widest ${key === 'smooth' ? 'text-cyan-500' : key === 'grainy' ? 'text-amber-600' : 'text-slate-600'}`}>{key}</span>
              <div className="flex gap-1">
                {key === 'ridged' && Array(5).fill(0).map((_, i) => <div key={i} className="w-1 h-3 bg-slate-200 rounded-full" />)}
                {key === 'grainy' && <CircleDashed size={16} className="text-amber-200 animate-spin-slow" />}
                {key === 'smooth' && <div className="w-4 h-4 rounded-full bg-cyan-50 blur-[2px] border border-cyan-100" />}
              </div>
            </div>
            <div className="relative h-14 flex items-center group">
              <div className={`absolute w-full h-10 rounded-full shadow-inner border-2 transition-colors
                ${key === 'smooth' ? 'bg-cyan-50/50 border-cyan-100' : key === 'grainy' ? 'bg-amber-50/50 border-amber-100' : 'bg-slate-100 border-slate-200'}
              `} />
              
              {/* Ridged Visual Markers */}
              {key === 'ridged' && (
                <div className="absolute inset-x-8 flex justify-between pointer-events-none opacity-20">
                  {Array(10).fill(0).map((_, i) => <div key={i} className="w-1 h-4 bg-slate-400 rounded-full" />)}
                </div>
              )}

              <input 
                type="range"
                value={val}
                onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
                className="absolute w-full h-full opacity-0 z-10 cursor-pointer"
              />
              <motion.div 
                animate={{ scale: val === (values as any)[key] ? 1 : 1.1 }}
                className={`h-12 w-12 rounded-full shadow-xl border-4 flex items-center justify-center pointer-events-none
                   ${key === 'smooth' ? 'bg-white border-cyan-400 shadow-cyan-200' : key === 'grainy' ? 'bg-white border-amber-400 shadow-amber-200' : 'bg-white border-slate-600 shadow-slate-300'}
                `}
                style={{ left: `calc(${val}% - 24px)`, position: 'absolute' }}
              >
                <div className={`w-3 h-3 rounded-full ${key === 'smooth' ? 'bg-cyan-100' : key === 'grainy' ? 'bg-amber-100' : 'bg-slate-200'}`} />
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const FidgetToy = () => {
  const [rotation, setRotation] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [style, setStyle] = useState<'classic' | 'neon' | 'pro' | 'gold'>('classic');

  React.useEffect(() => {
    let frame: number;
    const animate = () => {
      setRotation(r => r + speed);
      setSpeed(s => Math.max(0, s * 0.985)); // Slightly better friction for longer spins
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [speed]);

  const spin = () => {
    const intensity = Math.min(speed / 10 + 1, 3);
    
    // Differentiated sounds based on style
    if (style === 'neon') {
      playSound('spin-neon', intensity);
    } else if (style === 'pro') {
      playSound('spin-pro', intensity);
    } else if (style === 'gold') {
      playSound('spin-gold', intensity);
    } else {
      playSound('slide', intensity);
    }
    
    triggerVibration(10);
    setSpeed(prev => Math.min(prev + 20, 70));
  };

  const renderSpinnerBody = () => {
    switch(style) {
      case 'neon':
        return (
          <div className="relative w-64 h-64 flex items-center justify-center">
             {/* 4 Point Star */}
             {[0, 90, 180, 270].map(deg => (
               <div key={deg} style={{ transform: `rotate(${deg}deg)` }} className="absolute w-full h-12 flex justify-between px-2">
                  <div className="w-16 h-12 bg-cyan-400 rounded-full shadow-[0_0_20px_#22d3ee]" />
                  <div className="w-16 h-12 bg-cyan-400 rounded-full shadow-[0_0_20px_#22d3ee]" />
               </div>
             ))}
             <div className="absolute w-44 h-44 border-[10px] border-cyan-400/30 rounded-full shadow-[inset_0_0_20px_rgba(34,211,238,0.2)]" />
             <div className="z-10 w-16 h-16 bg-white border-4 border-fuchsia-400 shadow-[0_0_15px_#f0abfc] rounded-full" />
          </div>
        );
      case 'pro':
        return (
          <div className="relative w-64 h-64 flex items-center justify-center">
             {/* 2 Arm Pro Bar */}
             <div className="absolute w-full h-20 bg-slate-700 border-4 border-slate-900 rounded-full shadow-2xl flex justify-between items-center px-4">
                <div className="w-12 h-12 rounded-full bg-slate-400 shadow-inner" />
                <div className="w-12 h-12 rounded-full bg-slate-400 shadow-inner" />
             </div>
             <div className="z-10 w-24 h-24 bg-slate-200 border-8 border-slate-500 shadow-xl rounded-full" />
          </div>
        );
      case 'gold':
        return (
          <div className="relative w-64 h-64 flex items-center justify-center">
             {/* Gear Shape */}
             <div className="absolute w-56 h-56 bg-amber-600 border-8 border-amber-900 rounded-full flex items-center justify-center">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                  <div key={deg} style={{ transform: `rotate(${deg}deg)` }} className="absolute w-full h-16">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-8 bg-amber-700 border-x-2 border-amber-900" />
                  </div>
                ))}
             </div>
             <div className="absolute w-40 h-40 bg-amber-400 border-4 border-amber-200 rounded-full shadow-inner flex flex-wrap p-4 gap-2 justify-center content-center">
                {Array(6).fill(0).map((_, i) => <div key={i} className="w-3 h-3 bg-amber-600 rounded-full opacity-50" />)}
             </div>
             <div className="z-10 w-20 h-20 bg-amber-500 border-4 border-amber-100 shadow-xl rounded-full" />
          </div>
        );
      default:
        return (
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Classic 3-Arm */}
            {[0, 120, 240].map(deg => (
              <div key={deg} style={{ transform: `rotate(${deg}deg)` }} className="absolute w-full h-16 flex justify-end">
                <div className="w-32 h-16 bg-primary border-4 border-primary-container rounded-full shadow-lg" />
              </div>
            ))}
            <div className="z-10 w-20 h-20 bg-white border-8 border-primary shadow-xl rounded-full" />
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-10 pb-32">
      <div className="flex gap-2 mb-2 p-2 bg-slate-100 rounded-2xl overflow-x-auto w-full max-w-sm">
        {(['classic', 'neon', 'pro', 'gold'] as const).map(mode => (
          <button 
            key={mode} 
            onClick={() => { setStyle(mode); playSound('click', 1); triggerVibration(10); }}
            className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all ${style === mode ? 'bg-primary text-white shadow-md' : 'text-slate-400'}`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="text-center">
        <h2 className="comfortaa text-2xl text-primary capitalize">{style} Spinner</h2>
        <p className="text-slate-500 font-bold">Flick to spin!</p>
      </div>

      <motion.div 
        animate={{ rotate: rotation }}
        onClick={spin}
        className="cursor-pointer"
      >
        {renderSpinnerBody()}
      </motion.div>

      <div className="bg-white border-4 border-slate-100 p-4 rounded-xl min-w-[200px] text-center shadow-inner">
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Velocity</span>
        <div className="text-2xl font-bold text-primary">{Math.round(speed)}</div>
      </div>
    </div>
  );
};

const XylophoneToy = () => {
  const notes = [
    { name: 'C', freq: 261.63, color: 'bg-red-500' },
    { name: 'D', freq: 293.66, color: 'bg-orange-500' },
    { name: 'E', freq: 329.63, color: 'bg-yellow-500' },
    { name: 'F', freq: 349.23, color: 'bg-green-500' },
    { name: 'G', freq: 392.00, color: 'bg-blue-500' },
    { name: 'A', freq: 440.00, color: 'bg-indigo-500' },
    { name: 'B', freq: 493.88, color: 'bg-purple-500' },
  ];

  const playSong = () => {
    const song = Array(8).fill(0).map(() => Math.floor(Math.random() * notes.length));
    song.forEach((noteIdx, i) => {
      setTimeout(() => {
        playSound('note', notes[noteIdx].freq);
      }, i * 300);
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 pb-32">
      <div className="text-center">
        <h2 className="comfortaa text-2xl text-tertiary">Rainbow Xylophone</h2>
        <p className="text-slate-500 font-bold">Tap the bars to make music</p>
      </div>

      <div className="flex items-stretch gap-2 bg-surface-container p-4 rounded-3xl shadow-xl h-64 w-full max-w-sm">
        {notes.map((n, i) => (
          <motion.button
            key={n.name}
            whileTap={{ scaleY: 0.95 }}
            onClick={() => playSound('note', n.freq)}
            className={`flex-1 rounded-xl shadow-md border-x-4 border-black/10 flex flex-col items-center justify-end pb-4 text-white font-bold cursor-pointer transition-transform ${n.color}`}
            style={{ height: `${100 - i * 5}%` }}
          >
            {n.name}
          </motion.button>
        ))}
      </div>

      <button 
        onClick={playSong}
        className="px-8 py-3 bg-tertiary text-white rounded-2xl font-bold shadow-[0_6px_0_0_#3e4c00] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
      >
        <Music size={20} /> Play Random Song
      </button>
    </div>
  );
};

const SqueezeToy = () => {
  const [scale, setScale] = useState(1);
  const [squeezeCount, setSqueezeCount] = useState(0);

  const squeeze = () => {
    playSound('squeeze', 0.5 + Math.random() * 1);
    setSqueezeCount(c => c + 1);
    setScale(0.7);
    setTimeout(() => setScale(1), 100);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-10 pb-32">
      <div className="text-center">
        <h2 className="comfortaa text-2xl text-secondary">Squeeze Monster</h2>
        <p className="text-slate-500 font-bold">Squeeze me for relief!</p>
      </div>

      <motion.div
        animate={{ scale, rotate: scale < 1 ? [0, -5, 5, 0] : 0 }}
        onClick={squeeze}
        className="w-56 h-56 bg-secondary-container rounded-full border-8 border-secondary shadow-2xl flex items-center justify-center cursor-pointer relative"
      >
        <div className="absolute top-12 left-12 w-8 h-10 bg-white rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-slate-900 rounded-full" />
        </div>
        <div className="absolute top-12 right-12 w-8 h-10 bg-white rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-slate-900 rounded-full" />
        </div>
        <div className="w-20 h-10 bg-secondary border-t-4 border-black/20 rounded-b-full mt-10" />
      </motion.div>

      <div className="bg-white border-4 border-slate-100 p-6 rounded-2xl shadow-inner min-w-[200px] text-center">
        <span className="text-xs font-bold text-slate-400 uppercase">Squeeze Count</span>
        <div className="comfortaa text-5xl text-slate-800 font-bold mt-2">{squeezeCount}</div>
      </div>
    </div>
  );
};

const BubblesToy = () => {
  const [bubbles, setBubbles] = useState<{ id: number, x: number, y: number, size: number, color: string }[]>([]);

  const addBubble = () => {
    const intensity = Math.random();
    playSound('pop', 0.5 + intensity);
    triggerVibration(5);
    
    const colors = ['bg-blue-200/40', 'bg-cyan-200/40', 'bg-white/40', 'bg-indigo-100/40'];
    
    setBubbles([...bubbles, {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      y: 100,
      size: 40 + Math.random() * 60,
      color: colors[Math.floor(Math.random() * colors.length)]
    }]);
  };

  const popBubble = (id: number) => {
    playSound('pop', 1.8 + Math.random());
    triggerVibration([10, 5]);
    setBubbles(bubbles.filter(b => b.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 pb-32">
      <div className="text-center">
        <h2 className="comfortaa text-3xl text-primary-container">Ethereal Blower</h2>
        <p className="text-slate-500 font-bold">Tap a bubble to burst it!</p>
      </div>

      <div className="relative w-full max-w-sm h-96 bg-gradient-to-b from-primary-container/5 to-primary-container/20 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-primary-container/10 filter blur-2xl" />
        
        <AnimatePresence>
          {bubbles.map(b => (
            <motion.button
              key={b.id}
              initial={{ y: 350, opacity: 0, scale: 0.2 }}
              animate={{ y: -100, opacity: [0, 0.8, 0.8, 0], scale: [0.5, 1, 1.1, 1.2] }}
              exit={{ 
                scale: [1, 2], 
                opacity: 0,
                transition: { duration: 0.1 }
              }}
              transition={{ duration: 6 + Math.random() * 4, ease: "linear" }}
              onAnimationComplete={() => {
                // Auto removal if not clicked
                if (bubbles.find(item => item.id === b.id)) {
                   setBubbles(prev => prev.filter(item => item.id !== b.id));
                }
              }}
              onClick={() => popBubble(b.id)}
              className={`absolute border-2 border-white/60 rounded-full shadow-[inset_-4px_-4px_10px_rgba(255,255,255,0.4),inset_4px_4px_10px_rgba(0,0,0,0.05)] backdrop-blur-[2px] cursor-pointer group ${b.color}`}
              style={{ left: `${b.x}%`, width: b.size, height: b.size }}
            >
              {/* Shine highlight */}
              <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-white/60 rounded-full blur-[2px]" />
            </motion.button>
          ))}
        </AnimatePresence>
        
        {/* Wand */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom -10 left-1/2 -translate-x-1/2 w-20 h-24 bg-primary-container rounded-t-full border-x-[6px] border-t-[6px] border-white shadow-[0_0_30px_rgba(0,103,128,0.2)] z-20 flex items-start justify-center pt-4"
        >
          <div className="w-12 h-12 rounded-full border-4 border-white/40 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 animate-pulse" />
          </div>
        </motion.div>
      </div>

      <button
        onClick={addBubble}
        className="px-12 py-5 bg-primary-container text-on-primary-container comfortaa text-2xl rounded-[32px] shadow-[0_10px_0_0_#005266] hover:shadow-[0_12px_40px_rgba(0,103,128,0.3),0_10px_0_0_#005266] active:translate-y-2 active:shadow-none transition-all flex items-center gap-3 cursor-pointer"
      >
        <Wind size={28} /> Blow
      </button>
    </div>
  );
};

const WindChimesToy = () => {
  const chimes = [
    { id: 1, freq: 300, height: 'h-64' },
    { id: 2, freq: 400, height: 'h-56' },
    { id: 3, freq: 500, height: 'h-48' },
    { id: 4, freq: 600, height: 'h-40' },
    { id: 5, freq: 700, height: 'h-32' },
  ];

  const [swinging, setSwinging] = useState<number | null>(null);

  const ring = (id: number, freq: number) => {
    playSound('note', freq * 1.5);
    setSwinging(id);
    setTimeout(() => setSwinging(null), 500);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-12 pb-32">
      <div className="text-center">
        <h2 className="comfortaa text-2xl text-tertiary">Magic Wind Chimes</h2>
        <p className="text-slate-500 font-bold">Swipe or tap to hear the breeze</p>
      </div>

      <div className="flex gap-4 items-start p-8 bg-surface-container/20 rounded-full border-t-8 border-tertiary-container shadow-inner">
        {chimes.map((c) => (
          <motion.button
            key={c.id}
            animate={{ 
              rotate: swinging === c.id ? [0, 10, -10, 5, -5, 0] : 0,
              y: swinging === c.id ? [0, -5, 0] : 0
            }}
            onMouseEnter={() => ring(c.id, c.freq)}
            onClick={() => ring(c.id, c.freq)}
            className={`w-4 ${c.height} bg-gradient-to-b from-slate-300 to-slate-400 rounded-full border-x-2 border-white/20 shadow-md relative group cursor-pointer`}
          >
            <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-tertiary/20 border-2 border-tertiary/40 transition-transform ${swinging === c.id ? 'scale-125' : 'scale-100'}`} />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [isMusicOn, setIsMusicOn] = useState(false);

  const toggleMusic = () => {
    const newState = !isMusicOn;
    setIsMusicOn(newState);
    toggleBackgroundMusic(newState);
    playSound('click', 1);
  };

  const handleToySelect = (id: string) => {
    playSound('click', 1.2);
    if (TOYS.find(t => t.id === id)) {
      setCurrentScreen(id as Screen);
      if (!isMusicOn) {
        setIsMusicOn(true);
        toggleBackgroundMusic(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-x-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' ? (
          <WelcomeScreen 
            key="welcome" 
            onStart={() => {
              setCurrentScreen('selection');
              setIsMusicOn(true);
              toggleBackgroundMusic(true);
            }} 
          />
        ) : (
          <motion.div 
            key="interface"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <Header 
              onBack={currentScreen !== 'selection' ? () => setCurrentScreen('selection') : undefined} 
              title={TOYS.find(t => t.id === currentScreen)?.name}
              isMusicOn={isMusicOn}
              onToggleMusic={toggleMusic}
            />
            
            <main className="flex-1 flex flex-col">
              {currentScreen === 'selection' && <SelectionScreen onSelect={handleToySelect} />}
              {currentScreen === 'toy-tilt' && <TiltToy />}
              {currentScreen === 'toy-popit' && <PopItToy />}
              {currentScreen === 'toy-bubblewrap' && <BubbleWrapToy />}
              {currentScreen === 'toy-sliders' && <SliderToy />}
              {currentScreen === 'toy-spinner' && <FidgetToy />}
              {currentScreen === 'toy-xylophone' && <XylophoneToy />}
              {currentScreen === 'toy-squeeze' && <SqueezeToy />}
              {currentScreen === 'toy-bubbles' && <BubblesToy />}
              {currentScreen === 'toy-wind' && <WindChimesToy />}
            </main>

            <BottomNav active={currentScreen} onChange={(s) => {
              playSound('click', 0.8);
              setCurrentScreen(s);
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
