import React, { useState, useEffect } from 'react';
import { CurriculumData } from '../types/curriculum';
import { Search, X, BookOpen, ChevronRight } from 'lucide-react';

interface SearchModalProps {
  curriculum: CurriculumData;
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (moduleIndex: number, lessonIndex: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  curriculum,
  isOpen,
  onClose,
  onSelectLesson,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const results: { moduleIndex: number; lessonIndex: number; moduleTitle: string; lessonTitle: string; matchedConcept?: string }[] = [];

  if (query.trim().length > 1) {
    const q = query.toLowerCase();
    curriculum.modules.forEach((mod, mIdx) => {
      mod.lessons.forEach((les, lIdx) => {
        let match = false;
        let matchedConcept: string | undefined;

        if (les.title.toLowerCase().includes(q) || mod.title.toLowerCase().includes(q)) {
          match = true;
        }

        const foundConcept = les.coreConcepts.find((c) => c.toLowerCase().includes(q));
        if (foundConcept) {
          match = true;
          matchedConcept = foundConcept;
        }

        if (match) {
          results.push({
            moduleIndex: mIdx,
            lessonIndex: lIdx,
            moduleTitle: mod.title,
            lessonTitle: les.title,
            matchedConcept,
          });
        }
      });
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 bg-slate-900 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-sky-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search concepts (e.g. RadixAttention, ReWOO, GRPO, Temporal, KV-Cache)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
          />
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim().length <= 1 ? (
            <div className="p-6 text-center text-xs text-slate-500 font-mono">
              Type at least 2 characters to search across all 5 hyperscale agentic modules...
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 font-mono">
              No matching concepts found for "{query}". Try searching for 'vLLM', 'SGLang', 'CSP', or 'MCP'.
            </div>
          ) : (
            results.map((res, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectLesson(res.moduleIndex, res.lessonIndex);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-900 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <BookOpen className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-sky-300">
                      {res.lessonTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {res.moduleTitle}
                    </div>
                    {res.matchedConcept && (
                      <div className="text-[11px] text-emerald-400 font-mono mt-1">
                        ★ Matched: {res.matchedConcept}
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 transition-colors" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
