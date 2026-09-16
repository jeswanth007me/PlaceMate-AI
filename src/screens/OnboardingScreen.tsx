import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gender } from '../types';

export const OnboardingScreen: React.FC = () => {
  const { setCurrentScreen, user, setUser, accents } = useApp();

  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [gender, setGender] = useState<Gender>(user.gender || 'male');
  const [university, setUniversity] = useState(user.university || '');
  const [degree, setDegree] = useState(user.degree || '');
  const [graduationYear, setGraduationYear] = useState(user.graduationYear || '2025');
  const [targetRole, setTargetRole] = useState(user.targetRole || 'Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState(
    user.experienceLevel || 'Fresher / College Student (0-1 yrs)'
  );

  const [skillsInput, setSkillsInput] = useState('');
  const [skills, setSkills] = useState<string[]>(
    user.skills.length > 0
      ? user.skills
      : []
  );

  const handleAddSkill = () => {
    if (skillsInput.trim() && !skills.includes(skillsInput.trim())) {
      setSkills(prev => [...prev, skillsInput.trim()]);
      setSkillsInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name,
      email,
      gender,
      university,
      degree,
      graduationYear,
      targetRole,
      experienceLevel,
      skills,
    }));
    // Directly continue to GitHub + Resume setup (no theme/avatar selection page!)
    setCurrentScreen('github-resume');
  };

  return (
    <div className="min-h-screen w-full bg-[#08090C] text-[#f3f4f6] flex flex-col justify-between selection:bg-white/20 selection:text-white relative overflow-hidden">
      {/* Ambient background glow */}
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
                psychology
              </span>
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base text-white">PlaceMate AI</span>
              <p className="text-[11px] text-slate-400 font-medium">Practice. Prepare. Place.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accents.accentColor }}></span>
            <span>Profile Details</span>
          </div>
        </div>
      </header>

      {/* Main Profile Form */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-10">
        <div className="w-full max-w-2xl mx-auto">
          <div className="glass-panel rounded-3xl p-6 sm:p-9 border border-white/10 shadow-2xl backdrop-blur-2xl">
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Candidate Profile Details
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Provide your academic and engineering details so PlaceMate can personalize your interview difficulty and focus.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Row: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. alex@example.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Gender Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Gender *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'male', label: 'Male' },
                    { id: 'female', label: 'Female' },
                    { id: 'other', label: 'Other / Non-binary' },
                  ].map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setGender(option.id as Gender)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                        gender === option.id
                          ? 'bg-white/[0.12] border-white/40 text-white shadow-md'
                          : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          gender === option.id ? 'bg-white' : 'bg-slate-600'
                        }`}
                      ></span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* College & Degree */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                    College / University *
                  </label>
                  <input
                    type="text"
                    required
                    value={university}
                    onChange={e => setUniversity(e.target.value)}
                    placeholder="e.g. University of California, Berkeley"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                    Degree *
                  </label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={e => setDegree(e.target.value)}
                    placeholder="e.g. B.S. Computer Science"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Graduation Year & Experience Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                    Graduation Year *
                  </label>
                  <select
                    value={graduationYear}
                    onChange={e => setGraduationYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none bg-[#0e1014]"
                  >
                    <option value="2024">2024 (Recent Graduate)</option>
                    <option value="2025">2025 (Final Year)</option>
                    <option value="2026">2026 (Pre-Final Year)</option>
                    <option value="2027">2027+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                    Experience Level *
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={e => setExperienceLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none bg-[#0e1014]"
                  >
                    <option value="Fresher / College Student (0-1 yrs)">Fresher / College Student (0-1 yrs)</option>
                    <option value="Junior Engineer (1-2 yrs)">Junior Engineer (1-2 yrs)</option>
                    <option value="Mid-Level Engineer (2-4 yrs)">Mid-Level Engineer (2-4 yrs)</option>
                    <option value="Senior+ (5+ yrs)">Senior+ (5+ yrs)</option>
                  </select>
                </div>
              </div>

              {/* Target Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                  Target Role *
                </label>
                <select
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none bg-[#0e1014]"
                >
                  <option value="Software Engineer">Software Engineer (General)</option>
                  <option value="Frontend Engineer">Frontend Engineer</option>
                  <option value="Backend Engineer">Backend Engineer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Data Engineer">Data Engineer / AI Systems</option>
                </select>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                  Skills & Core Competencies
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={e => setSkillsInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="e.g. Python, Algorithms, Redis (press Enter)"
                    className="flex-1 px-3.5 py-2 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {skills.map(s => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-white/[0.07] border border-white/10 text-slate-200"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="text-slate-400 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-black mt-3 shadow-lg transition-all ${accents.buttonClass}`}
              >
                Continue to GitHub & Resume Setup →
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
