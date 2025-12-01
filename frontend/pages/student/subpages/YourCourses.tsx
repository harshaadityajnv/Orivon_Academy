
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { generateCertificatePNG } from '../../../utils/generateCertificate';
import { Course } from '../../../types';
import CourseCard from '../../../components/CourseCard';
import { getStartedExamIds } from '../../../utils/examStarted';
import EnterNameModal from '../../../components/modals/EnterNameModal';

interface YourCoursesProps {
    enrolledCourses: Course[];
    onStartExam: (course: Course) => void;
    onViewCourse: (course: Course) => void;
    onRequestCertificate: (course: Course) => void;
}

const YourCourses: React.FC<YourCoursesProps> = ({ enrolledCourses, onStartExam, onViewCourse, onRequestCertificate }) => {
    const [recentPaid, setRecentPaid] = useState<Array<{ id: number | string; title: string; description?: string; imageUrl?: string }>>([]);
    const [passedCourses, setPassedCourses] = useState<string[]>(() => {
        try {
            const raw = localStorage.getItem('passedCourses');
            const arr = raw ? JSON.parse(raw) : [];
            return Array.isArray(arr) ? arr.map((x: any) => String(x)) : [];
        } catch (_) {
            return [];
        }
    });
    const [availableDownloads, setAvailableDownloads] = useState<string[]>([]);
    const [downloadCourse, setDownloadCourse] = useState<Course | null>(null);
    const [downloadDefaultName, setDownloadDefaultName] = useState('');
    const [startingExamIds, setStartingExamIds] = useState<string[]>(() => getStartedExamIds());

    useEffect(() => {
        // Try to load recent purchases from the backend using the logged-in user's token.
        const fetchMyTx = async () => {
            try {
                const token = localStorage.getItem('access_token') || '';
                if (!token) {
                    // fallback to localStorage if no token
                    const raw = localStorage.getItem('recentPaidCourses');
                    if (raw) setRecentPaid(JSON.parse(raw));
                    return;
                }
                const res = await fetch('http://localhost:8000/payments/my_transactions', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const data = await res.json();
                // Map to expected shape
                const mapped = (data || []).map((t: any) => ({
                    id: t.id,
                    title: t.course_title || `Purchase ${t.id}`,
                    description: '',
                    imageUrl: ''
                }));
                setRecentPaid(mapped);
                try { localStorage.setItem('recentPaidCourses', JSON.stringify(mapped)); } catch (_){ }
            } catch (e) {
                console.error('Failed to fetch my transactions', e);
                // fallback to localStorage recentPaidCourses
                try {
                    const raw = localStorage.getItem('recentPaidCourses');
                    if (raw) setRecentPaid(JSON.parse(raw));
                } catch (_){ }
            }
        }
        fetchMyTx();
    }, []);

    useEffect(() => {
        const checkAvailabilityForCourse = async (courseId: string) => {
            try {
                const API_BASE = (window as any).__API_BASE || 'http://localhost:8000';
                const token = localStorage.getItem('access_token') || '';
                if (!token) return false;
                const res = await fetch(`${API_BASE}/exams/certification/${encodeURIComponent(String(courseId))}/availability`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) return false;
                const data = await res.json();
                if (data?.available) {
                    setAvailableDownloads(prev => prev.includes(String(courseId)) ? prev : [...prev, String(courseId)]);
                    return true;
                }
            } catch (e) {
                // ignore
            }
            return false;
        };

        // Listen for exam pass events from the exam flow. When an exam is passed elsewhere
        // in the app, that code should dispatch: window.dispatchEvent(new CustomEvent('examPassed', { detail: { courseId } }))
        const handler = (e: any) => {
            try {
                const courseId = e?.detail?.courseId;
                if (courseId === undefined || courseId === null) return;
                const cid = String(courseId);
                setPassedCourses((prev) => {
                    if (prev.includes(cid)) return prev;
                    const next = [...prev, cid];
                    try { localStorage.setItem('passedCourses', JSON.stringify(next)); } catch(_){}
                    return next;
                });
                // Query server availability for this course and enable download if server confirms
                void checkAvailabilityForCourse(cid);
            } catch (err) { console.warn('examPassed handler error', err); }
        };
        // Also check for a lastPassedCourseId left in localStorage (some exam flows navigate back
        // without dispatching an event). If present, mark it passed and remove the key.
        try {
            const last = localStorage.getItem('lastPassedCourseId');
            if (last) {
                try {
                    const parsed = JSON.parse(last);
                    if (parsed !== undefined && parsed !== null) {
                        const cid = String(parsed);
                        setPassedCourses((prev) => {
                            if (prev.includes(cid)) return prev;
                            const next = [...prev, cid];
                            try { localStorage.setItem('passedCourses', JSON.stringify(next)); } catch(_){ }
                            return next;
                        });
                        // Also trigger availability check so UI enables immediately
                        void checkAvailabilityForCourse(String(parsed));
                    }
                } catch (_) {}
                localStorage.removeItem('lastPassedCourseId');
            }
        } catch (_) {}

        // Also respond to visibility change so when a user returns via navigation the check runs
        const onVisibility = () => {
            try {
                const last = localStorage.getItem('lastPassedCourseId');
                if (last) {
                    try {
                        const parsed = JSON.parse(last);
                        if (parsed !== undefined && parsed !== null) {
                            const cid = String(parsed);
                            setPassedCourses((prev) => {
                                if (prev.includes(cid)) return prev;
                                const next = [...prev, cid];
                                try { localStorage.setItem('passedCourses', JSON.stringify(next)); } catch(_){}
                                return next;
                            });
                        }
                    } catch (_) {}
                    localStorage.removeItem('lastPassedCourseId');
                }
            } catch (_) {}
        };
        window.addEventListener('examPassed', handler as EventListener);
        const startedHandler = (e: any) => {
            try {
                const courseId = e?.detail?.courseId;
                if (courseId === undefined || courseId === null) return;
                const cid = String(courseId);
                setStartingExamIds((prev) => prev.includes(cid) ? prev : [...prev, cid]);
            } catch (err) { console.warn('examStarted handler error', err); }
        };
        window.addEventListener('examStarted', startedHandler as EventListener);
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            window.removeEventListener('examPassed', handler as EventListener);
            window.removeEventListener('examStarted', startedHandler as EventListener);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    const clearRecent = () => {
        // Only clear local cache; server-side history remains
        localStorage.removeItem('recentPaidCourses');
        setRecentPaid([]);
    }
    return (
        <div>
            {/* Recent paid summary shown immediately after payment */}
            {recentPaid.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Recently Purchased</h4>
                    <div className="flex flex-col gap-3">
                        {recentPaid.map((c) => (
                            <div key={String(c.id)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {/* {c.imageUrl ? (
                                        <img src={c.imageUrl} alt={c.title} className="w-16 h-12 object-cover rounded-md bg-gray-100" />
                                    ) : (
                                        <div className="w-16 h-12 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-400">No Image</div>
                                    )} */}
                                    <div>
                                        <div className="font-semibold text-gray-900">{c.title}</div>
                                        <div className="text-xs text-gray-500">{c.description}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        className={
                                            `px-3 py-2 rounded-lg text-sm font-medium ${(passedCourses.includes(String(c.id)) || availableDownloads.includes(String(c.id))) ? 'bg-gray-100 text-gray-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`
                                        }
                                        disabled={!(passedCourses.includes(String(c.id)) || availableDownloads.includes(String(c.id)))}
                                        onClick={() => {
                                            try {
                                                const userRaw = localStorage.getItem('user');
                                                const user = userRaw ? JSON.parse(userRaw) : null;
                                                const recipientDefault = user?.name || user?.fullName || user?.displayName || (user?.email ? user.email.split('@')[0] : 'Student');
                                                setDownloadDefaultName(recipientDefault);
                                                setDownloadCourse({
                                                    id: c.id as any,
                                                    title: c.title,
                                                    description: c.description || '',
                                                    author: 'Orivon Academy',
                                                    durationMinutes: 120,
                                                    progress: 100,
                                                    imageUrl: c.imageUrl || ''
                                                });
                                            } catch (e) {
                                                console.error('Failed to open name modal', e);
                                                toast.error('Failed to open certificate dialog');
                                            }
                                        }}>Download Certificate</button>
                                    {!startingExamIds.includes(String(c.id)) && (
                                        <button className="px-3 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium" onClick={() => {
                                                    // Start the exam (do not mark as started until submission)
                                            // Construct a Course object and start exam
                                            const course: Course = {
                                                id: c.id as any,
                                                title: c.title,
                                                description: c.description || '',
                                                author: 'Orivon Academy',
                                                durationMinutes: 120,
                                                progress: 0,
                                                imageUrl: c.imageUrl || ''
                                            };
                                            onStartExam(course);
                                            // Optionally remove this item from recentPaid
                                            const remaining = recentPaid.filter(r => r.id !== c.id);
                                            setRecentPaid(remaining);
                                            localStorage.setItem('recentPaidCourses', JSON.stringify(remaining));
                                        }}>Start Exam</button>
                                    )}
                                    {/* <button className="ml-2 text-xs text-gray-400" onClick={clearRecent}>Dismiss</button> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/*<div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">My Certifications</h3>
            </div>*/}
            
            {enrolledCourses.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 mb-4"></p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {enrolledCourses.map(course => (
                        <CourseCard 
                            key={course.id} 
                            course={course} 
                            onStartExam={(c) => {
                                // Start the exam (do not mark as started until submission)
                                onStartExam(c);
                            }}
                            examStarted={startingExamIds.includes(String(course.id))}
                            onViewCourse={onViewCourse} 
                            onRequestCertificate={onRequestCertificate}
                            canDownload={passedCourses.includes(String(course.id)) || availableDownloads.includes(String(course.id))}
                            onDownload={(c) => {
                                try {
                                    const userRaw = localStorage.getItem('user');
                                    const user = userRaw ? JSON.parse(userRaw) : null;
                                    const recipientDefault = user?.name || user?.fullName || user?.displayName || (user?.email ? user.email.split('@')[0] : 'Student');
                                    setDownloadDefaultName(recipientDefault);
                                    setDownloadCourse(c);
                                } catch (e) {
                                    console.error('Failed to open name modal', e);
                                    toast.error('Failed to open certificate dialog');
                                }
                            }}
                        />
                    ))}
                </div>
            )}
            {/* Name entry modal for certificate download */}
            <EnterNameModal
                open={downloadCourse !== null}
                defaultName={downloadDefaultName}
                courseTitle={downloadCourse?.title}
                onClose={() => setDownloadCourse(null)}
                onConfirm={async (name) => {
                    try {
                        if (!downloadCourse) return;
                        const blob = await generateCertificatePNG(name, downloadCourse.title);
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        const safeName = name.replace(/[^a-z0-9]+/gi, '_') || 'student';
                        a.download = `${downloadCourse.title.replace(/[^a-z0-9]+/gi, '_')}_${safeName}.png`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        URL.revokeObjectURL(url);
                    } catch (e) {
                        console.error('Failed to generate certificate', e);
                        toast.error('Failed to generate certificate');
                    } finally {
                        setDownloadCourse(null);
                    }
                }}
            />
        </div>
    );
}

export default YourCourses;
