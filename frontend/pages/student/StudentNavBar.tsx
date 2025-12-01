import React, { useEffect, useState } from 'react';
import { StudentView } from './StudentDashboard';

interface StudentNavBarProps {
    activeView: StudentView;
    setActiveView: (view: StudentView) => void;
    onLogout: () => void;
}

const StudentNavBar: React.FC<StudentNavBarProps> = ({ activeView, setActiveView, onLogout }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        )},
        { id: 'yourCourses', label: 'My Certifications', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        )},
        { id: 'certificates', label: 'Certifications', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )},
        // { id: 'profile', label: 'Profile', icon: (
        //     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        //     </svg>
        // )},
    ] as const;

    const [displayName, setDisplayName] = useState('Valued Student');
    const [email, setEmail] = useState('student@orivon.com');
    const [initials, setInitials] = useState('VS');

    useEffect(() => {
        try {
            const raw = localStorage.getItem('user');
            if (raw) {
                const u = JSON.parse(raw);
                const name = u?.name || u?.displayName || 'Valued Student';
                const mail = u?.email || 'student@orivon.com';
                setDisplayName(name);
                setEmail(mail);
                const parts = name.split(' ').filter(Boolean);
                const initials = parts.length === 1 ? parts[0].slice(0,2) : (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
                setInitials(initials.toUpperCase());
            }
        } catch (e) {
            // ignore parse errors
        }
    }, []);

    return (
        <div className="w-64 h-screen bg-[#1F1D2B] text-gray-400 flex flex-col fixed left-0 top-0 z-30 shadow-2xl">
            {/* Brand / Logo Area */}
            <div className="p-8 flex items-center gap-3">
                 <img src="./logo.png" alt="Orivon" className="h-10 w-10 rounded-xl object-cover shadow-lg" />
                  <h1 className="text-xl font-bold text-white tracking-wide">Orivon Academy</h1>
             </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id as StudentView)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                            activeView === item.id 
                            ? 'bg-[#252836] text-rose-500 shadow-md' 
                            : 'hover:bg-[#252836] hover:text-white'
                        }`}
                    >
                        <span className={`p-1 rounded-lg transition-colors ${activeView === item.id ? 'bg-rose-500/10' : 'group-hover:bg-white/5'}`}>
                             {item.icon}
                        </span>
                        <span className="font-medium text-sm">{item.label}</span>
                        
                         {activeView === item.id && (
                             <div className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
                         )}
                    </button>
                ))}
            </nav>

             {/* User Profile Summary */}
             <div className="px-4 mt-auto mb-2">
                <div className="flex items-center gap-3 p-3 bg-[#252836] rounded-xl border border-gray-700/50 hover:bg-[#2d3142] transition-colors cursor-pointer group" >
                    {/* <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-transparent group-hover:ring-rose-500/50 transition-all">
                        {initials}
                    </div> */}
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate group-hover:text-rose-200 transition-colors">{displayName}</p>
                        <p className="text-xs text-gray-400 truncate">{email}</p>
                    </div>
                </div>
            </div>

            {/* Logout Section */}
            <div className="p-4 pt-2 border-t border-gray-800">
                <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
                >
                     <span className="p-1 rounded-lg group-hover:bg-red-500/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                     </span>
                    <span className="font-medium text-sm">Log Out</span>
                </button>
            </div>
        </div>
    );
};

export default StudentNavBar;