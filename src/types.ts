export type Gender = 'male' | 'female' | 'other';

export type ScreenId =
  | 'login'
  | 'signup'
  | 'profile-details'
  | 'github-resume'
  | 'dashboard'
  | 'interview-setup'
  | 'interview-starting'
  | 'live-interview'
  | 'evaluation-processing'
  | 'live-feedback'
  | 'interview-complete'
  | 'score-reveal'
  | 'detailed-report'
  | 'preparation'
  | 'progress'
  | 'settings';

export interface UserProfile {
  name: string;
  email: string;
  gender: Gender;
  university: string;
  degree: string;
  graduationYear: string;
  targetRole: string;
  experienceLevel: string;
  skills: string[];
  githubUsername?: string;
  githubConnected: boolean;
  resumeFileName?: string;
  resumeUploaded: boolean;
}

export interface InterviewerProfile {
  name: string;
  title: string;
  avatar: string;
}

export interface InterviewQuestion {
  id: string;
  questionNumber: number;
  totalQuestions: number;
  type: 'technical' | 'behavioral' | 'project';
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  question: string;
  context?: string;
  hasProjectContext?: boolean;
  expectedKeyPoints: string[];
}

export interface RetrievedMaterial {
  topic: string;
  summary: string;
  keyConcept: string;
}

export interface AnswerEvaluation {
  questionId: string;
  questionText: string;
  candidateAnswer: string;
  strengths: string[];
  improvements: string[];
  technicalDepth: number; // 0-100
  communication: number; // 0-100
  projectUnderstanding: number; // 0-100
  retrievedPrepMaterial?: RetrievedMaterial;
  adaptedNextDifficulty?: 'easy' | 'medium' | 'hard' | 'adaptive';
  difficultyChanged?: boolean;
  retrievalOccurred?: boolean;
}

export interface InterviewResult {
  id: string;
  date: string;
  targetRole: string;
  interviewType: 'technical' | 'behavioral' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  questionsCount: number;
  overallScore: number;
  technicalKnowledge: number;
  problemSolving: number;
  communication: number;
  projectUnderstanding: number;
  strengths: string[];
  weakAreas: string[];
  topicsToPrepare: string[];
  recommendedNextSteps: string[];
  evaluations: AnswerEvaluation[];
}

export interface InterviewConfig {
  targetRole: string;
  type: 'technical' | 'behavioral' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  questionsCount: number;
}
