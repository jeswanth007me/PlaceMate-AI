import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const DetailedReportScreen: React.FC = () => {
  const { latestResult, completedInterviews, setCurrentScreen, accents } = useApp();

  const report = latestResult || (completedInterviews.length > 0 ? completedInterviews[0] : null);
  const [activeQuestionTab, setActiveQuestionTab] = useState(0);

  // Format nullable score — shows em-dash when backend didn't return a value
  const fmt = (v: number | null | undefined) => v !== null && v !== undefined ? `${v}%` : '—';

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[60vh]">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 mb-3">
          <span className="material-symbols-outlined text-xl">description</span>
        </div>
        <h2 className="text-base font-bold text-white mb-1">No completed interview session</h2>
        <p className="text-xs text-slate-400 mb-4">Complete an interview session to review your report.</p>
        <button
          onClick={() => setCurrentScreen('dashboard')}
          className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentEval = report.evaluations[activeQuestionTab] || report.evaluations[0];

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: accents.accentColor }}
              >
                PlaceMate AI Review
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{report.date}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Detailed Interview Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Target Role: <span className="text-white font-medium">{report.targetRole}</span> • {report.evaluations.length} Questions Evaluated
            </p>
          </div>

          <button
            onClick={() => setCurrentScreen('dashboard')}
            className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold border border-white/10 transition-colors self-start sm:self-auto"
          >
            ← Dashboard
          </button>
        </div>

        {/* OVERALL INTERVIEW REVIEW */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl backdrop-blur-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Interview Review
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/[0.06] text-white border border-white/10">
              Composite Score: {report.overallScore}%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Technical Knowledge', val: report.technicalKnowledge },
              { label: 'Problem Solving', val: report.problemSolving },
              { label: 'Communication', val: report.communication },
              { label: 'Project Understanding', val: report.projectUnderstanding },
            ].map(m => (
              <div key={m.label} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-slate-400 font-medium block mb-1">
                  {m.label}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-white">{fmt(m.val)}</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: m.val !== null && m.val !== undefined ? `${m.val}%` : '0%', backgroundColor: m.val !== null && m.val !== undefined ? accents.accentColor : 'transparent' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STRENGTHS & AREAS TO IMPROVE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Strengths */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-md flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Demonstrated Strengths
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              {report.strengths.length > 0 ? (
                report.strengths.map((str, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Standard response structure established.</p>
              )}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-md flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-amber-400">lightbulb</span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Areas for Improvement
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              {report.weakAreas.length > 0 ? (
                report.weakAreas.map((imp, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{imp}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No major gaps identified.</p>
              )}
            </div>
          </div>
        </div>

        {/* PERSONALIZED PREPARATION TOPICS */}
        {report.topicsToPrepare && report.topicsToPrepare.length > 0 && (
          <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg" style={{ color: accents.accentColor }}>
                  menu_book
                </span>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Personalized Preparation Topics
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Derived from your interview gaps</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.topicsToPrepare.map((topic, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-xs font-bold text-white block mb-0.5">{topic}</span>
                    <span className="text-[11px] text-slate-400 block">Recommended study focus</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('preparation')}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-semibold whitespace-nowrap transition-colors"
                  >
                    Open Topic →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUESTION-BY-QUESTION BREAKDOWN */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Question-by-Question Breakdown
            </h3>
            <div className="flex items-center gap-1">
              {report.evaluations.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveQuestionTab(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold border transition-all ${
                    activeQuestionTab === idx
                      ? 'bg-white/[0.15] border-white/40 text-white'
                      : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {currentEval && (
            <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl backdrop-blur-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Question {activeQuestionTab + 1} of {report.evaluations.length}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-slate-300">
                  Technical Depth: {currentEval.technicalDepth}%
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                "{currentEval.questionText}"
              </h4>

              {/* Candidate Answer */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Candidate Answer
                </span>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-wrap">
                  {currentEval.candidateAnswer || 'No response recorded.'}
                </div>
              </div>

              {/* Retrieved preparation material if available */}
              {currentEval.retrievedPrepMaterial && (
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Retrieved Material for Gap
                  </span>
                  <p className="text-xs font-semibold text-white">
                    {currentEval.retrievedPrepMaterial.topic}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {currentEval.retrievedPrepMaterial.summary}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
