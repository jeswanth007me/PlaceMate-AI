import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

interface StatusItem {
  id: string;
  label: string;
  subtext?: string;
}

export const InterviewStartingScreen: React.FC = () => {
  const {
    user,
    aiInterviewer,
    interviewConfig,
    accents,
    startError,
    isStarting,
    startNewInterview,
    setCurrentScreen,
  } = useApp();

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const statusItems: StatusItem[] = [
    {
      id: 'profile',
      label: 'Candidate profile loaded',
      subtext: `${user.name || 'Candidate'} • ${interviewConfig.targetRole || user.targetRole || 'Software Engineer'}`,
    },
    ...(user.resumeUploaded
      ? [
          {
            id: 'resume',
            label: 'Resume context loaded',
            subtext: user.resumeFileName || 'Resume parsed',
          },
        ]
      : []),
    ...(user.githubConnected
      ? [
          {
            id: 'github',
            label: 'GitHub context loaded',
            subtext: `@${user.githubUsername} synchronized`,
          },
        ]
      : []),
    {
      id: 'config',
      label: 'Interview configuration calibrated',
      subtext: `${interviewConfig.targetRole} • ${interviewConfig.type} • ${interviewConfig.difficulty}`,
    },
    {
      id: 'interviewer',
      label: 'AI interviewer ready',
      subtext: `${aiInterviewer.name} (${aiInterviewer.title})`,
    },
    {
      id: 'backend',
      label: 'Connecting to PlaceMate AI backend...',
      subtext: 'POST /api/interview/start (http://172.17.14.18:8000)',
    },
  ];

  useEffect(() => {
    if (startError) return;

    const interval = setInterval(() => {
      setActiveStepIndex(prev => (prev < statusItems.length - 1 ? prev + 1 : prev));
    }, 400);

    return () => clearInterval(interval);
  }, [statusItems.length, startError]);

  return (
    <div className="min-h-screen w-full bg-[#08090C] text-[#f3f4f6] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div
          className="w-[500px] h-[500px] rounded-full blur-[150px] opacity-20"
          style={{ backgroundColor: accents.accentColor }}
        ></div>
      </div>

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-lg glass-panel rounded-3xl p-7 sm:p-9 border border-white/10 shadow-2xl backdrop-blur-2xl text-center">
        {startError ? (
          // Error State with Retry
          <div>
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-5 bg-red-500/10 border border-red-500/30 text-red-400">
              <span className="material-symbols-outlined text-3xl">error_outline</span>
            </div>

            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-1">
                Backend Connection Error
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Could Not Start Interview
              </h1>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                The frontend could not connect to the PlaceMate AI backend at{' '}
                <code className="text-xs text-amber-300 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                  http://172.17.14.18:8000
                </code>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-left mb-6 text-xs text-red-300">
              <div className="font-semibold text-red-200 mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">info</span>
                <span>Error details:</span>
              </div>
              <p className="font-mono break-words leading-relaxed text-[11px] text-red-300/90">
                {startError}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => startNewInterview()}
                disabled={isStarting}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-black flex items-center justify-center gap-2 shadow-lg transition-all ${accents.buttonClass} disabled:opacity-50`}
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                <span>{isStarting ? 'Retrying...' : 'Retry Connection'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentScreen('interview-setup')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-semibold transition-all"
              >
                Back to Setup
              </button>
            </div>
          </div>
        ) : (
          // Loading / Preparing State
          <div>
            <div
              className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-5 shadow-xl border border-white/15"
              style={{ backgroundColor: `${accents.accentColor}15` }}
            >
              <span
                className="material-symbols-outlined text-2xl animate-spin"
                style={{ color: accents.accentColor }}
              >
                progress_activity
              </span>
            </div>

            <div className="mb-6">
              <span
                className="text-xs font-bold uppercase tracking-wider block mb-1"
                style={{ color: accents.accentColor }}
              >
                {interviewConfig.type} Simulation
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Preparing Your Interview Room...
              </h1>
              <p className="text-xs text-slate-400 mt-1.5">
                Calibrating interview question with the PlaceMate AI backend
              </p>
            </div>

            {/* Status Checklist */}
            <div className="flex flex-col gap-2.5 text-left my-4">
              {statusItems.map((item, idx) => {
                const isDone = idx < activeStepIndex;
                const isCurrent = idx === activeStepIndex;

                return (
                  <div
                    key={item.id}
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
                          {item.label}
                        </span>
                        {item.subtext && (
                          <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                            {item.subtext}
                          </span>
                        )}
                      </div>
                    </div>

                    {isDone ? (
                      <span className="text-[10px] font-bold uppercase text-emerald-400">Ready</span>
                    ) : isCurrent ? (
                      <span
                        className="text-[10px] font-bold uppercase animate-pulse"
                        style={{ color: accents.accentColor }}
                      >
                        Loading...
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-600">Waiting</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
