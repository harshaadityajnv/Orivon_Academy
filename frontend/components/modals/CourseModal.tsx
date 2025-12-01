
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { CourseTrack } from '../../types';

interface CourseModalProps {
    course: CourseTrack | null;
    onClose: () => void;
    onSave: (courseData: CourseTrack) => void;
}

const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, onSave }) => {
    // FIX: Initialize `price` to satisfy the CourseTrack type, which requires it.
    const [formData, setFormData] = useState<CourseTrack>({
        title: '',
        desc: '',
        badge: '',
        img: '',
        price: 0,
    });

    useEffect(() => {
        if (course) {
            setFormData(course);
        } else {
            // FIX: Reset form state including `price` when adding a new course.
            setFormData({ title: '', desc: '', badge: '', img: '', price: 0 });
        }
    }, [course]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Handle number conversion for price fields
        if (name === 'price' || name === 'originalPrice') {
            setFormData(prev => ({ ...prev, [name]: Number(value) || (name === 'originalPrice' ? undefined : 0) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.desc || !formData.badge || !formData.img) {
            toast.error("Please fill out all fields.");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg animate-fade-in-up">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-dark">{course ? 'Edit Course' : 'Add New Course'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required />
                    </div>
                    <div>
                        <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="desc" name="desc" value={formData.desc} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required />
                    </div>
                    <div>
                        <label htmlFor="badge" className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
                        <input type="text" id="badge" name="badge" value={formData.badge} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" placeholder="e.g., Certificate included" required />
                    </div>
                     <div>
                        <label htmlFor="img" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input type="text" id="img" name="img" value={formData.img} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" placeholder="https://example.com/image.jpg" required />
                    </div>
                     {/* FIX: Add inputs for price and originalPrice to manage all CourseTrack properties */}
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                             <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                             <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required min="0" />
                         </div>
                         <div>
                             <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹) <span className="text-xs text-gray-500">(Optional)</span></label>
                             <input type="number" id="originalPrice" name="originalPrice" value={formData.originalPrice || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" min="0" />
                         </div>
                     </div>
                     <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-secondary hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Save Course</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseModal;