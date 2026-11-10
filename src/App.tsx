import React, { useState, useEffect, useRef } from 'react';
import { curriculum } from './data/curriculumData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ThreeJsVisualizer } from './components/ThreeJsVisualizer';
import { GraphFlowVisualizer } from './components/GraphFlowVisualizer';
import { CodeViewer } from './components/CodeViewer';
import { MediaSection } from './components/MediaSection';
import { QuizSection } from './components/QuizSection';
import { LearnerProfileModal } from './components/LearnerProfileModal';
import { SearchModal } from './components/SearchModal';
import { MathHtmlRenderer } from './components/MathHtmlRenderer';
import {
  BookOpen,
  Box,
  Code2,
  Tv,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  GraduationCap,
  Cpu,
  Compass,
  Award,
} from 'lucide-react';

type ViewMode = 'masterclass-flow' | '3d-studio' | 'lab-code' | 'media' | 'challenge';

export const App: React.FC = () => {
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<ViewMode>('masterclass-flow');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Studio Sub-view toggle (3D WebGL vs 2D DAG vs Split)
  const [studioView, setStudioView] = useState<'split' | '3d' | '2d'>('split');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Persistence: Completed Lessons
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('hyperscale_agentic_completed_lessons');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persistence: Strategic Roadmap
  const [roadmapProgress, setRoadmapProgress] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('hyperscale_agentic_roadmap_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(
      'hyperscale_agentic_completed_lessons',
      JSON.stringify(completedLessons)
    );
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem(
      'hyperscale_agentic_roadmap_progress',
      JSON.stringify(roadmapProgress)
    );
  }, [roadmapProgress]);

  const currentModule = curriculum.modules[selectedModuleIndex] || curriculum.modules[0];
  const currentLesson = currentModule.lessons[selectedLessonIndex] || currentModule.lessons[0];

  const totalLessonsCount = curriculum.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessonsCount = Object.values(completedLessons).filter(Boolean).length;

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleComplete = () => {
    setCompletedLessons((prev) => ({
      ...prev,
      [currentLesson.id]: !prev[currentLesson.id],
    }));
  };

  const handleToggleRoadmapPhase = (idx: number) => {
    setRoadmapProgress((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleNextLesson = () => {
    if (selectedLessonIndex < currentModule.lessons.length - 1) {
      setSelectedLessonIndex(selectedLessonIndex + 1);
    } else if (selectedModuleIndex < curriculum.modules.length - 1) {
      setSelectedModuleIndex(selectedModuleIndex + 1);
      setSelectedLessonIndex(0);
    }
    scrollToTop();
  };

  const handlePrevLesson = () => {
    if (selectedLessonIndex > 0) {
      setSelectedLessonIndex(selectedLessonIndex - 1);
    } else if (selectedModuleIndex > 0) {
      setSelectedModuleIndex(selectedModuleIndex - 1);
      setSelectedLessonIndex(curriculum.modules[selectedModuleIndex - 1].lessons.length - 1);
    }
    scrollToTop();
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#090D16] text-slate-100 overflow-hidden">
      {/* Top Header */}
      <Header
        completedCount={completedLessonsCount}
        totalCount={totalLessonsCount}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          modules={curriculum.modules}
          selectedModuleIndex={selectedModuleIndex}
          selectedLessonIndex={selectedLessonIndex}
          onSelectLesson={(mIdx, lIdx) => {
            setSelectedModuleIndex(mIdx);
            setSelectedLessonIndex(lIdx);
            scrollToTop();
          }}
          completedLessons={completedLessons}
          isOpen={sidebarOpen}
          onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Center Content Viewport */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950/40">
          {/* Lesson Header & Mode Switcher Bar */}
          <div className="px-6 pt-4 pb-3 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur flex-shrink-0">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-sky-400">
                  <span className="font-bold bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded">
                    MODULE {currentModule.number}: {currentModule.category.toUpperCase()}
                  </span>
                  <span>•</span>
                  <span className="text-slate-300">{currentLesson.durationMinutes} MIN MASTERCLASS</span>
                  {completedLessons[currentLesson.id] && (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                      ✓ MASTERED
                    </span>
                  )}
                </div>
                <h1 className="text-lg md:text-2xl font-black text-white tracking-tight mt-1">
                  {currentLesson.title}
                </h1>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevLesson}
                  disabled={selectedModuleIndex === 0 && selectedLessonIndex === 0}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                  title="Previous Lesson"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextLesson}
                  disabled={
                    selectedModuleIndex === curriculum.modules.length - 1 &&
                    selectedLessonIndex === currentModule.lessons.length - 1
                  }
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                  title="Next Lesson"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Mode Tabs + Inline Anchor Shortcuts */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('masterclass-flow')}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeTab === 'masterclass-flow'
                      ? 'bg-gradient-to-r from-sky-500/30 to-indigo-500/30 text-white border border-sky-400/50 glow-cyan'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-sky-400" />
                  <span>★ All-in-One Guided Masterclass (Inline 3D + Videos + Code + Quiz)</span>
                </button>

                <button
                  onClick={() => setActiveTab('3d-studio')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                    activeTab === '3d-studio'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>3D &amp; DAG Studio</span>
                </button>

                <button
                  onClick={() => setActiveTab('lab-code')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                    activeTab === 'lab-code'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Code Sandbox</span>
                </button>

                <button
                  onClick={() => setActiveTab('media')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                    activeTab === 'media'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Videos &amp; Papers</span>
                </button>

                <button
                  onClick={() => setActiveTab('challenge')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                    activeTab === 'challenge'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Quiz ({currentLesson.interactiveExercise.quizQuestions.length})</span>
                </button>
              </div>

              {/* Quick Section Jumpers when in All-in-One Masterclass Mode */}
              {activeTab === 'masterclass-flow' && (
                <div className="hidden xl:flex items-center space-x-1.5 text-[11px] font-mono text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-slate-800">
                  <span className="text-slate-500">Jump to:</span>
                  <button onClick={() => scrollToSection('inline-theory')} className="hover:text-sky-400 px-1">1.Theory</button>
                  <span>·</span>
                  <button onClick={() => scrollToSection('inline-3d')} className="hover:text-indigo-400 px-1">2.3D/DAG</button>
                  <span>·</span>
                  <button onClick={() => scrollToSection('inline-code')} className="hover:text-emerald-400 px-1">3.CodeLab</button>
                  <span>·</span>
                  <button onClick={() => scrollToSection('inline-media')} className="hover:text-rose-400 px-1">4.Videos</button>
                  <span>·</span>
                  <button onClick={() => scrollToSection('inline-quiz')} className="hover:text-amber-400 px-1">5.Quiz</button>
                </div>
              )}
            </div>
          </div>

          {/* Scrollable Main Content Viewport */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6">
            <div className="max-w-5xl mx-auto pb-24 space-y-12">
              {/* ===================================================================== */}
              {/* MODE 1: ALL-IN-ONE GUIDED MASTERCLASS (EVERYTHING INLINE SEAMLESSLY!) */}
              {/* ===================================================================== */}
              {activeTab === 'masterclass-flow' && (
                <>
                  {/* 0. Core Concept Pills & Instructor Personalized Bridge */}
                  <div id="inline-theory" className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {currentLesson.coreConcepts.map((concept, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-mono bg-slate-900 text-sky-300 border border-slate-800 px-3 py-1 rounded-full"
                        >
                          #{concept}
                        </span>
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-sky-950/80 via-indigo-950/80 to-slate-900 border border-sky-500/40 rounded-2xl p-6 shadow-xl">
                      <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs font-mono uppercase tracking-wider mb-1.5">
                        <Sparkles className="w-4 h-4" />
                        <span>Instructor's Note — Bridging Your 5+ Years Experience &amp; NUS MTech to 100M Scale</span>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {currentModule.bridgeToYourResume}
                      </p>
                    </div>

                    {/* 1. Deep Textbook HTML Content with Native KaTeX Math */}
                    <MathHtmlRenderer htmlContent={currentLesson.htmlContent} />
                  </div>

                  {/* 2. Inline Interactive 3D WebGL & 2D DAG Studio */}
                  <section id="inline-3d" className="space-y-5 pt-4 border-t border-slate-800/80">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
                          <Box className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
                            Interactive Visual Laboratory • Step 2 of 5
                          </span>
                          <h2 className="text-xl font-bold text-white">
                            3D State-Space Simulation &amp; 2D Execution Topology
                          </h2>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <button
                          onClick={() => setStudioView('split')}
                          className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                            studioView === 'split'
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Stacked 3D + 2D
                        </button>
                        <button
                          onClick={() => setStudioView('3d')}
                          className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                            studioView === '3d'
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          3D Only
                        </button>
                        <button
                          onClick={() => setStudioView('2d')}
                          className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                            studioView === '2d'
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          2D DAG Only
                        </button>
                      </div>
                    </div>

                    {(studioView === 'split' || studioView === '3d') && (
                      <div className="h-[580px] w-full">
                        <ThreeJsVisualizer spec={currentLesson.visualizations.threeJsSpec} />
                      </div>
                    )}

                    {(studioView === 'split' || studioView === '2d') && (
                      <div className="h-[440px] w-full">
                        <GraphFlowVisualizer spec={currentLesson.visualizations.graphSpec} />
                      </div>
                    )}
                  </section>

                  {/* 3. Inline Production Code & Interactive Telemetry Sandbox */}
                  <section id="inline-code" className="space-y-5 pt-4 border-t border-slate-800/80">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                          Hands-On Implementation &amp; Simulator • Step 3 of 5
                        </span>
                        <h2 className="text-xl font-bold text-white">
                          Production Code Walkthrough &amp; Live Sandbox Execution
                        </h2>
                      </div>
                    </div>
                    <CodeViewer walkthrough={currentLesson.codeWalkthrough} />
                  </section>

                  {/* 4. Inline Architecture Diagrams, YouTube Tech Talks & Landmark Papers */}
                  <section id="inline-media" className="space-y-5 pt-4 border-t border-slate-800/80">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
                        <Tv className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                          Curated Blueprints, Lectures &amp; Literature • Step 4 of 5
                        </span>
                        <h2 className="text-xl font-bold text-white">
                          SVG Architecture Diagrams, YouTube Talks &amp; Foundational Papers
                        </h2>
                      </div>
                    </div>
                    <MediaSection
                      videos={currentLesson.media.youtubeVideos}
                      papers={currentLesson.media.articlesAndPapers}
                      diagrams={currentLesson.media.diagrams}
                    />
                  </section>

                  {/* 5. Inline Real-World Architecture Challenge & Multi-Question Mastery Quiz */}
                  <section id="inline-quiz" className="space-y-5 pt-4 border-t border-slate-800/80">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                          Verification &amp; Mastery Checkpoint • Step 5 of 5
                        </span>
                        <h2 className="text-xl font-bold text-white">
                          Interactive Architecture Design Challenge &amp; Mastery Quiz
                        </h2>
                      </div>
                    </div>
                    <QuizSection
                      exercise={currentLesson.interactiveExercise}
                      lessonId={currentLesson.id}
                      isCompleted={!!completedLessons[currentLesson.id]}
                      onToggleComplete={handleToggleComplete}
                      onNextLesson={handleNextLesson}
                    />
                  </section>
                </>
              )}

              {/* ===================================================================== */}
              {/* FOCUSED SINGLE-TOOL MODES                                             */}
              {/* ===================================================================== */}
              {activeTab === '3d-studio' && (
                <div className="space-y-6">
                  <div className="h-[580px] w-full">
                    <ThreeJsVisualizer spec={currentLesson.visualizations.threeJsSpec} />
                  </div>
                  <div className="h-[440px] w-full">
                    <GraphFlowVisualizer spec={currentLesson.visualizations.graphSpec} />
                  </div>
                </div>
              )}

              {activeTab === 'lab-code' && (
                <CodeViewer walkthrough={currentLesson.codeWalkthrough} />
              )}

              {activeTab === 'media' && (
                <MediaSection
                  videos={currentLesson.media.youtubeVideos}
                  papers={currentLesson.media.articlesAndPapers}
                  diagrams={currentLesson.media.diagrams}
                />
              )}

              {activeTab === 'challenge' && (
                <QuizSection
                  exercise={currentLesson.interactiveExercise}
                  lessonId={currentLesson.id}
                  isCompleted={!!completedLessons[currentLesson.id]}
                  onToggleComplete={handleToggleComplete}
                  onNextLesson={handleNextLesson}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Learner Profile Modal */}
      <LearnerProfileModal
        profile={curriculum.learnerProfile}
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        roadmapProgress={roadmapProgress}
        onToggleRoadmapPhase={handleToggleRoadmapPhase}
      />

      {/* Global Search Modal */}
      <SearchModal
        curriculum={curriculum}
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectLesson={(mIdx, lIdx) => {
          setSelectedModuleIndex(mIdx);
          setSelectedLessonIndex(lIdx);
          setActiveTab('masterclass-flow');
          scrollToTop();
        }}
      />
    </div>
  );
};
