import React, { useEffect, useState } from 'react';

const StatCard: React.FC<{ title: string; value: string; trend: string; color: string; icon: React.ReactNode }> = ({ title, value, trend, color, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
        <div>
            <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h4>
            <div className="mt-2">
                <p className="text-3xl font-extrabold text-gray-900">{value}</p>
            </div>
        </div>
        <div className={`p-3 rounded-xl ${color} text-white shadow-md`}>
            {icon}
        </div>
    </div>
);

type RecentLog = {
    action: string;
    time: string;
    iconClass?: string;
};

const AdminAnalytics: React.FC = () => {
    const [usersCount, setUsersCount] = useState<string | null>(null);
    const [activeCerts, setActiveCerts] = useState<string | null>(null);
    const [revenue, setRevenue] = useState<string | null>(null);
    const [recentLogs, setRecentLogs] = useState<RecentLog[]>([]);

    useEffect(() => {
        const apiBase = (window as any).__API_BASE || 'http://localhost:8000';
        const token = localStorage.getItem('access_token');

        // Fetch analytics
        fetch(`${apiBase}/admin/analytics`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        })
            .then((r) => {
                if (!r.ok) throw new Error(`Status ${r.status}`);
                return r.json();
            })
            .then((data) => {
                setUsersCount(data?.users_count != null ? String(data.users_count) : '0');
                setActiveCerts(data?.active_certifications_count != null ? String(data.active_certifications_count) : '0');
                setRevenue(data?.revenue != null ? `₹${Number(data.revenue).toLocaleString()}` : '₹0');
            })
            .catch((err) => {
                console.error('Failed to fetch admin analytics', err);
                setUsersCount('—');
                setActiveCerts('—');
                setRevenue('—');
            });

        // Fetch exams and show them in recent activity. We'll poll every 10s
        const fetchExams = async () => {
            try {
                const r = await fetch(`${apiBase}/exams/admin/list`, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    }
                });
                if (!r.ok) {
                    console.warn('Failed to fetch exams for recent activity', r.status);
                    return;
                }
                const exams = await r.json();
                if (!Array.isArray(exams)) return;
                // backend returns exams ordered by exma_id desc (newest first)
                // so take the first 3 items to get the newest three
                const recent = exams.slice(0, 3);
                const logs: RecentLog[] = recent.map((e) => {
                    const title = e?.title || e?.name || `Exam ${e?.exma_id || e?.id || ''}`.trim();
                    const owner = e?.nameofuser ? ` by ${e.nameofuser}` : '';
                    const timeRaw = e?.created_at || e?.inserted_at || e?.updated_at || e?.timestamp || null;
                    const time = timeRaw ? new Date(timeRaw).toLocaleString() : 'recent';
                    return {
                        action: `Exam "${title}"${owner}`,
                        time,
                        iconClass: 'bg-indigo-100 text-indigo-600'
                    };
                });
                setRecentLogs(logs);
            } catch (err) {
                console.error('Failed to fetch exams for recent activity', err);
            }
        };

        // run once immediately
        fetchExams();
        // then poll every 10 seconds
        const pollId = window.setInterval(fetchExams, 10000);

        // cleanup interval on unmount
        return () => {
            window.clearInterval(pollId);
        };

    }, []);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Users" 
                    value={usersCount ?? 'Loading...'} 
                    trend="+12% this month" 
                    color="bg-blue-500" 
                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                />
                <StatCard 
                    title="Total Revenue" 
                    value={revenue ?? 'Loading...'} 
                    trend="+18% vs last month" 
                    color="bg-emerald-500"
                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                     <h4 className="text-lg font-bold text-gray-800 mb-6">My Recent Activity</h4>
                     <ul className="space-y-6">
                         {recentLogs.length === 0 ? (
                             <li className="text-sm text-gray-400">No recent exam activity available.</li>
                         ) : (
                             recentLogs.map((log, i) => (
                                 <li key={i} className="flex items-start gap-4">
                                     <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${log.iconClass || 'bg-gray-100 text-gray-600'}`}>
                                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                     </div>
                                     <div>
                                         <p className="text-sm font-semibold text-gray-800">{log.action}</p>
                                         <p className="text-xs text-gray-400 mt-0.5">{log.time}</p>
                                     </div>
                                 </li>
                             ))
                         )}
                     </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
