export type TalentStatus = 'open' | 'busy' | 'employed';
export type ProjectType = 'IT' | 'UMKM' | 'Training';
export type UserStatus = 'pending_quiz' | 'active' | 'rejected';

export interface Talent {
  id: string;
  userId: string;
  name: string;
  wa: string;
  email: string;
  photoURL?: string;
  loc: string;
  cat: string;
  skills: string[];
  bio: string;
  portfolio: string;
  status: TalentStatus;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  type: ProjectType;
  desc: string;
  budget: string;
  wa: string;
  postedBy: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  photoURL: string;
  status: UserStatus;        // pending_quiz | active | rejected
  quizPassedAt?: string;
  talentId?: string;         // linked talent profile
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number; // index of correct option
  category: string;
}
