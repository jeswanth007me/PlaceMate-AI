import React from 'react';
import { useApp } from '../context/AppContext';

export const LiveFeedbackScreen: React.FC = () => {
  const {
    currentEvaluation,
    currentQuestionIndex,
    questions,
    accents,
    advanceToNextQuestionOrComplete,
  } = useApp();

  const isLastQuestion = currentQuestionIndex >= questions.length - 1;

  if (!currentEvaluation) {
    return (
      <div className="min-h-screen w-full bg-[#08090C] text-[#f3f4f6] flex items-center justify-center">
        <button
          onClick={advanceToNextQuestionOrComplete}
          className="px-6 py-3 rounded-xl bg-white/10 text-white text-xs font-semibold"
        >
          Proceed →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#08090C] text-[#f3f4f6] flex flex-col justify-between selection:bg-white/20 selection:text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div
          className="w-[600px] h-[600px] rounded-full blur-[160px] opacity-20"
          style={{ backgroundColor: accents.accentColor }}
        ></div>
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full border-b border-white/[0.06] bg-[#08090C]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: accents.accentColor }}
            ></span>
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              AI Answer Evaluation
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
      </header>

      {/* Main Feedback Content */}
      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* Question Banner */}
        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
            Question Evaluated
          </span>
          <p className="text-sm font-semibold text-white leading-relaxed">
            {currentEvaluation.questionText}
          </p>
        </div>

        {/* 3 Dimension Evaluation Scores */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel rounded-2xl p-4 border border-white/10 shadow-md">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
              Technical Depth
            </span>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xl font-extrabold text-white">
                {currentEvaluation.technicalDepth}%
              </span>
              <span className="text-[10px] text-slate-400">Target: 80%+</span>
            </div>
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${currentEvaluation.technicalDepth}%`,
                  backgroundColor: accents.accentColor,
                }}
              ></div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-white/10 shadow-md">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
              Communication
            </span>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xl font-extrabold text-white">
                {currentEvaluation.communication}%
              </span>
              <span className="text-[10px] text-slate-400">Structure & Clarity</span>
            </div>
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${currentEvaluation.communication}%`,
                  backgroundColor: accents.accentColor,
                }}
              ></div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-white/10 shadow-md">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
              Project Understanding
            </span>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xl font-extrabold text-white">
                {currentEvaluation.projectUnderstanding}%
              </span>
              <span className="text-[10px] text-slate-400">Context Alignment</span>
            </div>
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${currentEvaluation.projectUnderstanding}%`,
                  backgroundColor: accents.accentColor,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Dual Feedback Columns: What Went Well vs What Needs Improvement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* What Went Well */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                What went well
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              {currentEvaluation.strengths.map((s, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="text-emerald-400 text-sm leading-none mt-0.5">•</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What Needs Improvement */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-amber-400">lightbulb</span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                What needs improvement
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              {currentEvaluation.improvements.map((imp, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="text-amber-400 text-sm leading-none mt-0.5">•</span>
                  <span>{imp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Retrieved Preparation Material Section (When available) */}
        {currentEvaluation.retrievedPrepMaterial && (
          <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-base" style={{ color: accents.accentColor }}>
                menu_book
              </span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Retrieved Preparation Material
              </h3>
            </div>
            <p className="text-xs font-bold text-white">
              {currentEvaluation.retrievedPrepMaterial.topic}
            </p>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {currentEvaluation.retrievedPrepMaterial.summary}
            </p>
            <div className="mt-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/5 text-[11px] text-slate-300">
              <span className="text-slate-400 font-semibold block mb-0.5">Key Takeaway:</span>
              {currentEvaluation.retrievedPrepMaterial.keyConcept}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={advanceToNextQuestionOrComplete}
            className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2 shadow-lg transition-all ${accents.buttonClass}`}
          >
            <span>{isLastQuestion ? 'Complete Interview & View Results' : 'Continue to Next Question'}</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
};
