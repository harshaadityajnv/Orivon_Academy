
import React, { useEffect, useState } from 'react';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<Array<{id: string, name: string, email: string}>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) throw new Error('Not authenticated (no access token)');
                const res = await fetch('http://localhost:8000/admin/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error('Failed to fetch users');
                const data = await res.json();
                setUsers(data);
            } catch (err: any) {
                setError(err.message || 'Error fetching users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="space-y-6">
           <div className="flex items-center justify-between">
               <h3 className="text-2xl font-bold text-gray-800">User Management</h3>
               {/* <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-xl shadow-sm transition-all flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                   Add User
               </button> */}
           </div>

           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-6 text-gray-500">Loading users...</div>
                ) : error ? (
                    <div className="p-6 text-red-500">{error}</div>
                ) : (
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                            {/* <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th> */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-900">{u.name}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                                {/* <td className="px-6 py-4 text-right">
                                    <button className="text-rose-600 hover:text-rose-800 text-sm font-semibold hover:underline">Edit</button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
            </div>
        </div>
    );
}

export default UserManagement;