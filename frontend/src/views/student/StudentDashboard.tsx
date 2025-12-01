
import React, { useEffect } from 'react';
import AdminReturnBanner from '../../components/AdminReturnBanner';
import { Course, CertificateRequest } from '../../types';
import StudentNavBar from './StudentNavBar';
import StudentHome from './subpages/StudentHome';
import YourCourses from './subpages/YourCourses';
import Certificates from './subpages/Certificates';
import Profile from './subpages/Profile';

// Updated View Type: Removed 'allCourses'
export type StudentView = 'dashboard' | 'yourCourses' | 'certificates' | 'profile';

interface StudentDashboardProps {
    activeRole: 'student' | 'admin';
    onSwitchView: () => void;
    studentView: StudentView;
    setStudentView: (view: StudentView) => void;
    handleLogout: () => void;
    enrolledCourses: Course[];
    certificateRequests: CertificateRequest[];
    handleStartExam: (course: Course) => void;
    handleViewCourse: (course: Course) => void;
    handleOpenCertificateModal: (course: Course) => void;
    onAddCertificateRequest: (data: Omit<CertificateRequest, 'id' | 'status'>) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = (props) => {
    
    // Set default view to dashboard if currently on a subpage that might confuse initial load
    useEffect(() => {
        if (props.studentView === 'yourCourses' && props.activeRole === 'student') {
             // Optional: Force dashboard on first load if preferred
        }
    }, []);

    const renderStudentContentView = () => {
      switch (props.studentView) {
          case 'dashboard':
              return <StudentHome 
                        enrolledCourses={props.enrolledCourses} 
                        onStartExam={props.handleStartExam} 
                        setActiveView={props.setStudentView}
                    />;
          case 'yourCourses':
              return <YourCourses 
                        enrolledCourses={props.enrolledCourses}
                        onStartExam={props.handleStartExam}
                        onViewCourse={props.handleViewCourse}
                        onRequestCertificate={props.handleOpenCertificateModal}
                    />;
          case 'certificates':
              return <Certificates 
                        certificateRequests={props.certificateRequests} 
                        onAddCertificateRequest={props.onAddCertificateRequest}
                        onStartExam={props.handleStartExam}
                        setStudentView={props.setStudentView}
                     />;
          case 'profile':
              return <Profile enrolledCourses={props.enrolledCourses} />;
          default:
              return <StudentHome 
                        enrolledCourses={props.enrolledCourses} 
                        onStartExam={props.handleStartExam}
                        setActiveView={props.setStudentView}
                    />;
      }
    };
    
    return (
      <div className="flex bg-[#F8F8FA] min-h-screen font-sans">
        {/* Sidebar Navigation */}
        <StudentNavBar 
            activeView={props.studentView}
            setActiveView={props.setStudentView} 
            onLogout={props.handleLogout}
        />

        {/* Main Content Area */}
        <div className="flex-1 ml-64 flex flex-col">
             {/* Header Area for Buttons - Full width to allow corner positioning */}
             <div className="flex justify-end px-8 py-4 bg-transparent">
                 <button 
                    onClick={props.handleLogout}
                    className="flex items-center gap-2 text-gray-600 hover:text-rose-600 font-medium transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 hover:border-rose-100"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    Back to Landing Page
                 </button>
             </div>

             {props.activeRole === 'admin' && <AdminReturnBanner onReturn={props.onSwitchView} />}
             
             {/* Dynamic Content Container */}
             <div className="px-8 pb-8 max-w-7xl mx-auto w-full">
                  {renderStudentContentView()}
             </div>
        </div>
      </div>
    );
};

export default StudentDashboard;
