import {
  InterviewConfig,
  InterviewQuestion,
  AnswerEvaluation,
  UserProfile,
  InterviewResult,
} from '../types';

export const DEFAULT_API_BASE = 'http://172.17.14.18:8000';

export const API_BASE = (
  (import.meta as any).env?.VITE_API_BASE || DEFAULT_API_BASE
).replace(/\/$/, '');

// Adapter helper: format question from backend into frontend InterviewQuestion
function mapBackendQuestion(
  raw: any,
  fallbackNumber: number = 1,
  totalCount: number = 3
): InterviewQuestion {
  if (!raw) {
    throw new Error('Malformed backend response: missing question data.');
  }

  // Handle case where raw contains question object or is question string
  const source = raw.question && typeof raw.question === 'object' ? raw.question : raw;
  const questionText =
    typeof source.question === 'string'
      ? source.question
      : typeof raw.question === 'string'
      ? raw.question
      : source.text || source.prompt || '';

  if (!questionText) {
    throw new Error('Backend returned an invalid question without prompt text.');
  }

  const qNum =
    source.question_number ||
    source.questionNumber ||
    raw.question_number ||
    raw.questionNumber ||
    fallbackNumber;

  const total =
    source.total_questions ||
    source.totalQuestions ||
    raw.total_questions ||
    raw.totalQuestions ||
    totalCount;

  const difficulty =
    source.difficulty ||
    raw.difficulty ||
    raw.current_difficulty ||
    'medium';

  const keyPoints: string[] =
    source.expected_key_points ||
    source.expectedKeyPoints ||
    raw.expected_key_points ||
    raw.expectedKeyPoints ||
    [];

  return {
    id: String(source.id || raw.id || source.question_id || raw.question_id || `q_${qNum}`),
    questionNumber: Number(qNum),
    totalQuestions: Number(total),
    type: source.type || source.question_type || raw.type || 'technical',
    difficulty: difficulty as any,
    question: questionText,
    context: source.context || raw.context || source.subject || raw.subject,
    hasProjectContext: Boolean(source.has_project_context ?? raw.has_project_context),
    expectedKeyPoints: Array.isArray(keyPoints) ? keyPoints : [],
  };
}

// Adapter helper: map answer evaluation from backend
function mapBackendEvaluation(
  raw: any,
  questionText: string,
  candidateAnswer: string
): AnswerEvaluation {
  if (!raw) {
    throw new Error('Backend did not return an evaluation for the answer.');
  }

  const evalData = raw.evaluation || raw;
  const strengths: string[] = Array.isArray(evalData.strengths)
    ? evalData.strengths
    : evalData.strength
    ? [evalData.strength]
    : [];

  const improvements: string[] = Array.isArray(evalData.improvements)
    ? evalData.improvements
    : Array.isArray(evalData.weaknesses)
    ? evalData.weaknesses
    : evalData.improvement
    ? [evalData.improvement]
    : [];

  const techDepth =
    evalData.technical_depth ??
    evalData.technicalDepth ??
    evalData.technical_score ??
    evalData.score ??
    70;

  const comm =
    evalData.communication ??
    evalData.communication_score ??
    evalData.communicationScore ??
    75;

  const proj =
    evalData.project_understanding ??
    evalData.projectUnderstanding ??
    evalData.project_score ??
    70;

  const retrievalOccurred = Boolean(
    evalData.retrieval_occurred ??
    evalData.retrievalOccurred ??
    raw.retrieval_occurred ??
    raw.retrievalOccurred ??
    evalData.retrieved_material ??
    evalData.retrieved_context
  );

  let retrievedPrepMaterial = undefined;
  const rawMaterial =
    evalData.retrieved_prep_material ||
    evalData.retrieved_material ||
    evalData.retrieved_context ||
    raw.retrieved_prep_material ||
    raw.retrieved_material;

  if (rawMaterial) {
    retrievedPrepMaterial = {
      topic: rawMaterial.topic || rawMaterial.title || 'Technical Concept',
      summary: rawMaterial.summary || rawMaterial.content || rawMaterial.description || '',
      keyConcept: rawMaterial.key_concept || rawMaterial.keyConcept || rawMaterial.concept || '',
    };
  }

  const difficultyChanged = Boolean(
    evalData.difficulty_changed ??
    evalData.difficultyChanged ??
    raw.difficulty_changed ??
    raw.difficultyChanged
  );

  const adaptedNextDifficulty =
    evalData.adapted_next_difficulty ||
    evalData.next_difficulty ||
    raw.adapted_next_difficulty ||
    raw.next_difficulty ||
    evalData.adaptedNextDifficulty;

  return {
    questionId: String(evalData.question_id || evalData.questionId || 'q'),
    questionText: evalData.question_text || evalData.questionText || questionText,
    candidateAnswer,
    strengths,
    improvements,
    technicalDepth: Number(techDepth),
    communication: Number(comm),
    projectUnderstanding: Number(proj),
    retrievalOccurred,
    retrievedPrepMaterial,
    difficultyChanged,
    adaptedNextDifficulty,
  };
}

// Adapter helper: map interview result
function mapBackendResult(raw: any, threadId: string): InterviewResult {
  if (!raw) {
    throw new Error('Backend returned empty interview result.');
  }

  const data = raw.result || raw;
  const overall = Number(data.overall_score ?? data.overallScore ?? data.score ?? 0);
  const tech = Number(data.technical_knowledge ?? data.technicalKnowledge ?? data.technical_depth ?? overall);
  const prob = Number(data.problem_solving ?? data.problemSolving ?? tech);
  const comm = Number(data.communication ?? data.communication_score ?? 75);
  const proj = Number(data.project_understanding ?? data.projectUnderstanding ?? 75);

  const rawEvaluations = data.evaluations || [];
  const evaluations: AnswerEvaluation[] = Array.isArray(rawEvaluations)
    ? rawEvaluations.map((ev: any) =>
        mapBackendEvaluation(ev, ev.question_text || ev.questionText || 'Question', ev.candidate_answer || ev.candidateAnswer || '')
      )
    : [];

  return {
    id: String(data.thread_id || data.id || threadId),
    date: data.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    targetRole: data.target_role || data.targetRole || data.subject || 'Software Engineer',
    interviewType: data.interview_type || data.interviewType || 'technical',
    difficulty: data.difficulty || 'adaptive',
    questionsCount: Number(data.questions_count || data.questionsCount || evaluations.length || 1),
    overallScore: overall,
    technicalKnowledge: tech,
    problemSolving: prob,
    communication: comm,
    projectUnderstanding: proj,
    strengths: Array.isArray(data.strengths) ? data.strengths : [],
    weakAreas: Array.isArray(data.weaknesses)
      ? data.weaknesses
      : Array.isArray(data.weak_areas)
      ? data.weak_areas
      : Array.isArray(data.weakAreas)
      ? data.weakAreas
      : [],
    topicsToPrepare: Array.isArray(data.topics_to_prepare)
      ? data.topics_to_prepare
      : Array.isArray(data.topicsToPrepare)
      ? data.topicsToPrepare
      : [],
    recommendedNextSteps: Array.isArray(data.recommended_next_steps)
      ? data.recommended_next_steps
      : Array.isArray(data.recommendedNextSteps)
      ? data.recommendedNextSteps
      : [],
    evaluations,
  };
}

export const apiService = {
  // 1. Health check
  async checkHealth(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: HTTP ${response.status}`);
    }
    return await response.json();
  },

  // 2. Analyze Resume
  // Backend Contract: POST /api/candidate/analyze-resume with { resume_text, target_role }
  async analyzeResume(file: File, profile: UserProfile): Promise<any> {
    // Read actual text from uploaded file
    const resumeText = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Failed to read uploaded resume file.'));
      reader.readAsText(file);
    });

    const response = await fetch(`${API_BASE}/api/candidate/analyze-resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resume_text: resumeText || file.name,
        target_role: profile.targetRole || 'Software Engineer',
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || errData.error || `Resume analysis failed (HTTP ${response.status})`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      analysis: data.analysis || data,
    };
  },

  // 3. Analyze GitHub
  // Backend Contract: POST /api/github/analyze with { username, target_role }
  async analyzeGithub(username: string, targetRole: string = 'Software Engineer'): Promise<any> {
    const cleanUsername = username.trim().replace(/^@/, '');
    const response = await fetch(`${API_BASE}/api/github/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: cleanUsername,
        target_role: targetRole || 'Software Engineer',
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || errData.error || `GitHub analysis failed (HTTP ${response.status})`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      repositories: data.repositories || data.repos || [],
    };
  },

  // 4. Start Interview
  // Backend Contract: POST /api/interview/start with { candidate_profile, subject, thread_id }
  async startInterview(
    config: InterviewConfig,
    profile: UserProfile,
    threadIdOverride?: string
  ): Promise<{
    threadId: string;
    sessionId: string;
    firstQuestion: InterviewQuestion;
    totalQuestions: number;
    currentDifficulty: string;
  }> {
    const threadId =
      threadIdOverride ||
      (typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `thread_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);

    const candidateProfile = {
      name: profile.name || 'Candidate',
      email: profile.email || '',
      gender: profile.gender || 'other',
      university: profile.university || '',
      degree: profile.degree || '',
      graduation_year: profile.graduationYear || '',
      graduationYear: profile.graduationYear || '',
      target_role: config.targetRole || profile.targetRole || 'Software Engineer',
      targetRole: config.targetRole || profile.targetRole || 'Software Engineer',
      experience_level: profile.experienceLevel || 'Entry Level',
      experienceLevel: profile.experienceLevel || 'Entry Level',
      skills: profile.skills || [],
      github_username: profile.githubUsername || '',
      githubUsername: profile.githubUsername || '',
      resume_text: profile.resumeFileName || '',
    };

    const response = await fetch(`${API_BASE}/api/interview/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidate_profile: candidateProfile,
        subject: config.targetRole || profile.targetRole || 'Software Engineer',
        thread_id: threadId,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        errData.detail ||
        errData.error ||
        `Failed to start interview on backend (HTTP ${response.status})`
      );
    }

    const data = await response.json();
    const finalThreadId = data.thread_id || data.threadId || data.sessionId || threadId;
    const firstQuestion = mapBackendQuestion(data, 1, config.questionsCount);

    return {
      threadId: finalThreadId,
      sessionId: finalThreadId,
      firstQuestion,
      totalQuestions: data.total_questions || data.totalQuestions || config.questionsCount,
      currentDifficulty: data.difficulty || data.current_difficulty || config.difficulty || 'medium',
    };
  },

  // 5. Submit Answer
  // Backend Contract: POST /api/interview/answer with { thread_id, answer }
  async submitAnswer(
    threadId: string,
    answer: string,
    currentQuestionText: string = '',
    nextQuestionNumber: number = 2,
    totalQuestions: number = 3
  ): Promise<{
    evaluation: AnswerEvaluation;
    difficultyChanged: boolean;
    adaptedNextDifficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
    retrievalOccurred: boolean;
    hasNextQuestion: boolean;
    nextQuestion: InterviewQuestion | null;
  }> {
    const response = await fetch(`${API_BASE}/api/interview/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        thread_id: threadId,
        answer,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        errData.detail ||
        errData.error ||
        `Failed to evaluate answer on backend (HTTP ${response.status})`
      );
    }

    const data = await response.json();
    const evaluation = mapBackendEvaluation(data, currentQuestionText, answer);

    let nextQuestion: InterviewQuestion | null = null;
    const rawNext = data.next_question || data.nextQuestion || data.question;
    if (rawNext) {
      try {
        nextQuestion = mapBackendQuestion(rawNext, nextQuestionNumber, totalQuestions);
      } catch {
        nextQuestion = null;
      }
    }

    const hasNextQuestion = Boolean(
      data.has_next_question ??
      data.hasNextQuestion ??
      (nextQuestion !== null)
    );

    return {
      evaluation,
      difficultyChanged: evaluation.difficultyChanged || false,
      adaptedNextDifficulty: evaluation.adaptedNextDifficulty || 'medium',
      retrievalOccurred: evaluation.retrievalOccurred || false,
      hasNextQuestion,
      nextQuestion,
    };
  },

  // 6. Finish Interview
  // Backend Contract: POST /api/interview/finish with { thread_id }
  async finishInterview(threadId: string): Promise<any> {
    const response = await fetch(`${API_BASE}/api/interview/finish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        thread_id: threadId,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        errData.detail ||
        errData.error ||
        `Failed to finalize interview on backend (HTTP ${response.status})`
      );
    }

    return await response.json();
  },

  // 7. Get Interview Result
  // Backend Contract: GET /api/interview/result?thread_id=...
  async getInterviewResult(threadId: string): Promise<InterviewResult> {
    const response = await fetch(
      `${API_BASE}/api/interview/result?thread_id=${encodeURIComponent(threadId)}`
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        errData.detail ||
        errData.error ||
        `Failed to fetch interview result from backend (HTTP ${response.status})`
      );
    }

    const data = await response.json();
    return mapBackendResult(data, threadId);
  },

  // 8. Get Recommendations
  // Backend Contract: GET /api/recommendations?thread_id=...
  async getRecommendations(threadId: string): Promise<any[]> {
    const response = await fetch(
      `${API_BASE}/api/recommendations?thread_id=${encodeURIComponent(threadId)}`
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        errData.detail ||
        errData.error ||
        `Failed to fetch recommendations from backend (HTTP ${response.status})`
      );
    }

    const data = await response.json();
    return data.recommendations || data.topics || (Array.isArray(data) ? data : []);
  },
};
