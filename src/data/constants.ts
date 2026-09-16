import { UserProfile, InterviewerProfile, InterviewQuestion, AnswerEvaluation, RetrievedMaterial } from '../types';

export const MALE_CANDIDATE_AVATAR =
  'https://lh3.googleusercontent.com/aida/AEtjO1VrgezQ7vMeqqk2GRoJG0-dqweRoCu9sDUKi4wAz2mZ4B_F7w-HsL-DSLTP6oSbwNRR6XRR81tNsU29BNp2YA3hUNXvf2-P5p2mBbjhEh82EDHKzBmEihPUvmS-MKjLB9QFbOqlNlhCSUbpVDfa6Hfgd01pdwQuYPfFr9qx41nfZGWt02Efr86bMlLZVcwGBtSNAABivv1vR_Ix_lPB6R3NbkwJA71xaOU996yK6fMIRJjnlAO9cbEKJU0';

export const FEMALE_CANDIDATE_AVATAR =
  'https://lh3.googleusercontent.com/aida/AEtjO1V5iXhhbjky7pPhr2uGJOR-aw-H6T2FaZwZDgtD2nrh9eAg-iTHdqir5AtVjLEZWseDkx1Y55tvi52ADS6y13ZtOPJwd69h346x-wC682IA_qksWg7q8hW4k3-PNUrulz17Vr2Ax6j07iZpmFDnrjo7kE-k6AKWNPLma4XY-sJUTMzXI9VFw8Fg1JnAmjdCyzBkyf6Luq5Vki8ciOrXfhPSflIwop4LiI4GbmUywxWKKW3f5J0XOt2Nt0I';

export const FEMALE_INTERVIEWER: InterviewerProfile = {
  name: 'Sarah',
  title: 'AI Technical Interviewer',
  avatar:
    'https://lh3.googleusercontent.com/aida/AEtjO1Ugmh15PnQ-DtgynI1aThnxWWXojKCq4S1AilzwpCNoOgSy_LJi97xtCmMoDsidE7dGsZet_2-27VnSmuh_CLDfLJXmGTAmiVbq5DMJjYI_Kwi5e8C3QKfTmtTwjvuIKAvwrYPivQnVrCmyZZ7_Sg_8BCiSUw37fFci9kk9QXB8DX8MKLzFvfObv9oY6LPJXGvLDQMTiM6SnDGY__If8DT1yFEOElWbXz7_JF_i6W9xxg0y2EnLc0QKhW8',
};

export const MALE_INTERVIEWER: InterviewerProfile = {
  name: 'David',
  title: 'AI Technical Interviewer',
  avatar:
    'https://lh3.googleusercontent.com/aida/AEtjO1WZpno5Te_BRpJgTvDODK30HCw9nIf6cgZpk4zlC9HLWv0ij0ABZjWUXqaFMAkpw-S3pLc5W2btlyCdEW2hKMc1m-ntesYkKdk7KyeHEwxVnZUW6gNet3CKbtV6QVwdBl6EeWVOaxThZU7sUy2LHpSBkccz86892N9hWJsFIEXkf-36MLGSS8CvpfyYDpwVYE29VXnWalRccWf8Or09bKBgi_VzJPSn6S833oEfg1peMsQX4ToO-dPTXYE',
};

export const DEFAULT_USER: UserProfile = {
  name: '',
  email: '',
  gender: 'male',
  university: '',
  degree: '',
  graduationYear: '',
  targetRole: '',
  experienceLevel: '',
  skills: [],
  githubUsername: '',
  githubConnected: false,
  resumeFileName: '',
  resumeUploaded: false,
};

// Adaptive questions bank
export const SAMPLE_QUESTIONS: Record<string, InterviewQuestion[]> = {
  technical: [
    {
      id: 'tech-1',
      questionNumber: 1,
      totalQuestions: 3,
      type: 'technical',
      difficulty: 'medium',
      question:
        'Explain how you would design an in-memory caching mechanism (such as an LRU Cache). What underlying data structures would you select to achieve O(1) time complexity for both get and put operations, and why?',
      context: 'Core data structure and system trade-offs evaluation.',
      expectedKeyPoints: [
        'Doubly linked list for O(1) removals and insertions at head/tail',
        'Hash Map / Dictionary for O(1) key-to-node lookups',
        'Capacity eviction handling when cache reaches maximum size',
        'Thread safety or concurrency considerations',
      ],
    },
    {
      id: 'tech-2',
      questionNumber: 2,
      totalQuestions: 3,
      type: 'technical',
      difficulty: 'hard',
      question:
        'When building a high-throughput API gateway, how do you handle rate limiting across distributed server instances? Contrast a centralized Redis token-bucket approach with a local in-memory sliding window.',
      context: 'Distributed systems and API resilience.',
      expectedKeyPoints: [
        'Token bucket / Leaky bucket algorithm principles',
        'Centralized Redis store with atomic Lua scripts vs network latency',
        'In-memory local cache with eventual consistency sync',
        'Handling burst traffic and 429 status response headers',
      ],
    },
    {
      id: 'tech-3',
      questionNumber: 3,
      totalQuestions: 3,
      type: 'technical',
      difficulty: 'adaptive',
      question:
        'Review one of the projects listed on your resume or GitHub. What was the most challenging engineering bottleneck you encountered during implementation, and how did you diagnose and resolve it?',
      context: 'Connecting candidate real-world projects to engineering reasoning.',
      expectedKeyPoints: [
        'Clear problem statement and measurable performance impact',
        'Root cause analysis methodology (profiling, logs, metrics)',
        'Iterative solution and architectural trade-offs',
        'Verification and test results',
      ],
    },
  ],
  behavioral: [
    {
      id: 'beh-1',
      questionNumber: 1,
      totalQuestions: 3,
      type: 'behavioral',
      difficulty: 'medium',
      question:
        'Describe a situation where you had a significant technical disagreement with a team member or mentor regarding architecture or implementation. How did you approach the discussion and reach consensus?',
      context: 'Collaboration and constructive conflict resolution.',
      expectedKeyPoints: [
        'Focus on data and technical trade-offs over personal preference',
        'Active listening and seeking to understand opposing constraints',
        'Proof-of-concept or benchmark comparison approach',
        'Commitment to team outcome once a decision was made',
      ],
    },
    {
      id: 'beh-2',
      questionNumber: 2,
      totalQuestions: 3,
      type: 'behavioral',
      difficulty: 'medium',
      question:
        'Tell me about a time when a project or feature you were building encountered an unexpected blocker close to a critical deadline. What steps did you take to prioritize and deliver?',
      context: 'Ownership, composure, and prioritization.',
      expectedKeyPoints: [
        'Immediate stakeholder communication and transparency',
        'Scope triage and defining MVP deliverables',
        'Root cause troubleshooting under pressure',
        'Post-incident reflection to avoid recurrence',
      ],
    },
    {
      id: 'beh-3',
      questionNumber: 3,
      totalQuestions: 3,
      type: 'behavioral',
      difficulty: 'hard',
      question:
        'Can you share an experience where you had to quickly learn an unfamiliar technology, library, or codebase to solve a production issue or meet a tight requirement?',
      context: 'Adaptability and continuous learning speed.',
      expectedKeyPoints: [
        'Structured learning approach using documentation and test suites',
        'Iterative implementation with minimal risk',
        'Knowledge sharing with the team afterward',
      ],
    },
  ],
  mixed: [
    {
      id: 'mix-1',
      questionNumber: 1,
      totalQuestions: 3,
      type: 'technical',
      difficulty: 'medium',
      question:
        'How do you design a database schema and indexing strategy for a service with heavy read queries versus one with high write volume? What trade-offs do indexes introduce?',
      context: 'Database design and storage engine trade-offs.',
      expectedKeyPoints: [
        'B-Tree index structure and write amplification overhead',
        'Read-heavy vs write-heavy patterns (denormalization vs normalization)',
        'Composite indexes and query plan execution',
      ],
    },
    {
      id: 'mix-2',
      questionNumber: 2,
      totalQuestions: 3,
      type: 'project',
      difficulty: 'adaptive',
      question:
        'From your GitHub projects or portfolio, select a service where you designed the API contracts. How did you structure error handling, idempotency, and data validation for consumer clients?',
      context: 'Project engineering depth and API ergonomics.',
      expectedKeyPoints: [
        'HTTP status code semantics and structured error payloads',
        'Idempotency keys for non-safe write operations',
        'Schema validation boundaries (e.g. Zod, JSON Schema)',
      ],
    },
    {
      id: 'mix-3',
      questionNumber: 3,
      totalQuestions: 3,
      type: 'behavioral',
      difficulty: 'medium',
      question:
        'How do you handle receiving critical feedback during a code review when you initially felt your implementation was the best approach?',
      context: 'Receptiveness to feedback and growth mindset.',
      expectedKeyPoints: [
        'Separating code critiques from personal validation',
        'Focus on long-term codebase maintainability and team conventions',
        'Asking clarifying questions to learn the reviewer perspective',
      ],
    },
  ],
};

// Adaptive answer evaluation engine
export function evaluateAnswer(
  question: InterviewQuestion,
  answer: string,
  userProfile: UserProfile
): AnswerEvaluation {
  const clean = answer.trim();
  const wordCount = clean.split(/\s+/).filter(Boolean).length;

  // Real analysis of candidate response
  const lower = clean.toLowerCase();
  const hasLinkedDataStructures =
    lower.includes('hash') || lower.includes('map') || lower.includes('linked list') || lower.includes('node');
  const hasComplexity = lower.includes('o(1)') || lower.includes('o(n)') || lower.includes('time complexity');
  const hasTradeoffs = lower.includes('trade') || lower.includes('however') || lower.includes('latency') || lower.includes('memory') || lower.includes('concurrency');
  const hasProjectContext = lower.includes('project') || lower.includes('we used') || lower.includes('i built') || lower.includes('implemented');

  let technicalScore = 70;
  let communicationScore = 72;
  let projectScore = 70;

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (wordCount >= 40) {
    communicationScore += 10;
    strengths.push('Provided a structured, comprehensive response with clear reasoning.');
  } else if (wordCount >= 20) {
    communicationScore += 5;
    strengths.push('Concise answer addressing the core question prompt directly.');
  } else {
    communicationScore -= 15;
    improvements.push('Answer was relatively brief. Elaborate further with concrete architectural trade-offs.');
  }

  if (hasLinkedDataStructures || hasComplexity) {
    technicalScore += 14;
    strengths.push('Explicitly identified appropriate algorithmic data structures and computational complexity.');
  } else {
    technicalScore -= 8;
    improvements.push('Include explicit time/space complexity analysis (Big-O) and data structure primitives.');
  }

  if (hasTradeoffs) {
    technicalScore += 10;
    strengths.push('Demonstrated strong engineering judgment by weighing memory overhead against lookup latency.');
  } else {
    improvements.push('Discuss alternative approaches and edge-case boundary constraints.');
  }

  if (hasProjectContext || userProfile.githubConnected) {
    projectScore += 12;
    strengths.push('Grounded theoretical points in real engineering scenarios.');
  } else {
    improvements.push('Tie your answer back to practical project experience from your GitHub repositories or resume.');
  }

  technicalScore = Math.min(95, Math.max(50, technicalScore));
  communicationScore = Math.min(96, Math.max(52, communicationScore));
  projectScore = Math.min(94, Math.max(50, projectScore));

  // Determine targeted preparation retrieval if improvements are needed
  let retrievedPrepMaterial: RetrievedMaterial | undefined;
  if (improvements.length > 0) {
    if (!hasLinkedDataStructures) {
      retrievedPrepMaterial = {
        topic: 'Composite Data Structures & LRU Caches',
        summary:
          'Review Doubly-Linked Lists combined with Hash Maps for O(1) eviction and lookup operations.',
        keyConcept:
          'Maintain a head and tail pointer. When a key is accessed, splice the node and re-link at the head in O(1) time.',
      };
    } else if (!hasTradeoffs) {
      retrievedPrepMaterial = {
        topic: 'System Design Trade-offs & Distributed Rate Limiting',
        summary:
          'Evaluate Token Bucket vs Sliding Window counters in Redis clusters with Lua scripts for atomicity.',
        keyConcept:
          'Understand how network hops to a centralized cache introduce 2-5ms latency versus local in-process memory.',
      };
    } else {
      retrievedPrepMaterial = {
        topic: 'STAR Method for Technical Discussions',
        summary:
          'Structure engineering examples with Situation, Task, Action, and measurable Results.',
        keyConcept:
          'Always quantify technical outcomes: latency reduction, query throughput, or crash rate improvements.',
      };
    }
  }

  const adaptedNextDifficulty: 'easy' | 'medium' | 'hard' =
    technicalScore >= 85 ? 'hard' : technicalScore <= 65 ? 'medium' : 'medium';

  return {
    questionId: question.id,
    questionText: question.question,
    candidateAnswer: clean,
    strengths: strengths.length > 0 ? strengths : ['Clear attempt at answering the prompt.'],
    improvements: improvements.length > 0 ? improvements : ['Maintain this level of rigor on deeper edge cases.'],
    technicalDepth: technicalScore,
    communication: communicationScore,
    projectUnderstanding: projectScore,
    retrievedPrepMaterial,
    adaptedNextDifficulty,
  };
}
