
import React, { useEffect } from 'react';
import AdminReturnBanner from '../../components/AdminReturnBanner';
import { Course, CertificateRequest } from '../../types';
import { CourseTrack } from '../../types';
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
        <div className="flex-1 ml-64">
             {props.activeRole === 'admin' && <AdminReturnBanner onReturn={props.onSwitchView} />}
             
             {/* Dynamic Content Container */}
             <div className="p-8 max-w-7xl mx-auto">
                  {renderStudentContentView()}
             </div>
        </div>
      </div>
    );
};

export default StudentDashboard;