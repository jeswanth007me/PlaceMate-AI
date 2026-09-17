import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  ScreenId,
  UserProfile,
  InterviewerProfile,
  InterviewConfig,
  InterviewQuestion,
  AnswerEvaluation,
  InterviewResult,
} from '../types';
import {
  DEFAULT_USER,
  MALE_CANDIDATE_AVATAR,
  FEMALE_CANDIDATE_AVATAR,
  FEMALE_INTERVIEWER,
  MALE_INTERVIEWER,
} from '../data/constants';
import { apiService } from '../services/api';

export type AIAgentState =
  | 'listening'
  | 'evaluating'
  | 'finding_material'
  | 'adapting'
  | 'preparing_challenge'
  | 'idle';

export interface StyleAccents {
  accentColor: string;
  themeClass: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  accentGlow: string;
  buttonClass: string;
  pillClass: string;
}

interface AppContextType {
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  candidateAvatar: string;
  aiInterviewer: InterviewerProfile;
  accents: StyleAccents;
  // Interview configuration
  interviewConfig: InterviewConfig;
  setInterviewConfig: React.Dispatch<React.SetStateAction<InterviewConfig>>;
  // Live Interview State
  sessionId: string | null;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  currentQuestion: InterviewQuestion | null;
  agentState: AIAgentState;
  setAgentState: (state: AIAgentState) => void;
  currentAnswerText: string;
  setCurrentAnswerText: (text: string) => void;
  isMicActive: boolean;
  setIsMicActive: (active: boolean | ((prev: boolean) => boolean)) => void;
  isSubmitting: boolean;
  isStarting: boolean;
  startError: string | null;
  clearStartError: () => void;
  submitError: string | null;
  clearSubmitError: () => void;
  finishError: string | null;
  clearFinishError: () => void;
  currentEvaluation: AnswerEvaluation | null;
  evaluations: AnswerEvaluation[];
  submitCurrentAnswer: () => Promise<void>;
  advanceToNextQuestionOrComplete: () => Promise<void>;
  finishInterviewSession: () => Promise<void>;
  startNewInterview: (customConfig?: Partial<InterviewConfig>) => Promise<void>;
  // Completed Results & History
  completedInterviews: InterviewResult[];
  latestResult: InterviewResult | null;
  setLatestResult: (res: InterviewResult | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig>({
    targetRole: 'Software Engineer',
    type: 'technical',
    difficulty: 'adaptive',
    questionsCount: 3,
  });

  // Completed interviews history — strictly starts empty
  const [completedInterviews, setCompletedInterviews] = useState<InterviewResult[]>([]);
  const [latestResult, setLatestResult] = useState<InterviewResult | null>(null);

  // Live session state — strictly populated from backend
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [agentState, setAgentState] = useState<AIAgentState>('listening');
  const [currentAnswerText, setCurrentAnswerText] = useState<string>('');
  const [evaluations, setEvaluations] = useState<AnswerEvaluation[]>([]);
  const [currentEvaluation, setCurrentEvaluation] = useState<AnswerEvaluation | null>(null);

  // Automatic Gender Personalization
  const { candidateAvatar, aiInterviewer, accents } = useMemo(() => {
    const isMale = user.gender === 'male';

    const avatar = isMale ? MALE_CANDIDATE_AVATAR : FEMALE_CANDIDATE_AVATAR;
    const interviewer = isMale ? FEMALE_INTERVIEWER : MALE_INTERVIEWER;

    const styleAccents: StyleAccents = isMale
      ? {
          accentColor: '#FF6A00',
          themeClass: 'theme-male',
          accentBg: 'bg-[#FF6A00]',
          accentText: 'text-[#FF6A00]',
          accentBorder: 'border-[#FF6A00]/40',
          accentGlow: 'shadow-[0_0_24px_rgba(255,106,0,0.35)]',
          buttonClass:
            'bg-[#FF6A00] hover:bg-[#ff7d1a] text-black font-bold shadow-[0_0_24px_rgba(255,106,0,0.4)] transition-all',
          pillClass: 'bg-[#FF6A00]/15 text-[#FF6A00] border border-[#FF6A00]/30',
        }
      : {
          accentColor: '#00D4FF',
          themeClass: 'theme-female',
          accentBg: 'bg-[#00D4FF]',
          accentText: 'text-[#00D4FF]',
          accentBorder: 'border-[#00D4FF]/40',
          accentGlow: 'shadow-[0_0_24px_rgba(0,212,255,0.35)]',
          buttonClass:
            'bg-[#00D4FF] hover:bg-[#20dcff] text-black font-bold shadow-[0_0_24px_rgba(0,212,255,0.4)] transition-all',
          pillClass: 'bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30',
        };

    return {
      candidateAvatar: avatar,
      aiInterviewer: interviewer,
      accents: styleAccents,
    };
  }, [user.gender]);

  const currentQuestion = questions[currentQuestionIndex] || null;

  const clearStartError = () => setStartError(null);
  const clearSubmitError = () => setSubmitError(null);
  const clearFinishError = () => setFinishError(null);

  const startNewInterview = async (customConfig?: Partial<InterviewConfig>) => {
    const config = { ...interviewConfig, ...customConfig };
    setInterviewConfig(config);

    // Enter SCREEN 1: Interview Starting
    setCurrentScreen('interview-starting');
    setIsStarting(true);
    setStartError(null);
    setEvaluations([]);
    setCurrentEvaluation(null);
    setCurrentQuestionIndex(0);
    setCurrentAnswerText('');
    setAgentState('listening');

    try {
      const init = await apiService.startInterview(config, user);
      setSessionId(init.threadId);
      if (init.firstQuestion) {
        setQuestions([init.firstQuestion]);
      }
      setIsStarting(false);
      setCurrentScreen('live-interview');
    } catch (err: any) {
      console.error('startInterview API error:', err);
      setIsStarting(false);
      setStartError(
        err.message ||
        'Unable to connect to PlaceMate AI backend. Please ensure the backend service is running and reachable.'
      );
    }
  };

  const submitCurrentAnswer = async () => {
    if (!currentQuestion || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setAgentState('evaluating');

    try {
      const resp = await apiService.submitAnswer(
        sessionId || '',
        currentAnswerText,
        currentQuestion.question,
        currentQuestionIndex + 2,
        interviewConfig.questionsCount
      );

      setCurrentEvaluation(resp.evaluation);
      setEvaluations(prev => [...prev, resp.evaluation]);

      if (resp.nextQuestion) {
        setQuestions(prev => {
          const nextQuestions = [...prev];
          nextQuestions[currentQuestionIndex + 1] = resp.nextQuestion!;
          return nextQuestions;
        });
      }

      setCurrentScreen('evaluation-processing');
    } catch (err: any) {
      console.error('submitAnswer API error:', err);
      setSubmitError(
        err.message ||
        'Failed to submit answer to PlaceMate AI backend. Please verify your connection and retry.'
      );
      setAgentState('listening');
    } finally {
      setIsSubmitting(false);
    }
  };

  const finishInterviewSession = async () => {
    if (!sessionId) {
      setCurrentScreen('dashboard');
      return;
    }

    setIsSubmitting(true);
    setFinishError(null);

    try {
      await apiService.finishInterview(sessionId);
      const result = await apiService.getInterviewResult(sessionId);
      setLatestResult(result);
      setCompletedInterviews(prev => [result, ...prev]);
      setCurrentScreen('interview-complete');
    } catch (err: any) {
      console.error('finishInterview API error:', err);
      setFinishError(
        err.message ||
        'Failed to retrieve completed interview results from the backend. Please retry.'
      );
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const advanceToNextQuestionOrComplete = async () => {
    const nextIndex = currentQuestionIndex + 1;
    const totalCount = interviewConfig.questionsCount;

    if (nextIndex < totalCount && nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setCurrentAnswerText('');
      setCurrentEvaluation(null);
      setAgentState('listening');
      setCurrentScreen('live-interview');
    } else {
      await finishInterviewSession();
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        user,
        setUser,
        candidateAvatar,
        aiInterviewer,
        accents,
        interviewConfig,
        setInterviewConfig,
        sessionId,
        questions,
        currentQuestionIndex,
        currentQuestion,
        agentState,
        setAgentState,
        currentAnswerText,
        setCurrentAnswerText,
        isMicActive,
        setIsMicActive,
        isSubmitting,
        isStarting,
        startError,
        clearStartError,
        submitError,
        clearSubmitError,
        finishError,
        clearFinishError,
        currentEvaluation,
        evaluations,
        submitCurrentAnswer,
        advanceToNextQuestionOrComplete,
        finishInterviewSession,
        startNewInterview,
        completedInterviews,
        latestResult,
        setLatestResult,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
