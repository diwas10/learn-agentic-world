import React from 'react';
import { Module } from '../types/curriculum';
import {
  CheckCircle,
  Clock,
  Layers,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Cpu,
  Network,
  Database,
  Server,
} from 'lucide-react';

interface SidebarProps {
  modules: Module[];
  selectedModuleIndex: number;
  selectedLessonIndex: number;
  onSelectLesson: (moduleIndex: number, lessonIndex: number) => void;
  completedLessons: Record<string, boolean>;
  isOpen: boolean;
  onToggleOpen: () => void;
}

const MODULE_ICONS = [Layers, Network, Cpu, Server, Database];

export const Sidebar: React.FC<SidebarProps> = ({
  modules,
  selectedModuleIndex,
  selectedLessonIndex,
  onSelectLesson,
  completedLessons,
  isOpen,
  onToggleOpen,
}) => {
  const [expandedModules, setExpandedModules] = React.useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
  });

  const toggleModule = (idx: number) => {
    setExpandedModules((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (!isOpen) {
    return (
      <aside className="w-16 border-r border-slate-800 bg-slate-950/90 flex flex-col items-center py-4 space-y-4 flex-shrink-0">
        <button
          onClick={onToggleOpen}
          className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
          title="Expand Sidebar"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        {modules.map((mod, idx) => {
          const Icon = MODULE_ICONS[idx % MODULE_ICONS.length];
          const isSelected = selectedModuleIndex === idx;
          return (
            <button
              key={mod.id}
              onClick={() => {
                onToggleOpen();
                onSelectLesson(idx, 0);
              }}
              className={`p-3 rounded-xl transition-all ${
                isSelected
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 glow-cyan'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
              title={mod.title}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </aside>
    );
  }

  return (
    <aside className="w-80 md:w-88 border-r border-slate-800 bg-slate-950/95 flex flex-col h-full flex-shrink-0 overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Curriculum Modules
        </span>
        <button
          onClick={onToggleOpen}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
          title="Collapse Sidebar"
        >
          ✕
        </button>
      </div>

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {modules.map((mod, mIdx) => {
          const Icon = MODULE_ICONS[mIdx % MODULE_ICONS.length];
          const isExpanded = expandedModules[mIdx];
          const isCurrentModule = selectedModuleIndex === mIdx;

          return (
            <div key={mod.id} className="rounded-xl border border-slate-800/80 bg-slate-900/60 overflow-hidden">
              {/* Module Header Accordion */}
              <button
                onClick={() => toggleModule(mIdx)}
                className={`w-full text-left p-3.5 flex items-start justify-between transition-colors ${
                  isCurrentModule ? 'bg-slate-800/60' : 'hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-1.5 rounded-lg mt-0.5 ${
                      isCurrentModule
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-sky-400 uppercase font-bold">
                        Mod {mod.number}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">•</span>
                      <span className="text-[10px] font-mono text-slate-400">{mod.estimatedHours}h</span>
                    </div>
                    <div className="text-xs font-bold text-white mt-0.5 leading-snug">
                      {mod.category}
                    </div>
                  </div>
                </div>
                <div className="text-slate-400 mt-1">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>

              {/* Lessons List */}
              {isExpanded && (
                <div className="border-t border-slate-800/80 bg-slate-950/50 p-1.5 space-y-1">
                  {mod.lessons.map((les, lIdx) => {
                    const isSelected = selectedModuleIndex === mIdx && selectedLessonIndex === lIdx;
                    const isCompleted = completedLessons[les.id];

                    return (
                      <button
                        key={les.id}
                        onClick={() => onSelectLesson(mIdx, lIdx)}
                        className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between text-xs transition-all ${
                          isSelected
                            ? 'bg-sky-500/15 border border-sky-500/40 text-sky-200 font-semibold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 pr-2">
                          <span
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-400'
                                : isSelected
                                ? 'bg-sky-400 animate-pulse'
                                : 'bg-slate-700'
                            }`}
                          />
                          <span className="line-clamp-1 leading-snug">{les.title}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 flex-shrink-0 text-[10px] font-mono text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{les.durationMinutes}m</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
