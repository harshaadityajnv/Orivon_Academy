
import React from 'react';
import { CourseTrack } from '../types';

interface CourseTrackCardProps {
    course: CourseTrack;
    onBuyCourse: (course: CourseTrack) => void;
    isEnrolled: boolean;
}

const CourseTrackCard: React.FC<CourseTrackCardProps> = ({ course, onBuyCourse, isEnrolled }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <img src={course.img} alt={course.title} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
        <p className="text-sm text-slate-700 mb-2">{course.badge}</p>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{course.desc}</p>
        <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-2xl font-bold text-dark">₹{course.price}</span>
            {course.originalPrice && (
                <span className="text-md text-gray-500 line-through">₹{course.originalPrice}</span>
            )}
        </div>
      </div>
      <div className="px-6 pb-6 pt-0">
          <button
              onClick={() => onBuyCourse(course)}
              disabled={isEnrolled}
              className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
              {isEnrolled ? 'Already Enrolled' : 'Buy Now'}
          </button>
      </div>
    </div>
  );

export default CourseTrackCard;
