import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gender } from '../types';

export const SettingsScreen: React.FC = () => {
  const { user, setUser, accents, candidateAvatar, aiInterviewer } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [gender, setGender] = useState<Gender>(user.gender);
  const [university, setUniversity] = useState(user.university);
  const [degree, setDegree] = useState(user.degree);
  const [graduationYear, setGraduationYear] = useState(user.graduationYear);
  const [targetRole, setTargetRole] = useState(user.targetRole);
  const [experienceLevel, setExperienceLevel] = useState(user.experienceLevel);
  const [skills, setSkills] = useState<string[]>(user.skills);
  const [skillInput, setSkillInput] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills(prev => [...prev, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (s: string) => {
    setSkills(prev => prev.filter(item => item !== s));
  };

  const handleSave = (e: React.FormEvent) => {
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
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: accents.accentColor }}
            >
              Candidate Preferences
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Profile & Calibration Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Updating your candidate profile automatically updates your visual pairing and AI interviewer.
          </p>
        </div>

        {savedNotice && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>Profile and automatic pairing preferences updated successfully!</span>
          </div>
        )}

        {/* Automatic Pairing Preview Card */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl backdrop-blur-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Current Automatic Personalization
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
              <img
                src={candidateAvatar}
                alt="Candidate Avatar"
                className="w-12 h-12 rounded-full object-cover border border-white/20"
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Candidate Avatar
                </span>
                <p className="text-xs font-bold text-white capitalize">{gender} Candidate</p>
                <p className="text-[10px] text-slate-400">Accent: {gender === 'male' ? 'Orange (#FF6A00)' : 'Cyan (#00D4FF)'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
              <img
                src={aiInterviewer.avatar}
                alt={aiInterviewer.name}
                className="w-12 h-12 rounded-full object-cover border border-white/20"
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Paired AI Interviewer
                </span>
                <p className="text-xs font-bold text-white">{aiInterviewer.name}</p>
                <p className="text-[10px] text-slate-400">{aiInterviewer.title}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col gap-5">
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Gender (Automatically updates avatar & interviewer)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'male', label: 'Male' },
                { id: 'female', label: 'Female' },
                { id: 'other', label: 'Other / Non-binary' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setGender(opt.id as Gender)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                    gender === opt.id
                      ? 'bg-white/[0.12] border-white/40 text-white shadow-md'
                      : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      gender === opt.id ? 'bg-white' : 'bg-slate-600'
                    }`}
                  ></span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* University & Degree */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                College / University
              </label>
              <input
                type="text"
                required
                value={university}
                onChange={e => setUniversity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Degree
              </label>
              <input
                type="text"
                required
                value={degree}
                onChange={e => setDegree(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Graduation Year & Experience Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Graduation Year
              </label>
              <select
                value={graduationYear}
                onChange={e => setGraduationYear(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none bg-[#0e1014]"
              >
                <option value="2024">2024 (Recent Graduate)</option>
                <option value="2025">2025 (Final Year)</option>
                <option value="2026">2026 (Pre-Final Year)</option>
                <option value="2027">2027+</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none bg-[#0e1014]"
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
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Target Role
            </label>
            <select
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none bg-[#0e1014]"
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
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add skill (press Enter)"
                className="flex-1 px-4 py-2 rounded-xl glass-input text-sm text-white focus:outline-none"
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

          {/* Submit Save */}
          <div className="pt-3">
            <button
              type="submit"
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-black shadow-lg transition-all ${accents.buttonClass}`}
            >
              Save Profile Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
