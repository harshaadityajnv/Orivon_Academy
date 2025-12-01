import React from 'react';
import { Course } from '../../../types';

interface StudentHomeProps {
    enrolledCourses: Course[];
    onStartExam: (course: Course) => void;
    setActiveView: (view: any) => void;
}

const StudentHome: React.FC<StudentHomeProps> = ({ enrolledCourses, onStartExam, setActiveView }) => {
    // Gradient classes for course cards
    const gradientClasses = [
        "from-rose-400 to-red-600",
        "from-orange-400 to-amber-600",
        "from-pink-400 to-rose-600",
        "from-blue-400 to-indigo-600"
    ];

    // --- Statistics Calculation for Donut Chart ---
    const totalCourses = enrolledCourses.length;
    const completedCount = enrolledCourses.filter(c => c.progress === 100).length;
    const inProgressCount = enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length;
    const notStartedCount = enrolledCourses.filter(c => c.progress === 0).length;

    // Calculate percentages (based on 100 circumference for ease)
    const total = totalCourses || 1; // Prevent division by zero
    const completedPct = (completedCount / total) * 100;
    const inProgressPct = (inProgressCount / total) * 100;
    const notStartedPct = (notStartedCount / total) * 100;

    // Calculate stroke offsets
    // Start at 0, then shift by previous segments
    const completedOffset = 0;
    const inProgressOffset = -completedPct;
    const notStartedOffset = -(completedPct + inProgressPct);

    const [displayName, setDisplayName] = React.useState('Student');
    const [email, setEmail] = React.useState('student@orivon.com');

    React.useEffect(() => {
        try {
            const raw = localStorage.getItem('user');
            if (raw) {
                const u = JSON.parse(raw);
                setDisplayName(u?.name || u?.displayName || 'Student');
                setEmail(u?.email || 'student@orivon.com');
            }
        } catch (e) {
            // ignore
        }
    }, []);

    return (
        <div className="space-y-8">

            {/* Decorative Hero / Banner */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80"
                    alt="Learning hero"
                    className="w-full h-44 md:h-56 object-cover filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/30 via-transparent to-indigo-600/10 pointer-events-none"></div>
                <div className="absolute left-6 top-6 md:left-12 md:top-10 text-white">
                    <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm">Grow your skills — one certification at a time</h1>
                    <p className="mt-1 text-sm md:text-base text-white/90 max-w-xl">Curated learning paths, proctored exams and recognized certificates to showcase your expertise.</p>
                </div>

                {/* Floating decorative badges (static) */}
                <div className="absolute right-6 bottom-4 flex flex-col gap-3">
                    <div className="bg-white/90 text-gray-800 px-3 py-2 rounded-xl shadow-md text-sm font-medium flex items-center gap-2">
                        <svg className="h-4 w-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927C9.324 2.26 10.676 2.26 10.951 2.927l.847 2.45a1 1 0 00.95.69h2.58c.75 0 1.06.96.455 1.38l-2.087 1.51a1 1 0 00-.364 1.118l.847 2.45c.275.667-.57 1.22-1.16.74L10 12.347l-2.569 1.628c-.59.48-1.435-.073-1.16-.74l.847-2.45a1 1 0 00-.364-1.118L4.667 7.447c-.605-.42-.295-1.38.455-1.38h2.58a1 1 0 00.95-.69l.847-2.45z"/></svg>
                        Top Rated Certifications
                    </div>
                    <div className="bg-white/90 text-gray-800 px-3 py-2 rounded-xl shadow-md text-sm font-medium flex items-center gap-2">
                        <svg className="h-4 w-4 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zM2 17l10 5 10-5" /></svg>
                        Curated Paths
                    </div>
                </div>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Hello, {displayName.split(' ')[0] || 'Student'}! 👋</h2>
                    <p className="text-gray-500 mt-1">Ready to learn something new today?</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="hidden md:flex items-center gap-3">
                        <button onClick={() => setActiveView('yourCourses')} className="px-3 py-2 rounded-md bg-rose-50 text-rose-700 text-sm font-medium hover:bg-rose-100">My Certifications</button>
                        <button onClick={() => setActiveView('certificates')} className="px-3 py-2 rounded-md bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100">Certifications</button>
                    </div>
                </div>
            </div>

                {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Left Column (Courses & Stats) */}
                <div className="xl:col-span-2 space-y-8">

                    {/* Action widgets: moved here to span from beside the sidebar toward the profile */}
                    <div className="flex flex-col md:flex-row items-start gap-4">
                        <div className="flex-1 grid grid-cols-1 gap-4">
                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 h-28">
                                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-rose-50 flex items-center justify-center text-rose-700">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M13 7H7v6h6V7z" /></svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-800">My Certifications</p>
                                    <p className="text-xs text-gray-500">View certificates you've earned and their status.</p>
                                </div>
                                <div>
                                    <button onClick={() => setActiveView('yourCourses')} className="px-3 py-2 rounded-md bg-rose-600 text-white text-sm font-medium hover:bg-rose-700">Open</button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 h-28">
                                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3h12v2H4V3zM4 7h12v2H4V7zM4 11h12v2H4v-2z" /></svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-800">Certifications</p>
                                    <p className="text-xs text-gray-500">Browse available certifications and enroll.</p>
                                </div>
                                <div>
                                    <button onClick={() => setActiveView('certificates')} className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">Browse</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Featured/Enrolled Courses (Word Sets Style) */}
                    {/* <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">My Certifications</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setActiveView('yourCourses')} className="text-sm text-rose-600 font-medium hover:text-rose-800">View All</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {enrolledCourses.length === 0 ? (
                                <div className="col-span-full bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center">
                                    <p className="text-gray-500 mb-4">You haven't started any certifications yet.</p>
                                    Static decorative certificate preview
                                    <div className="mx-auto w-40 h-24 bg-gradient-to-r from-rose-50 to-indigo-50 rounded-lg border border-gray-100 flex items-center justify-center text-sm text-gray-500">
                                        Explore Courses
                                    </div>
                                </div>
                            ) : enrolledCourses.slice(0, 3).map((course, index) => (
                                <div key={course.id} className={`rounded-2xl p-6 text-white bg-gradient-to-br ${gradientClasses[index % gradientClasses.length]} shadow-lg transform transition-transform hover:scale-105 cursor-pointer relative overflow-hidden group`}>
                                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
                                        <svg className="h-24 w-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                            </div>
                                            <div className="text-white/80">
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-bold mb-1 line-clamp-1">{course.title}</h4>
                                        <p className="text-white/80 text-sm mb-4">{course.author}</p>
                                        
                                        <div className="w-full bg-black/20 rounded-full h-1.5 mb-2">
                                            <div className="bg-white h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-white/90 font-medium">
                                            <span>{course.progress}% Complete</span>
                                            <span className="text-white/70">{course.duration || '—'} mins</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div> */}

                    {/* Decorative static stats row */}
                    {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xl font-bold">★</div>
                            <div>
                                <div className="text-sm text-gray-500">Top Achiever</div>
                                <div className="text-lg font-bold text-gray-800">Rohit • 98%</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">🏅</div>
                            <div>
                                <div className="text-sm text-gray-500">Certificates Issued</div>
                                <div className="text-lg font-bold text-gray-800">1,284</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-xl font-bold">✔</div>
                            <div>
                                <div className="text-sm text-gray-500">Avg Completion</div>
                                <div className="text-lg font-bold text-gray-800">72%</div>
                            </div>
                        </div>
                    </div> */}

                </div>

                {/* Right Column (Profile & Quick Actions) */}
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center md:w-64 ml-auto">
                        <div className="relative mb-4">
                            <img src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-rose-50" />
                            <div className="absolute bottom-1 right-1 h-5 w-5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{displayName}</h3>
                        <p className="text-gray-500 text-sm mb-6">{email}</p>
                        {/* <button onClick={() => setActiveView('profile')} className="mt-2 w-full py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 hover:text-rose-600 transition-colors">
                            View Profile
                        </button> */}
                    </div>

                    {/* Decorative static card */}
                    {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Highlights</h4>
                        <p className="text-xs text-gray-500 mb-4">Curated content, practice exams and mentor support — all in one place.</p>
                        <div className="flex gap-3">
                            <div className="flex-1 bg-rose-50 p-3 rounded-lg text-rose-700 text-xs">Industry Standard Certificate</div>
                            <div className="flex-1 bg-indigo-50 p-3 rounded-lg text-indigo-700 text-xs">AI Proctoring</div>
                        </div>
                    </div> */}

                </div>
            </div>
        </div>
    );
};

export default StudentHome;