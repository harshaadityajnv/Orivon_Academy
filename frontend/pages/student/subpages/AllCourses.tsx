
import React from 'react';
import { Course } from '../../../types';
import { CourseTrack } from '../../../types';
import CourseTrackCard from '../../../components/CourseTrackCard';

interface AllCoursesProps {
    catalogCourses: CourseTrack[];
    enrolledCourses: Course[];
    onBuyCourse: (course: CourseTrack) => void;
}

const AllCourses: React.FC<AllCoursesProps> = ({ catalogCourses, enrolledCourses, onBuyCourse }) => {
    const enrolledTitles = new Set(enrolledCourses.map(c => c.title));
    return (
        <div>
            <h3 className="text-2xl font-bold text-dark mb-6">All Available Certifications</h3>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {catalogCourses.map(course => (
                      <CourseTrackCard 
                          key={course.title} 
                          course={course} 
                          onBuyCourse={onBuyCourse} 
                          isEnrolled={enrolledTitles.has(course.title)} 
                      />
                 ))}
            </div>
        </div>
    );
}

export default AllCourses;
