
import React, { useRef } from 'react';
import { Course } from '../types';

interface CourseDetailViewProps {
    course: Course;
    onBack: (timeSpentMinutes: number) => void;
    onStartExam: (course: Course) => void;
}

const CourseDetailView: React.FC<CourseDetailViewProps> = ({ course, onBack, onStartExam }) => {
    const startTimeRef = useRef(Date.now());

    const handleBack = () => {
        const timeSpentMs = Date.now() - startTimeRef.current;
        const timeSpentMinutes = timeSpentMs / (1000 * 60);
        onBack(timeSpentMinutes);
    };

    const courseModules = [
        "Module 1: Getting Started with React",
        "Module 2: Understanding Components and Props",
        "Module 3: State and Lifecycle",
        "Module 4: Handling Events",
        "Module 5: Advanced Hooks (useEffect, useContext)",
        "Module 6: Performance Optimization",
        "Module 7: Final Project Setup"
    ];

    return (
        <div className="container mx-auto">
             <button onClick={handleBack} className="mb-6 inline-flex items-center text-primary hover:underline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-dark mb-2">{course.title}</h2>
                    <p className="text-md text-secondary mb-6">By {course.author}</p>
                    <p className="text-gray-700 mb-8">{course.description}</p>
                    <h3 className="text-2xl font-semibold text-dark mb-4 border-t pt-6">Course Content</h3>
                    <ul className="space-y-3">
                        {courseModules.map((module, index) => (
                             <li key={index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="text-gray-800 font-medium">{module}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="lg:col-span-1">
                     <div className="bg-white p-6 rounded-lg shadow-lg sticky top-28">
                         <h3 className="text-xl font-bold text-dark mb-4">Your Progress</h3>
                         <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Overall Completion</span>
                            <span>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div className="bg-primary h-4 rounded-full text-white flex items-center justify-center text-xs" style={{ width: `${course.progress}%` }}>
                                    {course.progress}%
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">Keep up the great work!</p>
                        <button
                            onClick={() => onStartExam(course)}
                            disabled={course.progress < 100}
                            className="w-full mt-auto bg-success hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                            {course.progress < 100 ? `Complete Course to Unlock Exam` : `Take Final Exam`}
                        </button>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailView;
