import React from 'react';
import { useApp } from '../context/AppContext';

export const DashboardScreen: React.FC = () => {
  const {
    setCurrentScreen,
    user,
    candidateAvatar,
    aiInterviewer,
    accents,
    completedInterviews,
    startNewInterview,
    setLatestResult,
  } = useApp();

  const hasCompletedInterviews = completedInterviews.length > 0;
  const recentInterview = hasCompletedInterviews ? completedInterviews[0] : null;

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-[1360px] mx-auto w-full">
        {/* Welcome & Primary CTA Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Personal Preparation Workspace
                </span>
                <span className="text-slate-600">•</span>
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: accents.accentColor }}
                >
                  PlaceMate AI
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Your AI interview assistant is calibrated to your profile. Practice with adaptive mock questions, evaluate technical depth, and build your placement readiness.
              </p>
            </div>

            {/* Primary CTA */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => startNewInterview()}
                className={`px-6 py-3.5 rounded-xl font-bold text-sm text-black flex items-center gap-2 shadow-lg transition-all ${accents.buttonClass}`}
              >
                <span className="material-symbols-outlined text-lg">play_arrow</span>
                <span>Start Interview</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Status Cards: Profile Status, Resume Status, GitHub Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* 1. Profile Status */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-md flex flex-col justify-between">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-slate-300">
                  <span className="material-symbols-outlined text-base">account_circle</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Candidate Profile</h3>
                  <p className="text-[11px] text-slate-400">Automatic pairing</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentScreen('settings')}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Edit
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 mb-3">
              <div className="relative">
                <img
                  src={candidateAvatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/20"
                />
                <img
                  src={aiInterviewer.avatar}
                  alt={aiInterviewer.name}
                  className="w-5 h-5 rounded-full object-cover border border-black absolute -bottom-1 -right-1"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.targetRole}</p>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 space-y-1">
              <p className="truncate"><span className="text-slate-500">University:</span> {user.university}</p>
              <p className="truncate"><span className="text-slate-500">Interviewer:</span> {aiInterviewer.name}</p>
            </div>
          </div>

          {/* 2. Resume Status */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-md flex flex-col justify-between">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-slate-300">
                  <span className="material-symbols-outlined text-base">description</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Resume Context</h3>
                  <p className="text-[11px] text-slate-400">Interview personalization</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentScreen('github-resume')}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Manage
              </button>
            </div>

            {user.resumeUploaded ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="material-symbols-outlined text-base text-emerald-400">task_alt</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {user.resumeFileName || 'Candidate_Resume.pdf'}
                    </p>
                    <p className="text-[10px] text-emerald-400 font-medium">Parsed & ready</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Used by AI interviewer to ground project-specific questions.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-xs text-slate-400 font-medium">No resume uploaded</p>
                </div>
                <button
                  onClick={() => setCurrentScreen('github-resume')}
                  className="w-full py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white border border-white/10 transition-colors"
                >
                  Upload Resume
                </button>
              </div>
            )}
          </div>

          {/* 3. GitHub Status */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-md flex flex-col justify-between">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-slate-300">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">GitHub Projects</h3>
                  <p className="text-[11px] text-slate-400">Code repositories</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentScreen('github-resume')}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Manage
              </button>
            </div>

            {user.githubConnected ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      github.com/{user.githubUsername}
                    </p>
                    <p className="text-[10px] text-slate-400">Connected</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  PlaceMate reads your repositories to evaluate real engineering decisions.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-xs text-slate-400 font-medium">No GitHub account connected</p>
                </div>
                <button
                  onClick={() => setCurrentScreen('github-resume')}
                  className="w-full py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white border border-white/10 transition-colors"
                >
                  Connect GitHub
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Interview Results or Empty State */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xl backdrop-blur-2xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-white">Recent Interview Performance</h2>
              <p className="text-xs text-slate-400">Real feedback and evaluation records</p>
            </div>
            {hasCompletedInterviews && (
              <button
                onClick={() => setCurrentScreen('progress')}
                className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <span>View all in Progress</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            )}
          </div>

          {hasCompletedInterviews && recentInterview ? (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Technical</span>
                  <span className="text-xl font-bold text-white mt-1 block">
                    {recentInterview.technicalKnowledge}%
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Problem Solving</span>
                  <span className="text-xl font-bold text-white mt-1 block">
                    {recentInterview.problemSolving}%
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Communication</span>
                  <span className="text-xl font-bold text-white mt-1 block">
                    {recentInterview.communication}%
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Project Depth</span>
                  <span className="text-xl font-bold text-white mt-1 block">
                    {recentInterview.projectUnderstanding}%
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-white/5">
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-white">{recentInterview.targetRole}</span> •{' '}
                  <span className="capitalize">{recentInterview.interviewType}</span> •{' '}
                  <span>{recentInterview.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setLatestResult(recentInterview);
                      setCurrentScreen('detailed-report');
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                  >
                    View Detailed Report
                  </button>
                  <button
                    onClick={() => setCurrentScreen('preparation')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                    style={{ color: accents.accentColor }}
                  >
                    Review Preparation Material →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 mb-4">
                <span className="material-symbols-outlined text-2xl">videocam</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">No interviews yet</h3>
              <p className="text-xs text-slate-400 max-w-md mb-5 leading-relaxed">
                Start your first interview to begin building your performance history.
              </p>
              <button
                onClick={() => startNewInterview()}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs text-black transition-all ${accents.buttonClass}`}
              >
                Start Interview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
