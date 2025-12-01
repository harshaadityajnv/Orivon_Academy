import { Course } from '../types';

export const MOCK_COURSES_DATA: Course[] = [
  {
    id: 1,
    title: 'Advanced React and Web Technologies',
    author: 'Jane Doe',
    description: 'Master modern web development with advanced React patterns, hooks, and performance optimization techniques.',
    durationMinutes: 2520, // 42 hours
    progress: 100,
    imageUrl: `https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=60`,
  },
  {
    id: 2,
    title: 'Introduction to Machine Learning',
    author: 'John Smith',
    description: 'Learn the fundamentals of machine learning and build your first predictive models using Python and Scikit-learn.',
    durationMinutes: 4500, // 75 hours
    progress: 75,
    imageUrl: `https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=60`,
  }
];
