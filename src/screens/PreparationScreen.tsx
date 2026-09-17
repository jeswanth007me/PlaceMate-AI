import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';

interface PersonalizedTopic {
  id: string;
  topic: string;
  explanation: string;
  keyConcepts: string[];
  retrievedMaterial: string;
  relevantWeakness: string;
}

export const PreparationScreen: React.FC = () => {
  const { user, accents, latestResult, completedInterviews, setCurrentScreen } = useApp();
  const [backendRecs, setBackendRecs] = useState<any[]>([]);

  // Find recent interview with real evaluated weaknesses/topics
  const activeSession = latestResult || (completedInterviews.length > 0 ? completedInterviews[0] : null);

  useEffect(() => {
    if (activeSession?.id) {
      apiService
        .getRecommendations(activeSession.id)
        .then(recs => {
          if (Array.isArray(recs) && recs.length > 0) {
            setBackendRecs(recs);
          }
        })
        .catch(err => {
          console.warn('Backend recommendations not yet available:', err.message);
        });
    }
  }, [activeSession?.id]);

  const personalizedTopics: PersonalizedTopic[] = [];

  if (activeSession) {
    // 0. Real backend recommendations if returned by /api/recommendations
    if (backendRecs.length > 0) {
      backendRecs.forEach((rec, idx) => {
        const topicName = typeof rec === 'string' ? rec : rec.topic || rec.title || `Recommendation ${idx + 1}`;
        const explanation =
          typeof rec === 'string'
            ? `Recommended preparation topic from your recent ${activeSession.targetRole} evaluation.`
            : rec.reason || rec.explanation || rec.summary || 'Recommended by PlaceMate AI backend.';
        const keyConcepts =
          Array.isArray(rec.keyConcepts)
            ? rec.keyConcepts
            : Array.isArray(rec.concepts)
            ? rec.concepts
            : ['Core fundamentals', 'Practical trade-offs', 'Interview presentation'];
        const retrieved =
          rec.retrievedContent ||
          rec.retrievedMaterial ||
          rec.content ||
          `Backend study note for ${topicName}`;

        personalizedTopics.push({
          id: `rec-${idx}`,
          topic: topicName,
          explanation,
          keyConcepts,
          retrievedMaterial: retrieved,
          relevantWeakness: rec.reason || 'Backend Recommendation',
        });
      });
    }
  }

  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [studyNotes, setStudyNotes] = useState<string>(() => {
    return localStorage.getItem('placemate_prep_notes') || '';
  });
  const [notesSaved, setNotesSaved] = useState(false);

  const handleSaveNotes = () => {
    localStorage.setItem('placemate_prep_notes', studyNotes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  // If no completed interviews, show approved empty state:
  if (!activeSession || personalizedTopics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[65vh] text-center max-w-md mx-auto">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl border border-white/10"
          style={{ backgroundColor: `${accents.accentColor}15` }}
        >
          <span
            className="material-symbols-outlined text-3xl"
            style={{ color: accents.accentColor }}
          >
            auto_stories
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Personalized Preparation</h2>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Complete an interview to unlock personalized preparation.
        </p>
        <button
          onClick={() => setCurrentScreen('interview-setup')}
          className={`px-6 py-3 rounded-xl font-bold text-xs text-black shadow-lg transition-all ${accents.buttonClass}`}
        >
          Start Mock Interview
        </button>
      </div>
    );
  }

  const currentTopic = personalizedTopics[selectedTopicIndex] || personalizedTopics[0];

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: accents.accentColor }}
              >
                Personalized Preparation
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{activeSession.targetRole}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Interview Weakness Preparation
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Derived from your real mock evaluation weak areas and retrieved materials.
            </p>
          </div>

          <button
            onClick={() => setCurrentScreen('dashboard')}
            className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold border border-white/10 transition-colors self-start sm:self-auto"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* 2-Column Study Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Topics Sidebar (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Identified Topics ({personalizedTopics.length})
            </span>
            <div className="flex flex-col gap-2">
              {personalizedTopics.map((pt, idx) => {
                const isSelected = idx === selectedTopicIndex;
                return (
                  <button
                    key={pt.id}
                    onClick={() => setSelectedTopicIndex(idx)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-white/[0.12] border-white/30 text-white shadow-lg'
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        Weakness Targeted
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Q{idx + 1}</span>
                    </div>
                    <h3 className="text-xs font-bold text-white leading-snug truncate">
                      {pt.topic}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate mt-1">
                      {pt.relevantWeakness}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Topic Study Area (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* Topic & Explanation */}
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: accents.accentColor }}
                >
                  Topic Study Module
                </span>
                <span className="text-[11px] text-slate-400">
                  Targeted Preparation
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white">
                {currentTopic.topic}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentTopic.explanation}
              </p>
            </div>

            {/* Relevant Interview Weakness */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Identified Interview Gap
              </span>
              <p className="text-xs text-amber-200 font-medium">
                "{currentTopic.relevantWeakness}"
              </p>
            </div>

            {/* Key Concepts */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl backdrop-blur-2xl flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Key Concepts
              </span>
              <div className="flex flex-col gap-2">
                {currentTopic.keyConcepts.map((concept, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                      style={{ backgroundColor: `${accents.accentColor}25`, color: accents.accentColor }}
                    >
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{concept}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Retrieved Preparation Material */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl backdrop-blur-2xl flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base" style={{ color: accents.accentColor }}>
                  library_books
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Retrieved Preparation Material
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentTopic.retrievedMaterial}
              </p>
            </div>

            {/* Notes Area */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl backdrop-blur-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Study & Preparation Notes
                </label>
                {notesSaved && (
                  <span className="text-xs text-emerald-400 font-semibold animate-pulse">
                    ✓ Notes Saved
                  </span>
                )}
              </div>
              <textarea
                rows={4}
                value={studyNotes}
                onChange={e => setStudyNotes(e.target.value)}
                placeholder="Jot down personal takeaways, algorithmic invariants, or answers to practice saying out loud..."
                className="w-full p-3.5 rounded-2xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-semibold border border-white/10 transition-colors"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
