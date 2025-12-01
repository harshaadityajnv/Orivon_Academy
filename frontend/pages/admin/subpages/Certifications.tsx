
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Certification } from '../../../types';

// start with empty list; real data will be fetched from backend `/courses`
const INITIAL_CERTS: Certification[] = [];

const Certifications: React.FC = () => {
    // --- State: Grant Access (UI only) ---
    // --- State: Grant Access (UI only) ---
    const [grantForm, setGrantForm] = useState({ name: '', mailid: '', price: 0, course_title: '' });



    // --- State: Data ---
    const [certifications, setCertifications] = useState<Certification[]>(INITIAL_CERTS);
    const [loadingCourses, setLoadingCourses] = useState<boolean>(false);
    const [coursesError, setCoursesError] = useState<string | null>(null);

    // Fetch courses/certifications from backend and map to Certification shape
    React.useEffect(() => {
        const load = async () => {
            try {
                setLoadingCourses(true);
                setCoursesError(null);
                const API_BASE = (window as any).__API_BASE || 'http://localhost:8000';
                const res = await fetch(`${API_BASE}/courses`);
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const data = await res.json();
                // Map returned course rows to the Certification interface used by this page
                const mapped: Certification[] = (data || []).map((r: any) => ({
                    id: String(r.id ?? r.course_id ?? r.certification_id ?? r.id ?? ''),
                    title: r.title || r.name || '',
                    level: r.level || '',
                    price: Number(r.price ?? r.amount ?? 0),
                    duration: Number(r.duration_minutes ?? r.duration ?? 0),
                    tags: r.tags || [],
                    skills: r.skills || [],
                    syllabus: r.syllabus || [],
                    description: r.description || r.desc || '',
                    active: typeof r.active === 'boolean' ? r.active : true,
                    questionsCount: Number(r.questionsCount ?? r.questions_count ?? 0)
                }));
                setCertifications(mapped);
            } catch (e: any) {
                console.error('Failed to load courses', e);
                setCoursesError(e?.message || 'Failed to load courses');
            } finally {
                setLoadingCourses(false);
            }
        };
        load();
    }, []);

    // --- State: Exam Management ---
    const [selectedCertId, setSelectedCertId] = useState<string>('');

    // Grant handler removed — button intentionally does nothing.

    

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this certification?")) {
            setCertifications(prev => prev.filter(c => c.id !== id));
            toast.success("Certification deleted.");
            if (selectedCertId === id) setSelectedCertId('');
        }
    };

    const handleToggleActive = (id: string) => {
        setCertifications(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
    };

    const handleAddQuestion = () => {
        if (!selectedCertId) {
            toast.error("Select a certification first.");
            return;
        }
        // Simulation of adding a question
        setCertifications(prev => prev.map(c => c.id === selectedCertId ? { ...c, questionsCount: c.questionsCount + 1 } : c));
        toast.success("Question added (simulated).");
    };

    const selectedCert = certifications.find(c => c.id === selectedCertId);

    // Common input style class
    const inputClass = "w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400";

    return (
        <div className="space-y-8 pb-10">
            {/* 1. Grant Access Section */}
            <div className="bg-rose-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-dark mb-4">Grant Certification Access (Admin)</h3>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-grow w-full">
                        <input 
                            type="text" 
                            name="name"
                            value={grantForm.name}
                            onChange={(e) => setGrantForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="User Name" 
                            className={inputClass}
                        />
                    </div>
                    <div className="flex-grow w-full">
                        <input 
                            type="number" 
                            name="price"
                            value={grantForm.price}
                            onChange={(e) => setGrantForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                            placeholder="Price" 
                            className={inputClass}
                        />
                    </div>
                    <div className="flex-grow w-full">
                        <input 
                            type="email" 
                            name="mailid"
                            value={grantForm.mailid}
                            onChange={(e) => setGrantForm(prev => ({ ...prev, mailid: e.target.value }))}
                            placeholder="User Email" 
                            className={inputClass}
                        />
                    </div>
                    <div className="flex-grow w-full">
                        <select
                            name="course_title"
                            value={grantForm.course_title}
                            onChange={(e) => setGrantForm(prev => ({ ...prev, course_title: e.target.value }))}
                            className={inputClass}
                        >
                            <option value="">Select certification</option>
                            {loadingCourses && <option disabled>Loading...</option>}
                            {coursesError && <option disabled>{coursesError}</option>}
                            {certifications.map((c) => (
                                <option key={c.id} value={c.title}>{c.title}</option>
                            ))}
                        </select>
                    </div>
                    <button 
                        onClick={async () => {
                            try {
                                const token = localStorage.getItem('access_token') || '';
                                if (!token) {
                                    toast.error('Admin must be logged in to perform this action');
                                    return;
                                }
                                const API_BASE = (window as any).__API_BASE || 'http://localhost:8000';
                                const res = await fetch(`${API_BASE}/payments/admin_record_transaction`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                                    body: JSON.stringify({ mailid: grantForm.mailid, price: grantForm.price, course_title: grantForm.course_title })
                                });
                                if (!res.ok) {
                                    const text = await res.text().catch(() => '');
                                    toast.error('Failed to record transaction: ' + (text || res.status));
                                    return;
                                }
                                toast.success('Transaction recorded');
                                // clear the grant form
                                setGrantForm({ name: '', mailid: '', price: 0, course_title: '' });
                            } catch (e) {
                                console.error(e);
                                toast.error('Failed to record transaction');
                            }
                        }}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-6 rounded-md shadow-md transition-colors"
                    >
                        Grant
                    </button>
                </div>
            </div>

            

            {/* 3. Certifications Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                        
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                            
                            {/* <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Active</th> */}
                            
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {certifications.map((cert) => (
                            <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-dark">{cert.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{cert.level}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{cert.price}</td>
                                
                                {/* <td className="px-6 py-4 whitespace-nowrap">
                                    <input 
                                        type="checkbox" 
                                        checked={cert.active} 
                                        onChange={() => handleToggleActive(cert.id)} 
                                        className="form-checkbox h-4 w-4 text-rose-600 rounded cursor-pointer" 
                                    />
                                </td> */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {/*<button 
                                        onClick={() => handleDelete(cert.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-3 rounded shadow-sm"
                                    >
                                        Delete
                                    </button>*/}
                                </td>
                            </tr>
                        ))}
                        {certifications.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No certifications found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 4. Exam Management Section */}
            {/* <div className="bg-orange-50 p-6 rounded-lg shadow-sm flex flex-col md:flex-row items-center gap-4">
                <span className="font-bold text-dark whitespace-nowrap">Select Certification</span>
                <select 
                    value={selectedCertId} 
                    onChange={(e) => setSelectedCertId(e.target.value)}
                    className="flex-grow px-4 py-2 rounded-full border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                    <option value="">-- Select --</option>
                    {certifications.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <button onClick={handleAddQuestion} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full shadow-md whitespace-nowrap">
                    + Add Question
                </button>
                <button onClick={() => toast.success("Exam saved successfully!")} className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-full shadow-md whitespace-nowrap">
                    Save Exam
                </button>
            </div> */}

            {/* 5. Exam Preview Card */}
            {selectedCert && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-xl font-bold text-dark mb-1">New Certification Exam</h4>
                            <p className="text-gray-500 text-sm">Duration: {selectedCert.duration} min • Questions: {selectedCert.questionsCount}</p>
                            <div className="mt-2 flex gap-2">
                                {selectedCert.tags.map(tag => (
                                    <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-sm transition-colors">
                            Preview
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certifications;
