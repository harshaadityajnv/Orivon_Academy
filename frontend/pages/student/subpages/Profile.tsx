import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Course } from '../../../types';
import { formatDuration } from '../../../utils/formatDuration';

interface ProfileProps {
    enrolledCourses: Course[];
}

const Profile: React.FC<ProfileProps> = ({ enrolledCourses }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [user, setUser] = useState(() => {
        // Populate from localStorage 'user' if available
        try {
            const raw = localStorage.getItem('user');
            if (raw) {
                const u = JSON.parse(raw);
                return {
                    name: u?.name || u?.displayName || 'Valued Student',
                    headline: 'Aspiring Full-Stack Developer | Cloud Enthusiast',
                    email: u?.email || 'student@orivon.com',
                    bio: u?.bio || 'Passionate about learning new technologies. Currently focusing on mastering React, Node.js, and AWS Cloud architecture. Always eager to build scalable web applications.',
                    linkedin: u?.linkedin || 'linkedin.com/in/valuedstudent',
                    github: u?.github || 'github.com/valuedstudent'
                };
            }
        } catch (e) {
            // ignore parse errors
        }
        return {
            name: 'Valued Student',
            headline: 'Aspiring Full-Stack Developer | Cloud Enthusiast',
            email: 'student@orivon.com',
            bio: 'Passionate about learning new technologies. Currently focusing on mastering React, Node.js, and AWS Cloud architecture. Always eager to build scalable web applications.',
            linkedin: 'linkedin.com/in/valuedstudent',
            github: 'github.com/valuedstudent'
        };
    });

    const [aboutText, setAboutText] = useState(user.bio);

    useEffect(() => {
        setAboutText(user.bio);
    }, [user.bio]);

    const completedCourses = enrolledCourses.filter(c => c.progress === 100).length;
    const totalMinutes = enrolledCourses.reduce((acc, curr) => acc + curr.durationMinutes, 0);

    const handleSave = () => {
        setIsEditing(false);
        toast.success("Profile updated successfully!");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header / Banner */}
            <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-rose-500 to-orange-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                                <img 
                                    src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" 
                                    alt="Profile" 
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="absolute bottom-1 right-1 h-5 w-5 bg-green-500 border-2 border-white rounded-full" title="Online"></div>
                        </div>
                        <button 
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                isEditing 
                                ? 'bg-green-500 hover:bg-green-600 text-white shadow-md' 
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </button>
                    </div>

                    <div>
                        {isEditing ? (
                            <div className="space-y-3 max-w-lg">
                                <input 
                                    name="name"
                                    value={user.name}
                                    onChange={handleChange}
                                    className="text-2xl font-bold text-gray-900 w-full border-b border-gray-300 focus:border-rose-500 focus:outline-none py-1"
                                />
                                <input 
                                    name="headline"
                                    value={user.headline}
                                    onChange={handleChange}
                                    className="text-gray-500 w-full border-b border-gray-300 focus:border-rose-500 focus:outline-none py-1"
                                />
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                <p className="text-gray-500">{user.headline}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Personal Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            Personal Details
                        </h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email</label>
                                {isEditing ? (
                                    <input name="email" value={user.email} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1" />
                                ) : (
                                    <div className="text-gray-800 break-all">{user.email}</div>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1"></label>
                                {isEditing ? (
                                    <input name="phone" value={user.phone} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1" />
                                ) : (
                                    <div className="text-gray-800">{user.phone}</div>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1"></label>
                                {isEditing ? (
                                    <input name="location" value={user.location} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1" />
                                ) : (
                                    <div className="text-gray-800">{user.location}</div>
                                )}
                            </div>
                             <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1"></label>
                                <div className="text-gray-800 font-mono bg-gray-50 inline-block px-2 py-0.5 rounded border border-gray-200">{user.enrollmentId}</div>
                            </div>
                        </div>
                    </div>

                    {/* Social Links removed per request */}
                </div>

                {/* Right Column: Bio & Stats */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-900">About Me</h3>
                            <div>
                                {!isEditing && !isEditingAbout && (
                                    <button onClick={() => setIsEditingAbout(true)} className="text-xs text-rose-600 font-medium">Edit</button>
                                )}
                            </div>
                        </div>

                        {isEditing || isEditingAbout ? (
                            <div className="space-y-2">
                                <textarea
                                    name="bio"
                                    value={aboutText}
                                    onChange={(e) => setAboutText(e.target.value)}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-rose-200 focus:border-rose-400 focus:outline-none"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setUser(prev => ({ ...prev, bio: aboutText }));
                                            setIsEditingAbout(false);
                                            setIsEditing(false);
                                            toast.success('About updated');
                                        }}
                                        className="px-3 py-1 bg-rose-500 text-white rounded-md text-sm"
                                    >Save</button>
                                    <button onClick={() => { setAboutText(user.bio); setIsEditingAbout(false); }} className="px-3 py-1 border rounded-md text-sm">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600 leading-relaxed">
                                {user.bio}
                            </p>
                        )}
                    </div>

                    {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
                            <div className="text-3xl font-bold text-rose-600 mb-1">{enrolledCourses.length}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Active Courses</div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
                            <div className="text-3xl font-bold text-green-500 mb-1">{completedCourses}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Completed</div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
                            <div className="text-3xl font-bold text-orange-500 mb-1">{formatDuration(totalMinutes).split(' ')[0]}h</div>
                             <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Learning Time</div>
                        </div>
                    </div> */}

                    {/* Academic Journey removed per request */}
                </div>
            </div>
        </div>
    );
}

export default Profile;