
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CourseTrack, Course } from '../types';

// NOTE: This hook is partially deprecated as the application now uses direct purchasing.
// It is kept for potential future shopping cart features.
export const useCartState = () => {
    const [cartItems, setCartItems] = useState<CourseTrack[]>([]);
    
    const handleAddToCart = (
        courseToAdd: CourseTrack,
        enrolledCourses: Course[]
    ) => {
        if (enrolledCourses.some(c => c.title === courseToAdd.title)) {
            toast.error('You are already enrolled in this course.');
            return;
        }
        if (cartItems.some(c => c.title === courseToAdd.title)) {
            toast.error('This course is already in your cart.');
            return;
        }
        setCartItems(prev => [...prev, courseToAdd]);
        toast.success(`"${courseToAdd.title}" added to cart!`);
    };
    
    const handleRemoveFromCart = (courseTitle: string) => {
        setCartItems(prev => prev.filter(item => item.title !== courseTitle));
        toast.success(`"${courseTitle}" removed from cart.`);
    };

    const clearCart = () => {
        setCartItems([]);
    };
    
    return {
        cartItems,
        handleAddToCart,
        handleRemoveFromCart,
        clearCart
    };
};
