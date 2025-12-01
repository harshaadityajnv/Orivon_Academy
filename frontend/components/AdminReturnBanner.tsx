
import React from 'react';

interface AdminReturnBannerProps {
    onReturn: () => void;
}

const AdminReturnBanner: React.FC<AdminReturnBannerProps> = ({ onReturn }) => (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 container mx-auto rounded-r-lg" role="alert">
        <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
                <p className="font-bold">Admin Preview Mode</p>
                <p>You are currently viewing the student portal. Click the button to return to your dashboard.</p>
            </div>
            <button onClick={onReturn} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow">
                Return to Admin Dashboard
            </button>
        </div>
    </div>
);

export default AdminReturnBanner;
