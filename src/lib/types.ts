export type Role = 'student' | 'teacher' | 'guardian';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
};

export type Curriculum = {
  id: string;
  teacherId: string;
  title: string;
  status: 'processing' | 'ready' | 'error';
  originalUrl: string;
  simplifiedContent: string;
  createdAt: Date;
};

export type Lesson = {
  id: string;
  curriculumId: string;
  title: string;
  order: number;
};

export type LessonStep = {
  id: string;
  lessonId: string;
  order: number;
  concept: string;
  imageUrl: string;
  imageHint: string;
  audioUrl: string;
};

export type Exam = {
    id: string;
    lessonId: string;
    title: string;
};

export type Question = {
    id: string;
    examId: string;
    questionType: 'multiple-choice' | 'image-based' | 'audio';
    questionText: string;
    options: { id: string; text?: string; imageUrl?: string, imageHint?: string }[];
    correctAnswerId: string;
    explanation: string;
};

export type Progress = {
  id: string;
  studentId: string;
  lessonId: string;
  score: number;
  timeSpent: number; // in seconds
  completedAt: Date;
};

export type EmotionalIndicator = {
  date: string; // "YYYY-MM-DD"
  level: 'happy' | 'neutral' | 'anxious';
};

// Subscription / Billing types
export type BillingCycle = 'monthly' | 'yearly';

export type SubscriptionPlanId = 'free' | 'freemium' | 'pro' | 'pro_plus';

export type SubscriptionPlan = {
  id: SubscriptionPlanId;
  name: string;
  description?: string;
  pricePerMonth: number; // in cents or the smallest currency unit (e.g., 0 for free)
  currency?: string; // e.g. 'USD'
  billingCycleOptions?: BillingCycle[];
  features: string[];
  recommended?: boolean;
};

export type Subscription = {
  id: string;
  userId?: string; // optional for anonymous or pending subscriptions
  planId: SubscriptionPlanId;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'pending';
  startedAt: Date;
  nextBillingAt?: Date;
  billingCycle: BillingCycle;
};
