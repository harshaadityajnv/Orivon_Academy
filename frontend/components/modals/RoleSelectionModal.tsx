
import React, { useEffect, useRef, useState } from 'react';
import { signInWithGoogle } from '../../services/authService';

declare global {
    interface Window { google?: any; }
}

interface RoleSelectionModalProps {
    onSelectRole: (role: 'student' | 'admin') => void;
    onClose: () => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ onSelectRole, onClose }) => {
    
    const googleButtonRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);



    const handleCredentialResponse = async (resp: any) => {
        const id_token = resp?.credential;
        if (!id_token) {
            setError('No credential returned from Google');
            return;
        }
        setLoading(true);
        setError(null);
            try {
                const data = await signInWithGoogle(id_token);
                if (data?.access_token) {
                    localStorage.setItem('access_token', data.access_token);
                }
                if (data?.user) localStorage.setItem('user', JSON.stringify(data.user));
                const returnedRole = data?.user?.role === 'admin' ? 'admin' : 'student';
                onSelectRole(returnedRole);
        } catch (e: any) {
            console.error('Google sign-in error', e);
            setError(e?.message || 'Sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const clientId = (import.meta.env as any).VITE_GOOGLE_CLIENT_ID;
        if (!clientId) {
            setError('Google client ID is not configured');
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => {
            try {
                window.google?.accounts?.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                    ux_mode: 'popup'
                });
                if (googleButtonRef.current) {
                    window.google.accounts.id.renderButton(googleButtonRef.current, { theme: 'outline', size: 'large' });
                }
            } catch (e) {
                console.error('GSI init error', e);
                setError('Failed to initialize Google Sign-In');
            }
        };

        return () => {
            if (script.parentNode) script.parentNode.removeChild(script);
        };
    }, []);

    const handleAdminSignIn = (e: React.MouseEvent) => {
        e.preventDefault();
        onSelectRole('admin');
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-8 pt-10 text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Orivon</h2>
                    <p className="text-gray-500 mb-8">Sign in to access your certificates and exams.</p>

                    <div className="w-full mb-4">
                        <div ref={googleButtonRef} />
                        {/* <div className="mt-3 text-center">
                            <button
                                onClick={() => window.google?.accounts?.id.prompt()}
                                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                            >
                                Or open Google prompt
                            </button>
                        </div> */}
                        {loading && <div className="text-sm text-gray-500 mt-2">Signing in...</div>}
                        {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        {/* <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-400">or</span>
                        </div> */}
                    </div>

                    {/* <div className="text-sm">
                        <p className="text-gray-500 mb-2">Admin access?</p>
                        <button 
                            onClick={handleAdminSignIn}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                        >
                            Sign in as Administrator
                        </button>
                    </div> */}
                </div>
                
                <div className="bg-gray-50 px-8 py-4 text-center text-xs text-gray-400 border-t border-gray-100">
                    By signing in, you agree to Orivon Academy's Terms of Service and Privacy Policy.
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionModal;
