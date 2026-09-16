import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const InterviewSetupScreen: React.FC = () => {
  const { user, accents, startNewInterview } = useApp();

  const [targetRole, setTargetRole] = useState(user.targetRole || 'Software Engineer');
  const [interviewType, setInterviewType] = useState<'technical' | 'behavioral' | 'mixed'>('technical');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'adaptive'>('adaptive');
  const [questionsCount, setQuestionsCount] = useState<number>(3);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    startNewInterview({
      targetRole,
      type: interviewType,
      difficulty,
      questionsCount,
    });
  };

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span
              className="text-xs uppercase tracking-wider font-bold"
              style={{ color: accents.accentColor }}
            >
              Live Simulation
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Setup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Configure Interview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Set your target role, evaluation type, and difficulty before stepping into the AI interview room.
          </p>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleStart} className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col gap-6">
          {/* Target Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              Target Role
            </label>
            <input
              type="text"
              required
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g. Software Engineer, Backend Engineer"
              className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Interview Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              Interview Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'technical', label: 'Technical', desc: 'Algorithms & Architecture' },
                { id: 'behavioral', label: 'Behavioral', desc: 'STAR & Situational' },
                { id: 'mixed', label: 'Mixed', desc: 'Technical & Practical' },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setInterviewType(t.id as any)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    interviewType === t.id
                      ? 'bg-white/[0.12] border-white/40 text-white shadow-md'
                      : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        interviewType === t.id ? 'bg-white' : 'bg-slate-600'
                      }`}
                    ></span>
                    <span className="text-xs font-bold text-white">{t.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              Difficulty Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'easy', label: 'Easy' },
                { id: 'medium', label: 'Medium' },
                { id: 'hard', label: 'Hard' },
                { id: 'adaptive', label: 'Adaptive' },
              ].map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDifficulty(d.id as any)}
                  className={`py-3 px-3.5 rounded-xl border text-center transition-all ${
                    difficulty === d.id
                      ? 'bg-white/[0.12] border-white/40 text-white shadow-md'
                      : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="text-xs font-bold">{d.label}</span>
                </button>
              ))}
            </div>
            {difficulty === 'adaptive' && (
              <p className="text-xs text-slate-400 mt-2 font-medium">
                Difficulty adjusts based on your responses.
              </p>
            )}
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              Number of Questions
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[3, 5, 8].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionsCount(count)}
                  className={`py-2.5 px-4 rounded-xl border text-center transition-all ${
                    questionsCount === count
                      ? 'bg-white/[0.12] border-white/40 text-white shadow-md'
                      : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="text-xs font-bold">{count} Questions</span>
                </button>
              ))}
            </div>
          </div>

          {/* Primary CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-4 px-6 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2 shadow-lg transition-all ${accents.buttonClass}`}
            >
              <span className="material-symbols-outlined text-lg">play_arrow</span>
              <span>Start Interview</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
