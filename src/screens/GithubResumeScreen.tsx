import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';

type GithubStatus = 'empty' | 'connecting' | 'analyzing' | 'success' | 'error';
type ResumeStatus = 'empty' | 'parsing' | 'success' | 'error';

interface RepoSummary {
  name: string;
  description: string;
  language: string;
  stars: number;
  url?: string;
}

export const GithubResumeScreen: React.FC = () => {
  const { setCurrentScreen, user, setUser, accents } = useApp();
  const [githubInput, setGithubInput] = useState(user.githubUsername || '');
  const [githubStatus, setGithubStatus] = useState<GithubStatus>(
    user.githubConnected ? 'success' : 'empty'
  );
  const [githubError, setGithubError] = useState('');
  const [repositories, setRepositories] = useState<RepoSummary[]>([]);

  const [resumeStatus, setResumeStatus] = useState<ResumeStatus>(
    user.resumeUploaded ? 'success' : 'empty'
  );
  const [resumeError, setResumeError] = useState('');
  const [lastUploadedFile, setLastUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Connect GitHub Flow
  const handleConnectGithub = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUsername = githubInput.trim().replace('@', '');
    if (!cleanUsername) return;

    setGithubStatus('connecting');
    setGithubError('');

    try {
      // Step 1: Connecting
      await new Promise(resolve => setTimeout(resolve, 400));
      setGithubStatus('analyzing');

      // Step 2: Analyzing real repositories
      const result = await apiService.analyzeGithub(cleanUsername, user.targetRole || 'Software Engineer');

      if (result && result.success) {
        setRepositories(result.repositories || []);
        setUser(prev => ({
          ...prev,
          githubUsername: cleanUsername,
          githubConnected: true,
        }));
        setGithubStatus('success');
      } else {
        throw new Error(result?.error || 'Unable to connect/analyze');
      }
    } catch (err: any) {
      setGithubError(err.message || 'Unable to connect/analyze');
      setGithubStatus('error');
    }
  };

  const handleDisconnectGithub = () => {
    setUser(prev => ({
      ...prev,
      githubUsername: '',
      githubConnected: false,
    }));
    setRepositories([]);
    setGithubStatus('empty');
    setGithubError('');
  };

  // Upload Resume Flow
  const processResumeFile = async (file: File) => {
    setLastUploadedFile(file);
    setResumeStatus('parsing');
    setResumeError('');

    try {
      const result = await apiService.analyzeResume(file, user);
      if (result && result.success) {
        setUser(prev => ({
          ...prev,
          resumeFileName: file.name,
          resumeUploaded: true,
        }));
        setResumeStatus('success');
      } else {
        throw new Error(result?.error || 'Unable to connect/analyze');
      }
    } catch (err: any) {
      setResumeError(err.message || 'Unable to connect/analyze');
      setResumeStatus('error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processResumeFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveResume = () => {
    setUser(prev => ({
      ...prev,
      resumeFileName: '',
      resumeUploaded: false,
    }));
    setResumeStatus('empty');
    setResumeError('');
    setLastUploadedFile(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#08090C] text-[#f3f4f6] flex flex-col justify-between selection:bg-white/20 selection:text-white relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div
          className="w-[600px] h-[600px] rounded-full blur-[160px] opacity-20"
          style={{ backgroundColor: accents.accentColor }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full border-b border-white/[0.06] bg-[#08090C]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 shadow-sm"
              style={{ backgroundColor: `${accents.accentColor}20` }}
            >
              <span className="material-symbols-outlined text-lg" style={{ color: accents.accentColor }}>
                folder_shared
              </span>
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base text-white">PlaceMate AI</span>
              <p className="text-[11px] text-slate-400 font-medium">Practice. Prepare. Place.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accents.accentColor }}></span>
            <span>Project & Resume Context</span>
          </div>
        </div>
      </header>

      {/* Main Glass Workspace */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Connect Your Engineering Context
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
              PlaceMate AI analyzes your real code and professional experience to ask targeted, role-relevant questions during your interview.
            </p>
          </div>

          {/* Dual Glass Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SECTION 1: GITHUB */}
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl flex flex-col justify-between backdrop-blur-2xl">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-white">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Connect GitHub</h2>
                    <span className="text-[11px] text-slate-400">Project intelligence</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-5">
                  “Let PlaceMate understand the projects you’ve built.”
                </p>

                {/* GitHub State: LOADING (Connecting / Analyzing) */}
                {(githubStatus === 'connecting' || githubStatus === 'analyzing') && (
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col items-center justify-center py-6 text-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {githubStatus === 'connecting' ? 'Connecting GitHub...' : 'Analyzing repositories...'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Reading public projects</p>
                    </div>
                  </div>
                )}

                {/* GitHub State: ERROR */}
                {githubStatus === 'error' && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 flex flex-col gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-red-400 text-lg mt-0.5">error</span>
                      <div>
                        <p className="text-xs font-bold text-red-300">Unable to connect/analyze</p>
                        <p className="text-[11px] text-red-400/80 mt-0.5 leading-tight">
                          {githubError || 'Check the username or GitHub API limits and retry.'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleConnectGithub()}
                      className="w-full py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-semibold transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* GitHub State: SUCCESS */}
                {githubStatus === 'success' && (
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-lg text-emerald-400">check_circle</span>
                        <div>
                          <p className="text-xs font-bold text-white">✓ GitHub connected</p>
                          <p className="text-[11px] text-slate-400">@{user.githubUsername}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleDisconnectGithub}
                        className="text-xs text-slate-400 hover:text-red-400 transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>

                    {repositories.length > 0 && (
                      <div className="pt-2 border-t border-white/5 flex flex-col gap-1.5">
                        <p className="text-[10px] uppercase font-semibold text-slate-400">
                          Detected Repositories ({repositories.length}):
                        </p>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                          {repositories.map(repo => (
                            <span
                              key={repo.name}
                              className="px-2 py-0.5 rounded-md bg-white/[0.06] text-[11px] text-slate-300 border border-white/5"
                            >
                              {repo.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* GitHub State: EMPTY */}
                {githubStatus === 'empty' && (
                  <form onSubmit={handleConnectGithub} className="flex flex-col gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                        GitHub Username
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">@</span>
                        <input
                          type="text"
                          value={githubInput}
                          onChange={e => setGithubInput(e.target.value)}
                          placeholder="your-username"
                          className="w-full pl-8 pr-4 py-2 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={!githubInput.trim()}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-semibold border border-white/10 transition-all disabled:opacity-40"
                    >
                      Connect GitHub
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* SECTION 2: RESUME */}
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl flex flex-col justify-between backdrop-blur-2xl">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-xl">description</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Upload Resume</h2>
                    <span className="text-[11px] text-slate-400">Profile grounding</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-5">
                  “Use your resume to personalize your interview.”
                </p>

                {/* Resume State: LOADING (Parsing) */}
                {resumeStatus === 'parsing' && (
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col items-center justify-center py-6 text-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                    <div>
                      <p className="text-xs font-semibold text-white">Parsing resume...</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Extracting candidate experience</p>
                    </div>
                  </div>
                )}

                {/* Resume State: ERROR */}
                {resumeStatus === 'error' && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 flex flex-col gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-red-400 text-lg mt-0.5">error</span>
                      <div>
                        <p className="text-xs font-bold text-red-300">Unable to connect/analyze</p>
                        <p className="text-[11px] text-red-400/80 mt-0.5 leading-tight">
                          {resumeError || 'Failed to parse resume file. Please upload PDF or DOCX and retry.'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => lastUploadedFile && processResumeFile(lastUploadedFile)}
                      className="w-full py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-semibold transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Resume State: SUCCESS */}
                {resumeStatus === 'success' && (
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-lg text-emerald-400">check_circle</span>
                        <div className="max-w-[170px] truncate">
                          <p className="text-xs font-bold text-white">✓ Resume parsed successfully</p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {user.resumeFileName || 'Resume.pdf'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveResume}
                        className="text-xs text-slate-400 hover:text-red-400 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Resume State: EMPTY */}
                {resumeStatus === 'empty' && (
                  <div
                    onDragOver={e => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer ${
                      isDragOver
                        ? 'border-white bg-white/[0.08]'
                        : 'border-white/15 bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload-input"
                    />
                    <label htmlFor="resume-upload-input" className="cursor-pointer block">
                      <span className="material-symbols-outlined text-2xl text-slate-400 mb-1 block">
                        cloud_upload
                      </span>
                      <p className="text-xs font-semibold text-white">Upload Resume</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">PDF or DOCX (max 10MB)</p>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Primary CTA to Dashboard */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setCurrentScreen('dashboard')}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-black shadow-lg transition-all ${accents.buttonClass}`}
            >
              Continue to Dashboard →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
