import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../types';

export const Header: React.FC = () => {
  const { currentScreen, setCurrentScreen, user, candidateAvatar, aiInterviewer, accents } = useApp();
  const [isScreenMenuOpen, setIsScreenMenuOpen] = useState(false);

  const screens: { id: ScreenId; label: string; group: string }[] = [
    { id: 'dashboard', label: 'Dashboard', group: 'Core' },
    { id: 'interview-setup', label: 'Start Interview Setup', group: 'Interview' },
    { id: 'live-interview', label: 'Live AI Interview', group: 'Interview' },
    { id: 'evaluation-processing', label: 'Answer Processing', group: 'Interview' },
    { id: 'live-feedback', label: 'Live Feedback', group: 'Interview' },
    { id: 'score-reveal', label: 'Evaluation & Score', group: 'Evaluation' },
    { id: 'detailed-report', label: 'Detailed Review Report', group: 'Evaluation' },
    { id: 'preparation', label: 'Preparation Topics', group: 'Learning' },
    { id: 'progress', label: 'Progress History', group: 'Learning' },
    { id: 'github-resume', label: 'GitHub & Resume Setup', group: 'Onboarding' },
    { id: 'profile-details', label: 'Profile Details', group: 'Onboarding' },
    { id: 'settings', label: 'Settings', group: 'Profile' },
    { id: 'login', label: 'Login Screen', group: 'Auth' },
    { id: 'signup', label: 'Sign Up Screen', group: 'Auth' },
  ];

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-[#08090C]/85 backdrop-blur-2xl border-b border-white/[0.06] shadow-md z-40 flex items-center justify-between px-6">
      {/* Left status / Navigator */}
      <div className="flex items-center gap-3">
        {/* Screen Navigator */}
        <div className="relative">
          <button
            onClick={() => setIsScreenMenuOpen(!isScreenMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white border border-white/10 transition-all"
            title="Navigate screens"
          >
            <span className="material-symbols-outlined text-sm" style={{ color: accents.accentColor }}>
              layers
            </span>
            <span className="text-slate-400 hidden sm:inline">Screen:</span>
            <span className="text-white capitalize">
              {screens.find(s => s.id === currentScreen)?.label || 'Current View'}
            </span>
            <span className="material-symbols-outlined text-xs text-slate-400">arrow_drop_down</span>
          </button>

          {isScreenMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 max-h-[380px] overflow-y-auto rounded-2xl bg-[#0e1014]/95 backdrop-blur-2xl border border-white/10 shadow-2xl p-2 z-50">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                PlaceMate AI Screens
              </div>
              <div className="flex flex-col gap-0.5 mt-1">
                {screens.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentScreen(s.id);
                      setIsScreenMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all ${
                      currentScreen === s.id
                        ? `${accents.buttonClass}`
                        : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <span className="truncate">{s.label}</span>
                    {currentScreen === s.id && (
                      <span className="material-symbols-outlined text-xs">check</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
          <span className="text-slate-600">•</span>
          <span className="italic">“Practice. Prepare. Place.”</span>
        </div>
      </div>

      {/* Right Candidate + AI Interviewer Badge */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => setCurrentScreen('settings')}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] cursor-pointer transition-all"
        >
          <div className="flex items-center -space-x-2">
            <img
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border border-white/20"
              src={candidateAvatar}
            />
            <img
              alt={aiInterviewer.name}
              className="w-7 h-7 rounded-full object-cover border border-black"
              src={aiInterviewer.avatar}
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-white leading-tight">
              {user.name}
            </span>
            <span
              className="text-[10px] font-semibold leading-tight capitalize"
              style={{ color: accents.accentColor }}
            >
              {aiInterviewer.name} (AI)
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
