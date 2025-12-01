
import React from 'react';
import { CourseTrack } from '../../../types';

interface CourseManagementProps {
    courses: CourseTrack[];
    onAddCourse: () => void;
    onEditCourse: (course: CourseTrack) => void;
    onDeleteCourse: (title: string) => void;
}

const CourseManagement: React.FC<CourseManagementProps> = ({ courses, onAddCourse, onEditCourse, onDeleteCourse }) => {
    return (
        <div className="space-y-6">
           <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">Course Management</h3>
               <button onClick={onAddCourse} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                   Create Course
               </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {courses.map(course => (
                   <div key={course.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                       <div className="h-40 overflow-hidden relative">
                           <img src={course.img} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                           <div className="absolute top-3 left-3">
                               <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-gray-800 shadow-sm">
                                   {course.badge}
                               </span>
                           </div>
                       </div>
                       <div className="p-5 flex flex-col flex-grow">
                           <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">{course.title}</h4>
                           <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{course.desc}</p>
                           <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                               <span className="font-bold text-gray-800">₹{course.price}</span>
                               <div className="flex items-center gap-2">
                                   <button onClick={() => onEditCourse(course)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                   </button>
                                   <button onClick={() => onDeleteCourse(course.title)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                   </button>
                               </div>
                           </div>
                       </div>
                   </div>
               ))}
           </div>
        </div>
    );
}

export default CourseManagement;
