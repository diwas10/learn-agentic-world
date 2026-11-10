import React from 'react';
import { Search, User, Sparkles, ShieldCheck, Flame } from 'lucide-react';

interface HeaderProps {
  completedCount: number;
  totalCount: number;
  onOpenProfile: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  completedCount,
  totalCount,
  onOpenProfile,
  onOpenSearch,
}) => {
  const percent = Math.round((completedCount / Math.max(totalCount, 1)) * 100);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between z-30 flex-shrink-0">
      {/* Brand & Badge */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg glow-cyan">
            <Flame className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-white tracking-tight text-base">AGENTIC WORLD</span>
              <span className="text-[10px] font-mono font-bold uppercase bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full">
                100M+ Scale Mastery
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              Cognitive Loops • Durable Orchestration • vLLM/SGLang • 100M Architecture • GRPO Flywheels
            </p>
          </div>
        </div>
      </div>

      {/* Center/Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Progress Tracker */}
        <div className="hidden md:flex items-center space-x-3 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Mastery Progress</div>
            <div className="text-xs font-mono font-bold text-sky-400">{completedCount} / {totalCount} Lessons ({percent}%)</div>
          </div>
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all text-xs font-mono"
        >
          <Search className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Search (⌘K)</span>
        </button>

        {/* Diwash Baral Profile Pill */}
        <button
          onClick={onOpenProfile}
          className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-xl bg-gradient-to-r from-sky-950/60 to-indigo-950/60 border border-sky-500/30 hover:border-sky-500/60 transition-all group"
        >
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 font-bold text-xs flex items-center justify-center border border-sky-500/40">
            DB
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
              Diwash Baral
            </div>
            <div className="text-[10px] text-slate-400 font-mono">NUS MTech AI</div>
          </div>
        </button>
      </div>
    </header>
  );
};
