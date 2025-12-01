
import React from 'react';
import { CertificateRequest } from '../../types';
import AdminNavBar from './AdminNavBar';
import UserManagement from './subpages/UserManagement';
import Certifications from './subpages/Certifications';
import AdminAnalytics from './subpages/AdminAnalytics';
import Purchases from './subpages/Purchases';
import Attempts from './subpages/Attempts';

export type AdminView = 'analytics' | 'userManagement' | 'certifications' | 'purchases' | 'attempts';

interface AdminDashboardProps {
    onSwitchView: () => void;
    certificateRequests: CertificateRequest[];
    onIssueCertificate: (id: number) => void;
    onBackToLanding: () => void;
    activeView: AdminView;
    setActiveView: (view: AdminView) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    onSwitchView, 
    certificateRequests, 
    onIssueCertificate, 
    onBackToLanding, 
    activeView,
    setActiveView,
}) => {
    const renderAdminContentView = () => {
        switch (activeView) {
            case 'analytics':
                return <AdminAnalytics />;
            case 'userManagement':
                return <UserManagement />;
            case 'certifications':
                return <Certifications />; 
            case 'purchases':
                return <Purchases />;
            case 'attempts':
                return <Attempts />;
            default:
                return <AdminAnalytics />;
        }
    };
    
    return (
        <div className="flex bg-[#F8F8FA] min-h-screen font-sans">
            {/* Sidebar */}
            <AdminNavBar activeView={activeView} setActiveView={setActiveView} onLogout={onBackToLanding} />

            {/* Main Content */}
            <div className="flex-1 ml-64 p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
                        <p className="text-gray-500 mt-1">Overview of system performance and management.</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={onBackToLanding}
                            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-xl shadow-sm transition-all flex items-center gap-2"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            Back to Landing Page
                        </button>
                        <button 
                            onClick={onSwitchView} 
                            className="bg-white border border-gray-200 hover:bg-gray-50 text-indigo-600 font-semibold py-2 px-4 rounded-xl shadow-sm transition-all flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" />
                            </svg>
                            Switch to Student View
                        </button>
                    </div>
                </div>
                
                {renderAdminContentView()}
            </div>
        </div>
    );
};

export default AdminDashboard;
