import React, { useState, useEffect } from 'react';
import { InteractiveExercise } from '../types/curriculum';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Award, HelpCircle, Check, ArrowRight } from 'lucide-react';

interface QuizSectionProps {
  exercise: InteractiveExercise;
  lessonId: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onNextLesson?: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  exercise,
  lessonId,
  isCompleted,
  onToggleComplete,
  onNextLesson,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setSelectedAnswers({});
    setSubmitted({});
  }, [lessonId]);

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted[qIdx]) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmit = (qIdx: number) => {
    setSubmitted((prev) => ({ ...prev, [qIdx]: true }));
    const question = exercise.quizQuestions[qIdx];
    if (selectedAnswers[qIdx] === question.correctIndex) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#38BDF8', '#34D399', '#818CF8'],
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Real-World Scenario Prompt */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/60 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs sm:text-sm uppercase tracking-wider mb-2">
          <Award className="w-4 h-4 flex-shrink-0" />
          <span>Real-World Engineering Challenge</span>
        </div>
        <h3 className="text-base sm:text-xl font-bold text-white mb-2">{exercise.title}</h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-3 sm:p-4 rounded-xl border border-slate-800/80">
          {exercise.prompt}
        </p>
      </div>

      {/* Quiz Questions */}
      <div className="space-y-4 sm:space-y-6">
        {exercise.quizQuestions.map((q, qIdx) => {
          const isAnswered = submitted[qIdx];
          const chosenOpt = selectedAnswers[qIdx];
          const isCorrect = chosenOpt === q.correctIndex;

          return (
            <div
              key={qIdx}
              className={`bg-slate-900/80 border rounded-2xl p-4 sm:p-6 shadow-xl transition-all ${
                isAnswered
                  ? isCorrect
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-rose-500/50 bg-rose-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start space-x-2.5 sm:space-x-3 mb-3.5">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-sky-400">
                  {qIdx + 1}
                </span>
                <h4 className="text-xs sm:text-sm font-semibold text-white leading-relaxed">{q.question}</h4>
              </div>

              {/* Options */}
              <div className="space-y-2 ml-0 sm:ml-9">
                {q.options.map((opt, optIdx) => {
                  let optStyle = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';

                  if (selectedAnswers[qIdx] === optIdx) {
                    optStyle = 'border-sky-500 bg-sky-950/40 text-sky-200';
                  }

                  if (isAnswered) {
                    if (optIdx === q.correctIndex) {
                      optStyle = 'border-emerald-500 bg-emerald-950/50 text-emerald-200 font-semibold';
                    } else if (selectedAnswers[qIdx] === optIdx) {
                      optStyle = 'border-rose-500 bg-rose-950/50 text-rose-200';
                    } else {
                      optStyle = 'border-slate-800/40 opacity-40 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all flex items-start space-x-2.5 ${optStyle}`}
                    >
                      <span className="font-mono font-bold text-slate-500 flex-shrink-0">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Submit or Explanation */}
              <div className="mt-3.5 ml-0 sm:ml-9 flex flex-col space-y-3">
                {!isAnswered ? (
                  <button
                    onClick={() => handleSubmit(qIdx)}
                    disabled={selectedAnswers[qIdx] === undefined}
                    className="self-stretch sm:self-start text-center px-4 py-2.5 sm:py-2 rounded-xl text-xs font-mono font-bold bg-sky-500 text-slate-950 hover:bg-sky-400 disabled:opacity-40 transition-all shadow-lg"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <div
                    className={`p-3.5 sm:p-4 rounded-xl border text-xs leading-relaxed ${
                      isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 font-bold mb-1">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>Correct! Masterful understanding.</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                          <span>Not quite. Check the system mechanics:</span>
                        </>
                      )}
                    </div>
                    <p className="mt-1 text-slate-300">{q.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion & Next Lesson Footer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-3">
          <button
            onClick={() => {
              onToggleComplete();
              if (!isCompleted) {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              }
            }}
            className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
              isCompleted
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg glow-emerald'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{isCompleted ? '✓ Lesson Mastered' : 'Mark Lesson as Mastered'}</span>
          </button>
          <span className="text-[11px] sm:text-xs text-slate-400 text-center sm:text-left">
            {isCompleted ? 'Progress saved locally.' : 'Complete quizzes and review all sections.'}
          </span>
        </div>

        {onNextLesson && (
          <button
            onClick={onNextLesson}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg glow-cyan transition-all"
          >
            <span>Proceed to Next Lesson</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
