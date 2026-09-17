import {
  InterviewConfig,
  InterviewQuestion,
  AnswerEvaluation,
  UserProfile,
  InterviewResult,
} from '../types';

// Backend base URL — configure via VITE_API_BASE in .env.local for local dev
export const API_BASE = (
  (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000'
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
  const decisionLog: any[] = Array.isArray(raw.decision_log)
    ? raw.decision_log
    : Array.isArray(evalData.decision_log)
    ? evalData.decision_log
    : [];

  const latestEntry = decisionLog.length > 0 ? decisionLog[decisionLog.length - 1] : null;

  const rating =
    evalData.evaluation_rating ||
    raw.evaluation_rating ||
    latestEntry?.evaluation_rating ||
    null;

  const feedback =
    evalData.feedback ||
    raw.feedback ||
    evalData.evaluation_feedback ||
    raw.evaluation_feedback ||
    latestEntry?.feedback ||
    null;

  const decisionReason =
    evalData.decision_reason ||
    raw.decision_reason ||
    latestEntry?.decision_reason ||
    null;

  const retrievalUsed = Boolean(
    evalData.retrieval_used ??
    raw.retrieval_used ??
    latestEntry?.retrieval_used ??
    latestEntry?.retrieval_called ??
    evalData.retrieval_occurred ??
    raw.retrieval_occurred
  );

  const explicitStrengths: string[] = Array.isArray(evalData.strengths)
    ? evalData.strengths
    : evalData.strength
    ? [evalData.strength]
    : [];

  const explicitImprovements: string[] = Array.isArray(evalData.improvements)
    ? evalData.improvements
    : Array.isArray(evalData.weaknesses)
    ? evalData.weaknesses
    : evalData.improvement
    ? [evalData.improvement]
    : [];

  const strengths: string[] = [...explicitStrengths];
  const improvements: string[] = [...explicitImprovements];

  // Extract feedback and rationale from real backend data without fabricating content
  if (strengths.length === 0 && improvements.length === 0) {
    if (feedback && typeof feedback === 'string') {
      if (rating === 'strong') {
        strengths.push(feedback);
      } else {
        improvements.push(feedback);
      }
    }
    if (decisionReason && typeof decisionReason === 'string' && decisionReason !== feedback) {
      if (rating === 'strong') {
        strengths.push(decisionReason);
      } else if (rating === 'weak' || rating === 'acceptable') {
        improvements.push(decisionReason);
      }
    }
  }

  const techDepth =
    evalData.technical_depth ??
    evalData.technicalDepth ??
    evalData.technical_score ??
    evalData.score ??
    null;

  const comm =
    evalData.communication ??
    evalData.communication_score ??
    evalData.communicationScore ??
    null;

  const proj =
    evalData.project_understanding ??
    evalData.projectUnderstanding ??
    evalData.project_score ??
    null;

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
  } else if (latestEntry?.retrieval_query && retrievalUsed) {
    retrievedPrepMaterial = {
      topic: latestEntry.retrieval_query,
      summary: latestEntry.decision_reason || 'Retrieved prep material based on response evaluation.',
      keyConcept: 'Review core fundamentals and algorithmic invariants.',
    };
  }

  const difficultyDelta = latestEntry?.difficulty_delta ?? 0;
  const difficultyChanged = Boolean(
    difficultyDelta !== 0 ||
    evalData.difficulty_changed ||
    evalData.difficultyChanged ||
    raw.difficulty_changed ||
    raw.difficultyChanged
  );

  const diffNum = latestEntry?.difficulty_after ?? raw.difficulty ?? evalData.difficulty;
  const adaptedNextDifficulty =
    evalData.adapted_next_difficulty ||
    evalData.next_difficulty ||
    raw.adapted_next_difficulty ||
    raw.next_difficulty ||
    evalData.adaptedNextDifficulty ||
    (typeof diffNum === 'number' ? (diffNum >= 4 ? 'hard' : diffNum <= 1 ? 'easy' : 'medium') : 'medium');

  return {
    questionId: String(evalData.question_id || evalData.questionId || 'q'),
    questionText: evalData.question_text || evalData.questionText || questionText,
    candidateAnswer,
    strengths,
    improvements,
    technicalDepth: techDepth !== null ? Number(techDepth) : null,
    communication: comm !== null ? Number(comm) : null,
    projectUnderstanding: proj !== null ? Number(proj) : null,
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
  const rawTech = data.technical_knowledge ?? data.technicalKnowledge ?? data.technical_depth ?? null;
  const tech = rawTech !== null ? Number(rawTech) : (overall > 0 ? overall : null);
  const rawProb = data.problem_solving ?? data.problemSolving ?? null;
  const prob = rawProb !== null ? Number(rawProb) : tech;
  const rawComm = data.communication ?? data.communication_score ?? null;
  const comm = rawComm !== null ? Number(rawComm) : null;
  const rawProj = data.project_understanding ?? data.projectUnderstanding ?? null;
  const proj = rawProj !== null ? Number(rawProj) : null;

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
    topicsToPrepare: Array.isArray(data.recommended_topics)
      ? data.recommended_topics
      : Array.isArray(data.topics_to_prepare)
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
    const rawProjects = Array.isArray(data.projects)
      ? data.projects
      : Array.isArray(data.repositories)
      ? data.repositories
      : Array.isArray(data.repos)
      ? data.repos
      : [];

    const repositories = rawProjects.map((p: any) => ({
      name: p.project_name || p.name || 'Repository',
      technologies: Array.isArray(p.technologies) ? p.technologies : [],
      architecture: p.architecture || '',
      importantFiles: Array.isArray(p.important_files) ? p.important_files : [],
      interviewTopics: Array.isArray(p.interview_topics) ? p.interview_topics : [],
      ...p,
    }));

    return {
      success: true,
      data,
      repositories,
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
    const topics = Array.isArray(data.recommended_topics)
      ? data.recommended_topics.map((t: any) =>
          typeof t === 'string'
            ? { topic: t, explanation: 'Targeted preparation topic recommended from your interview evaluation.' }
            : t
        )
      : [];

    const roles = Array.isArray(data.recommended_roles)
      ? data.recommended_roles.map((r: any) => ({
          topic: r.role ? `${r.role} (Match: ${r.match_score}%)` : (r.topic || 'Recommended Role'),
          explanation: Array.isArray(r.reasons) && r.reasons.length > 0
            ? r.reasons.join(' ')
            : 'Recommended career path based on your interview evaluation.',
          keyConcepts: Array.isArray(r.reasons) ? r.reasons : [],
        }))
      : [];

    return [...topics, ...roles];
  },
};
