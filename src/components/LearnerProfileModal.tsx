import React from 'react';
import { LearnerProfile } from '../types/curriculum';
import { X, Sparkles, Target, Compass, CheckCircle, GraduationCap } from 'lucide-react';

interface LearnerProfileModalProps {
  profile: LearnerProfile;
  isOpen: boolean;
  onClose: () => void;
  roadmapProgress: Record<number, boolean>;
  onToggleRoadmapPhase: (index: number) => void;
}

export const LearnerProfileModal: React.FC<LearnerProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  roadmapProgress,
  onToggleRoadmapPhase,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-950 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-sky-950/80 to-indigo-950/80 border-b border-slate-800">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 font-bold text-base sm:text-lg flex-shrink-0">
              DB
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h2 className="text-base sm:text-xl font-extrabold text-white">{profile.name}</h2>
                <span className="text-[9px] sm:text-[10px] font-mono uppercase bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full">
                  NUS MTech AI Systems
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 font-mono mt-0.5">
                {profile.currentRole} • {profile.yearsOfExperience}y Exp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* 1. Existing Superpowers & Agentic Transfer */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2 text-sky-400 font-bold text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Your Existing Superpowers & 100M-Scale Transfer</span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {profile.existingSuperpowers.map((sp, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-sky-500/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{sp.skill}</h4>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      Direct Transfer
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-1">{sp.details}</p>
                  <div className="mt-3 p-3 bg-slate-950/70 border-l-4 border-sky-400 rounded-r-xl text-xs text-slate-300 leading-relaxed">
                    <strong className="text-sky-300">How It Transfers to 100M Agentic Systems: </strong>
                    {sp.agenticTransfer}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Critical Scale Gaps to Bridge */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>Critical Gaps to Bridge for 100M+ Users</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.criticalGapsToBridgeFor100MScale.map((gap, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div className="text-xs font-mono font-bold text-amber-300 mb-2">{gap.gap}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{gap.whyItMatters}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3. 20-Week Strategic Roadmap */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Personalized 20-Week Execution Roadmap</span>
            </div>
            <div className="space-y-4">
              {profile.strategicRoadmap.map((phase, idx) => {
                const isDone = roadmapProgress[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => onToggleRoadmapPhase(idx)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isDone
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                        : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <h4 className="text-sm font-bold text-white">{phase.phase}</h4>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {isDone ? 'COMPLETED' : 'IN PROGRESS'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 ml-9">{phase.focus}</p>
                    <div className="mt-2 ml-9 text-xs font-mono text-indigo-300">
                      ★ Milestone Project: {phase.milestoneProject}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
