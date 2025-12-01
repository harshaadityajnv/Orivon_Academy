
import React from 'react';

interface RoleSelectionModalProps {
    onSelectRole: (role: 'student' | 'admin') => void;
    onClose: () => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ onSelectRole, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in-up">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm text-center p-8 relative">
            <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-2xl font-bold text-dark mb-6">Select Your Role</h2>
            <div className="flex flex-col space-y-4">
                <button
                    onClick={() => onSelectRole('student')}
                    className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                >
                    Login as Student
                </button>
                <button
                    onClick={() => onSelectRole('admin')}
                    className="bg-secondary hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                >
                    Login as Admin
                </button>
            </div>
        </div>
    </div>
);

export default RoleSelectionModal;
