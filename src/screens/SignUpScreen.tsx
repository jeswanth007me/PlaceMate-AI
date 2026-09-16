import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const SignUpScreen: React.FC = () => {
  const { setCurrentScreen, setUser, accents } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setUser(prev => ({
      ...prev,
      name: name || prev.name,
      email: email || prev.email,
    }));
    // After sign up -> Show Profile Details
    setCurrentScreen('profile-details');
  };

  const handleGitHubSignUp = () => {
    setUser(prev => ({
      ...prev,
      githubConnected: true,
    }));
    setCurrentScreen('profile-details');
  };

  return (
    <div className="min-h-screen w-full bg-[#08090C] text-[#f3f4f6] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle ambient light */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div
          className="w-[500px] h-[500px] rounded-full blur-[140px] opacity-25"
          style={{ backgroundColor: accents.accentColor }}
        ></div>
      </div>

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md glass-panel rounded-3xl p-7 sm:p-9 border border-white/10 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-lg border border-white/15"
            style={{ backgroundColor: `${accents.accentColor}20` }}
          >
            <span className="material-symbols-outlined text-2xl" style={{ color: accents.accentColor }}>
              person_add
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-medium tracking-wide">
            PlaceMate AI • Practice. Prepare. Place.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="flex flex-col gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. alex@example.edu"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-black mt-2 shadow-lg transition-all ${accents.buttonClass}`}
          >
            Create Account
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">or</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <button
          type="button"
          onClick={handleGitHubSignUp}
          className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-sm font-semibold flex items-center justify-center gap-2.5 transition-all"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>Continue with GitHub</span>
        </button>

        <div className="text-center mt-5">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => setCurrentScreen('login')}
              className="font-semibold text-white hover:underline ml-1"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
