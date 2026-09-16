import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const LoginScreen: React.FC = () => {
  const { setCurrentScreen, user, setUser, accents } = useApp();
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    setUser(prev => ({
      ...prev,
      email: cleanEmail,
    }));

    // Follow required profile flow:
    // If candidate has completed profile details, proceed to dashboard; otherwise go to profile details
    if (user.name && user.university) {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('profile-details');
    }
  };

  const handleGitHubLogin = () => {
    setUser(prev => ({
      ...prev,
      githubConnected: true,
    }));

    if (user.name && user.university) {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('profile-details');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage('Password reset link sent to your email if an account exists.');
    setTimeout(() => {
      setShowForgotPassword(false);
      setForgotMessage('');
    }, 2800);
  };

  return (
    <div className="min-h-screen w-full bg-[#08090C] text-[#f3f4f6] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle ambient light behind glass */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div
          className="w-[500px] h-[500px] rounded-full blur-[140px] opacity-25"
          style={{ backgroundColor: accents.accentColor }}
        ></div>
      </div>

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md glass-panel rounded-3xl p-7 sm:p-9 border border-white/10 shadow-2xl backdrop-blur-2xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-lg border border-white/15"
            style={{ backgroundColor: `${accents.accentColor}20` }}
          >
            <span className="material-symbols-outlined text-2xl" style={{ color: accents.accentColor }}>
              psychology
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            PlaceMate AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium tracking-wide">
            Practice. Prepare. Place.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-black mt-2 shadow-lg transition-all ${accents.buttonClass}`}
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">or</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Continue with GitHub */}
        <button
          type="button"
          onClick={handleGitHubLogin}
          className="w-full py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-sm font-semibold flex items-center justify-center gap-2.5 transition-all"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>Continue with GitHub</span>
        </button>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={() => setCurrentScreen('signup')}
              className="font-semibold text-white hover:underline ml-1"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-sm glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Reset Password</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your email address to receive reset instructions.
            </p>
            {forgotMessage ? (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 font-medium text-center">
                {forgotMessage}
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  defaultValue={email}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <div className="flex items-center justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-xl text-xs font-bold text-black ${accents.buttonClass}`}
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
