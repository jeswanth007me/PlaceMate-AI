import React from 'react';
import { useApp } from '../context/AppContext';

export const InterviewCompleteScreen: React.FC = () => {
  const { latestResult, accents, setCurrentScreen } = useApp();

  if (!latestResult) {
    return (
      <div className="min-h-screen w-full bg-[#08090C] text-white flex flex-col items-center justify-center p-4">
        <p className="text-sm text-slate-400 mb-4">No completed interview session recorded.</p>
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
    <div className="min-h-screen w-full bg-[#08090C] text-[#f3f4f6] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div
          className="w-[550px] h-[550px] rounded-full blur-[160px] opacity-20"
          style={{ backgroundColor: accents.accentColor }}
        ></div>
      </div>

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-lg glass-panel rounded-3xl p-7 sm:p-9 border border-white/10 shadow-2xl backdrop-blur-2xl text-center">
        {/* Checkmark badge */}
        <div
          className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-5 shadow-xl border border-white/15"
          style={{ backgroundColor: `${accents.accentColor}20` }}
        >
          <span
            className="material-symbols-outlined text-3xl font-bold"
            style={{ color: accents.accentColor }}
          >
            check_circle
          </span>
        </div>

        {/* Title */}
        <div className="mb-6">
          <span
            className="text-xs font-bold uppercase tracking-wider block mb-1"
            style={{ color: accents.accentColor }}
          >
            PlaceMate AI
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
            Interview Complete
          </h1>
          <p className="text-sm text-slate-300 mt-2 font-medium">
            Your interview has been evaluated.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {latestResult.targetRole} • {latestResult.interviewType} • {latestResult.questionsCount} questions completed
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setCurrentScreen('detailed-report')}
            className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2 shadow-xl transition-all ${accents.buttonClass}`}
          >
            <span>View Detailed Report</span>
            <span className="material-symbols-outlined text-base">assessment</span>
          </button>
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-semibold transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
