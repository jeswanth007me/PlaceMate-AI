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
