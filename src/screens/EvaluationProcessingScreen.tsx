import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const EvaluationProcessingScreen: React.FC = () => {
  const {
    accents,
    currentQuestionIndex,
    questions,
    currentEvaluation,
    currentQuestion,
    advanceToNextQuestionOrComplete,
  } = useApp();

  const [stepIndex, setStepIndex] = useState(0);

  const isDifficultyChanged = !!currentEvaluation?.difficultyChanged;
  const isRetrievalOccurred = !!currentEvaluation?.retrievalOccurred;

  // Build the list of real verified transitions
  const fromDiff = currentQuestion?.difficulty ? (currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)) : 'Medium';
  const toDiff = currentEvaluation?.adaptedNextDifficulty ? (currentEvaluation.adaptedNextDifficulty.charAt(0).toUpperCase() + currentEvaluation.adaptedNextDifficulty.slice(1)) : 'Hard';

  const steps: { label: string; subtext?: string }[] = [
    { label: 'Response received', subtext: 'Answer captured and transmitted' },
    { label: 'Answer evaluated', subtext: 'Technical reasoning and trade-offs analyzed' },
    { label: 'Candidate context updated', subtext: 'Skill and progress memory refreshed' },
    ...(isRetrievalOccurred
      ? [
          {
            label: 'Retrieving preparation context...',
            subtext: `Targeted material: ${currentEvaluation?.retrievedPrepMaterial?.topic || 'Core Concept'}`,
          },
        ]
      : []),
    isDifficultyChanged
      ? {
          label: `${fromDiff} → ${toDiff}`,
          subtext: 'Calibrating question complexity to candidate depth',
        }
      : {
          label: 'Selecting your next question...',
          subtext: 'Next challenge calibrated',
        },
  ];

  useEffect(() => {
    // Brisk real processing progression
    const timer = setInterval(() => {
      setStepIndex(prev => {
        if (prev < steps.length) {
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 350);

    // Auto-advance once verified steps display
    const autoAdvanceTimeout = setTimeout(() => {
      advanceToNextQuestionOrComplete();
    }, steps.length * 350 + 400);

    return () => {
      clearInterval(timer);
      clearTimeout(autoAdvanceTimeout);
    };
  }, [steps.length, advanceToNextQuestionOrComplete]);

  return (
    <div className="min-h-screen w-full bg-[#08090C] text-[#f3f4f6] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div
          className="w-[500px] h-[500px] rounded-full blur-[160px] opacity-20"
          style={{ backgroundColor: accents.accentColor }}
        ></div>
      </div>

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-lg glass-panel rounded-3xl p-7 sm:p-9 border border-white/10 shadow-2xl backdrop-blur-2xl text-center">
        <div
          className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-5 shadow-xl border border-white/15"
          style={{ backgroundColor: `${accents.accentColor}15` }}
        >
          <span
            className="material-symbols-outlined text-2xl animate-pulse"
            style={{ color: accents.accentColor }}
          >
            neurology
          </span>
        </div>

        <div className="mb-6">
          <span
            className="text-xs font-bold uppercase tracking-wider block mb-1"
            style={{ color: accents.accentColor }}
          >
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Analyzing your response...
          </h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Evaluating candidate response against target engineering standards
          </p>
        </div>

        {/* Dynamic Verified Status Steps */}
        <div className="flex flex-col gap-2.5 text-left my-4">
          {steps.map((step, idx) => {
            const isDone = idx < stepIndex;
            const isCurrent = idx === stepIndex;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                  isDone
                    ? 'bg-white/[0.04] border-white/10 text-white'
                    : isCurrent
                    ? 'bg-white/[0.08] border-white/20 text-white shadow-sm'
                    : 'bg-transparent border-transparent opacity-40 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isCurrent
                        ? 'text-black'
                        : 'bg-white/5 text-slate-600'
                    }`}
                    style={isCurrent ? { backgroundColor: accents.accentColor } : {}}
                  >
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <div>
                    <span className="text-xs font-semibold leading-tight block">
                      {step.label}
                    </span>
                    {step.subtext && (
                      <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
                        {step.subtext}
                      </span>
                    )}
                  </div>
                </div>

                {isCurrent && (
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-ping mr-1"
                    style={{ backgroundColor: accents.accentColor }}
                  ></span>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-2">
          <span className="text-[11px] text-slate-500">
            Continuing interview automatically...
          </span>
        </div>
      </div>
    </div>
  );
};
