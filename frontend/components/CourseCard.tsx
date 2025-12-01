
import React from 'react';
import { Course } from '../types';
import { formatDuration } from '../utils/formatDuration';
import { isExamStarted } from '../utils/examStarted';

interface CourseCardProps {
  course: Course;
  onStartExam: (course: Course) => void;
  onViewCourse: (course: Course) => void;
  onRequestCertificate: (course: Course) => void;
  examStarted?: boolean;
  // Optional: allow parent to enable download button when certificate is available
  canDownload?: boolean;
  onDownload?: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onStartExam, onViewCourse, onRequestCertificate, canDownload, onDownload, examStarted }) => {
  const started = examStarted || isExamStarted(String(course.id));
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover" />
      <div onClick={() => onViewCourse(course)} className="p-6 flex flex-col flex-grow cursor-pointer group">
        <h3 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
        <p className="text-sm text-secondary mb-4">By {course.author}</p>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{course.description}</p>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
          </div>
        </div>
         <p className="text-sm text-gray-500 mb-4">Time Spent: {formatDuration(course.durationMinutes)}</p>
      </div>
      <div className="px-6 pb-6 pt-0 space-y-2">
          {!started && (
            <button
                onClick={() => onStartExam(course)}
                disabled={course.progress < 100}
                className="w-full bg-success hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {course.progress < 100 ? `Complete Course to Unlock Exam` : `Take Final Exam`}
            </button>
          )}
             <div className="flex gap-2">
              <button
                onClick={() => onRequestCertificate(course)}
                disabled={course.progress < 100}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                Request Certificate
              </button>
              <button
                onClick={() => onDownload && onDownload(course)}
                disabled={!canDownload}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${canDownload ? 'bg-gray-100 text-gray-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Download
              </button>
             </div>
      </div>
    </div>
  );
}
  
export default CourseCard;
