// ProctoringDashboard.tsx (updated)
import React, { useState, useEffect } from 'react';
import { useProctoring } from '../hooks/useProctoring';
import WebcamFeed from './WebcamFeed';
import AlertsPanel from './AlertsPanel';
import Quiz from './questions';
import SystemCheck from './SystemCheck';
import { AnalyticsData, Alert, Course } from '../types';
import toast from 'react-hot-toast';
import { markExamStarted } from '../utils/examStarted';

interface ProctoringDashboardProps {
  onExamComplete: (data: Omit<AnalyticsData, 'course'>) => void;
  onBackToDashboard: () => void;
  /** Optional: called when exam is force-exited due to malpractice.
   * Parent should navigate user to My Certifications (or equivalent) when this is called.
   */
  onMalpracticeExit?: () => void;
  selectedCourse?: Course | null;
}

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

type Step = 'instructions' | 'system-check' | 'exam';

const WarningModal: React.FC<{ title: string; message: string; onClose: () => void }> = ({ title, message, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-slate-700 mb-4">{message}</p>
        <div className="text-right">
          <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded">OK</button>
        </div>
      </div>
    </div>
  );
};

const TerminatedModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[70] bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg text-center">
        <h3 className="text-xl font-bold text-red-600 mb-3">Exam terminated</h3>
        <p className="text-sm text-slate-700 mb-4">Your exam has been exited due to repeated malpractice detections. You have been redirected to My Certifications.</p>
        <div className="flex justify-center">
          <button onClick={onClose} className="px-5 py-2 bg-indigo-600 text-white rounded">Continue</button>
        </div>
      </div>
    </div>
  );
};

const ProctoringDashboard: React.FC<ProctoringDashboardProps> = ({ onExamComplete, onBackToDashboard, onMalpracticeExit, selectedCourse }) => {
  const [step, setStep] = useState<Step>('instructions');

  const {
    isProctoring,
    isLoading,
    alerts,
    videoRef,
    canvasRef,
    isCameraReady,
    startProctoring,
    stopProctoring,
    violationPoints,
    terminatedByMalpractice,
  } = useProctoring();

  // show the latest alert in a small modal popup
  const [latestPopup, setLatestPopup] = useState<Alert | null>(null);
  // show terminated modal when forced exit
  const [showTerminatedModal, setShowTerminatedModal] = useState(false);

  // show incoming alerts as popup (non-blocking toasts already appear)
  useEffect(() => {
    if (alerts && alerts.length > 0) {
      const newest = alerts[0];
      // ignore system-type end alerts
      if (newest.type !== 'system') {
        setLatestPopup(newest);
      }
    }
  }, [alerts]);

  // When terminatedByMalpractice flips true inside hook, show terminated modal & invoke parent
  useEffect(() => {
    if (terminatedByMalpractice) {
      // Stop proctoring and then handle parent navigation
      stopProctoring(() => {
        // show terminated modal
        setShowTerminatedModal(true);
        // if parent provided onMalpracticeExit, call it
        if (onMalpracticeExit) {
          try { onMalpracticeExit(); } catch (e) { console.error(e); }
        } else {
          // fallback: navigate back to dashboard
          onBackToDashboard();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminatedByMalpractice]);

  const handleQuizSubmit = (score: number, totalQuestions: number) => {
    // Persist that the exam was started/submitted (so Start button hides)
    try {
      if (selectedCourse && selectedCourse.id !== undefined && selectedCourse.id !== null) {
        markExamStarted(String(selectedCourse.id));
        // notify other parts of the app immediately
        try { window.dispatchEvent(new CustomEvent('examStarted', { detail: { courseId: selectedCourse.id } })); } catch (_) {}
      }
    } catch (e) {
      console.warn('Failed to mark exam started', e);
    }
    stopProctoring((finalAlerts: Alert[]) => {
      onExamComplete({
        score,
        totalQuestions, // forward actual quiz total
        alerts: finalAlerts,
      });
    });
  };

  const handleSystemCheckPassed = () => {
    setStep('exam');
    // start proctoring and pass malpractice exit handler
    startProctoring(() => {
      // This callback is executed when violation threshold exceeded.
      // We'll let the hook and component-level effect handle stop & modal.
      // You can also implement custom logging here if needed.
      // For safety, also call parent's onMalpracticeExit if provided
      if (onMalpracticeExit) {
        try { onMalpracticeExit(); } catch (e) { console.error(e); }
      } else {
        onBackToDashboard();
      }
    });
  };

  if (step === 'instructions') {
    return (
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-dark mb-4">Exam Proctoring Setup</h2>
        <p className="text-secondary mb-6">
          This exam requires live proctoring. Please ensure you are in a quiet, well-lit room with no one else present. Your webcam will be used to monitor the session for integrity.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-8 text-left">
          <p className="font-bold">Anti-Cheating Measures Active:</p>
          <ul className="list-disc list-inside text-sm mt-2">
               <li>Full-screen monitoring</li>
               <li>Copy/Paste disabled</li>
               <li>Right-click disabled</li>
               <li>Tab switching detected</li>
          </ul>
        </div>
        <div className="space-y-4">
            <button
                onClick={() => setStep('system-check')}
                className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 flex items-center justify-center"
            >
                Start System Check
            </button>
            <button
                onClick={onBackToDashboard}
                className="w-full bg-secondary hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
            >
                Return to Home
            </button>
        </div>
      </div>
    );
  }

  if (step === 'system-check') {
    return <SystemCheck onReady={handleSystemCheckPassed} />;
  }

  // Exam view
  if (!isProctoring && !isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
          <div className="text-center">
             <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
              <p>Initializing Exam Environment...</p>
          </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
      {/* Warning popup modal */}
      {latestPopup && (
        <WarningModal
          title={latestPopup.type.replace(/-/g, ' ').toUpperCase()}
          message={latestPopup.message}
          onClose={() => setLatestPopup(null)}
        />
      )}

      {/* Termination modal (blocks further interaction) */}
      {showTerminatedModal && (
        <TerminatedModal onClose={() => {
          setShowTerminatedModal(false);
          // After closing, route user via onBackToDashboard or onMalpracticeExit (parent should navigate to My Certifications)
          if (onMalpracticeExit) onMalpracticeExit();
          else onBackToDashboard();
        }} />
      )}

      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-2xl font-semibold">Final Exam</h3>
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded animate-pulse">● Live Proctored</span>
        </div>
        {/* Pass courseId and courseTitle from selectedCourse so the questions bank matches the course */}
        <Quiz courseId={selectedCourse?.id ?? 1} courseTitle={selectedCourse?.title} onSubmit={handleQuizSubmit} />
      </div>

      <div className="lg:col-span-1 space-y-6">
        <WebcamFeed videoRef={videoRef} isCameraReady={isCameraReady} />
        <AlertsPanel alerts={alerts} />
        <div className="rounded p-3 bg-white border text-sm">
          <div className="font-semibold mb-2">Violation points</div>
          <div className="flex items-center gap-3">
            <div className="text-xl font-bold">{violationPoints}</div>
            <div className="text-xs text-slate-500">/ 5 — exam will be exited if exceeded</div>
          </div>
          <div className="text-xs text-slate-400 mt-2">Repeated warnings will automatically end the exam.</div>
        </div>
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
};

export default ProctoringDashboard;
