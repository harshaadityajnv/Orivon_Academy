
import { useState, useEffect } from 'react';
import { StudentView } from '../pages/student/StudentDashboard';
import { AdminView } from '../pages/admin/AdminDashboard';
import { View } from '../views/useViewNavigation';

export type Role = 'student' | 'admin';

export const useAuthState = () => {
    const [activeRole, setActiveRole] = useState<Role | null>(null);
    const [viewingAs, setViewingAs] = useState<Role | null>(null);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [postLoginAction, setPostLoginAction] = useState<'viewAllCourses' | null>(null);

    // Hydrate from localStorage if a user was already signed in from LandingPage
    useEffect(() => {
        try {
            const userJson = localStorage.getItem('user');
            if (userJson) {
                const user = JSON.parse(userJson) as any;
                const role = (user?.role || user?.Role || '').toLowerCase();
                if (role === 'admin' || role === 'student') {
                    setActiveRole(role as Role);
                    setViewingAs(role as Role);
                }
            }
        } catch (e) {
            // ignore parse errors
        }
    }, []);

    const handleLoginRequest = (action: 'viewAllCourses' | null = null) => {
        setPostLoginAction(action);
        setIsRoleModalOpen(true);
    };

    const closeRoleModal = () => {
        setIsRoleModalOpen(false);
        setPostLoginAction(null);
    };

    const handleLogin = (
        role: Role,
        setStudentView: (view: StudentView) => void,
        setAdminView: (view: AdminView) => void,
        setView: (view: View) => void
    ) => {
        setActiveRole(role);
        setViewingAs(role);

        // Updated default view to 'dashboard' (Home)
        setStudentView('dashboard');
        
        // Default admin view set to 'analytics' based on new structure
        setAdminView('analytics');

        if (postLoginAction === 'viewAllCourses') {
            if (role === 'student') setStudentView('dashboard');
            else if (role === 'admin') setAdminView('analytics');
        }
        
        setPostLoginAction(null);
        setIsRoleModalOpen(false);
        setView('landing');
    };

    const handleLogout = (setView: (view: View) => void) => {
        setActiveRole(null);
        setViewingAs(null);
        setView('landing');
    };
  
    const handleSwitchView = () => {
        if (activeRole === 'admin') {
            setViewingAs(current => current === 'admin' ? 'student' : 'admin');
        }
    };

    return {
        activeRole,
        viewingAs,
        isRoleModalOpen,
        handleLogin,
        handleLogout,
        handleSwitchView,
        handleLoginRequest,
        closeRoleModal
    };
};
