
import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
// Fix: Changed the import of 'CourseTrack' from '../../../components/LandingPage' to '../../../types' as it is defined in types.ts.
import { CourseTrack } from '../../../types';

interface PaymentProps {
    cartItems: CourseTrack[];
    onRemove: (title: string) => void;
    onCheckout: (paymentId: string) => void;
}

const Payment: React.FC<PaymentProps> = ({ cartItems, onRemove, onCheckout }) => {
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const subtotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.price, 0);
    }, [cartItems]);

    const total = subtotal - discount;

    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === 'SAVE10') {
            const discountAmount = subtotal * 0.10;
            setDiscount(discountAmount);
            toast.success('Coupon "SAVE10" applied! You get 10% off.');
        } else {
            setDiscount(0);
            toast.error('Invalid coupon code.');
        }
    };

    const handlePayment = () => {
        if (total <= 0) {
            toast.error("Cannot proceed with a payment of zero or less.");
            return;
        }

        if (!(window as any).Razorpay) {
            alert("Razorpay SDK not loaded. Check your internet connection.");
            return;
        }

        const storedUser = (() => {
            try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null }
        })();
        const accessToken = localStorage.getItem('access_token') || '';

        const options = {
            key: "rzp_test_ROER8sbtNhHp1n", // Replace with your actual Razorpay key
            amount: total * 100, // Amount in paise
            currency: "INR",
            name: "Orivon Academy",
            description: `Payment for ${cartItems.length} course(s)`,
            image: "https://image2url.com/images/1762859802432-99ab7a34-86b4-4395-a7e4-831fe8fc2dbf.png",
            handler: async function (response: any) {
                // Record the transaction on the backend
                try {
                    const priceRupees = Math.max(1, Math.round(total));
                    await fetch('http://localhost:8000/payments/record_transaction', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({ price: priceRupees, payment_id: response.razorpay_payment_id, course_title: cartItems.map(i => i.title).join(', ') })
                    });
                } catch (err) {
                    console.error('Failed to record transaction', err);
                }

                onCheckout(response.razorpay_payment_id);
            },
            prefill: {
                name: storedUser?.displayName || "Valued Student",
                email: storedUser?.email || "student@example.com",
                contact: "9999999999",
            },
            theme: {
                color: "#007BFF",
            },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };


    if (cartItems.length === 0) {
        return (
            <div className="text-center bg-white p-12 rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-2 text-xl font-medium text-gray-900">Your cart is empty</h3>
                <p className="mt-1 text-sm text-gray-500">Looks like you haven't added any certifications yet.</p>
            </div>
        )
    }

    return (
        <div>
            <h3 className="text-2xl font-bold text-dark mb-6">Your Cart</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold mb-4">Courses ({cartItems.length})</h4>
                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <div key={item.title} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                                <img src={item.img} alt={item.title} className="w-24 h-16 object-cover rounded-md"/>
                                <div className="flex-grow">
                                    <h5 className="font-bold text-dark">{item.title}</h5>
                                    <p className="text-sm text-gray-500">{item.badge}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">₹{item.price}</p>
                                    <button onClick={() => onRemove(item.title)} className="text-xs text-red-500 hover:underline">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-28">
                        <h4 className="text-lg font-semibold mb-4 border-b pb-2">Order Summary</h4>
                        <div className="space-y-3 text-gray-700">
                           <div className="flex justify-between">
                               <span>Subtotal</span>
                               <span>₹{subtotal.toFixed(2)}</span>
                           </div>
                           <div className="flex justify-between text-green-600">
                               <span>Discount</span>
                               <span>- ₹{discount.toFixed(2)}</span>
                           </div>
                           <div className="border-t pt-3 mt-3 flex justify-between font-bold text-dark text-xl">
                               <span>Total</span>
                               <span>₹{total.toFixed(2)}</span>
                           </div>
                        </div>

                        <div className="mt-6">
                            <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    id="coupon" 
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="e.g., SAVE10"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                />
                                <button onClick={handleApplyCoupon} className="bg-secondary hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-lg text-sm">Apply</button>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            className="w-full mt-6 bg-primary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-lg"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;