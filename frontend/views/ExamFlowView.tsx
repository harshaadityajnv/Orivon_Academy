import React from 'react';
import CourseDetailView from '../pages/CourseDetailView';
import ProctoringDashboard from '../components/ProctoringDashboard';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import CertificateView from '../components/CertificateView';
import { Course, AnalyticsData } from '../types';

interface ExamFlowViewProps {
    view: 'courseDetail' | 'exam' | 'analytics' | 'certificate';
    selectedCourse: Course | null;
    analyticsData: AnalyticsData | null;
    onReturnFromCourse: (timeSpentMinutes: number) => void;
    onStartExam: (course: Course) => void;
    onExamComplete: (data: Omit<AnalyticsData, 'course'>) => void;
    onBackToDashboard: () => void;
    onRequestCertificate: (course: Course) => void;
}

const ExamFlowView: React.FC<ExamFlowViewProps> = (props) => {
    switch (props.view) {
        case 'courseDetail':
            return <CourseDetailView course={props.selectedCourse!} onBack={props.onReturnFromCourse} onStartExam={props.onStartExam} />;
        case 'exam':
            return <ProctoringDashboard selectedCourse={props.selectedCourse} onExamComplete={props.onExamComplete} onBackToDashboard={props.onBackToDashboard} />;
        case 'analytics':
            return <AnalyticsDashboard data={props.analyticsData!} onRequestCertificate={props.onRequestCertificate} onBackToDashboard={props.onBackToDashboard} />;
        case 'certificate':
            return <CertificateView data={props.analyticsData!} onBack={props.onBackToDashboard} />;
        default:
            return null;
    }
};

export default ExamFlowView;
