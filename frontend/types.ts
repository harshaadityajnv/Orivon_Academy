

export interface Alert {
  id: number;
  type: AlertType;
  message: string;
  timestamp: string;
}

export type AlertType = 'looking-away' | 'multiple-faces' | 'phone-detected' | 'tab-switch' | 'face-unclear' | 'no-face' | 'system';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  author: string;
  durationMinutes: number;
  progress: number; // percentage
  imageUrl: string;
}

export interface AnalyticsData {
  score: number;
  totalQuestions: number;
  alerts: Alert[];
  course: Course;
}

export interface CertificateRequest {
  id: number;
  studentName: string;
  email: string;
  enrollmentId: string;
  courseName: string;
  duration: string;
  status: 'Pending' | 'Issued';
}

export type CourseTrack = {
  title: string;
  badge: string;
  desc: string;
  img: string;
  price: number;
  originalPrice?: number;
};

export interface Purchase {
    id: string;
    studentName: string;
    courseTitle: string;
    amount: number;
    date: string;
    status: 'Success' | 'Failed' | 'Refunded';
}

export interface ExamAttempt {
    id: string;
    studentName: string;
    examTitle: string;
    date: string;
    score: number;
    status: 'Pass' | 'Fail' | 'Under Review';
    flags: number;
}

export interface Certification {
    id: string;
    title: string;
    level: string;
    price: number;
    duration: number; // in minutes
    tags: string[];
    skills: string[];
    syllabus: string[];
    description: string;
    active: boolean;
    questionsCount: number;
}
