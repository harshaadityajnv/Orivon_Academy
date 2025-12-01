import React from 'react';
import { AnalyticsData } from '../types';

interface CertificateViewProps {
  data: AnalyticsData;
  onBack: () => void;
}

const CertificateView: React.FC<CertificateViewProps> = ({ data, onBack }) => {
  // If the parent provides a certificate download URL via analyticsData (optional), use it
  // Fallback: build a generic download link
  const downloadUrl = (data as any)?.certificateDownloadUrl || `/certificates/${data.course?.id ?? 'certificate'}.pdf`;

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-blue-800 mb-4">Certificate of Completion</h2>
      <p className="text-lg text-gray-600 mb-2">This certifies that</p>
      <p className="text-3xl font-semibold text-dark mb-4">Valued Student</p>
      <p className="text-lg text-gray-600 mb-2">has successfully completed the course</p>
      <p className="text-2xl font-medium text-primary mb-8">{data.course.title}</p>
      <p className="text-md text-gray-500">Issued on {new Date().toLocaleDateString()}</p>

      <div className="mt-10 flex justify-center gap-4">
        <a
          href={downloadUrl}
          download
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg"
        >
          Download Certificate
        </a>

        <button onClick={onBack} className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CertificateView;
