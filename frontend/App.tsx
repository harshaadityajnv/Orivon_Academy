
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

import LandingPage from './components/LandingPage';
import Header from './components/Header';
import RoleSelectionModal from './components/modals/RoleSelectionModal';
import CertificateRequestModal from './components/CertificateRequestModal';
import CourseModal from './components/modals/CourseModal';
import DashboardView from './views/DashboardView';
import ExamFlowView from './views/ExamFlowView';
import DownloadLatestChanges from './components/DownloadLatestChanges';
import GoogleAuthPage from './views/GoogleAuthPage';

import { useAuthState } from './state/useAuthState';
import { useCourseState } from './state/useCourseState';
import { useCertificateState } from './state/useCertificateState';
import { useViewNavigation } from './views/useViewNavigation';

import { Course, CourseTrack } from './types';

const App: React.FC = () => {
  const {
    activeRole, viewingAs, isRoleModalOpen, handleLogin, handleLogout, handleSwitchView, handleLoginRequest, closeRoleModal
  } = useAuthState();

  const {
    enrolledCourses, setEnrolledCourses, catalogCourses, isCourseModalOpen, editingCourse,
    handleDeleteCourse, openAddCourseModal, openEditCourseModal, closeCourseModal, handleSaveCourse, addEnrolledCourses
  } = useCourseState();

  const {
    certificateRequests, isCertificateModalOpen, openCertificateModal, closeCertificateModal,
    handleCertificateRequestSubmit, addCertificateRequest, handleIssueCertificate
  } = useCertificateState();

  const {
    view, setView, studentView, setStudentView, adminView, setAdminView, analyticsData, selectedCourse,
    handleStartExam, handleViewCourse, handleReturnFromCourse, handleBackToDashboard, handleExamComplete,
    setSelectedCourse
  } = useViewNavigation();
  
  const onLoginRequest = () => handleLoginRequest();
  const goToAuthPage = () => setView('googleAuth');

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Toaster position="top-right" />
      <DownloadLatestChanges />

      {view === 'landing' && (
        <>
           {!activeRole && <LandingPage 
              onLoginRequest={onLoginRequest} 
              courses={catalogCourses} 
              onSeeAllCourses={onLoginRequest}
              activeRole={activeRole}
              onGoToDashboard={() => {
                  if (activeRole === 'student') setStudentView('dashboard');
                  else if (activeRole === 'admin') setAdminView('analytics');
              }}
           />}
           {activeRole && (
             <>
               <Header />
               <DashboardView 
                  viewingAs={viewingAs || 'student'}
                  activeRole={activeRole}
                  onSwitchView={handleSwitchView}
                  studentView={studentView}
                  setStudentView={setStudentView}
                  adminView={adminView}
                  setAdminView={setAdminView}
                  handleLogout={() => handleLogout(setView)}
                  enrolledCourses={enrolledCourses}
                  catalogCourses={catalogCourses}
                  certificateRequests={certificateRequests}
                  handleStartExam={handleStartExam}
                  handleViewCourse={handleViewCourse}
                  handleOpenCertificateModal={(c) => openCertificateModal()}
                  onIssueCertificate={handleIssueCertificate}
                  onAddCourse={openAddCourseModal}
                  onEditCourse={openEditCourseModal}
                  onDeleteCourse={handleDeleteCourse}
                  onAddCertificateRequest={addCertificateRequest}
               />
             </>
           )}
        </>
      )}

      {view !== 'landing' && (
        <>
          {view === 'googleAuth' ? (
            <GoogleAuthPage onComplete={(role) => handleLogin(role, setStudentView, setAdminView, setView)} onCancel={() => setView('landing')} />
          ) : (
            <ExamFlowView 
               view={view as any}
               selectedCourse={selectedCourse}
               analyticsData={analyticsData}
               onReturnFromCourse={(time) => handleReturnFromCourse(time, setEnrolledCourses)}
               onStartExam={handleStartExam}
               onExamComplete={handleExamComplete}
               onBackToDashboard={handleBackToDashboard}
               onRequestCertificate={() => openCertificateModal()}
            />
          )}
        </>
      )}

      {isRoleModalOpen && (
        <RoleSelectionModal 
           onSelectRole={(role) => handleLogin(role, setStudentView, setAdminView, setView)} 
           onClose={closeRoleModal} 
        />
      )}

      {isCourseModalOpen && (
        <CourseModal 
           course={editingCourse} 
           onClose={closeCourseModal} 
           onSave={handleSaveCourse} 
        />
      )}

      {isCertificateModalOpen && selectedCourse && (
          <CertificateRequestModal 
            course={selectedCourse}
            onClose={closeCertificateModal}
            onSubmit={handleCertificateRequestSubmit}
          />
      )}

    </div>
  );
};

export default App;
