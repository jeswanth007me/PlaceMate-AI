import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const LiveInterviewScreen: React.FC = () => {
  const {
    aiInterviewer,
    candidateAvatar,
    user,
    accents,
    questions,
    currentQuestionIndex,
    currentQuestion,
    currentAnswerText,
    setCurrentAnswerText,
    isMicActive,
    setIsMicActive,
    isSubmitting,
    submitCurrentAnswer,
    finishInterviewSession,
    interviewConfig,
    submitError,
    clearSubmitError,
    finishError,
    clearFinishError,
    setCurrentScreen,
  } = useApp();

  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Set up optional Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setCurrentAnswerText(prev => (prev ? prev + ' ' + transcript : transcript));
        }
      };

      recognition.onerror = () => {
        setIsMicActive(false);
      };

      recognitionRef.current = recognition;
    }
  }, [setCurrentAnswerText, setIsMicActive]);

  const toggleMic = () => {
    if (isMicActive) {
      setIsMicActive(false);
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
    } else {
      setIsMicActive(true);
      try {
        recognitionRef.current?.start();
      } catch {
        // ignore
      }
    }
  };

  const totalQuestions = questions.length || interviewConfig.questionsCount || 3;
  const currentNum = currentQuestionIndex + 1;
  const wordCount = currentAnswerText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#08090C] text-[#f3f4f6]">
      {/* Top Session Bar */}
      <header className="w-full px-4 sm:px-8 py-3.5 bg-[#08090C]/90 backdrop-blur-2xl border-b border-white/[0.06] flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: accents.accentColor }}
            ></span>
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              PlaceMate AI
            </span>
          </div>
          <span className="text-slate-600">•</span>
          <span className="text-xs font-semibold text-white">
            {currentNum} / {totalQuestions}
          </span>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: accents.accentColor }}
          ></span>
          <span className="text-slate-300 font-medium">
            Status: <span className="text-white font-semibold">Live Interview</span>
          </span>
        </div>

        {/* End Interview control */}
        <button
          type="button"
          onClick={() => finishInterviewSession()}
          className="text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/[0.04] transition-all font-medium"
        >
          End Interview
        </button>
      </header>

      {/* Main Interview Stage */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Minimal Progress Bar */}
        <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{
              width: `${Math.round((currentNum / totalQuestions) * 100)}%`,
              backgroundColor: accents.accentColor,
            }}
          ></div>
        </div>

        {/* Interview Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* AI INTERVIEWER ZONE */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="glass-panel rounded-3xl p-3 border border-white/10 shadow-2xl backdrop-blur-2xl">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
                <img
                  src={aiInterviewer.avatar}
                  alt={aiInterviewer.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      AI Interviewer
                    </span>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {aiInterviewer.name}
                    </h3>
                    <p className="text-[11px] text-slate-300 font-medium">
                      {aiInterviewer.title}
                    </p>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-black"
                    style={{ backgroundColor: accents.accentColor }}
                  >
                    Active
                  </span>
                </div>
              </div>

              {/* Status footer */}
              <div className="p-3 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-ping"
                    style={{ backgroundColor: accents.accentColor }}
                  ></span>
                  <span>Listening for response...</span>
                </span>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Round: {interviewConfig.type}
                </span>
              </div>
            </div>

            {/* Candidate Identity Card */}
            <div className="glass-card rounded-2xl p-3.5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={candidateAvatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/20"
                />
                <div>
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[11px] text-slate-400">{user.targetRole}</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 px-2 py-1 rounded bg-white/[0.04]">
                Candidate
              </span>
            </div>
          </div>

          {/* QUESTION & CANDIDATE ANSWER WORKSPACE */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Question Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span
                  className="text-xs uppercase tracking-wider font-bold"
                  style={{ color: accents.accentColor }}
                >
                  Question {currentNum} of {totalQuestions}
                </span>

                <div className="flex items-center gap-2">
                  {currentQuestion?.hasProjectContext && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      Project context
                    </span>
                  )}
                  <span className="text-[11px] text-slate-300 uppercase tracking-wider font-medium px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10">
                    Difficulty: {currentQuestion?.difficulty || 'Medium'}
                  </span>
                </div>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                "{currentQuestion?.question}"
              </h2>

              {currentQuestion?.context && (
                <p className="text-xs text-slate-400 italic pt-1 border-t border-white/5">
                  Focus: {currentQuestion.context}
                </p>
              )}
            </div>

            {/* Answer Input Workspace */}
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col gap-4">
              {submitError && (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-red-400">error</span>
                    <span>{submitError}</span>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => submitCurrentAnswer()}
                      className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 font-semibold text-[11px] transition-all"
                    >
                      Retry
                    </button>
                    <button
                      type="button"
                      onClick={clearSubmitError}
                      className="text-slate-400 hover:text-white text-xs px-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {finishError && (
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-amber-400">warning</span>
                    <span>{finishError}</span>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => finishInterviewSession()}
                      className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold text-[11px] transition-all"
                    >
                      Retry Finalize
                    </button>
                    <button
                      type="button"
                      onClick={clearFinishError}
                      className="text-slate-400 hover:text-white text-xs px-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Your Answer
                </label>

                {/* Voice / Mic input */}
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    isMicActive
                      ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white border-white/10'
                  }`}
                  title={isSpeechSupported ? 'Voice dictate answer' : 'Voice input'}
                >
                  <span className="material-symbols-outlined text-sm">
                    {isMicActive ? 'mic' : 'mic_none'}
                  </span>
                  <span>{isMicActive ? 'Listening...' : 'Voice Input'}</span>
                </button>
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  rows={8}
                  disabled={isSubmitting}
                  value={currentAnswerText}
                  onChange={e => setCurrentAnswerText(e.target.value)}
                  placeholder="Articulate your approach, design decisions, and concrete trade-offs here..."
                  className="w-full p-4 rounded-2xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed font-normal disabled:opacity-50"
                ></textarea>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
                  <span>{wordCount} words</span>
                  <span>Be detailed to allow the AI to evaluate technical depth</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => finishInterviewSession()}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-white/[0.04] transition-all"
                >
                  End Interview
                </button>

                <button
                  type="button"
                  disabled={!currentAnswerText.trim() || isSubmitting}
                  onClick={() => submitCurrentAnswer()}
                  className={`px-7 py-3 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-40 disabled:pointer-events-none ${accents.buttonClass}`}
                >
                  <span>{isSubmitting ? 'Analyzing...' : 'Submit Answer'}</span>
                  <span className="material-symbols-outlined text-base">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
