import React, { useEffect, useState } from 'react';
import { AdminView } from './AdminDashboard';

interface AdminNavBarProps {
    activeView: AdminView;
    setActiveView: (view: AdminView) => void;
    onLogout?: () => void;
}

const AdminNavBar: React.FC<AdminNavBarProps> = ({ activeView, setActiveView, onLogout }) => {
    const navItems = [
        { id: 'analytics', label: 'Overview', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        )},
        { id: 'userManagement', label: 'Users', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        )},
        { id: 'certifications', label: 'Certifications', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )},
        { id: 'purchases', label: 'Transactions', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
        )},
        { id: 'attempts', label: 'Exam Logs', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
        )},
    ] as const;

    const [displayName, setDisplayName] = useState('Administrator');
    const [email, setEmail] = useState('admin@orivon.com');
    const [initials, setInitials] = useState('AD');

    useEffect(() => {
        try {
            const raw = localStorage.getItem('user');
            if (raw) {
                const u = JSON.parse(raw);
                const name = u?.name || u?.displayName || 'Administrator';
                const mail = u?.email || 'admin@orivon.com';
                setDisplayName(name);
                setEmail(mail);
                const parts = name.split(' ').filter(Boolean);
                const initials = parts.length === 1 ? parts[0].slice(0,2) : (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
                setInitials(initials.toUpperCase());
            }
        } catch (e) {
            // ignore
        }
    }, []);

    return (
        <div className="w-64 h-screen bg-[#1F1D2B] text-gray-400 flex flex-col fixed left-0 top-0 z-30 shadow-2xl">
            {/* Brand / Logo Area */}
            <div className="p-8 flex items-center gap-3">
                 <img src="./logo.png" alt="Orivon" className="h-10 w-10 rounded-xl object-cover shadow-lg" />
                  <h1 className="text-xl font-bold text-white tracking-wide">Orivon<span className="text-rose-500">.Admin</span></h1>
             </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id as any)}
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
                <div className="flex items-center gap-3 p-3 bg-[#252836] rounded-xl border border-gray-700/50 hover:bg-[#2d3142] transition-colors cursor-pointer group">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-transparent group-hover:ring-rose-500/50 transition-all">
                        {initials}
                    </div>
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

export default AdminNavBar;
