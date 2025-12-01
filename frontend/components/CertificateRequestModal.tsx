
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Course, CertificateRequest } from '../types';

interface CertificateRequestModalProps {
    course: Course | null;
    onClose: () => void;
    onSubmit: (data: Omit<CertificateRequest, 'id' | 'status'>) => void;
}

const CertificateRequestModal: React.FC<CertificateRequestModalProps> = ({ course, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        studentName: 'Valued Student',
        email: '',
        enrollmentId: '',
        startDate: '',
        endDate: '',
    });

    if (!course) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { studentName, email, enrollmentId, startDate, endDate } = formData;
        if (!studentName || !enrollmentId || !startDate || !endDate || !email) {
            toast.error("Please fill out all fields.");
            return;
        }
        onSubmit({
            studentName,
            email,
            enrollmentId,
            courseName: course.title,
            duration: `${startDate} to ${endDate}`,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg animate-fade-in-up">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-dark">Request Certificate of Completion</h2>
                    <p className="text-secondary">Please fill in your details for the course: <span className="font-semibold">{course.title}</span></p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" id="studentName" name="studentName" value={formData.studentName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Mail ID</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" placeholder="your.email@example.com" required />
                    </div>
                    <div>
                        <label htmlFor="enrollmentId" className="block text-sm font-medium text-gray-700 mb-1">Enrollment ID</label>
                        <input type="text" id="enrollmentId" name="enrollmentId" value={formData.enrollmentId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" placeholder="e.g., E12345" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course Duration</label>
                        <div className="flex items-center gap-4">
                            <input type="month" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required />
                            <span className="text-gray-500">to</span>
                            <input type="month" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required />
                        </div>
                    </div>
                     <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-secondary hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Submit Request</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CertificateRequestModal;
