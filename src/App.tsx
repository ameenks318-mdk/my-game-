import React, { useState, useEffect } from 'react';
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
  Sliders,
  Sparkles,
  Palette,
  Zap,
  Smartphone,
  Trophy,
  Coins,
  Star,
  ChevronRight,
  TrendingUp,
  Award,
  Globe,
  Disc,
  LogOut
} from 'lucide-react';
import { FirebaseProvider, useFirebase } from './components/FirebaseProvider';

let hapticsEnabledGlobal = true;

// --- Types ---
type Screen = 'welcome' | 'selection' | 'toy-tilt' | 'toy-popit' | 'toy-sliders' | 'toy-spinner' | 'toy-xylophone' | 'toy-squeeze' | 'toy-bubbles' | 'toy-bubblewrap' | 'toy-wind' | 'toy-bobble';

// --- Constants ---
const TOYS = [
  { id: 'toy-spinner', name: 'Fidget Spinner', icon: Gamepad2, color: 'primary', locked: false },
  { id: 'toy-popit', name: 'Pop-It', icon: LayoutGrid, color: 'secondary', locked: false },
  { id: 'toy-bubblewrap', name: 'Bubble Wrap', icon: CircleDot, color: 'primary-container', locked: false, isNew: true },
  { id: 'toy-bubbles', name: 'Soap Bubbles', icon: Sparkles, color: 'primary-container', locked: false },
  { id: 'toy-xylophone', name: 'Xylophone', icon: Music, color: 'tertiary', locked: false },
  { id: 'toy-squeeze', name: 'Squeeze Monster', icon: Ghost, color: 'secondary', locked: false },
  { id: 'toy-wind', name: 'Wind Chimes', icon: Wind, color: 'tertiary-container', locked: false },
  { id: 'toy-bobble', name: 'Bobble Head', icon: User, color: 'secondary-container', locked: false, isNew: true },
  { id: 'toy-tilt', name: 'Tilt & Balance', icon: Compass, color: 'primary', locked: false },
  { id: 'toy-sliders', name: 'Textured Sliders', icon: Sliders, color: 'primary', locked: false },
];

const ACHIEVEMENTS = [
  { id: 'first-pop', title: 'First Pop', description: 'Pop your first bubble!', icon: Zap, xp: 50 },
  { id: 'speed-demon', title: 'Speed Demon', description: 'Reach 50 velocity on the spinner', icon: TrendingUp, xp: 100 },
  { id: 'streak-3', title: '3 Day Streak', description: 'Launch the app 3 days in a row', icon: Trophy, xp: 200 },
];

const THEMES = [
  { id: 'neon', name: 'Cyber Glow', colors: { bg: 'bg-slate-900', accent: 'text-cyan-400' } },
  { id: 'ocean', name: 'Deep Sea', colors: { bg: 'bg-blue-900', accent: 'text-sky-300' } },
  { id: 'nature', name: 'Zen Forest', colors: { bg: 'bg-emerald-900', accent: 'text-lime-300' } },
];

const FloatingBackground = ({ screen }: { screen: string }) => {
  const [timeState, setTimeState] = useState<'morning' | 'day' | 'evening' | 'night'>('day');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) setTimeState('morning');
    else if (hour >= 10 && hour < 17) setTimeState('day');
    else if (hour >= 17 && hour < 21) setTimeState('evening');
    else setTimeState('night');
  }, []);

  const getDayColors = () => {
    switch (timeState) {
      case 'morning': return 'from-orange-50/30 via-rose-50/20 to-blue-50/30';
      case 'day': return 'from-sky-50/40 via-blue-50/20 to-indigo-50/30';
      case 'evening': return 'from-amber-50/30 via-purple-50/20 to-indigo-100/30';
      case 'night': return 'from-slate-900 via-indigo-950 to-slate-900';
    }
  };

  const isNight = timeState === 'night';

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 transition-colors duration-1000 bg-gradient-to-br ${getDayColors()}`}>
      {/* Decorative Orbs */}
      <motion.div 
        animate={{ 
          x: [0, 100, -100, 0],
          y: [0, -100, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className={`absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full blur-[120px] ${isNight ? 'bg-primary/10' : 'bg-primary/5'}`}
      />
      <motion.div 
        animate={{ 
          x: [0, -150, 150, 0],
          y: [0, 150, -150, 0],
          scale: [1, 0.8, 1.3, 1],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className={`absolute bottom-1/4 -right-20 w-[600px] h-[600px] rounded-full blur-[150px] ${isNight ? 'bg-secondary/10' : 'bg-secondary/5'}`}
      />

      {/* Screen Specific Accents */}
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
        >
          {screen === 'toy-bubbles' && (
            <div className="absolute inset-0">
              {Array(12).fill(0).map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    y: [window.innerHeight + 100, -200], 
                    x: [Math.sin(i) * 100, Math.cos(i) * 100 + (Math.random() - 0.5) * 200] 
                  }}
                  transition={{ 
                    duration: 15 + Math.random() * 10, 
                    repeat: Infinity, 
                    delay: i * 1.2 
                  }}
                  className={`absolute left-1/2 w-4 h-4 rounded-full ${isNight ? 'bg-white/10' : 'bg-white/30'} border border-white/20`}
                  style={{ left: `${(i / 12) * 100}%` }}
                />
              ))}
            </div>
          )}

          {screen === 'toy-popit' && (
            <div className="absolute inset-0 opacity-20">
              {Array(20).fill(0).map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1, 0.5], 
                    opacity: [0, 1, 0],
                    rotate: [0, 90]
                  }}
                  transition={{ 
                    duration: 5 + Math.random() * 5, 
                    repeat: Infinity, 
                    delay: i * 0.5 
                  }}
                  className="absolute w-8 h-8 border-2 border-primary rounded-lg"
                  style={{ 
                    left: `${Math.random() * 100}%`, 
                    top: `${Math.random() * 100}%` 
                  }}
                />
              ))}
            </div>
          )}

          {screen === 'toy-spinner' && (
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-[200px] border-primary/5 rounded-full border-dashed opacity-50"
             />
          )}

          {screen === 'toy-xylophone' && (
            <div className="absolute inset-0 overflow-hidden">
               {['bg-red-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400'].map((c, i) => (
                 <motion.div 
                   key={i}
                   animate={{ 
                     x: [-500, 2000],
                     skewX: [-20, 20]
                   }}
                   transition={{ 
                     duration: 10 + i * 2, 
                     repeat: Infinity, 
                     ease: "easeInOut" 
                   }}
                   className={`absolute top-0 w-20 h-full ${c} blur-3xl opacity-[0.03]`}
                   style={{ left: `${i * 20}%` }}
                 />
               ))}
            </div>
          )}

          {screen === 'toy-bobble' && (
            <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-secondary/10 to-transparent" />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
const Header = ({ 
  onBack, 
  title, 
  isMusicOn, 
  onToggleMusic,
  isHapticsOn,
  onToggleHaptics,
  stats
}: { 
  onBack?: () => void, 
  title?: string, 
  isMusicOn: boolean, 
  onToggleMusic: () => void,
  isHapticsOn: boolean,
  onToggleHaptics: () => void,
  stats: { xp: number, coins: number, level: number }
}) => {
  const progress = (stats.xp % 100);
  
  return (
    <header className="flex justify-between items-center px-4 py-3 w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-[0_1px_4px_rgba(0,0,0,0.05)] rounded-b-2xl border-b border-slate-100">
      <div className="flex items-center gap-3">
        {onBack ? (
          <button 
            onClick={() => {
              playSound('click', 0.8);
              onBack();
            }} 
            className="p-1.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
             <Zap size={24} />
          </div>
        )}
        <div className="flex flex-col">
          <h1 className="comfortaa text-sm font-bold text-slate-800 tracking-tight leading-none mb-1">{title || 'Serenity Spin'}</h1>
          <div className="flex items-center gap-2">
             <div className="flex items-center gap-0.5">
                <Star size={10} className="text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase leading-none">Lvl {stats.level}</span>
             </div>
             <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-amber-500 transition-all duration-500" 
                />
             </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 border border-amber-100 rounded-xl">
           <Coins size={14} className="text-amber-600" />
           <span className="text-xs font-black text-amber-700">{stats.coins}</span>
        </div>

        <div className="flex gap-1">
          <button 
            onClick={onToggleHaptics}
            className={`p-2 rounded-xl transition-all active:scale-95 cursor-pointer ${isHapticsOn ? 'bg-slate-100 text-slate-600' : 'bg-slate-50 text-slate-300'}`}
          >
            <Smartphone size={18} />
          </button>
          <button 
            onClick={onToggleMusic}
            className={`p-2 rounded-xl transition-all active:scale-95 cursor-pointer ${isMusicOn ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-300'}`}
          >
            <Volume2 size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

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
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let compressor: DynamicsCompressorNode | null = null;

const getAudioCtx = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      
      // Master compression and lowpass to prevent clipping and harshness
      compressor = audioCtx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-24, audioCtx.currentTime);
      compressor.knee.setValueAtTime(40, audioCtx.currentTime);
      compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
      compressor.attack.setValueAtTime(0, audioCtx.currentTime);
      compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, audioCtx.currentTime); // Softer filter
      filter.Q.setValueAtTime(0.5, audioCtx.currentTime);

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.6, audioCtx.currentTime); // Further volume reduction
      
      compressor.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(audioCtx.destination);
    }
  }
  return audioCtx;
};

const getAudioDestination = () => {
  getAudioCtx();
  return compressor || audioCtx?.destination || null;
};

const triggerVibration = (pattern: number | number[]) => {
  if (hapticsEnabledGlobal && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

const playSound = (type: 'pop' | 'click' | 'slide' | 'note' | 'squeeze' | 'ridged' | 'smooth' | 'spin-neon' | 'spin-pro' | 'spin-gold' | 'celebrate', pitch = 1) => {
  try {
    const ctx = getAudioCtx();
    const dest = getAudioDestination();
    if (!ctx || !dest) return;
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;

    if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(10, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.16);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(100 * pitch, now);
      gain2.gain.setValueAtTime(0.2, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc2.connect(gain2);
      gain2.connect(dest);
      osc2.start(now);
      osc2.stop(now + 0.06);
    } else if (type === 'click') {
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
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(dest);
      noise.start(now);
    } else if (type === 'note') {
       [1, 2.76, 5.4].forEach((h, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch * h, now);
        gain.gain.setValueAtTime(0.2 / (i + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (i === 0 ? 0.8 : 0.2));
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.9);
      });
    } else if (type === 'squeeze') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1200 * pitch, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.21);
    } else if (type === 'slide' || type === 'smooth') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type === 'smooth' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(150 + pitch * 100, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (type === 'ridged') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle'; // Was square
      osc.frequency.setValueAtTime(60, now);
      gain.gain.setValueAtTime(0.05, now); // Reduced volume
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'spin-neon') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle'; // Was sawtooth
      osc.frequency.setValueAtTime(50 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(200 * pitch, now + 0.1);
      gain.gain.setValueAtTime(0.03, now); // Reduced volume
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (type === 'spin-pro') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(500 * pitch, now + 0.1);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (type === 'spin-gold') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle'; 
      osc.frequency.setValueAtTime(200 * pitch, now);
      gain.gain.setValueAtTime(0.015, now); 
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (type === 'celebrate') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.1);
        gain.gain.setValueAtTime(0, now + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.1, now + i * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.4);
      });
    }
  } catch (e) {
    console.error('Audio error', e);
  }
};

// --- Ambient Music Handler ---
let bgOscs: OscillatorNode[] = [];
let bgGain: GainNode | null = null;
let musicInterval: number | null = null;

const toggleBackgroundMusic = (on: boolean) => {
  try {
    const ctx = getAudioCtx();
    const dest = getAudioDestination();
    if (!ctx || !dest) return;
    if (ctx.state === 'suspended') ctx.resume();
    
    if (!on) {
      if (bgGain) {
        bgGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
        if (musicInterval) clearInterval(musicInterval);
        musicInterval = null;
        setTimeout(() => {
          bgOscs.forEach(o => { try { o.stop(); } catch(e) {} });
          bgOscs = [];
          if (bgGain) {
            bgGain.disconnect();
            bgGain = null;
          }
        }, 1600);
      }
      return;
    }

    if (musicInterval) return; // Already playing

    bgGain = ctx.createGain();
    bgGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    bgGain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 3);
    bgGain.connect(dest);

    const bpm = 84; // Slower for ambient feel
    const stepTime = 60 / bpm; 
    let step = 0;

    // Pokémon TCG inspired progression (CMaj7 - FMaj7 feel)
    const melody = [
      523.25, 493.88, 440.00, 392.00, 349.23, 329.63, 293.66, 392.00,
      523.25, 587.33, 659.25, 493.88, 440.00, 392.00, 523.25, null
    ];
    
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // CMaj7
      [349.23, 440.00, 523.25, 659.25], // FMaj7
    ];

    const playNote = (freq: number, type: 'sine' | 'triangle', vol: number, attack: number, decay: number, time: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, time);
      
      // Detune for Lo-Fi feel
      osc.detune.setValueAtTime((Math.random() - 0.5) * 10, time);
      
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(vol, time + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, time + attack + decay);
      
      osc.connect(g);
      g.connect(bgGain!);
      osc.start(time);
      osc.stop(time + attack + decay + 0.1);
      bgOscs.push(osc);
      
      setTimeout(() => {
        bgOscs = bgOscs.filter(o => o !== osc);
      }, (attack + decay + 1) * 1000);
    };

    musicInterval = window.setInterval(() => {
      const nextTime = ctx.currentTime + 0.1;
      
      // Play Pad (Chords) every 4 steps
      if (step % 4 === 0) {
        const chord = chords[(step / 4) % chords.length];
        chord.forEach(f => {
          playNote(f, 'sine', 0.04, 2, 4, nextTime);
        });
      }

      // Play Melody
      const note = melody[step % melody.length];
      if (note && step % 2 === 0) {
        playNote(note, 'sine', 0.05, 0.4, 1.5, nextTime);
      }

      // Subtle sparkle
      if (Math.random() > 0.8) {
        playNote(1046.50 + (Math.random() * 500), 'sine', 0.02, 0.1, 0.5, nextTime);
      }

      step++;
    }, stepTime * 1000);

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
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-3/4 h-3/4 rounded-full border-[3px] border-primary-container/30"
      >
        <div className="absolute top-1/2 right-0 -mr-2 -mt-2 w-4 h-4 bg-tertiary rounded-full shadow-md" />
      </motion.div>

      {/* Central Core Toy */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          rotateY: [0, 180, 360],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative z-10 w-44 h-44 bg-gradient-to-br from-primary via-primary-container to-secondary border-[8px] border-white rounded-[48px] shadow-[0_25px_60px_rgba(0,103,128,0.5),inset_0_-10px_20px_rgba(0,0,0,0.2)] flex items-center justify-center overflow-hidden"
      >
        {/* Dynamic Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.6),transparent)]" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Dices size={90} strokeWidth={1.5} className="text-white drop-shadow-[0_8px_15px_rgba(0,0,0,0.4)]" />
        </motion.div>
        
        {/* Liquid wave effect at the bottom */}
        <motion.div 
          animate={{ x: [-100, 0, -100] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-[200%] h-1/3 bg-white/20 blur-md rounded-[100%]" 
        />
      </motion.div>
    </div>
    
    <div className="z-10 mt-4 md:mt-0">
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="comfortaa text-4xl md:text-6xl text-primary font-bold drop-shadow-sm mb-2"
      >
        Serenity Spin
      </motion.h1>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="inline-block px-4 py-1.5 bg-primary/10 rounded-full"
      >
        <p className="text-primary font-bold tracking-[0.1em] uppercase text-[9px]">Infinite Sensory Universe</p>
      </motion.div>
    </div>

    <motion.div 
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="w-full max-w-xs px-4"
    >
      <button 
        onClick={onStart}
        className="w-full py-5 rounded-[32px] border-[4px] border-[#004e61] bg-primary text-white comfortaa text-2xl shadow-[0_12px_40px_rgba(0,103,128,0.3),0_12px_0_0_#003a49] hover:shadow-[0_15px_50px_rgba(0,103,128,0.4),0_12px_0_0_#003a49] active:translate-y-3 active:shadow-none transition-all flex items-center justify-center gap-4 group translate-y-0 cursor-pointer"
      >
        <Gamepad2 size={28} className="group-active:rotate-90 transition-transform" />
        Play Now
      </button>
    </motion.div>
    
    <button 
      onClick={() => {
        playSound('note', 440);
        triggerVibration(10);
      }}
      className="text-slate-400 font-bold underline decoration-2 underline-offset-4 hover:text-primary transition-colors cursor-pointer mt-4"
    >
      Need help?
    </button>
  </motion.div>
);

const SelectionScreen = ({ onSelect, stats, currentTheme, onSetTheme }: { onSelect: (id: string) => void, stats: { xp: number, coins: number, level: number, streak: number }, currentTheme: string, onSetTheme: (id: string) => void }) => {
  const [activeTab, setActiveTab] = useState<'toys' | 'progress' | 'leaderboard' | 'shop'>('toys');
  const { user, signIn, signOut } = useFirebase();

  const mockLeaderboard = [
    { name: 'ZenMaster', xp: 4500, avatar: '🧘' },
    { name: 'PopKing', xp: 3200, avatar: '🎈' },
    { name: 'CrystalRave', xp: 2800, avatar: '💎' },
    { name: 'FidgetFlow', xp: 2100, avatar: '🌀' },
    { name: 'SilentBreeze', xp: 1800, avatar: '🍃' },
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="flex-1 w-full max-w-5xl mx-auto px-6 pt-10 pb-32"
    >
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
        className="mb-8 flex flex-col lg:flex-row justify-between items-end gap-6"
      >
        <div>
           <h2 className="comfortaa text-4xl md:text-5xl text-slate-800 font-black leading-tight">Pick your <span className="text-primary italic">escape</span></h2>
           <p className="text-slate-400 text-lg mt-2 font-bold tracking-tight">What sensory joy do you need today?</p>
        </div>

        <div className="flex gap-1 p-1.5 bg-slate-100 rounded-2xl w-full lg:w-auto shadow-inner overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => { playSound('click', 1); setActiveTab('toys'); }}
            className={`flex-none lg:px-8 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'toys' ? 'bg-white text-slate-800 shadow-sm scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Toys
          </button>
          <button 
            onClick={() => { playSound('click', 1); setActiveTab('progress'); }}
            className={`flex-none lg:px-8 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'progress' ? 'bg-white text-slate-800 shadow-sm scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Progress
          </button>
          <button 
            onClick={() => { playSound('click', 1); setActiveTab('leaderboard'); }}
            className={`flex-none lg:px-8 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leaderboard' ? 'bg-white text-slate-800 shadow-sm scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Social
          </button>
          <button 
            onClick={() => { playSound('click', 1); setActiveTab('shop'); }}
            className={`flex-none lg:px-8 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'shop' ? 'bg-white text-slate-800 shadow-sm scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Shop
          </button>
        </div>
      </motion.div>

      {activeTab === 'toys' ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TOYS.map((toy) => (
            <motion.button 
              key={toy.id}
              variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}
              onClick={() => onSelect(toy.id)}
              className={`relative bg-white rounded-[32px] border-[4px] p-6 flex flex-col items-center justify-center gap-4 transition-all duration-150 group cursor-pointer
                ${toy.color === 'primary' ? 'border-primary shadow-[6px_6px_0_0_#004e61] text-primary hover:shadow-[8px_8px_0_0_#004e61]' : ''}
                ${toy.color === 'secondary' ? 'border-secondary shadow-[6px_6px_0_0_#8e0048] text-secondary hover:shadow-[8px_8px_0_0_#8e0048]' : ''}
                ${toy.color === 'primary-container' ? 'border-primary-container shadow-[6px_6px_0_0_#005266] text-primary hover:shadow-[8px_8px_0_0_#005266]' : ''}
                ${toy.color === 'tertiary' ? 'border-tertiary shadow-[6px_6px_0_0_#3e4c00] text-tertiary hover:shadow-[8px_8px_0_0_#3e4c00]' : ''}
                ${toy.color === 'tertiary-container' ? 'border-tertiary-container shadow-[6px_6px_0_0_#425000] text-on-tertiary-container hover:shadow-[8px_8px_0_0_#425000]' : ''}
                ${toy.color === 'secondary-container' ? 'border-secondary-container shadow-[6px_6px_0_0_#8e0048] text-on-secondary-container hover:shadow-[8px_8px_0_0_#8e0048]' : ''}
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
                ${toy.color === 'secondary-container' ? 'bg-surface border-2 border-secondary-container' : ''}
              `}>
                <toy.icon size={48} strokeWidth={2.5} />
              </div>
               <span className="comfortaa text-lg font-bold text-center leading-tight">
                {toy.name.split(' ').map((word, i) => <React.Fragment key={i}>{word}<br/></React.Fragment>)}
              </span>
            </motion.button>
          ))}
        </div>
      ) : activeTab === 'progress' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                       <Trophy size={20} className="text-amber-400" />
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">Level {stats.level}</span>
                    </div>
                    <div className="text-4xl font-black">{stats.xp}</div>
                    <div className="text-xs font-bold text-white/40 uppercase mt-1">Total XP</div>
                 </div>
                 <div className="bg-primary text-white p-8 rounded-[40px] shadow-xl shadow-primary/20">
                    <div className="flex justify-between items-center mb-4">
                       <TrendingUp size={20} className="text-white/80" />
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">Streak</span>
                    </div>
                    <div className="text-4xl font-black">{stats.streak}d</div>
                    <div className="text-xs font-bold text-white/40 uppercase mt-1">Activity</div>
                 </div>
              </div>

              <div className="bg-white/60 p-8 rounded-[40px] border-4 border-white shadow-lg space-y-4">
                 <div className="flex justify-between items-end">
                    <div>
                       <h3 className="text-xl font-black text-slate-800">Next Level</h3>
                       <p className="text-slate-400 font-bold text-sm tracking-tight">Earn XP to level up!</p>
                    </div>
                    <div className="text-right">
                       <span className="text-2xl font-black text-primary">{stats.xp % 100}</span>
                       <span className="text-slate-300 font-bold"> / 100 XP</span>
                    </div>
                 </div>
                 <div className="h-6 bg-slate-100 rounded-2xl p-1 shadow-inner overflow-hidden">
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${stats.xp % 100}%` }}
                       className="h-full bg-gradient-to-r from-primary to-primary-container rounded-xl shadow-sm"
                    />
                 </div>
                 <div className="pt-2 flex items-start gap-2">
                    <Sparkles size={14} className="text-primary mt-0.5 shrink-0" />
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                       Level up every <span className="text-slate-800">100 XP</span>. Each level increases your sensory score and prestige!
                    </p>
                 </div>
              </div>

              <div className="bg-white border border-slate-100 p-8 rounded-[40px] space-y-6 shadow-sm overflow-hidden">
                 <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Achievements</h3>
                    <Award size={18} className="text-slate-300" />
                 </div>
                 <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {ACHIEVEMENTS.map(ach => (
                       <div key={ach.id} className="flex items-center gap-4 group">
                          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                             <Trophy size={20} />
                          </div>
                          <div>
                             <div className="text-sm font-bold text-slate-800">{ach.title}</div>
                             <div className="text-xs text-slate-400 font-medium">{ach.description}</div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-100 p-8 rounded-[40px] space-y-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black text-amber-700 uppercase tracking-widest">Daily Reward</h3>
                    <div className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">LIVE</div>
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-lg border border-amber-200 flex items-center justify-center">
                       <Coins size={32} className="text-amber-500" />
                    </div>
                    <div>
                       <div className="text-xl font-black text-amber-900">+50 Coins</div>
                       <button 
                         onClick={() => { playSound('celebrate', 1); triggerVibration(50); }}
                         className="mt-2 text-xs font-black text-amber-500 uppercase tracking-widest border-b-2 border-amber-300 pb-1 hover:text-amber-600 transition-colors"
                       >
                         Claim Reward
                       </button>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[40px] space-y-6 text-white min-h-[200px] flex flex-col justify-center text-center relative overflow-hidden">
                 <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-50" />
                 <Globe size={48} className="mx-auto text-primary/40 mb-4 animate-pulse relative z-10" />
                 <h3 className="text-lg font-black tracking-tight relative z-10">{user ? 'You are Synced' : 'Sync Progress'}</h3>
                 <p className="text-sm text-white/50 font-medium relative z-10">
                   {user ? `Logged in as ${user.displayName || user.email}` : 'Protect your progress. Sync to cloud to join the global community!'}
                 </p>
                 {user ? (
                   <button 
                     onClick={() => signOut()}
                     className="mt-4 bg-white/10 text-white hover:bg-white/20 py-3 rounded-2xl font-black text-xs uppercase tracking-widest relative z-10 active:scale-95 transition-all flex items-center justify-center gap-2 w-full"
                   >
                     <LogOut size={16} /> Sign Out
                   </button>
                 ) : (
                   <button 
                     onClick={() => signIn()}
                     className="mt-4 bg-white text-slate-900 py-3 rounded-2xl font-black text-xs uppercase tracking-widest relative z-10 active:scale-95 transition-all w-full"
                   >
                     Sign In with Google
                   </button>
                 )}
              </div>
           </div>
        </div>
      ) : activeTab === 'leaderboard' ? (
        <div className="space-y-8">
           <div className="bg-slate-900 p-8 rounded-[48px] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20">
                       <Globe size={40} className="text-primary/60" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black tracking-tight">Global Leaderboard</h3>
                       <p className="text-white/50 font-medium">Top stress-busters worldwide</p>
                    </div>
                 </div>
                 <div className="text-center md:text-right">
                    <div className="text-xs font-black text-white/30 uppercase tracking-widest">Your Rank</div>
                    <div className="text-4xl font-black text-primary">#{user ? '982' : '--'}</div>
                 </div>
              </div>
           </div>

           <div className="bg-white/40 backdrop-blur-md rounded-[48px] border-4 border-white p-8 shadow-xl">
              <div className="space-y-4">
                 {mockLeaderboard.map((item, i) => (
                    <motion.div 
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center justify-between p-6 rounded-3xl transition-all ${i === 0 ? 'bg-amber-50 border-2 border-amber-200' : 'bg-white/50 border border-slate-100 hover:bg-white'}`}
                    >
                       <div className="flex items-center gap-6">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl
                            ${i === 0 ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-400'}
                          `}>
                             {i + 1}
                          </div>
                          <div className="text-3xl">{item.avatar}</div>
                          <div>
                             <div className="font-black text-slate-800">{item.name}</div>
                             <div className="text-xs font-bold text-slate-400 uppercase">Season 1 Pro</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-lg font-black text-primary">{item.xp} XP</div>
                          <div className="text-xs font-bold text-slate-400 tracking-tighter uppercase">Ascended</div>
                       </div>
                    </motion.div>
                 ))}
              </div>
              
              {!user && (
                <div className="mt-8 p-6 bg-primary/10 rounded-3xl border-2 border-dashed border-primary/20 text-center">
                   <p className="text-primary font-bold">Sign in to join the leaderboard and compete!</p>
                </div>
              )}
           </div>
        </div>
      ) : (
        <div className="space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {THEMES.map(theme => (
                <div key={theme.id} className={`p-8 rounded-[40px] border-4 transition-all ${currentTheme === theme.id ? 'border-primary bg-white shadow-xl scale-[1.02]' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
                   <div className={`w-16 h-16 rounded-2xl mb-6 ${theme.colors.bg} flex items-center justify-center`}>
                      <Palette size={32} className="text-white/40" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-800">{theme.name}</h3>
                   <p className="text-slate-400 text-sm mt-1 font-medium italic">Transform your vibe</p>
                   {currentTheme === theme.id ? (
                     <div className="mt-6 text-primary font-black text-xs uppercase tracking-widest">Active</div>
                   ) : (
                     <button 
                       onClick={() => { playSound('click', 1); onSetTheme(theme.id); }}
                       className="mt-6 w-full bg-slate-800 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 active:scale-95 transition-all"
                     >
                       Equip
                     </button>
                   )}
                </div>
              ))}
           </div>
           
           <div className="bg-slate-900 text-white p-12 rounded-[50px] flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
              <div className="relative z-10">
                 <h2 className="text-3xl font-black italic">Mystic Bundle</h2>
                 <p className="text-white/60 mt-2 font-bold">Unlocks 3 premium themes & hidden toys.</p>
                 <div className="mt-6 flex items-center gap-4">
                    <div className="bg-amber-500 px-4 py-2 rounded-full font-black text-xs">500 COINS</div>
                    <button className="text-white/40 font-black text-xs uppercase tracking-widest border-b border-white/20 pb-1">Coming Soon</button>
                 </div>
              </div>
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center relative z-10 backdrop-blur-xl">
                 <Sparkles size={48} className="text-amber-400 animate-pulse" />
              </div>
           </div>
        </div>
      )}
    </motion.div>
  );
};

const TiltToy = () => {
  // Marble structure: { id, x, y, vx, vy, color, radius }
  const MARBLE_RADIUS = 24;
  const BOARD_RADIUS = 160; // Inner playing area radius

  const [marbles, setMarbles] = useState<any[]>([
    { id: 1, color: 'secondary', x: -40, y: -40, vx: 0, vy: 0, radius: 24, bounciness: 0.5, mass: 1 },
    { id: 2, color: 'primary', x: 50, y: 30, vx: 0, vy: 0, radius: 20, bounciness: 0.6, mass: 0.8 },
    { id: 3, color: 'tertiary', x: 20, y: 80, vx: 0, vy: 0, radius: 28, bounciness: 0.4, mass: 1.2 },
  ]);

  const [particles, setParticles] = useState<any[]>([]);
  const [showVisualSettings, setShowVisualSettings] = useState(false);
  const [showMarbleCustomizer, setShowMarbleCustomizer] = useState(false);
  const [selectedMarbleId, setSelectedMarbleId] = useState<number | null>(null);
  const [visualSettings, setVisualSettings] = useState({
    density: 8,
    theme: 'default' as 'default' | 'neon' | 'monochrome' | 'candy'
  });

  const createBurst = (x: number, y: number, color: string) => {
    const themeColors: any = {
      default: (c: string) => c === 'primary' ? '#006780' : c === 'secondary' ? '#e20476' : '#62a800',
      neon: () => `hsl(${Math.random() * 360}, 100%, 50%)`,
      monochrome: () => '#94a3b8',
      candy: () => ['#ff758c', '#ff7eb3', '#70d6ff', '#ffbe0b'][Math.floor(Math.random() * 4)]
    };

    const getColorFn = themeColors[visualSettings.theme] || themeColors.default;

    const burst = Array.from({ length: visualSettings.density }).map(() => ({
      id: Math.random(),
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      life: 1.0,
      color: typeof getColorFn === 'function' ? getColorFn(color) : getColorFn
    }));
    setParticles(prev => [...prev, ...burst].slice(-100));
  };

  const [settings, setSettings] = useState({
    gravity: 0.3,
    friction: 0.97,
    airResistance: 0.99,
    bounciness: 0.5,
  });

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [showSettings, setShowSettings] = useState(false);
  const tiltRef = React.useRef({ x: 0, y: 0 });
  const isSensorActive = React.useRef(false);

  // Handle Device Orientation
  React.useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // Gamma is left/right (-90 to 90), Beta is front/back (-180 to 180)
      if (e.gamma !== null && e.beta !== null) {
        isSensorActive.current = true;
        // Use flat position as neutral (0,0)
        // Add a small deadzone to prevent jitter
        const deadzone = 2; 
        
        let tx = e.gamma / 30; // More sensitive than 45
        let ty = e.beta / 30;
        
        if (Math.abs(e.gamma) < deadzone) tx = 0;
        if (Math.abs(e.beta) < deadzone) ty = 0;

        tx = Math.max(-1, Math.min(1, tx));
        ty = Math.max(-1, Math.min(1, ty));
        
        setTilt({ x: tx, y: ty });
        tiltRef.current = { x: tx, y: ty };
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  // Physics Loop
  React.useEffect(() => {
    let frame: number;
    const update = () => {
      setParticles(prev => prev
        .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 0.04 }))
        .filter(p => p.life > 0)
      );

      setMarbles(prev => {
        const next = prev.map(m => {
          let { x, y, vx, vy, radius = MARBLE_RADIUS, mass = 1, bounciness = settings.bounciness } = m;

          // Apply Gravity based on Tilt
          vx += (tiltRef.current.x * settings.gravity) / mass;
          vy += (tiltRef.current.y * settings.gravity) / mass;

          // Apply Air Resistance & Friction
          vx *= settings.airResistance * settings.friction;
          vy *= settings.airResistance * settings.friction;

          // Velocity Threshold - stop moving at very low speeds to prevent drift
          if (Math.abs(vx) < 0.01) vx = 0;
          if (Math.abs(vy) < 0.01) vy = 0;

          // Update Position
          x += vx;
          y += vy;

          // Wall Collision (Circular Boundary)
          const dist = Math.sqrt(x * x + y * y);
          const maxDist = BOARD_RADIUS - radius;

          if (dist > maxDist) {
            const nx = x / dist;
            const ny = y / dist;
            x = nx * maxDist;
            const dot = vx * nx + vy * ny;
            vx = (vx - 2 * dot * nx) * bounciness;
            vy = (vy - 2 * dot * ny) * bounciness;

            const impact = Math.sqrt(vx * vx + vy * vy);
            if (impact > 0.5) {
              createBurst(x, y, m.color);
              if (impact > 2) triggerVibration(Math.min(10, Math.ceil(impact * 2)));
            }
          }

          return { ...m, x, y, vx, vy };
        });

        // Marble-to-Marble Collision
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const m1 = next[i];
            const m2 = next[j];
            const dx = m2.x - m1.x;
            const dy = m2.y - m1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = (m1.radius || MARBLE_RADIUS) + (m2.radius || MARBLE_RADIUS);

            if (distance < minDistance) {
              // Standard 2D Elastic Collision
              const angle = Math.atan2(dy, dx);
              const sin = Math.sin(angle);
              const cos = Math.cos(angle);

              // Rotate velocities
              const vx1 = m1.vx * cos + m1.vy * sin;
              const vy1 = m1.vy * cos - m1.vx * sin;
              const vx2 = m2.vx * cos + m2.vy * sin;
              const vy2 = m2.vy * cos - m2.vx * sin;

              // Elastic collision in 1D
              const m1_mass = m1.mass || 1;
              const m2_mass = m2.mass || 1;
              const vx1Final = ((m1_mass - m2_mass) * vx1 + 2 * m2_mass * vx2) / (m1_mass + m2_mass);
              const vx2Final = ((m2_mass - m1_mass) * vx2 + 2 * m1_mass * vx1) / (m1_mass + m2_mass);

              // Restore velocities
              m1.vx = vx1Final * cos - vy1 * sin;
              m1.vy = vy1 * cos + vx1Final * sin;
              m2.vx = vx2Final * cos - vy2 * sin;
              m2.vy = vy2 * cos + vx2Final * sin;

              // Separate marbles to avoid sticking
              const overlap = minDistance - distance;
              const moveX = (overlap / 2) * cos;
              const moveY = (overlap / 2) * sin;
              m1.x -= moveX;
              m1.y -= moveY;
              m2.x += moveX;
              m2.y += moveY;

              // Sound/Effect on impact
              const relVel = Math.abs(vx1Final - vx2Final);
              if (relVel > 1) {
                playSound('pop', 0.8 + relVel / 10);
                createBurst((m1.x + m2.x) / 2, (m1.y + m2.y) / 2, m1.color);
              }
            }
          }
        }

        return [...next];
      });
      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [settings]);

  const addMarble = () => {
    if (marbles.length >= 10) return;
    playSound('click', 1.5);
    const colors = ['secondary', 'primary', 'tertiary'];
    const randColor = colors[Math.floor(Math.random() * colors.length)];
    setMarbles([...marbles, { 
      id: Date.now(), 
      color: randColor, 
      x: (Math.random() - 0.5) * 50, 
      y: (Math.random() - 0.5) * 50,
      vx: 0,
      vy: 0,
      radius: MARBLE_RADIUS,
      bounciness: settings.bounciness,
      mass: 1
    }]);
  };

  const resetBoard = () => {
    playSound('pop', 0.5);
    setMarbles(prev => prev.slice(0, 1).map(m => ({ ...m, x: 0, y: 0, vx: 0, vy: 0 })));
  };

  const handleSimulatedTilt = (e: React.MouseEvent | React.TouchEvent) => {
    if (isSensorActive.current) return; // Prevent fighting with real sensor
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    let clientX, clientY;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    let tx = (clientX - cx) / (rect.width / 2);
    let ty = (clientY - cy) / (rect.height / 2);
    
    // Deadzone
    if (Math.abs(tx) < 0.1) tx = 0;
    if (Math.abs(ty) < 0.1) ty = 0;
    
    setTilt({ x: tx, y: ty });
    tiltRef.current = { x: tx, y: ty };
  };

  const resetTilt = () => {
    setTilt({ x: 0, y: 0 });
    tiltRef.current = { x: 0, y: 0 };
  };

  const updateMarble = (id: number, updates: any) => {
    setMarbles(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const selectedMarble = marbles.find(m => m.id === selectedMarbleId);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6 pb-32">
       {/* Settings Modal Toggles */}
       <div className="w-full max-w-sm flex justify-end gap-3">
          <button 
            onClick={() => {
              playSound('click', 1.1);
              setShowVisualSettings(!showVisualSettings);
              setShowSettings(false);
              setShowMarbleCustomizer(false);
            }}
            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${showVisualSettings ? 'bg-tertiary text-white border-tertiary shadow-lg' : 'bg-white border-slate-200 text-slate-500'}`}
          >
            <Sparkles size={24} />
          </button>
          <button 
            onClick={() => {
              playSound('click', 1.2);
              setShowSettings(!showSettings);
              setShowVisualSettings(false);
              setShowMarbleCustomizer(false);
            }}
            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${showSettings ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white border-slate-200 text-slate-500'}`}
          >
            <Sliders size={24} />
          </button>
       </div>

      <AnimatePresence>
        {showMarbleCustomizer && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-sm bg-white border-4 border-slate-100 p-6 rounded-3xl shadow-2xl flex flex-col gap-6 absolute z-30"
          >
            <div className="flex justify-between items-center">
              <h3 className="comfortaa text-lg font-bold text-slate-800">Marble Factory</h3>
              <button onClick={() => setShowMarbleCustomizer(false)} className="text-slate-400 hover:text-slate-600">
                 <Plus className="rotate-45" size={24} />
              </button>
            </div>

            {!selectedMarble ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <Palette size={32} />
                </div>
                <p className="text-slate-500 font-medium">Tap a marble on the board to customize it!</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* ID and Preview */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div 
                    className="w-12 h-12 rounded-full border-2 shadow-sm"
                    style={{ backgroundColor: selectedMarble.color === 'primary' ? '#006780' : selectedMarble.color === 'secondary' ? '#e20476' : selectedMarble.color === 'tertiary' ? '#62a800' : selectedMarble.color }}
                  />
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Editing Marble</div>
                    <div className="text-slate-700 font-bold capitalize">{selectedMarble.color} Sphere</div>
                  </div>
                </div>

                {/* Color Selector */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Color</div>
                  <div className="flex gap-2">
                    {['#006780', '#e20476', '#62a800', '#f9bc05', '#7b1fa2', '#455a64'].map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          playSound('click', 1.2);
                          updateMarble(selectedMarbleId!, { color: c });
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-transform active:scale-125 ${selectedMarble.color === c ? 'scale-110 border-slate-900 shadow-md' : 'border-white'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Radius (Size)</span>
                    <span>{selectedMarble.radius}px</span>
                  </div>
                  <input 
                    type="range" min="12" max="48" step="1"
                    value={selectedMarble.radius}
                    onChange={(e) => updateMarble(selectedMarbleId!, { radius: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-tertiary"
                  />
                </div>

                {/* Physics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>Bounce</span>
                      <span>{selectedMarble.bounciness}</span>
                    </div>
                    <input 
                      type="range" min="0.1" max="0.95" step="0.05"
                      value={selectedMarble.bounciness}
                      onChange={(e) => updateMarble(selectedMarbleId!, { bounciness: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>Mass</span>
                      <span>{selectedMarble.mass}</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="3" step="0.1"
                      value={selectedMarble.mass}
                      onChange={(e) => updateMarble(selectedMarbleId!, { mass: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-secondary"
                    />
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedMarbleId(null)}
                  className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  Deselect Marble
                </button>
              </div>
            )}
          </motion.div>
        )}
        {showVisualSettings && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full max-w-sm bg-white border-4 border-slate-100 p-6 rounded-3xl shadow-xl flex flex-col gap-6 absolute z-30"
          >
            <div className="flex justify-between items-center">
              <h3 className="comfortaa text-lg font-bold text-slate-800">Visuals</h3>
              <button onClick={() => setShowVisualSettings(false)} className="text-slate-400 hover:text-slate-600">
                 <Plus className="rotate-45" size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Particle Density</span>
                  <span>{visualSettings.density}</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={visualSettings.density}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setVisualSettings(prev => ({ ...prev, density: val }));
                    if (val % 5 === 0) playSound('slide', 0.8 + val / 30);
                  }}
                  className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-tertiary"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Color Theme</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(['default', 'neon', 'monochrome', 'candy'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => {
                        playSound('pop', 1.2);
                        setVisualSettings(prev => ({ ...prev, theme: t }));
                      }}
                      className={`py-2 px-3 rounded-xl border-2 text-sm font-bold capitalize transition-all ${visualSettings.theme === t ? 'bg-tertiary text-white border-tertiary' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => {
                    playSound('click', 1.1);
                    setShowMarbleCustomizer(true);
                    setShowVisualSettings(false);
                  }}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                >
                  <Palette size={20} />
                  Customize Marbles
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full max-w-sm bg-white border-4 border-slate-100 p-6 rounded-3xl shadow-xl flex flex-col gap-6 absolute z-30"
          >
            <div className="flex justify-between items-center">
              <h3 className="comfortaa text-lg font-bold text-slate-800">Physics Lab</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                 <LayoutGrid size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Gravity', key: 'gravity', min: 0, max: 2, step: 0.1 },
                { label: 'Rolling Friction', key: 'friction', min: 0.8, max: 1, step: 0.01 },
                { label: 'Air Resistance', key: 'airResistance', min: 0.9, max: 1, step: 0.005 },
                { label: 'Bounciness', key: 'bounciness', min: 0.1, max: 0.9, step: 0.05 },
              ].map(s => (
                <div key={s.key} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>{s.label}</span>
                    <span>{(settings as any)[s.key]}</span>
                  </div>
                  <input 
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={(settings as any)[s.key]}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (Math.abs(val - (settings as any)[s.key]) > s.step) {
                        playSound('smooth', 0.5 + val / s.max);
                      }
                      setSettings(prev => ({ ...prev, [s.key]: val }));
                    }}
                    className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="relative perspective-1000"
        onMouseMove={handleSimulatedTilt}
        onMouseLeave={resetTilt}
        onTouchMove={handleSimulatedTilt}
        onTouchEnd={resetTilt}
      >
        <motion.div 
          style={{ 
            rotateX: tilt.y * -15, 
            rotateY: tilt.x * 15,
            transformStyle: 'preserve-3d'
          }}
          className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full shadow-[inset_0_10px_20px_rgba(0,0,0,0.1),20px_20px_40px_rgba(0,0,0,0.2),-10px_-10px_30px_#fff] border-8 border-surface-container-high bg-surface flex items-center justify-center overflow-hidden transition-transform duration-100 ease-out"
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="relative w-full h-full">
            {/* Particles */}
            {particles.map(p => (
              <div 
                key={p.id}
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
                style={{ 
                  transform: `translate3d(${p.x}px, ${p.y}px, 0px)`,
                  backgroundColor: p.color,
                  opacity: p.life,
                  scale: p.life
                }}
              />
            ))}

            {marbles.map((m) => (
              <motion.div
                key={m.id}
                layoutId={`marble-${m.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  playSound('click', 1.0);
                  setSelectedMarbleId(m.id);
                  setShowMarbleCustomizer(true);
                  setShowVisualSettings(false);
                }}
                className={`absolute top-1/2 left-1/2 rounded-full border-2 shadow-lg flex items-center justify-center cursor-pointer active:scale-110 transition-shadow z-10 
                  ${selectedMarbleId === m.id ? 'ring-4 ring-white ring-offset-2 ring-offset-primary-container z-20' : ''}`}
                style={{ 
                  transform: `translate3d(${m.x}px, ${m.y}px, 10px)`,
                  width: (m.radius || MARBLE_RADIUS) * 2,
                  height: (m.radius || MARBLE_RADIUS) * 2,
                  marginLeft: -(m.radius || MARBLE_RADIUS),
                  marginTop: -(m.radius || MARBLE_RADIUS),
                  backgroundColor: m.color === 'primary' ? '#006780' : m.color === 'secondary' ? '#e20476' : m.color === 'tertiary' ? '#62a800' : m.color,
                  borderColor: 'rgba(255,255,255,0.4)'
                }}
              >
                {/* 3D sphere shine */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-white/40 via-transparent to-black/10 absolute top-0 left-0" />
                <div 
                  className="rounded-full bg-white/60 absolute blur-[0.5px]" 
                  style={{ 
                    width: (m.radius || MARBLE_RADIUS) / 4, 
                    height: (m.radius || MARBLE_RADIUS) / 4,
                    top: (m.radius || MARBLE_RADIUS) / 3,
                    left: (m.radius || MARBLE_RADIUS) / 3
                  }} 
                />
              </motion.div>
            ))}
          </div>
          
          <div className="absolute w-8 h-8 rounded-full bg-surface-container-highest shadow-inner border border-surface-variant flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-300 shadow-md" />
          </div>
        </motion.div>
      </div>

      <div className="text-center space-y-1">
        <h2 className="comfortaa text-2xl text-primary font-bold">Tilt & Balance</h2>
        <p className="text-slate-500 font-bold text-sm">
          {Math.abs(tilt.x) > 0.1 || Math.abs(tilt.y) > 0.1 ? 'Rolling...' : 'Tilt to roll marbles!'}
        </p>
      </div>

      <div className="flex gap-4 w-full max-w-sm">
        <button 
          onClick={resetBoard}
          className="flex-1 bg-white border-2 border-primary-container text-primary-container rounded-2xl py-3 font-bold shadow-[0_6px_0_0_#4cc9f0] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <LayoutGrid size={20} /> Reset
        </button>
        <button 
          onClick={addMarble}
          className="flex-1 bg-primary text-white rounded-2xl py-3 font-bold shadow-[0_6px_0_0_#004e61] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={20} /> Add Marble
        </button>
      </div>
    </div>
  );
};

const PopItToy = ({ addXP, addCoins }: { addXP: (n: number) => void, addCoins: (n: number) => void }) => {
  const [grid, setGrid] = useState(Array(25).fill(false));
  const [mode, setMode] = useState<'classic' | 'silicone'>('classic');

  const [combo, setCombo] = useState(0);
  const lastPop = React.useRef(Date.now());

  const togglePopper = (i: number) => {
    let pitch = 1.2;
    if (mode === 'silicone') pitch = 0.8;
    
    if (grid[i]) {
       playSound('pop', 0.8 * (mode === 'silicone' ? 0.7 : 1));
       setCombo(0);
    } else {
       const now = Date.now();
       const dt = now - lastPop.current;
       lastPop.current = now;

       if (dt < 500) {
         setCombo(prev => Math.min(prev + 1, 10));
       } else {
         setCombo(0);
       }

       playSound('pop', pitch + (combo * 0.05));
       triggerVibration(15 + combo * 2);
       addXP(1 + Math.floor(combo / 2));
       if (Math.random() > 0.9) addCoins(1);
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
      <AnimatePresence>
        {combo > 2 && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-40 text-secondary font-black text-4xl italic pointer-events-none drop-shadow-lg"
          >
            {combo}x COMBO!
          </motion.div>
        )}
      </AnimatePresence>

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
              animate={{ scale: popped ? 0.9 : 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => togglePopper(i)}
              className={`w-14 h-14 rounded-full transition-all flex items-center justify-center cursor-pointer border-b-[4px] ${s.cell(popped)}`}
            >
              <motion.div 
                animate={{ scale: popped ? 0.8 : 1 }}
                className={`transition-all w-10 h-10 rounded-full ${popped ? 'bg-slate-300 shadow-inner' : s.inner}`} 
              />
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
    
    if (dx > 0.5 && dt > 40) { // Throttled to avoid saturating context
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
      lastUpdate.current = { time: now, values: { ...values, [key]: newVal } };
    }

    setValues(prev => ({ ...prev, [key]: newVal }));
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

const FidgetToy = ({ addXP }: { addXP: (n: number) => void }) => {
  const [rotation, setRotation] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [style, setStyle] = useState<'classic' | 'neon' | 'pro' | 'gold' | 'galactic' | 'vortex' | 'shuriken' | 'rainbow' | 'frost' | 'magma' | 'clover'>('classic');
  const speedRef = React.useRef(0);
  const lastSpeedRef = React.useRef(0);
  const xpAccumulatorRef = React.useRef(0);

  React.useEffect(() => {
    let frame: number;
    let lastTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      setRotation(r => r + speedRef.current);
      
      // Decay speed naturally
      speedRef.current = Math.max(0, speedRef.current * (1 - 0.015 * (dt * 60)));
      
      // Update UI speed less frequently to save performance
      if (Math.abs(speedRef.current - lastSpeedRef.current) > 1) {
        setSpeed(speedRef.current);
        lastSpeedRef.current = speedRef.current;
      }

      if (speedRef.current > 40) {
        xpAccumulatorRef.current += dt;
        if (xpAccumulatorRef.current > 0.5) {
          addXP(2);
          xpAccumulatorRef.current = 0;
        }
      }
      
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [addXP]);

  const spin = () => {
    const soundIntensity = Math.min(speedRef.current / 40 + 1, 3);
    
    if (style === 'neon' || style === 'galactic') {
      playSound('spin-neon', soundIntensity);
    } else if (style === 'pro' || style === 'shuriken' || style === 'magma') {
      playSound('spin-pro', soundIntensity);
    } else if (style === 'gold' || style === 'vortex' || style === 'frost' || style === 'rainbow') {
      playSound('spin-gold', soundIntensity);
    } else {
      playSound('slide', soundIntensity);
    }
    
    triggerVibration(10);
    speedRef.current = Math.min(speedRef.current + 15, 120);
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
      case 'galactic':
        return (
          <div className="relative w-64 h-64 flex items-center justify-center">
             <div className="absolute w-full h-full rounded-full border-[20px] border-indigo-500/20 blur-md animate-pulse" />
             {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
               <div key={deg} style={{ transform: `rotate(${deg}deg)` }} className="absolute w-full h-8 px-2">
                  <div className="w-20 h-8 bg-gradient-to-r from-purple-500 to-transparent blur-[2px] rounded-full" />
               </div>
             ))}
             <div className="z-10 w-24 h-24 bg-slate-900 border-4 border-indigo-400 shadow-[0_0_30px_rgba(129,140,248,0.5)] rounded-full flex items-center justify-center">
                <Sparkles size={32} className="text-white animate-spin" style={{ animationDuration: '3s' }} />
             </div>
          </div>
        );
      case 'vortex':
        return (
          <div className="relative w-64 h-64 flex items-center justify-center">
             {[0, 60, 120, 180, 240, 300].map(deg => (
               <div key={deg} style={{ transform: `rotate(${deg}deg) skewX(20deg)` }} className="absolute w-full h-24 px-4">
                  <div className="w-24 h-20 bg-rose-500/80 rounded-[40px] border-4 border-rose-900" />
               </div>
             ))}
             <div className="z-10 w-16 h-16 bg-white border-8 border-rose-500 rounded-full shadow-xl" />
          </div>
        );
      case 'shuriken':
        return (
          <div className="relative w-64 h-64 flex items-center justify-center">
             {[0, 90, 180, 270].map(deg => (
               <div key={deg} style={{ transform: `rotate(${deg}deg)` }} className="absolute w-full h-32 px-4 flex items-center">
                  <div className="w-28 h-12 bg-slate-300 border-4 border-slate-500 rounded-l-full rounded-br-[80px]" />
               </div>
             ))}
             <div className="z-10 w-12 h-12 bg-slate-800 border-2 border-slate-400 rounded-full" />
          </div>
        );
      case 'rainbow':
        return (
          <div className="relative w-64 h-64 flex items-center justify-center">
             {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <div key={deg} style={{ transform: `rotate(${deg}deg)` }} className="absolute w-full h-12 px-2">
                   <div className="w-24 h-12 rounded-full shadow-lg" style={{ 
                     background: `hsl(${i * 60}, 80%, 60%)`,
                     border: '4px solid white'
                   }} />
                </div>
             ))}
             <div className="z-10 w-16 h-16 bg-white shadow-xl rounded-full border-4 border-slate-100" />
          </div>
        );
      case 'frost':
        return (
          <div className="relative w-64 h-64 flex items-center justify-center">
             <div className="absolute inset-0 bg-cyan-200/20 rounded-full blur-2xl animate-pulse" />
             {[0, 120, 240].map(deg => (
               <div key={deg} style={{ transform: `rotate(${deg}deg)` }} className="absolute w-full h-32 px-2 flex items-center">
                  <div className="w-32 h-32 bg-cyan-50 border-4 border-cyan-200 rounded-[20px] rotate-45 flex items-center justify-center">
                     <div className="w-16 h-16 bg-white rounded-full opacity-40 blur-sm" />
                  </div>
               </div>
             ))}
             <div className="z-10 w-14 h-14 bg-cyan-100 border-4 border-white shadow-lg rounded-full" />
          </div>
        );
      case 'magma':
        return (
          <div className="relative w-64 h-64 flex items-center justify-center">
             <div className="absolute inset-0 bg-orange-600/10 rounded-full blur-3xl" />
             {[0, 90, 180, 270].map(deg => (
                <div key={deg} style={{ transform: `rotate(${deg}deg)` }} className="absolute w-full h-40">
                   <div className="w-32 h-8 bg-gradient-to-r from-orange-600 to-amber-400 rounded-full border-2 border-black/40 shadow-[0_0_15px_rgba(234,88,12,0.4)]" />
                </div>
             ))}
             <div className="z-10 w-20 h-20 bg-slate-900 border-4 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.6)] rounded-full" />
          </div>
        );
      case 'clover':
        return (
          <div className="relative w-64 h-64 flex items-center justify-center">
             {[0, 90, 180, 270].map(deg => (
                <div key={deg} style={{ transform: `rotate(${deg}deg)` }} className="absolute w-full h-24 px-2">
                   <div className="w-24 h-24 bg-emerald-500 rounded-[50%_50%_50%_0%] border-4 border-emerald-900 shadow-lg" />
                </div>
             ))}
             <div className="z-10 w-16 h-16 bg-emerald-900 border-4 border-emerald-400 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full opacity-20" />
             </div>
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
      <div className="flex gap-2 mb-2 p-2 bg-slate-100 rounded-2xl overflow-x-auto w-full max-w-sm scrollbar-hide">
        {(['classic', 'neon', 'pro', 'gold', 'galactic', 'vortex', 'shuriken', 'rainbow', 'frost', 'magma', 'clover'] as const).map(mode => (
          <button 
            key={mode} 
            onClick={() => { setStyle(mode); playSound('click', 1); triggerVibration(10); }}
            className={`flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${style === mode ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:bg-slate-200'}`}
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
        style={{ rotate: rotation + 'deg' }}
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

const XylophoneToy = ({ addXP }: { addXP: (n: number) => void }) => {
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
        addXP(2);
      }, i * 600);
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
            onClick={() => {
              playSound('note', n.freq);
              addXP(1);
            }}
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

const SqueezeToy = ({ addXP }: { addXP: (n: number) => void }) => {
  const [scale, setScale] = useState(1);
  const [squeezeCount, setSqueezeCount] = useState(0);

  const squeeze = () => {
    playSound('squeeze', 0.5 + Math.random() * 1);
    setSqueezeCount(c => c + 1);
    addXP(5);
    if (squeezeCount % 10 === 0 && squeezeCount > 0) addXP(20);
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

const BubblesToy = ({ addXP }: { addXP: (n: number) => void }) => {
  const [bubbles, setBubbles] = useState<{ id: number, x: number, y: number, size: number, color: string }[]>([]);

  const addBubble = () => {
    const intensity = Math.random();
    playSound('pop', 0.5 + intensity);
    triggerVibration(5);
    addXP(1);
    
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
    addXP(3);
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
              transition={{ duration: 12 + Math.random() * 6, ease: "linear" }}
              onAnimationComplete={() => {
                // Auto removal if not clicked
                setBubbles(prev => prev.filter(item => item.id !== b.id));
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

const WindChimesToy = ({ addXP }: { addXP: (n: number) => void }) => {
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
    addXP(1);
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

function AppContent() {
  const { stats: cloudStats, updateStats, user } = useFirebase();
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [isHapticsOn, setIsHapticsOn] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(THEMES[0].id);

  // Gamification State (pre-populate with cloud or default)
  const [localStats, setLocalStats] = useState<{xp: number, coins: number, level: number, streak: number, achievements: string[]}>({
    xp: 0,
    coins: 0,
    level: 1,
    streak: 1,
    achievements: []
  });

  // Sync cloud stats to local state when they change
  React.useEffect(() => {
    if (cloudStats) {
      setLocalStats(cloudStats);
    }
  }, [cloudStats]);

  const [notification, setNotification] = useState<{title: string, icon: any} | null>(null);

  const addXP = (amount: number) => {
    setLocalStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      const nextStats = { ...prev, xp: newXP, level: newLevel };
      
      if (newLevel > prev.level) {
        playSound('celebrate', 1);
        triggerVibration([50, 30, 50]);
        setNotification({ title: `Level Up! You're now Level ${newLevel}`, icon: Award });
        setTimeout(() => setNotification(null), 3000);
      }
      
      // Persist to cloud if user is logged in
      if (user) {
        updateStats(nextStats);
      }
      
      return nextStats;
    });
  };

  const addCoins = (amount: number) => {
    setLocalStats(prev => {
      const nextStats = { ...prev, coins: prev.coins + amount };
      if (user) updateStats(nextStats);
      return nextStats;
    });
  };

  // Achievement Checking
  React.useEffect(() => {
    ACHIEVEMENTS.forEach(ach => {
      if (localStats.achievements?.includes(ach.id)) return;

      let earned = false;
      if (ach.id === 'first-pop' && localStats.xp >= 10) earned = true;
      if (ach.id === 'speed-demon' && localStats.xp >= 500) earned = true; 
      if (ach.id === 'streak-3' && localStats.streak >= 3) earned = true;

      if (earned) {
        setLocalStats(prev => {
          const nextStats = { ...prev, achievements: [...(prev.achievements || []), ach.id] };
          if (user) updateStats(nextStats);
          return nextStats;
        });
        addXP(ach.xp);
        setNotification({ title: `Achievement Unlocked: ${ach.title}`, icon: Trophy });
        setTimeout(() => setNotification(null), 4000);
      }
    });
  }, [localStats.xp, localStats.streak, user]);

  // Sync global haptics variable
  React.useEffect(() => {
    hapticsEnabledGlobal = isHapticsOn;
  }, [isHapticsOn]);

  // Music Cleanup on unmount
  React.useEffect(() => {
    return () => {
      toggleBackgroundMusic(false);
    };
  }, []);

  const toggleMusic = () => {
    const newState = !isMusicOn;
    setIsMusicOn(newState);
    toggleBackgroundMusic(newState);
    playSound('click', 1);
  };

  const toggleHaptics = () => {
    const next = !isHapticsOn;
    setIsHapticsOn(next);
    if (next) triggerVibration(20);
    playSound('click', next ? 1.2 : 0.8);
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

  const themeColors = THEMES.find(t => t.id === currentTheme)?.colors || THEMES[0].colors;

  return (
    <div className={`min-h-screen flex flex-col ${themeColors.bg} overflow-x-hidden transition-colors duration-1000`}>
      <FloatingBackground screen={currentScreen} />
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' ? (
          <WelcomeScreen 
            key="welcome" 
            onStart={() => {
              playSound('pop', 1.2);
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
              isHapticsOn={isHapticsOn}
              onToggleHaptics={toggleHaptics}
              stats={localStats}
            />

            <AnimatePresence>
              {notification && (
                <motion.div 
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 20, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  className="fixed top-20 left-12 right-12 z-[100] flex justify-center pointer-events-none"
                >
                  <div className="bg-slate-900/90 backdrop-blur-lg px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl border border-white/10">
                    <div className="p-2 bg-amber-500 rounded-xl text-white">
                      <Award size={20} />
                    </div>
                    <span className="text-white font-bold text-sm">{notification.title}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <main className="flex-1 flex flex-col relative">
              <AnimatePresence mode="wait">
                {currentScreen === 'selection' && (
                  <motion.div 
                    key="selection"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col"
                  >
                    <SelectionScreen 
                      onSelect={handleToySelect} 
                      stats={localStats} 
                      currentTheme={currentTheme}
                      onSetTheme={setCurrentTheme}
                    />
                  </motion.div>
                )}
                {currentScreen === 'toy-tilt' && (
                  <motion.div key="tilt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                    <TiltToy />
                  </motion.div>
                )}
                {currentScreen === 'toy-popit' && (
                  <motion.div key="popit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                    <PopItToy addXP={addXP} addCoins={addCoins} />
                  </motion.div>
                )}
                {currentScreen === 'toy-bubblewrap' && (
                  <motion.div key="bubblewrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                    <BubbleWrapToy />
                  </motion.div>
                )}
                {currentScreen === 'toy-sliders' && (
                  <motion.div key="sliders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                    <SliderToy />
                  </motion.div>
                )}
                {currentScreen === 'toy-spinner' && (
                  <motion.div key="spinner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                    <FidgetToy addXP={addXP} />
                  </motion.div>
                )}
                {currentScreen === 'toy-xylophone' && (
                  <motion.div key="xylophone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                    <XylophoneToy addXP={addXP} />
                  </motion.div>
                )}
                {currentScreen === 'toy-squeeze' && (
                  <motion.div key="squeeze" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                    <SqueezeToy addXP={addXP} />
                  </motion.div>
                )}
                {currentScreen === 'toy-bubbles' && (
                  <motion.div key="bubbles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                    <BubblesToy addXP={addXP} />
                  </motion.div>
                )}
                {currentScreen === 'toy-wind' && (
                  <motion.div key="wind" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                    <WindChimesToy addXP={addXP} />
                  </motion.div>
                )}
                {currentScreen === 'toy-bobble' && (
                  <motion.div key="bobble" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                    <BobbleToy addXP={addXP} />
                  </motion.div>
                )}
              </AnimatePresence>
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

const BobbleToy = ({ addXP }: { addXP: (n: number) => void }) => {
  const [character, setCharacter] = useState<'cat' | 'dog' | 'alien' | 'robot'>('cat');
  const [isWobbling, setIsWobbling] = useState(false);

  const chars = {
    cat: { emoji: '🐱', color: 'bg-orange-100', name: 'Milo' },
    dog: { emoji: '🐶', color: 'bg-amber-100', name: 'Buddy' },
    alien: { emoji: '👽', color: 'bg-green-100', name: 'Zorp' },
    robot: { emoji: '🤖', color: 'bg-slate-100', name: 'Beep' },
  };

  const handlePoke = () => {
    playSound('pop', 1.2);
    triggerVibration([10, 5, 10]);
    addXP(1);
    setIsWobbling(true);
    setTimeout(() => setIsWobbling(false), 500);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 pb-32">
       <div className="flex gap-2 p-2 bg-white/40 backdrop-blur-md rounded-2xl border-2 border-white shadow-sm z-20">
          {(Object.keys(chars) as Array<keyof typeof chars>).map((c) => (
            <button 
              key={c}
              onClick={() => { setCharacter(c); playSound('click', 1.2); }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${character === c ? 'bg-primary text-white shadow-lg scale-110' : 'bg-white/60 text-slate-400 hover:bg-white'}`}
            >
              {chars[c].emoji}
            </button>
          ))}
       </div>

       <div className="text-center">
          <motion.h2 
            key={character}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="comfortaa text-3xl text-secondary font-black"
          >
            {chars[character].name}
          </motion.h2>
          <p className="text-slate-500 font-bold text-sm">Poke or drag their head!</p>
       </div>

       <div className="relative h-64 flex items-end justify-center">
          {/* Base */}
          <div className="w-56 h-14 bg-slate-200 rounded-full border-b-8 border-slate-300 shadow-2xl relative z-0">
             <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-full" />
          </div>
          
          {/* Spring */}
          <div className="absolute left-1/2 bottom-12 -translate-x-1/2 w-6 h-20 bg-slate-400 rounded-full z-0 flex flex-col justify-around py-2 px-1">
             {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-0.5 w-full bg-slate-500/50 rounded-full" />
             ))}
          </div>
          
          {/* Head */}
          <motion.div 
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.6}
            onDragStart={handlePoke}
            whileTap={{ scale: 0.95 }}
            animate={isWobbling ? {
               rotate: [0, -10, 10, -5, 5, 0],
               x: 0,
               y: 0
            } : { x: 0, y: 0, rotate: 0 }}
            transition={{ 
               type: "spring", 
               stiffness: 200, 
               damping: 12,
               rotate: { duration: 0.5 }
            }}
            onClick={handlePoke}
            className={`absolute left-1/2 bottom-24 -translate-x-1/2 w-44 h-44 ${chars[character].color} rounded-[60px] border-4 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-center text-8xl cursor-grab active:cursor-grabbing select-none z-10`}
          >
             <span className="drop-shadow-lg">{chars[character].emoji}</span>
             {/* Decorative elements */}
             <div className="absolute bottom-12 left-8 w-8 h-4 bg-rose-400/20 rounded-full blur-[3px]" />
             <div className="absolute bottom-12 right-8 w-8 h-4 bg-rose-400/20 rounded-full blur-[3px]" />
             
             {/* Shine */}
             <div className="absolute top-6 left-10 w-12 h-6 bg-white/30 rounded-full -rotate-45 blur-[4px]" />
          </motion.div>
       </div>

       <div className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-100 px-4 py-1 rounded-full">
          Physics Engine: Active
       </div>
    </div>
  );
};

export default function App() {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  );
}
