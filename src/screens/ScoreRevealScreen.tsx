import React from 'react';
import { useApp } from '../context/AppContext';

export const ScoreRevealScreen: React.FC = () => {
  const { setCurrentScreen, latestResult, accents } = useApp();

  if (!latestResult) {
    return (
      <div className="min-h-screen w-full bg-[#08090C] text-white flex flex-col items-center justify-center p-4">
        <p className="text-sm text-slate-400 mb-4">No completed session available.</p>
        <button
          onClick={() => setCurrentScreen('dashboard')}
          className="px-5 py-2.5 rounded-xl bg-white/10 text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#08090C] text-[#f3f4f6] flex flex-col justify-between selection:bg-white/20 selection:text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div
          className="w-[600px] h-[600px] rounded-full blur-[160px] opacity-20"
          style={{ backgroundColor: accents.accentColor }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full border-b border-white/[0.06] bg-[#08090C]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: accents.accentColor }}
            ></span>
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Interview Evaluation
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {latestResult.targetRole} • {latestResult.date}
          </span>
        </div>
      </header>

      {/* Main Score & Breakdown Container */}
      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col gap-6">
        {/* Overall Score Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5 text-center sm:text-left">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: accents.accentColor }}
            >
              Session Complete
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Interview Performance Evaluation
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Based on your answers to {latestResult.questionsCount} adaptive questions for {latestResult.targetRole}.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/[0.04] border border-white/10 min-w-[140px]">
            <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              {latestResult.overallScore}
              <span className="text-lg text-slate-400 font-normal">/100</span>
            </span>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-1">
              Overall Score
            </span>
          </div>
        </div>

        {/* 4 Skill Dimensions Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="glass-card rounded-2xl p-4 border border-white/10 shadow-md">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
              Technical Knowledge
            </span>
            <span className="text-xl font-bold text-white block mb-2">
              {latestResult.technicalKnowledge}%
            </span>
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${latestResult.technicalKnowledge}%`,
                  backgroundColor: accents.accentColor,
                }}
              ></div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-white/10 shadow-md">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
              Problem Solving
            </span>
            <span className="text-xl font-bold text-white block mb-2">
              {latestResult.problemSolving}%
            </span>
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${latestResult.problemSolving}%`,
                  backgroundColor: accents.accentColor,
                }}
              ></div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-white/10 shadow-md">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
              Communication
            </span>
            <span className="text-xl font-bold text-white block mb-2">
              {latestResult.communication}%
            </span>
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${latestResult.communication}%`,
                  backgroundColor: accents.accentColor,
                }}
              ></div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-white/10 shadow-md">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
              Project Understanding
            </span>
            <span className="text-xl font-bold text-white block mb-2">
              {latestResult.projectUnderstanding}%
            </span>
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${latestResult.projectUnderstanding}%`,
                  backgroundColor: accents.accentColor,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Strengths & Weak Areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Strengths */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Candidate Strengths
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              {latestResult.strengths.map((s, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-emerald-400">•</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Areas */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-amber-400">warning</span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Weak Areas
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              {latestResult.weakAreas.map((w, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-amber-400">•</span>
                  <span>{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Topics to Prepare & Recommended Next Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Topics to Prepare */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-md">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Topics to Prepare
            </h3>
            <div className="flex flex-wrap gap-2">
              {latestResult.topicsToPrepare.map((topic, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg text-xs bg-white/[0.06] border border-white/10 text-slate-200"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Next Steps */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-md">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Recommended Next Steps
            </h3>
            <div className="flex flex-col gap-2">
              {latestResult.recommendedNextSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-slate-400 font-bold">{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={() => setCurrentScreen('detailed-report')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            View Question-by-Question Report
          </button>
          <button
            onClick={() => setCurrentScreen('preparation')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            Open Preparation Section
          </button>
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-black transition-all ${accents.buttonClass}`}
          >
            Return to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
};
