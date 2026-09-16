import React from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../types';

export const Sidebar: React.FC = () => {
  const { currentScreen, setCurrentScreen, user, candidateAvatar, aiInterviewer, accents } = useApp();

  const navItems: { id: ScreenId; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' },
    { id: 'interview-setup', label: 'Start Interview', icon: 'play_arrow' },
    { id: 'github-resume', label: 'GitHub & Resume', icon: 'folder_shared' },
    { id: 'preparation', label: 'Preparation', icon: 'menu_book' },
    { id: 'progress', label: 'Progress', icon: 'insights' },
    { id: 'settings', label: 'Profile & Settings', icon: 'tune' },
  ];

  const isInterviewFlow = [
    'interview-setup',
    'live-interview',
    'evaluation-processing',
    'live-feedback',
    'score-reveal',
    'detailed-report',
  ].includes(currentScreen);

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#08090C]/90 backdrop-blur-2xl border-r border-white/[0.06] shadow-2xl z-50 flex flex-col justify-between p-5">
      <div className="flex flex-col gap-6">
        {/* Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setCurrentScreen('dashboard')}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 shadow-lg transition-transform group-hover:scale-105"
            style={{ backgroundColor: `${accents.accentColor}20` }}
          >
            <span className="material-symbols-outlined text-2xl" style={{ color: accents.accentColor }}>
              psychology
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-white group-hover:text-white transition-colors">
              PlaceMate AI
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">
              Practice. Prepare. Place.
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map(item => {
            const isActive =
              currentScreen === item.id ||
              (item.id === 'interview-setup' && isInterviewFlow);

            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-left text-xs font-semibold ${
                  isActive
                    ? `${accents.buttonClass}`
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Candidate Card & Interviewer Pairing */}
      <div className="flex flex-col gap-3 pt-4 border-t border-white/[0.06]">
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
          <div className="relative">
            <img
              src={candidateAvatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-white/20"
            />
            <img
              src={aiInterviewer.avatar}
              alt={aiInterviewer.name}
              className="w-4 h-4 rounded-full object-cover border border-black absolute -bottom-0.5 -right-0.5"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user.targetRole}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => setCurrentScreen('login')}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-white/[0.04] transition-all"
        >
          <span className="material-symbols-outlined text-base">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
