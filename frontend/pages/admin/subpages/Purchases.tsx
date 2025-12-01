
import React, { useEffect, useState } from 'react';

type TxRow = {
    id: string | number;
    mailid: string;
    course_title?: string | null;
    price: number;
    created_at?: string | null;
}

const Purchases: React.FC = () => {
    const [txs, setTxs] = useState<TxRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTx = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('access_token') || '';
                const res = await fetch('http://localhost:8000/admin/transactions', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const data = await res.json();
                setTxs(data || []);
            } catch (err: any) {
                console.error('Failed to load transactions', err);
                setError(err?.message || 'Failed to load transactions');
            } finally {
                setLoading(false);
            }
        }
        fetchTx();
    }, []);

    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between">
               <h3 className="text-2xl font-bold text-gray-800">Transactions</h3>
               {/* <div className="flex gap-2">
                   <button className="text-sm text-gray-500 hover:text-gray-900 font-medium">Export CSV</button>
               </div> */}
           </div>

           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center text-gray-500">Loading transactions...</div>
                ) : error ? (
                    <div className="p-6 text-center text-red-500">{error}</div>
                ) : (
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Course Title </th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price (₹)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {txs.map((p) => (
                            <tr key={String(p.id)} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-gray-500">{p.id}</td>
                                <td className="px-6 py-4 font-semibold text-gray-900">{p.mailid}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{p.course_title || '-'}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">₹{p.price}</td>
                                {/* <td className="px-6 py-4 text-sm text-gray-500">{p.created_at ? new Date(p.created_at).toLocaleString() : '-'}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
           </div>
        </div>
    );
};

export default Purchases;
