
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CertificateRequest, CourseTrack, Course } from '../../../types';
import { fetchCourses } from '../../../services/courseService';

// --- Helper for Mock Data (Simulating API response for detailed view) ---
const getExtendedDetails = (track: CourseTrack) => {
    // Specific details for DevOps track to make it more informative
    if (track.title.includes("DevOps")) {
        return {
            ...track,
            longDescription: "Master the art of unifying software development (Dev) and software operation (Ops). This comprehensive certification covers the entire DevOps lifecycle, from continuous integration and delivery (CI/CD) to infrastructure as code (IaC) and container orchestration with Kubernetes. You will learn to automate workflows, improve deployment frequency, and ensure system reliability at scale.",
            syllabus: [
                { module: "Module 1: DevOps Culture & CI/CD", topics: ["Git workflows", "Jenkins/GitHub Actions", "Automated Testing strategies"] },
                { module: "Module 2: Containerization with Docker", topics: ["Dockerfiles", "Image optimization", "Multi-stage builds", "Docker Compose"] },
                { module: "Module 3: Orchestration with Kubernetes", topics: ["Pods & Deployments", "Services & Ingress", "ConfigMaps & Secrets", "Helm Charts"] },
                { module: "Module 4: Infrastructure as Code", topics: ["Terraform basics", "State management", "Modules", "Ansible for configuration"] },
                { module: "Module 5: Monitoring & Logging", topics: ["Prometheus & Grafana", "ELK Stack", "Alerting strategies"] }
            ],
            examDetails: {
                duration: "180 minutes",
                questions: "90 questions",
                format: "Performance-based labs & Multiple choice",
                passingScore: "72%",
                validity: "3 years"
            },
            prerequisites: [
                "Linux command line proficiency",
                "Basic understanding of networking (HTTP, DNS, TCP/IP)",
                "Experience with at least one scripting language (Python/Bash)"
            ],
            careerRoles: ["DevOps Engineer", "Site Reliability Engineer (SRE)", "Platform Engineer", "Release Manager"],
            skills: ["CI/CD", "Docker", "Kubernetes", "Terraform", "Linux", "AWS/Azure", "Python"]
        };
    }

    // Default template for other tracks
    return {
        ...track,
        longDescription: `This ${track.title} certification validates your expertise in ${track.badge}. It is designed for professionals who want to demonstrate their ability to build secure, reliable, and scalable systems using modern best practices. Earning this credential showcases your commitment to professional growth and technical excellence.`,
        syllabus: [
            { module: "Module 1: Core Concepts & Architecture", topics: ["Design principles", "Scalability strategies", "Global infrastructure patterns"] },
            { module: "Module 2: Security & Compliance", topics: ["Identity & Access Management", "Data encryption standards", "Regulatory compliance"] },
            { module: "Module 3: Implementation & Deployment", topics: ["CI/CD pipelines", "Infrastructure as Code (IaC)", "Container orchestration"] },
            { module: "Module 4: Monitoring & Optimization", topics: ["Performance tuning", "Cost optimization", "Logging and observability"] }
        ],
        examDetails: {
            duration: "120 minutes",
            questions: "60-75 questions",
            format: "Multiple choice & Multi-select",
            passingScore: "60%",
            validity: "3 years"
        },
        prerequisites: [
            "6+ months of hands-on experience",
            "Basic understanding of networking and security",
            "Familiarity with CLI tools"
        ],
        careerRoles: ["Solutions Architect", "DevOps Engineer", "Cloud Developer", "System Administrator"],
        skills: ["System Architecture", "Cloud Security", "DevOps Practices", "Data Management", "Scalability"]
    };
};

// --- Payment/Confirmation Modal ---
interface CertificationPaymentModalProps {
    course: Course;
    onClose: () => void;
    onPay: (details: { coupon: string }) => void;
}

const CertificationPaymentModal: React.FC<CertificationPaymentModalProps> = ({ course, onClose, onPay }) => {
    const [formData, setFormData] = useState({
        coupon: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Only coupon is collected from the modal; proceed to payment
        onPay({ coupon: formData.coupon });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-0 backdrop-blur-sm">
            <div className="bg-white shadow-2xl w-full h-full overflow-auto border border-gray-200 text-gray-900 animate-fade-in-up">
                <div className="p-6 border-b border-gray-300 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-1000 ">Confirm Registration</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <div className="text-center">
                            <div className="text-sm text-gray-600"></div>
                            {(() => {
                                const code = (formData.coupon || '').trim().toUpperCase();
                                const discounted = code === 'INTERNALPASS' ? Math.max(1, Math.round((course as any).price * 0.1)) : (course as any).price;
                                return (
                                    <div className="w-full mt-2 px-4 sm:px-12">
                                        <div className="w-full flex items-center justify-between">
                                            <div className="text-3xl font-semibold text-gray-900 max-w-3xl truncate">{course.title}</div>
                                            <div className="text-3xl font-semibold text-gray-900">₹{discounted}</div>
                                        </div>
                                        {code === 'INTERNALPASS' && (
                                            <div className="text-xs text-green-700 mt-2 text-center">INTERNALPASS applied — 90% off</div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Voucher Code</label>
                        <div className="flex gap-2">
                             <input 
                                type="text"
                                name="coupon"
                                value={formData.coupon}
                                onChange={handleChange}
                                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:outline-none transition-all"
                                placeholder="Optional"
                            />
                            <button type="button" className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium text-sm transition-colors border border-red-600">Apply</button>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-red-200 p-3 rounded-lg flex items-start gap-3 mt-4">
                         <svg className="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-xs text-blue-800">
                            By clicking "Pay Now", you agree to the exam terms and conditions. Ensure your webcam is working.
                        </p>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 mt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 font-medium hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-red-200 transition-all transform active:scale-95 flex items-center gap-2"
                        >
                            <span>Pay Now</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Detailed View Component ---
interface CertificationDetailProps {
    course: Course;
    onBack: () => void;
    onGetCertified: () => void;
}

const CertificationDetail: React.FC<CertificationDetailProps> = ({ course, onBack, onGetCertified }) => {
    // Use static details for all courses
    const details = getExtendedDetails({
        title: course.title,
        badge: (course as any).badge || '',
        desc: course.description || '',
        img: course.imageUrl || '',
        price: (course as any).price || 0,
        originalPrice: (course as any).originalPrice || (course as any).price || 0,
    });

    return (
        <div className="animate-fade-in-up space-y-8">
            {/* Top Navigation */}
            <button onClick={onBack} className="group inline-flex items-center text-gray-500 hover:text-rose-600 font-medium transition-colors">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-3 group-hover:border-rose-200 group-hover:bg-rose-50 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </div>
                Back to Courses
            </button>

            {/* Immersive Hero Section */}
            <div className="relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl group">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover opacity-40 transform transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent"></div>
                </div>
                
                {/* Hero Content */}
                <div className="relative p-8 md:p-12 lg:p-16 text-white max-w-4xl">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-rose-500/20 text-rose-200 border border-rose-500/30 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                            {(course as any).badge}
                        </span>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            Live Proctoring
                        </span>
                         <span className="px-3 py-1 bg-white/10 text-gray-300 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                            Professional Certificate
                        </span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                        {course.title}
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mb-10">
                        {course.description}
                    </p>

                    <div className="flex flex-wrap gap-8 text-sm font-medium text-gray-300 border-t border-gray-700/50 pt-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-800 rounded-lg">
                                <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Duration</p>
                                <p className="text-white">{details.examDetails.duration}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-800 rounded-lg">
                                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Questions</p>
                                <p className="text-white">{details.examDetails.questions}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-800 rounded-lg">
                                <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Language</p>
                                <p className="text-white">English</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Structured Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Skills Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </span>
                            <h3 className="text-xl font-bold text-gray-900">Skills You Will Gain</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {details.skills.map(skill => (
                                <span key={skill} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold border border-gray-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                         <div className="flex items-center gap-3 mb-6">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </span>
                            <h3 className="text-xl font-bold text-gray-900">Description</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg mb-8">{details.longDescription}</p>
                        
                        <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Prerequisites</h4>
                        <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
                            <ul className="grid md:grid-cols-2 gap-4">
                                {details.prerequisites.map((req, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                                        <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Syllabus Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                         <div className="flex items-center gap-3 mb-8">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            </span>
                            <h3 className="text-xl font-bold text-gray-900">Exam Domains</h3>
                        </div>
                        
                        <div className="space-y-6">
                            {details.syllabus.map((mod, i) => (
                                <div key={i} className="group border border-gray-100 rounded-xl overflow-hidden hover:border-rose-200 hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4 bg-gray-50/80 px-6 py-4 border-b border-gray-100 group-hover:bg-rose-50/30">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-500 shadow-sm group-hover:border-rose-200 group-hover:text-rose-600">
                                            {i + 1}
                                        </div>
                                        <h4 className="font-bold text-gray-900 flex-grow">{mod.module}</h4>
                                    </div>
                                    <div className="p-6 bg-white">
                                        <div className="flex flex-wrap gap-x-8 gap-y-3">
                                            {mod.topics.map((t, j) => (
                                                <div key={j} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-200 group-hover:bg-rose-400"></span>
                                                    {t}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    
                    {/* Action Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-rose-100 sticky top-4 z-10">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Ready to certify?</h3>
                            <p className="text-sm text-gray-500 mt-1">Join thousands of certified professionals.</p>
                        </div>
                        
                        <button 
                            onClick={onGetCertified} 
                            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-rose-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 mb-6"
                        >
                            <span>Register for Exam</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </button>
                        
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                <span className="text-gray-500">Format</span>
                                <span className="font-semibold text-gray-900">{details.examDetails.format}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                <span className="text-gray-500">Passing Score</span>
                                <span className="font-semibold text-green-600">{details.examDetails.passingScore}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Validity</span>
                                <span className="font-semibold text-gray-900">{details.examDetails.validity}</span>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            Secure payment & proctoring
                        </div>
                    </div>

                    {/* Career Roles Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                         <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            Career Opportunities
                        </h3>
                         <p className="text-sm text-gray-500 mb-4">Professionals with this certification often work as:</p>
                         <div className="flex flex-wrap gap-2">
                            {details.careerRoles.map(role => (
                                <span key={role} className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200">
                                    {role}
                                </span>
                            ))}
                         </div>
                    </div>
                    
                    {/* Testimonial Placeholder */}
                    <div className="bg-gradient-to-br from-rose-600 to-pink-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                        <svg className="absolute top-4 right-4 text-white/10 w-16 h-16 transform rotate-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C9.00003 16.5523 8.55231 17 8.00003 17C7.44775 17 7.00003 16.5523 7.00003 16H4.00003C2.89546 16 2.00003 15.1046 2.00003 14V5C2.00003 3.89543 2.89546 3 4.00003 3H20C21.1046 3 22 3.89543 22 5V18C22 19.1046 21.1046 20 20 20H15.6569L14.017 21Z" /></svg>
                        <p className="relative z-10 text-rose-100 italic text-sm mb-4">"This certification was the key to my promotion. The syllabus is perfectly aligned with industry standards."</p>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="h-8 w-8 rounded-full bg-white/20"></div>
                            <div>
                                <p className="text-xs font-bold text-white">Sarah Jenkins</p>
                                <p className="text-[10px] text-rose-200">Senior DevOps Engineer</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};


// --- Main Certificates Component ---
interface CertificatesProps {
    certificateRequests: CertificateRequest[];
    onAddCertificateRequest: (data: Omit<CertificateRequest, 'id' | 'status'>) => void;
    onStartExam: (course: Course) => void;
    setStudentView?: (view: string) => void;
}

const Certificates: React.FC<CertificatesProps> = ({ certificateRequests, onAddCertificateRequest, onStartExam, setStudentView }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    React.useEffect(() => {
        fetchCourses().then(setCourses).catch(console.error);
    }, []);

    const handleViewDetails = (course: Course) => {
        setSelectedCourse(course);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToList = () => {
        setSelectedCourse(null);
    };

    const handlePayment = (details: { coupon: string }) => {
        if (!selectedCourse) return;

        // Check for SDK
        if (!(window as any).Razorpay) {
            toast.error("Razorpay SDK not loaded. Check internet connection.");
            return;
        }
        // derive prefill values from localStorage if available (best-effort)
        let prefillName = 'Valued Student';
        let prefillEmail = '';
        try {
            const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
            if (profile && profile.name) prefillName = profile.name;
            if (profile && profile.email) prefillEmail = profile.email;
        } catch (e) {
            // ignore
        }

        const finalPrice = (details && details.coupon && details.coupon.trim().toUpperCase() === 'INTERNALPASS')
            ? Math.max(1, Math.round(selectedCourse?.price ? selectedCourse.price * 0.1 : 1))
            : selectedCourse?.price;

        const options = {
            key: "rzp_test_ROER8sbtNhHp1n", // Test Key
            amount: finalPrice * 100, // Amount in paise
            currency: "INR",
            name: "Orivon Academy",
            description: `Exam Fee: ${selectedCourse?.title}`,
            image: "https://image2url.com/images/1762859802432-99ab7a34-86b4-4395-a7e4-831fe8fc2dbf.png",
            handler: function (response: any) {
                // Success Callback
                // 1. Close Modal
                setShowPaymentModal(false);

                // Record transaction on backend (best-effort)
                (async () => {
                    try {
                        const accessToken = localStorage.getItem('access_token') || '';
                        await fetch('http://localhost:8000/payments/record_transaction', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`
                            },
                            body: JSON.stringify({ price: finalPrice, payment_id: response.razorpay_payment_id, course_title: selectedCourse?.title, coupon: details?.coupon || null })
                        });
                    } catch (err) {
                        console.error('Failed to record transaction', err);
                    }
                })();

                // 2. Add Request
                onAddCertificateRequest({
                    studentName: prefillName,
                    email: prefillEmail,
                    enrollmentId: `CERT-${response.razorpay_payment_id.slice(-6).toUpperCase()}`, // Use part of payment ID
                    courseName: selectedCourse?.title,
                    duration: `Started: ${new Date().toLocaleDateString()}`
                });

                // 3. Create a temporary course object representing this paid course
                const courseForExam: Course = {
                    id: Date.now(),
                    title: selectedCourse?.title,
                    description: selectedCourse?.description,
                    author: 'Orivon Academy',
                    durationMinutes: 120, // Default duration
                    progress: 0,
                    imageUrl: selectedCourse?.imageUrl,
                };

                // 4. Persist recent paid course(s) and navigate to My Certifications page
                try {
                    const prev = JSON.parse(localStorage.getItem('recentPaidCourses') || '[]');
                    const toSave = {
                        id: courseForExam.id,
                        title: courseForExam.title,
                        description: courseForExam.description,
                        imageUrl: courseForExam.imageUrl
                    };
                    // keep most recent first, limit to 10
                    const merged = [toSave, ...prev.filter((p: any) => p.title !== toSave.title)].slice(0, 10);
                    localStorage.setItem('recentPaidCourses', JSON.stringify(merged));
                } catch (e) {
                    console.error('Failed to persist recentPaidCourses', e);
                }

                if (setStudentView) {
                    setStudentView('yourCourses');
                } else {
                    // fallback: navigate to same route if available
                    window.location.href = window.location.pathname;
                }

                // 5. Toast
                toast.success(`Payment Successful! ID: ${response.razorpay_payment_id}`);
                toast.success("Added to My Certifications. Start the exam from there when ready.");
            },
            prefill: {
                name: prefillName,
                email: prefillEmail,
                contact: "9999999999", // Dummy contact
            },
            theme: {
                color: "#e11d48", // Rose color
            },
        };

        const rzp = new (window as any).Razorpay(options);
        
        // Handle failure
        rzp.on('payment.failed', function (response: any){
            toast.error(`Payment Failed: ${response.error.description}`);
        });

        rzp.open();
    };

    if (selectedCourse) {
        return (
            <>
                <CertificationDetail 
                    course={selectedCourse}
                    onBack={handleBackToList} 
                    onGetCertified={() => setShowPaymentModal(true)} 
                />
                {showPaymentModal && (
                    <CertificationPaymentModal 
                        course={selectedCourse}
                        onClose={() => setShowPaymentModal(false)}
                        onPay={handlePayment}
                    />
                )}
            </>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Courses</h2>
                    <p className="text-gray-500 mt-1">Validate your expertise with industry-recognized credentials.</p>
                </div>
            </div>

            {/* List of Available Certifications */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full cursor-pointer" onClick={() => handleViewDetails(course)}>
                        <div className="relative h-56 overflow-hidden">
                            <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-xs font-bold text-gray-800 border border-gray-200 shadow-sm uppercase tracking-wide">
                                    {course.badge}
                                </span>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow relative">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors line-clamp-2">{course.title}</h3>
                            <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">{course.description}</p>
                            <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Course</span>
                                <span className="text-rose-600 font-semibold text-sm group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                    View Details <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Previous Requests Section */}
            {/* <div className="mt-12">
                <h3 className="text-xl font-bold text-gray-800 mb-6">My Certification History</h3>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Certification</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {certificateRequests.length > 0 ? (
                                certificateRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{req.courseName}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{req.duration.includes(' to ') ? req.duration.split(' to ')[1] : req.duration}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                                req.status === 'Issued' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.status === 'Issued' ? (
                                                <button className="text-rose-600 hover:text-rose-800 text-sm font-medium">Download</button>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Processing</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No certification history found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div> */}
        </div>
    );
};

export default Certificates;
