
import React from 'react';
import StudentDashboard from '../pages/student/StudentDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import { StudentView } from '../pages/student/StudentDashboard';
import { AdminView } from '../pages/admin/AdminDashboard';
import { Course, CertificateRequest, CourseTrack } from '../types';

interface DashboardViewProps {
    viewingAs: 'student' | 'admin';
    activeRole: 'student' | 'admin';
    onSwitchView: () => void;
    studentView: StudentView;
    setStudentView: (view: StudentView) => void;
    adminView: AdminView;
    setAdminView: (view: AdminView) => void;
    handleLogout: () => void;
    enrolledCourses: Course[];
    catalogCourses: CourseTrack[];
    certificateRequests: CertificateRequest[];
    handleStartExam: (course: Course) => void;
    handleViewCourse: (course: Course) => void;
    handleOpenCertificateModal: (course: Course) => void;
    onIssueCertificate: (id: number) => void;
    onAddCourse: () => void;
    onEditCourse: (course: CourseTrack) => void;
    onDeleteCourse: (title: string) => void;
    onAddCertificateRequest: (data: Omit<CertificateRequest, 'id' | 'status'>) => void;
}

const DashboardView: React.FC<DashboardViewProps> = (props) => {
    if (props.viewingAs === 'student') {
            return (
            <StudentDashboard 
                activeRole={props.activeRole}
                onSwitchView={props.onSwitchView}
                studentView={props.studentView}
                setStudentView={props.setStudentView}
                handleLogout={props.handleLogout}
                enrolledCourses={props.enrolledCourses}
                catalogCourses={props.catalogCourses}
                certificateRequests={props.certificateRequests}
                handleStartExam={props.handleStartExam}
                handleViewCourse={props.handleViewCourse}
                handleOpenCertificateModal={props.handleOpenCertificateModal}
                onAddCertificateRequest={props.onAddCertificateRequest}
            />
        );
    }
  
    if (props.viewingAs === 'admin') {
        return <AdminDashboard
            onSwitchView={props.onSwitchView} 
            certificateRequests={props.certificateRequests} 
            onIssueCertificate={props.onIssueCertificate} 
            onBackToLanding={props.handleLogout} 
            activeView={props.adminView}
            setActiveView={props.setAdminView}
        />;
    }
  
    return null;
};

export default DashboardView;
