import React from 'react';
import { CertificateRequest } from '../../../types';

const CertificateRequestsTable: React.FC<{ requests: CertificateRequest[]; onIssue: (id: number) => void; }> = ({ requests, onIssue }) => (
    <div className="overflow-x-auto rounded-lg border border-rose-200">
        <table className="w-full text-sm text-left text-gray-900">
            <thead className="text-xs text-rose-900 uppercase bg-rose-100">
                <tr>
                    <th scope="col" className="px-4 py-3">Student Name</th>
                    <th scope="col" className="px-4 py-3">Mail ID</th>
                    <th scope="col" className="px-4 py-3">Enrollment ID</th>
                    <th scope="col" className="px-4 py-3">Course</th>
                    <th scope="col" className="px-4 py-3">Duration</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3">Action</th>
                </tr>
            </thead>
            <tbody>
                {requests.map((req, index) => (
                    <tr key={req.id} className={`hover:bg-rose-50 ${index < requests.length -1 ? 'border-b border-rose-100' : ''}`}>
                        <td className="px-4 py-4 font-medium whitespace-nowrap">{req.studentName}</td>
                        <td className="px-4 py-4">{req.email}</td>
                        <td className="px-4 py-4">{req.enrollmentId}</td>
                        <td className="px-4 py-4">{req.courseName}</td>
                        <td className="px-4 py-4">{req.duration}</td>
                        <td className="px-4 py-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                req.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                            }`}>
                                {req.status}
                            </span>
                        </td>
                        <td className="px-4 py-4">
                            {req.status === 'Pending' ? (
                                <button onClick={() => onIssue(req.id)} className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1 px-3 rounded-lg">
                                    Issue Certificate
                                </button>
                            ) : (
                                <span className="text-gray-500 text-xs">Completed</span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


interface CertificateRequestsProps {
    requests: CertificateRequest[];
    onIssue: (id: number) => void;
}

const CertificateRequests: React.FC<CertificateRequestsProps> = ({ requests, onIssue }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
               <h3 className="text-xl font-bold text-gray-900 ml-3">Certificate Requests</h3>
           </div>
           <CertificateRequestsTable requests={requests} onIssue={onIssue} />
        </div>
    );
}

export default CertificateRequests;