import { useState } from 'react';
import toast from 'react-hot-toast';
import { CertificateRequest, Course } from '../types';
import { MOCK_CERTIFICATE_REQUESTS } from '../data/mockCertificates';

/**
 * useCertificateState
 * - certificateRequests: list of certificate records
 * - issueCertificateImmediately(course): creates a certificate with status 'Issued' and returns it
 * - other helpers retained for backward compatibility
 */

export const useCertificateState = () => {
  const [certificateRequests, setCertificateRequests] = useState<CertificateRequest[]>(MOCK_CERTIFICATE_REQUESTS || []);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  const openCertificateModal = () => setIsCertificateModalOpen(true);
  const closeCertificateModal = () => setIsCertificateModalOpen(false);

  // Add a pending certificate request (keeps old flow)
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
    setCertificateRequests(prev =>
      prev.map(req => req.id === id ? { ...req, status: 'Issued' } : req)
    );
    toast.success("Certificate status updated to 'Issued'.");
  };

  /**
   * issueCertificateImmediately
   * - Creates a certificate record with status 'Issued'
   * - Generates a (fake) downloadUrl (you should replace with your real storage link)
   * - Returns the created certificate object
   */
  const issueCertificateImmediately = (course: Course) => {
    const newCert: CertificateRequest = {
      id: Date.now(),
      course_id: (course as any).id ?? Math.floor(Math.random()*1000000),
      student_name: (course as any).studentName ?? 'Valued Student', // if you track student
      course_title: course.title,
      issued_at: new Date().toISOString(),
      status: 'Issued',
      downloadUrl: `/certificates/${(course as any).id ?? 'cert-' + Date.now()}.pdf`,
    } as unknown as CertificateRequest;

    setCertificateRequests(prev => [newCert, ...prev]);

    toast.success('Certificate generated and issued.');

    return newCert;
  };

  return {
    certificateRequests,
    isCertificateModalOpen,
    openCertificateModal,
    closeCertificateModal,
    handleCertificateRequestSubmit,
    addCertificateRequest,
    handleIssueCertificate,
    issueCertificateImmediately, // <-- new API
  };
};
