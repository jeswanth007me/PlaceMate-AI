import React from 'react';
import { useApp } from '../context/AppContext';

export const ProgressScreen: React.FC = () => {
  const { completedInterviews, setCurrentScreen, accents, setLatestResult, startNewInterview } = useApp();

  const hasInterviews = completedInterviews.length > 0;

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: accents.accentColor }}
              >
                Performance Progression
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Real Session Records</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Candidate Progress
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Track your score trends and skill refinement across all completed mock interview sessions.
            </p>
          </div>

          <button
            onClick={() => startNewInterview()}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs text-black transition-all self-start sm:self-auto ${accents.buttonClass}`}
          >
            Start New Interview
          </button>
        </div>

        {!hasInterviews ? (
          /* Empty State */
          <div className="glass-panel rounded-3xl p-12 border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 mb-4">
              <span className="material-symbols-outlined text-3xl">query_stats</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No interviews completed yet</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
              Complete your first mock interview to track real score trends, skill development, and weak areas shrinking over time.
            </p>
            <button
              onClick={() => startNewInterview()}
              className={`px-6 py-3 rounded-xl font-bold text-xs text-black transition-all ${accents.buttonClass}`}
            >
              Start Your First Interview
            </button>
          </div>
        ) : (
          /* Actual Real Progress View */
          <div className="flex flex-col gap-6">
            {/* Summary Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-md">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                  Completed Sessions
                </span>
                <span className="text-3xl font-extrabold text-white">
                  {completedInterviews.length}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Verified interview sessions</p>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-md">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                  Average Overall Score
                </span>
                <span className="text-3xl font-extrabold text-white">
                  {Math.round(
                    completedInterviews.reduce((a, b) => a + b.overallScore, 0) /
                      completedInterviews.length
                  )}%
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Across all completed rounds</p>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-md">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                  Latest Technical Depth
                </span>
                <span className="text-3xl font-extrabold text-white">
                  {completedInterviews[0].technicalKnowledge}%
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Most recent evaluation</p>
              </div>
            </div>

            {/* Score History List / Table */}
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xl backdrop-blur-2xl">
              <h2 className="text-base font-bold text-white mb-4">Completed Interview Sessions</h2>
              <div className="flex flex-col gap-3">
                {completedInterviews.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 text-white font-extrabold text-base">
                        {item.overallScore}
                        <span className="text-[9px] text-slate-400 font-normal">pts</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-white">
                            {item.targetRole}
                          </span>
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-white/[0.06] text-slate-300">
                            {item.interviewType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {item.date} • {item.questionsCount} questions
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-300">
                      <div className="hidden md:flex gap-4">
                        <span>Tech: <strong className="text-white">{item.technicalKnowledge}%</strong></span>
                        <span>Comm: <strong className="text-white">{item.communication}%</strong></span>
                        <span>Solving: <strong className="text-white">{item.problemSolving}%</strong></span>
                      </div>
                      <button
                        onClick={() => {
                          setLatestResult(item);
                          setCurrentScreen('detailed-report');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                      >
                        View Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
