import React, { useEffect, useState } from 'react';

type AdminExamRow = {
    exma_id: string | number | null;
    title: string;
    passing_score: number;
    nameofuser: string;
    questions?: any;
    created_at?: string | null;
};

const Attempts: React.FC = () => {
    const [rows, setRows] = useState<AdminExamRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExams = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('access_token') || '';
                const API_BASE = (window as any).__API_BASE || 'http://localhost:8000';
                const res = await fetch(`${API_BASE}/exams/admin/list`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) {
                    const txt = await res.text().catch(() => '');
                    throw new Error(txt || `Status ${res.status}`);
                }
                const data = await res.json();
                setRows(data || []);
            } catch (e: any) {
                console.error('Failed to fetch exams', e);
                setError(e?.message || 'Failed to fetch exams');
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">Exam Attempts & Proctoring Logs</h3>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center text-gray-500">Loading...</div>
                ) : error ? (
                    <div className="p-6 text-center text-red-500">{error}</div>
                ) : rows.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No exam records found.</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Attempt ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Exam</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Score</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Questions</th>
                                {/* <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Created</th> */}
                                {/* <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th> */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {rows.map((r) => (
                                <tr key={String(r.exma_id) || Math.random()} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{String(r.exma_id || '')}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">{r.nameofuser || 'Unknown'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{r.title}</td>
                                    <td className="px-6 py-4 font-bold text-gray-800">{r.passing_score}%</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{typeof r.questions === 'number' ? r.questions : JSON.stringify(r.questions)}</td>
                                    {/* <td className="px-6 py-4 text-sm text-gray-600">{r.created_at || ''}</td> */}
                                    {/* <td className="px-6 py-4">
                                        <button className="text-rose-600 hover:text-rose-800 text-xs font-bold hover:underline">Review Log</button>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Attempts;