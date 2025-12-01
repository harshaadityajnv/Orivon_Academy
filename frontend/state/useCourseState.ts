
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Course, CourseTrack } from '../types';
import { TRACKS } from '../data/tracks';

export const useCourseState = () => {
    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
    const [catalogCourses, setCatalogCourses] = useState<CourseTrack[]>(TRACKS);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<CourseTrack | null>(null);

    const handleDeleteCourse = (title: string) => {
        if (window.confirm(`Are you sure you want to delete the course "${title}"? This action cannot be undone.`)) {
            setCatalogCourses(prev => prev.filter(c => c.title !== title));
            toast.success('Course deleted successfully!');
        }
    };

    const openAddCourseModal = () => {
        setEditingCourse(null);
        setIsCourseModalOpen(true);
    };

    const openEditCourseModal = (course: CourseTrack) => {
        setEditingCourse(course);
        setIsCourseModalOpen(true);
    };
    
    const closeCourseModal = () => {
        setIsCourseModalOpen(false);
        setEditingCourse(null);
    }

    const handleSaveCourse = (courseData: CourseTrack) => {
        if (editingCourse) {
            setCatalogCourses(prev => prev.map(c => c.title === editingCourse.title ? courseData : c));
            toast.success('Course updated successfully!');
        } else {
            if (catalogCourses.some(c => c.title === courseData.title)) {
                toast.error('A course with this title already exists.');
                return;
            }
            setCatalogCourses(prev => [...prev, courseData]);
            toast.success('Course added successfully!');
        }
        closeCourseModal();
    };

    const addEnrolledCourses = (newCourses: Course[]) => {
        setEnrolledCourses(prev => [...prev, ...newCourses]);
    };

    useEffect(() => {
        // Try fetching catalog courses from common backend endpoints (handle dev port differences)
        const endpoints = [
            'http://localhost:8000/courses',
            'http://127.0.0.1:8000/courses',
            'http://localhost:8001/courses',
            'http://127.0.0.1:8001/courses',
            // final fallback: same origin (if proxying)
            '/courses'
        ];

        (async () => {
            for (const url of endpoints) {
                try {
                    const res = await fetch(url, { cache: 'no-store' });
                    if (!res.ok) {
                        // try next
                        continue;
                    }
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        const mapped: CourseTrack[] = data.map((r: any) => ({
                            title: String(r.title || ''),
                            badge: String(r.badge || ''),
                            desc: String(r.desc || r.description || ''),
                            img: String(r.img || ''),
                            price: Number(r.price || 0),
                            originalPrice: Number(r.price || 0)
                        }));
                        setCatalogCourses(mapped);
                        console.info('Loaded catalog from', url);
                        return;
                    }
                } catch (err) {
                    // ignore and try next endpoint
                    // console.warn('courses fetch failed for', url, err);
                }
            }
            console.warn('Could not load courses from backend, using local TRACKS');
        })();
    }, []);

    return {
        enrolledCourses,
        setEnrolledCourses,
        catalogCourses,
        isCourseModalOpen,
        editingCourse,
        handleDeleteCourse,
        openAddCourseModal,
        openEditCourseModal,
        closeCourseModal,
        handleSaveCourse,
        addEnrolledCourses
    };
};
