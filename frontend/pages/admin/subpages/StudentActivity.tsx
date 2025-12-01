import React from 'react';

const MOCK_STUDENT_ANALYTICS = [
    // { id: 1, name: 'Alex Johnson', course: 'Advanced React', loginTime: '09:01 AM', logoutTime: '11:34 AM', status: 'Offline' },
    // { id: 2, name: 'Brenda Smith', course: 'Machine Learning', loginTime: '09:05 AM', logoutTime: '-', status: 'Online' },
    // { id: 3, name: 'Charles Brown', course: 'Advanced React', loginTime: '09:15 AM', logoutTime: '10:55 AM', status: 'Offline' },
    // { id: 4, name: 'Diana Garcia', course: 'Machine Learning', loginTime: '09:20 AM', logoutTime: '-', status: 'Online' },
    // { id: 5, name: 'Ethan Miller', course: 'Advanced React', loginTime: '09:30 AM', logoutTime: '-', status: 'Online' },
];

const StudentAnalyticsTable: React.FC<{ onSwitchView: () => void; }> = ({ onSwitchView }) => (
    <div className="overflow-x-auto rounded-lg border border-rose-200">
        <table className="w-full text-sm text-left text-gray-900">
            <thead className="text-xs text-rose-900 uppercase bg-rose-100">
                <tr>
                    <th scope="col" className="px-4 py-3">Student Name</th>
                    {/* <th scope="col" className="px-4 py-3">Course</th>
                    <th scope="col" className="px-4 py-3">Login Time</th>
                    <th scope="col" className="px-4 py-3">Logout Time</th> */}
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3">Action</th>
                </tr>
            </thead>
            <tbody>
                {MOCK_STUDENT_ANALYTICS.map((student, index) => (
                    <tr key={student.id} className={`hover:bg-rose-50 ${index < MOCK_STUDENT_ANALYTICS.length -1 ? 'border-b border-rose-100' : ''}`}>
                        <td className="px-4 py-4 font-medium whitespace-nowrap">{student.name}</td>
                        <td className="px-4 py-4">{student.course}</td>
                        <td className="px-4 py-4">{student.loginTime}</td>
                        <td className="px-4 py-4">{student.logoutTime}</td>
                        <td className="px-4 py-4">
                            <div className="flex items-center">
                                <div className={`h-2.5 w-2.5 rounded-full mr-2 ${student.status === 'Online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                {student.status}
                            </div>
                        </td>
                        <td className="px-4 py-4">
                            <button onClick={onSwitchView} className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold py-1 px-3 rounded-lg flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" /></svg>
                                View Portal
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


interface StudentActivityProps {
    onSwitchView: () => void;
}

const StudentActivity: React.FC<StudentActivityProps> = ({ onSwitchView }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               <h3 className="text-xl font-bold text-gray-900 ml-3">Student Activity</h3>
           </div>
           <StudentAnalyticsTable onSwitchView={onSwitchView} />
        </div>
    );
}

export default StudentActivity;