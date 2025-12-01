
import React from 'react';
import toast from 'react-hot-toast';

// Define the content of the modified files directly here to ensure they are captured in the download.

const filesToZip = {
  'pages/student/subpages/Certificates.tsx': `
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CertificateRequest, CourseTrack, Course } from '../../../types';
import { TRACKS } from '../../../data/tracks';

// --- Helper for Mock Data ---
const getExtendedDetails = (track: CourseTrack) => {
    // Detailed data logic...
    return {
        ...track,
        longDescription: \`This \${track.title} certification validates your expertise.\`,
        syllabus: [], 
        examDetails: { duration: "120 min", questions: "60", passingScore: "75%" },
        prerequisites: ["Basic knowledge"],
        careerRoles: ["Developer"],
        skills: ["React", "Cloud"]
    };
};

interface CertificationPaymentModalProps {
    track: CourseTrack;
    onClose: () => void;
    onPay: (details: { firstName: string; lastName: string; email: string; coupon: string }) => void;
}

const CertificationPaymentModal: React.FC<CertificationPaymentModalProps> = ({ track, onClose, onPay }) => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', coupon: '' });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPay(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 text-white animate-fade-in-up">
                <div className="p-6 border-b border-gray-700"><h2 className="text-xl font-bold">Confirm Registration</h2></div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                    <input className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                    <input className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">Cancel</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold">Pay Now</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface CertificatesProps {
    certificateRequests: CertificateRequest[];
    onAddCertificateRequest: (data: Omit<CertificateRequest, 'id' | 'status'>) => void;
    onStartExam: (course: Course) => void;
}

const Certificates: React.FC<CertificatesProps> = ({ certificateRequests, onAddCertificateRequest, onStartExam }) => {
    const [selectedTrack, setSelectedTrack] = useState<CourseTrack | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const handlePayment = (details: any) => {
        if (!selectedTrack) return;
        // Check for Razorpay
        if (!(window as any).Razorpay) {
            toast.error("Razorpay SDK not loaded.");
            return;
        }

        const options = {
            key: "rzp_test_ROER8sbtNhHp1n",
            amount: selectedTrack.price * 100,
            currency: "INR",
            name: "Orivon Academy",
            description: \`Exam Fee: \${selectedTrack.title}\`,
            handler: function (response: any) {
                setShowPaymentModal(false);
                onAddCertificateRequest({
                    studentName: \`\${details.firstName} \${details.lastName}\`,
                    email: details.email,
                    enrollmentId: \`CERT-\${response.razorpay_payment_id.slice(-6).toUpperCase()}\`,
                    courseName: selectedTrack.title,
                    duration: \`Started: \${new Date().toLocaleDateString()}\`
                });
                const courseForExam: Course = {
                    id: Date.now(),
                    title: selectedTrack.title,
                    description: selectedTrack.desc,
                    author: 'Orivon Academy',
                    durationMinutes: 120,
                    progress: 0,
                    imageUrl: selectedTrack.img,
                };
                onStartExam(courseForExam);
                toast.success("Payment Successful! Exam Unlocked.");
            },
            prefill: { name: "Student", email: details.email },
            theme: { color: "#e11d48" },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any){ toast.error(response.error.description); });
        rzp.open();
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Certifications</h2>
            <div className="grid md:grid-cols-3 gap-6">
                {TRACKS.map((track) => (
                    <div key={track.title} onClick={() => { setSelectedTrack(track); setShowPaymentModal(true); }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-lg">
                        <h3 className="text-xl font-bold">{track.title}</h3>
                        <p className="text-gray-500 text-sm mt-2">{track.desc}</p>
                        <button className="mt-4 text-rose-600 font-bold">Register Now &rarr;</button>
                    </div>
                ))}
            </div>
            {showPaymentModal && selectedTrack && (
                <CertificationPaymentModal track={selectedTrack} onClose={() => setShowPaymentModal(false)} onPay={handlePayment} />
            )}
        </div>
    );
};
export default Certificates;
`,
  'pages/admin/subpages/Certifications.tsx': `
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Certifications: React.FC = () => {
    const [grantEmail, setGrantEmail] = useState('');
    const inputClass = "w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400";
    
    return (
        <div className="space-y-8 pb-10">
            <div className="bg-rose-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-dark mb-4">Grant Certification Access</h3>
                <input type="email" placeholder="User Email" className={inputClass} value={grantEmail} onChange={e => setGrantEmail(e.target.value)} />
                <button className="mt-4 bg-rose-600 text-white font-bold py-2 px-6 rounded-md">Grant</button>
            </div>
             <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">Manage Certifications</h3>
                <p>Admin interface with dark-themed inputs for better visibility.</p>
            </div>
        </div>
    );
};
export default Certifications;
`,
  'state/useCertificateState.ts': `
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CertificateRequest } from '../types';
import { MOCK_CERTIFICATE_REQUESTS } from '../data/mockCertificates';

export const useCertificateState = () => {
    const [certificateRequests, setCertificateRequests] = useState<CertificateRequest[]>(MOCK_CERTIFICATE_REQUESTS);
    const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

    const openCertificateModal = () => setIsCertificateModalOpen(true);
    const closeCertificateModal = () => setIsCertificateModalOpen(false);
    
    const addCertificateRequest = (data: Omit<CertificateRequest, 'id' | 'status'>) => {
        const newRequest: CertificateRequest = {
            id: Date.now(),
            ...data,
            status: 'Pending',
        };
        setCertificateRequests(prev => [newRequest, ...prev]);
    };

    const handleCertificateRequestSubmit = (data: Omit<CertificateRequest, 'id' | 'status'>) => {
      addCertificateRequest(data);
      toast.success("Certificate request submitted successfully!");
      closeCertificateModal();
    };
    
    const handleIssueCertificate = (id: number) => {
        setCertificateRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Issued' } : req));
        toast.success("Certificate status updated.");
    };

    return {
        certificateRequests,
        isCertificateModalOpen,
        openCertificateModal,
        closeCertificateModal,
        handleCertificateRequestSubmit,
        addCertificateRequest,
        handleIssueCertificate
    };
};
`
};

const DownloadLatestChanges: React.FC = () => {
  const handleDownload = async () => {
        if (!(window as any).JSZip || !(window as any).saveAs) {
            toast.error('Download libraries not loaded. Please refresh.');
            return;
        }

    const zip = new (window as any).JSZip();
    
        // Add files to zip (skip any entries with empty path or content)
        Object.entries(filesToZip).forEach(([path, content]) => {
            if (!path || typeof path !== 'string' || !path.trim()) return;
            if (content === null || content === undefined) return;
            zip.file(path, content);
        });

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      (window as any).saveAs(content, 'orivon-lms-latest-changes.zip');
      toast.success('Downloaded latest changes!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create zip file.');
    }
  };

//   return (
//     <button
//       onClick={handleDownload}
//       className="fixed bottom-4 right-4 z-50 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-transform transform hover:scale-105"
//       title="Download Latest Code Changes"
//     >
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//       </svg>
//       <span className="font-bold text-sm">Download Updates</span>
//     </button>
//   );
};

export default DownloadLatestChanges;
