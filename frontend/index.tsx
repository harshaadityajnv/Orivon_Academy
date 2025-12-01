import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) || '';
if (!googleClientId) {
  // eslint-disable-next-line no-console
  console.warn('VITE_GOOGLE_CLIENT_ID is not set; Google sign-in will not work until configured.');
}

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);