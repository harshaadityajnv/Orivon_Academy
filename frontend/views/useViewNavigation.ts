import React, { useState } from 'react';
import { Course, AnalyticsData } from '../types';
import { StudentView } from '../pages/student/StudentDashboard';
import { AdminView } from '../pages/admin/AdminDashboard';

export type View = 'landing' | 'courseDetail' | 'exam' | 'analytics' | 'certificate' | 'googleAuth';

export const useViewNavigation = () => {
    const [view, setView] = useState<View>('landing');
    const [studentView, setStudentView] = useState<StudentView>('yourCourses');
    const [adminView, setAdminView] = useState<AdminView>('analytics');
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const handleStartExam = async (course: Course) => {
        setSelectedCourse(course);
        // Create an attempt record in backend so we can update it on completion
        try {
            const API_BASE = (window as any).__API_BASE || 'http://localhost:8000';
            const token = localStorage.getItem('access_token') || '';
            const res = await fetch(`${API_BASE}/exams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ title: course.title, certification_id: String(course.id) })
            });
            if (res.ok) {
                const data = await res.json();
                if (data?.exma_id) {
                    try { localStorage.setItem('currentExamRecordId', String(data.exma_id)); } catch(_){ }
                }
            } else {
                const text = await res.text().catch(() => '');
                console.warn('Failed to create exam record', res.status, text);
            }
        } catch (err) {
            console.warn('Error creating exam record', err);
        }
        setView('exam');
    };
    
    const handleViewCourse = (course: Course) => {
        setSelectedCourse(course);
        setView('courseDetail');
    };

    const handleReturnFromCourse = (
        timeSpentMinutes: number,
        setEnrolledCourses: React.Dispatch<React.SetStateAction<Course[]>>
    ) => {
        if (selectedCourse) {
            setEnrolledCourses(prevCourses =>
                prevCourses.map(c =>
                    c.id === selectedCourse.id
                    ? { ...c, durationMinutes: c.durationMinutes + timeSpentMinutes }
                    : c
                )
            );
        }
        setView('landing');
        setSelectedCourse(null);
    };
  
    const handleBackToDashboard = () => {
        setView('landing');
        setSelectedCourse(null);
        setAnalyticsData(null);
    };
  
    const handleExamComplete = async (data: Omit<AnalyticsData, 'course'>) => {
        if (selectedCourse) {
            setAnalyticsData({ ...data, course: selectedCourse });
            // Update backend exam record if present
            try {
                const exId = localStorage.getItem('currentExamRecordId');
                if (exId) {
                    const API_BASE = (window as any).__API_BASE || 'http://localhost:8000';
                    const token = localStorage.getItem('access_token') || '';
                    // compute percentage for storing in DB and determine pass (>= 75)
                    const percent = (data.totalQuestions && data.totalQuestions > 0)
                        ? Math.round((data.score / data.totalQuestions) * 100)
                        : data.score;
                    const passed = percent >= 75;

                    // Build payload required by backend: exma_id, title, passing_score, questions, nameofuser, certification_id
                    const exma_id = exId;
                    const title = selectedCourse.title;
                    const certification_id = String((selectedCourse as any).id);
                    const questions = data.totalQuestions || 0;
                    const userJson = localStorage.getItem('user');
                    const nameofuser = userJson ? (JSON.parse(userJson || '{}').name || JSON.parse(userJson || '{}').displayName || JSON.parse(userJson || '{}').email) : '';

                    await fetch(`${API_BASE}/exams/${exId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { Authorization: `Bearer ${token}` } : {})
                        },
                        body: JSON.stringify({ exma_id, title, certification_id, passing_score: percent, questions, nameofuser, pass_status: passed })
                    });
                    // If passed, mark for certificate availability
                    if (passed) {
                        try {
                            // store to let YourCourses pick it up when returning
                            localStorage.setItem('lastPassedCourseId', JSON.stringify(selectedCourse.id));
                        } catch (_) {}
                        // dispatch event asynchronously so we don't trigger other components' setState
                        // while React is updating this component (avoids "update during render" errors)
                        setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('examPassed', { detail: { courseId: selectedCourse.id } }));
                        }, 0);
                    }
                    // cleanup current exam record id
                    localStorage.removeItem('currentExamRecordId');
                }
            } catch (err) {
                console.warn('Failed to update exam record', err);
            }
            setView('analytics');
        }
    };

    return {
        view,
        setView,
        studentView,
        setStudentView,
        adminView,
        setAdminView,
        analyticsData,
        selectedCourse,
        setSelectedCourse,
        handleStartExam,
        handleViewCourse,
        handleReturnFromCourse,
        handleBackToDashboard,
        handleExamComplete
    };
};