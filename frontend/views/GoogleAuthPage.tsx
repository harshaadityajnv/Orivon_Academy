import React, { useEffect, useRef, useState } from 'react';
import { signInWithGoogle } from '../services/authService';

declare global {
    interface Window { google?: any; }
}

const GoogleAuthPage: React.FC<{ onComplete: (role: 'student' | 'admin') => void; onCancel: () => void }> = ({ onComplete, onCancel }) => {
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
            onComplete(returnedRole);
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
                    ux_mode: 'popup',
                    auto_select: false
                });
                if (googleButtonRef.current) {
                    // provide explicit options so the generated iframe URL doesn't include `undefined` params
                    window.google.accounts.id.renderButton(googleButtonRef.current, {
                        theme: 'outline',
                        size: 'large',
                        type: 'standard',
                        text: 'signin_with',
                        shape: 'rectangular',
                        width: 240
                    });
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="w-full max-w-md rounded-2xl shadow-lg p-8 bg-white border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Sign in with Google</h2>
                <p className="text-sm text-gray-600 mb-4">Use your Google account to sign in and continue to Orivon.</p>

                <div ref={googleButtonRef} className="mb-4" />

                <div className="flex gap-2">
                    <button onClick={onCancel} className="flex-1 rounded-md px-4 py-2 border border-gray-200">Cancel</button>
                </div>

                {loading && <div className="mt-3 text-sm text-gray-500">Signing in...</div>}
                {error && <div className="mt-3 text-sm text-red-500">{error}</div>}
            </div>
        </div>
    );
};

export default GoogleAuthPage;
