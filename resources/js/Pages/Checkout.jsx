import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import CartDrawer from '../Components/CartDrawer';
import { CartProvider, useCart } from '../context/CartContext';
import { BANGLADESH_DIVISIONS, COUPONS, calculateDeliveryFee } from '../constants/bangladeshGeo';
import { 
    Truck, 
    ShieldCheck, 
    CreditCard, 
    MapPin, 
    Phone, 
    User, 
    Mail,
    Check, 
    ArrowRight,
    ArrowLeft,
    ShoppingBag,
    Gift,
    Tag,
    Trash2,
    Plus,
    Minus,
    HelpCircle,
    Info,
    Lock,
    MessageCircle,
    CheckCircle2,
    Calendar,
    Printer,
    Sparkles,
    AlertCircle
} from 'lucide-react';

function CheckoutContent() {
    const { cart, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();

    // Customer Form State
    const [form, setForm] = useState(() => {
        try {
            const saved = localStorage.getItem('paharika_checkout_customer');
            if (saved) return JSON.parse(saved);
        } catch {}
        return {
            name: '',
            phone: '',
            altPhone: '',
            email: '',
            divisionId: 'dhaka',
            districtId: 'dhaka-city',
            upazila: 'ধানমন্ডি (Dhanmondi)',
            address: '',
            landmark: '',
            deliveryType: 'home', // 'home' | 'pickup'
            deliveryNote: '',
            paymentMethod: 'cod', // 'cod' | 'mfs' | 'card'
            mfsProvider: 'bkash', // 'bkash' | 'nagad' | 'rocket'
            mfsSenderNumber: '',
            mfsTrxId: '',
            giftWrap: false,
            giftMessage: '',
            agreeTerms: true,
            saveInfo: true,
        };
    });

    // Coupon & Order State
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    // Current division & district lookup
    const currentDivision = BANGLADESH_DIVISIONS.find(d => d.id === form.divisionId) || BANGLADESH_DIVISIONS[0];
    const currentDistrict = currentDivision.districts.find(d => d.id === form.districtId) || currentDivision.districts[0];

    // Handle Division change
    const handleDivisionChange = (divisionId) => {
        const division = BANGLADESH_DIVISIONS.find(d => d.id === divisionId) || BANGLADESH_DIVISIONS[0];
        const firstDistrict = division.districts[0];
        setForm(prev => ({
            ...prev,
            divisionId,
            districtId: firstDistrict.id,
            upazila: firstDistrict.upazilas[0] || '',
        }));
    };

    // Handle District change
    const handleDistrictChange = (districtId) => {
        const district = currentDivision.districts.find(d => d.id === districtId) || currentDivision.districts[0];
        setForm(prev => ({
            ...prev,
            districtId,
            upazila: district.upazilas[0] || '',
        }));
    };

    // Delivery calculation
    const deliveryInfo = calculateDeliveryFee(form.divisionId, form.districtId, cartTotal);
    const deliveryFee = deliveryInfo.fee;
    const giftWrapFee = form.giftWrap ? 50 : 0;

    // Coupon Calculation
    let couponDiscount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.type === 'percentage') {
            couponDiscount = Math.round((cartTotal * appliedCoupon.value) / 100);
        } else if (appliedCoupon.type === 'fixed') {
            couponDiscount = Math.min(appliedCoupon.value, cartTotal);
        }
    }

    const grandTotal = Math.max(0, cartTotal + deliveryFee + giftWrapFee - couponDiscount);

    // Free delivery progress
    const freeDeliveryThreshold = 2000;
    const remainingForFree = Math.max(0, freeDeliveryThreshold - cartTotal);
    const freeDeliveryProgress = Math.min(100, Math.round((cartTotal / freeDeliveryThreshold) * 100));

    // Multi-vendor grouping
    const groupedCart = cart.reduce((groups, item) => {
        const vendor = item.vendor || 'পাহাড়িকা কারিগর সমবায়';
        if (!groups[vendor]) groups[vendor] = [];
        groups[vendor].push(item);
        return groups;
    }, {});

    // Save info to local storage
    useEffect(() => {
        if (form.saveInfo) {
            try {
                localStorage.setItem('paharika_checkout_customer', JSON.stringify({
                    name: form.name,
                    phone: form.phone,
                    altPhone: form.altPhone,
                    email: form.email,
                    divisionId: form.divisionId,
                    districtId: form.districtId,
                    upazila: form.upazila,
                    address: form.address,
                    landmark: form.landmark,
                    deliveryType: form.deliveryType,
                    saveInfo: true,
                }));
            } catch {}
        }
    }, [form]);

    // Apply Coupon
    const handleApplyCoupon = (codeToApply) => {
        const targetCode = (codeToApply || couponInput).trim().toUpperCase();
        setCouponError('');

        if (!targetCode) {
            setCouponError('অনুগ্রহ করে কুপন কোড লিখুন');
            return;
        }

        const coupon = COUPONS[targetCode];
        if (coupon) {
            setAppliedCoupon(coupon);
            setCouponInput(targetCode);
            setCouponError('');
        } else {
            setCouponError('দুঃখিত, কুপনটি সঠিক নয় বা মেয়াদোত্তীর্ণ হয়েছে');
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponInput('');
        setCouponError('');
    };

    // Validation & Submit
    const handleSubmitOrder = (e) => {
        e.preventDefault();
        const errors = {};

        if (!form.name.trim()) {
            errors.name = 'আপনার পূর্ণ নাম লিখুন';
        }

        // Validate Bangladeshi mobile number
        const cleanPhone = form.phone.replace(/[\s-]/g, '');
        if (!cleanPhone) {
            errors.phone = 'সক্রিয় মোবাইল নম্বর প্রদান করুন';
        } else if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
            errors.phone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)';
        }

        if (!form.address.trim()) {
            errors.address = 'বাসা/রোড/এলাকা বা বিস্তারিত ঠিকানা লিখুন';
        }

        if (form.paymentMethod === 'mfs') {
            if (!form.mfsSenderNumber.trim()) {
                errors.mfsSenderNumber = 'যে নম্বর থেকে টাকা পাঠিয়েছেন তা লিখুন';
            }
            if (!form.mfsTrxId.trim()) {
                errors.mfsTrxId = 'ট্রানজেকশন আইডি (TrxID) লিখুন';
            }
        }

        if (!form.agreeTerms) {
            errors.agreeTerms = 'শর্তাবলী মেনে নিয়ে অর্ডার নিশ্চিত করুন';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            window.scrollTo({ top: 300, behavior: 'smooth' });
            return;
        }

        setFormErrors({});

        const newOrderId = '#PH-' + Math.floor(2000 + Math.random() * 8000);
        
        // Calculate estimated delivery date range
        const today = new Date();
        const minDays = deliveryInfo.days.includes('২-৩') ? 2 : 3;
        const maxDays = deliveryInfo.days.includes('২-৩') ? 3 : 5;
        
        const estMin = new Date(today);
        estMin.setDate(today.getDate() + minDays);
        const estMax = new Date(today);
        estMax.setDate(today.getDate() + maxDays);

        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const estDateText = `${estMin.toLocaleDateString('bn-BD', options)} থেকে ${estMax.toLocaleDateString('bn-BD', options)}`;

        const snapshot = {
            orderId: newOrderId,
            orderDate: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            estimatedDelivery: estDateText,
            form: { ...form },
            divisionName: currentDivision.bnName,
            districtName: currentDistrict.bnName,
            cart: [...cart],
            cartTotal,
            deliveryFee,
            giftWrapFee,
            couponDiscount,
            appliedCoupon,
            grandTotal,
            deliveryZone: deliveryInfo.zone,
        };

        setOrderData(snapshot);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // If order submitted, display rich Order Confirmation / Thank You Page
    if (submitted && orderData) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Celebration Banner */}
                    <div className="text-center">
                        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-8 ring-emerald-500/5 animate-pulse">
                            <CheckCircle2 className="size-12" />
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-forest-deep px-4 py-1 text-xs font-bold text-white uppercase tracking-wider">
                            <Sparkles className="size-3 text-accent" /> অর্ডার সফলভাবে সম্পন্ন হয়েছে (Order Confirmed)
                        </span>
                        <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
                            ধন্যবাদ, {orderData.form.name}!
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
                            আপনার অর্ডারটি গৃহীত হয়েছে। পার্বত্য চট্টগ্রামের বিশ্বস্ত কারিগর ও জুমচাষী পরিবারগুলো আপনার পণ্য প্রস্তুতকরণ শুরু করেছে।
                        </p>
                    </div>

                    {/* Order Reference Card */}
                    <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                        <div className="bg-primary/5 px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">অর্ডার ট্র্যাকিং আইডি</span>
                                <p className="font-mono text-xl font-bold text-primary">{orderData.orderId}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">সম্ভাব্য ডেলিভারি</span>
                                <p className="text-xs font-bold text-foreground flex items-center gap-1">
                                    <Calendar className="size-3.5 text-accent" /> {orderData.estimatedDelivery}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 space-y-6">
                            {/* Status Notification note */}
                            <div className="flex items-start gap-3 rounded-2xl bg-amber-500/10 p-4 text-xs text-amber-900 border border-amber-500/20">
                                <Info className="size-5 shrink-0 text-amber-600 mt-0.5" />
                                <div>
                                    <p className="font-semibold">এসএমএস ও ট্র্যাকিং নোটিফিকেশন:</p>
                                    <p className="mt-0.5 text-amber-800">
                                        আপনার মোবাইল নম্বর (<span className="font-mono font-bold">{orderData.form.phone}</span>)-এ অর্ডার কনফার্মেশনের এসএমএস পাঠানো হয়েছে। কুরিয়ারে হস্তান্তর করা মাত্রই লাইভ ট্র্যাকিং আপডেট পেয়ে যাবেন।
                                    </p>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="space-y-3 rounded-2xl border border-border p-4 text-xs bg-muted/20">
                                    <h3 className="font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
                                        <MapPin className="size-4 text-primary" /> ডেলিভারি তথ্য
                                    </h3>
                                    <p><span className="text-muted-foreground">প্রাপক:</span> <strong className="text-foreground">{orderData.form.name}</strong></p>
                                    <p><span className="text-muted-foreground">ফোন:</span> <strong className="text-foreground font-mono">{orderData.form.phone}</strong></p>
                                    <p>
                                        <span className="text-muted-foreground">ঠিকানা:</span>{' '}
                                        <span className="text-foreground">{orderData.form.address}, {orderData.form.upazila}, {orderData.districtName}, {orderData.divisionName}</span>
                                    </p>
                                    {orderData.form.landmark && (
                                        <p><span className="text-muted-foreground">ল্যান্ডমার্ক:</span> <span className="text-foreground">{orderData.form.landmark}</span></p>
                                    )}
                                    <p>
                                        <span className="text-muted-foreground">ডেলিভারির ধরন:</span>{' '}
                                        <span className="font-semibold text-primary">
                                            {orderData.form.deliveryType === 'home' ? '🏠 হোম ডেলিভারি (ঠিকানায় সরাসরি)' : '📦 নিকটস্থ কুরিয়ার পয়েন্ট পিকআপ'}
                                        </span>
                                    </p>
                                    {orderData.form.deliveryNote && (
                                        <p><span className="text-muted-foreground">কুরিয়ার নোট:</span> <span className="italic text-foreground">"{orderData.form.deliveryNote}"</span></p>
                                    )}
                                </div>

                                <div className="space-y-3 rounded-2xl border border-border p-4 text-xs bg-muted/20">
                                    <h3 className="font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
                                        <CreditCard className="size-4 text-primary" /> পেমেন্ট ও খরচের সারাংশ
                                    </h3>
                                    <p>
                                        <span className="text-muted-foreground">পেমেন্ট মেথড:</span>{' '}
                                        <strong className="text-foreground">
                                            {orderData.form.paymentMethod === 'cod' && 'ক্যাশ অন ডেলিভারি (পণ্য পেয়ে টাকা দিন)'}
                                            {orderData.form.paymentMethod === 'mfs' && `${orderData.form.mfsProvider.toUpperCase()} মোবাইল পেমেন্ট (TrxID: ${orderData.form.mfsTrxId})`}
                                            {orderData.form.paymentMethod === 'card' && 'কার্ড / ইন্টারনেট ব্যাংকিং'}
                                        </strong>
                                    </p>
                                    <div className="space-y-1.5 pt-2 border-t border-border">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">পণ্য মূল্য:</span>
                                            <span className="font-medium text-foreground">৳ {orderData.cartTotal.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">ডেলিভারি চার্জ ({orderData.deliveryZone}):</span>
                                            <span className="font-medium text-foreground">
                                                {orderData.deliveryFee === 0 ? <span className="font-bold text-emerald-600">ফ্রি (Free)</span> : `৳ ${orderData.deliveryFee}`}
                                            </span>
                                        </div>
                                        {orderData.giftWrapFee > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">ইকো গিফট র্যাপিং:</span>
                                                <span className="font-medium text-foreground">৳ ৫০</span>
                                            </div>
                                        )}
                                        {orderData.couponDiscount > 0 && (
                                            <div className="flex justify-between text-emerald-600">
                                                <span>কুপন ছাড় ({orderData.appliedCoupon?.code}):</span>
                                                <span className="font-bold">- ৳ {orderData.couponDiscount.toLocaleString('en-IN')}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm font-bold pt-2 border-t border-border">
                                            <span>সর্বমোট প্রদেয়:</span>
                                            <span className="font-display text-primary text-base">৳ {orderData.grandTotal.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ordered items breakdown */}
                            <div className="pt-2">
                                <h3 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                                    <ShoppingBag className="size-4 text-primary" /> অর্ডারকৃত আইটেমসমূহ
                                </h3>
                                <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
                                    {orderData.cart.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3.5 bg-card hover:bg-muted/30 transition-colors text-xs">
                                            <div className="flex items-center gap-3">
                                                <img src={item.image} alt="" className="size-12 rounded-xl object-cover border border-border" />
                                                <div>
                                                    <p className="font-semibold text-foreground">{item.name}</p>
                                                    <p className="text-[11px] text-muted-foreground">ভেন্ডর: {item.vendor || 'Paharika Artisan Co-op'} · পরিমাণ: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <span className="font-display font-bold text-foreground">
                                                ৳ {(item.price * item.quantity).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Action Buttons */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border">
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href={`/track-order?order=${orderData.orderId}`}
                                        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-primary-foreground hover:bg-forest-deep shadow-sm transition-all"
                                    >
                                        লাইভ অর্ডার ট্র্যাক করুন <ArrowRight className="size-4" />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => window.print()}
                                        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                                    >
                                        <Printer className="size-4 text-muted-foreground" /> ইনভয়েস প্রিন্ট / সংরক্ষণ
                                    </button>
                                </div>

                                <Link
                                    href="/shop"
                                    onClick={() => clearCart()}
                                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                                >
                                    আরও কেনাকাটা চালিয়ে যান <ArrowRight className="size-3" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Page Header */}
            <div className="border-b border-border bg-secondary/40">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-0.5 text-[11px] font-bold text-emerald-700">
                                    <Lock className="size-3" /> নিরাপদ ও এনক্রিপ্টেড চেকআউট
                                </span>
                                <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-semibold text-accent">
                                    Guest Checkout
                                </span>
                            </div>
                            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                পাহাড়ি পণ্যের চেকআউট (Order Checkout)
                            </h1>
                            <p className="mt-1 text-xs text-muted-foreground">
                                লগইন ছাড়াই দ্রুত অর্ডার করুন। আপনার তথ্য শতভাগ সুরক্ষিত।
                            </p>
                        </div>

                        {/* Free Shipping Progress in Header */}
                        <div className="w-full sm:w-80 rounded-2xl border border-border bg-card p-3 shadow-xs">
                            <div className="flex justify-between items-center text-xs mb-1.5">
                                <span className="font-semibold text-foreground flex items-center gap-1">
                                    <Truck className="size-3.5 text-primary" /> ফ্রি ডেলিভারি
                                </span>
                                <span className="text-[11px] font-bold text-primary">
                                    {remainingForFree === 0 ? '🎉 অর্জিত!' : `আর ৳ ${remainingForFree} যোগ করুন`}
                                </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                                <div 
                                    className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                                    style={{ width: `${freeDeliveryProgress}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1 text-right">
                                ৳২,০০০ বা তার বেশি অর্ডারে দেশব্যাপী ফ্রি হোম ডেলিভারি
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Form Content */}
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {cart.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center max-w-lg mx-auto">
                        <ShoppingBag className="mx-auto size-12 text-muted-foreground/50" />
                        <h2 className="mt-4 font-display text-xl font-bold text-foreground">আপনার কার্ট বর্তমানে খালি</h2>
                        <p className="mt-2 text-xs text-muted-foreground">
                            অর্ডার সম্পন্ন করতে অনুগ্রহ করে পাহাড়ি শপ থেকে পণ্য যোগ করুন।
                        </p>
                        <Link
                            href="/shop"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-primary-foreground hover:bg-forest-deep shadow-sm"
                        >
                            পাহাড়ি পণ্যসমূহ দেখুন <ArrowRight className="size-4" />
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmitOrder} className="grid gap-10 lg:grid-cols-12 items-start">
                        {/* LEFT COLUMN: Customer Info, Shipping & Payment (7 Cols) */}
                        <div className="lg:col-span-7 space-y-6">

                            {/* 1. Customer Info */}
                            <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-5">
                                <div className="flex items-center justify-between border-b border-border pb-3">
                                    <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                                        <User className="size-4 text-primary" /> ১. কাস্টমারের তথ্য (Customer Info)
                                    </h2>
                                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        লগইন ছাড়াই অর্ডার
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-foreground mb-1">
                                            পূর্ণ নাম <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            placeholder="যেমন: আয়েশা রহমান"
                                            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none transition-colors ${
                                                formErrors.name ? 'border-red-500 bg-red-50/20' : 'border-input bg-background focus:border-primary'
                                            }`}
                                        />
                                        {formErrors.name && (
                                            <p className="mt-1 text-[11px] text-red-600">{formErrors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-foreground mb-1">
                                            মোবাইল নম্বর <span className="text-red-500">*</span> (কুরিয়ার কল করবে)
                                        </label>
                                        <input
                                            type="tel"
                                            inputMode="tel"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            placeholder="01XXXXXXXXX"
                                            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none transition-colors font-mono ${
                                                formErrors.phone ? 'border-red-500 bg-red-50/20' : 'border-input bg-background focus:border-primary'
                                            }`}
                                        />
                                        {formErrors.phone && (
                                            <p className="mt-1 text-[11px] text-red-600">{formErrors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-foreground mb-1">
                                            বিকল্প মোবাইল নম্বর (ঐচ্ছিক)
                                        </label>
                                        <input
                                            type="tel"
                                            inputMode="tel"
                                            value={form.altPhone}
                                            onChange={(e) => setForm({ ...form, altPhone: e.target.value })}
                                            placeholder="01XXXXXXXXX (পরিবারের অন্য কারও)"
                                            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-foreground mb-1">
                                            ইমেইল ঠিকানা (ঐচ্ছিক - ইনভয়েসের জন্য)
                                        </label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            placeholder="example@mail.com"
                                            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground select-none">
                                        <input
                                            type="checkbox"
                                            checked={form.saveInfo}
                                            onChange={(e) => setForm({ ...form, saveInfo: e.target.checked })}
                                            className="size-3.5 rounded accent-primary cursor-pointer"
                                        />
                                        <span>ভবিষ্যতের কেনাকাটার সুবিধার্থে এই ডিভাইসে আমার তথ্য সংরক্ষণ করুন</span>
                                    </label>
                                </div>
                            </div>

                            {/* 2. Delivery Address */}
                            <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-5">
                                <div className="flex items-center justify-between border-b border-border pb-3">
                                    <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                                        <MapPin className="size-4 text-primary" /> ২. ডেলিভারি ঠিকানা (Delivery Address)
                                    </h2>
                                    <span className="text-[11px] font-semibold text-accent">
                                        {deliveryInfo.days} এ ডেলিভারি
                                    </span>
                                </div>

                                {/* Cascading Region Selection */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-foreground mb-1">
                                            বিভাগ (Division) <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.divisionId}
                                            onChange={(e) => handleDivisionChange(e.target.value)}
                                            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary cursor-pointer"
                                        >
                                            {BANGLADESH_DIVISIONS.map(div => (
                                                <option key={div.id} value={div.id}>{div.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-foreground mb-1">
                                            জেলা (District) <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.districtId}
                                            onChange={(e) => handleDistrictChange(e.target.value)}
                                            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary cursor-pointer"
                                        >
                                            {currentDivision.districts.map(dist => (
                                                <option key={dist.id} value={dist.id}>{dist.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-foreground mb-1">
                                            উপজেলা / থানা <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.upazila}
                                            onChange={(e) => setForm({ ...form, upazila: e.target.value })}
                                            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary cursor-pointer"
                                        >
                                            {currentDistrict.upazilas.map(up => (
                                                <option key={up} value={up}>{up}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Detailed Street / House Address */}
                                <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1">
                                        বাসা নং, রোড নং, এলাকা / গ্রাম <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={form.address}
                                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                                        placeholder="যেমন: বাসা নং ৪২, রোড নং ১১, ধানমন্ডি"
                                        className={`w-full rounded-xl border p-3 text-xs outline-none transition-colors ${
                                            formErrors.address ? 'border-red-500 bg-red-50/20' : 'border-input bg-background focus:border-primary'
                                        }`}
                                    />
                                    {formErrors.address && (
                                        <p className="mt-1 text-[11px] text-red-600">{formErrors.address}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1">
                                        পরিচিত ল্যান্ডমার্ক (ঐচ্ছিক)
                                    </label>
                                    <input
                                        type="text"
                                        value={form.landmark}
                                        onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                                        placeholder="যেমন: বায়তুল আমান জামে মসজিদের পাশে / স্কুল মোড়"
                                        className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs outline-none focus:border-primary"
                                    />
                                </div>

                                {/* Delivery Type Selection */}
                                <div>
                                    <label className="block text-xs font-semibold text-foreground mb-2">
                                        ডেলিভারির ধরন (Delivery Method)
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <label className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition-all ${
                                            form.deliveryType === 'home' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-muted/30'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="deliveryType"
                                                checked={form.deliveryType === 'home'}
                                                onChange={() => setForm({ ...form, deliveryType: 'home' })}
                                                className="mt-0.5 size-4 accent-primary"
                                            />
                                            <div>
                                                <p className="font-semibold text-xs text-foreground">🏠 সরাসরি হোম ডেলিভারি</p>
                                                <p className="text-[11px] text-muted-foreground mt-0.5">আপনার বাসা বা অফিসের ঠিকানায় সরাসরি কুরিয়ার পৌঁছে দেবে।</p>
                                            </div>
                                        </label>

                                        <label className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition-all ${
                                            form.deliveryType === 'pickup' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-muted/30'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="deliveryType"
                                                checked={form.deliveryType === 'pickup'}
                                                onChange={() => setForm({ ...form, deliveryType: 'pickup' })}
                                                className="mt-0.5 size-4 accent-primary"
                                            />
                                            <div>
                                                <p className="font-semibold text-xs text-foreground">📦 কুরিয়ার হাব পিকআপ</p>
                                                <p className="text-[11px] text-muted-foreground mt-0.5">নিকটস্থ সুন্দরবন / রেডএক্স / স্টেডফাস্ট শাখা থেকে তুলে নিন।</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Delivery instructions */}
                                <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1">
                                        কুরিয়ার ডেলিভারি নির্দেশিকা (ঐচ্ছিক)
                                    </label>
                                    <input
                                        type="text"
                                        value={form.deliveryNote}
                                        onChange={(e) => setForm({ ...form, deliveryNote: e.target.value })}
                                        placeholder="যেমন: বিকেল ৩টার পর কল করবেন / সিকিউরিটি গার্ডের কাছে রাখবেন"
                                        className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            {/* 3. Payment Method */}
                            <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-5">
                                <div className="flex items-center justify-between border-b border-border pb-3">
                                    <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                                        <CreditCard className="size-4 text-primary" /> ৩. পেমেন্ট মেথড (Payment Options)
                                    </h2>
                                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                                        <ShieldCheck className="size-3.5" /> ১০০% নিরাপদ
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {/* Option 1: Cash on Delivery (COD) */}
                                    <label className={`block rounded-2xl border p-4 cursor-pointer transition-all ${
                                        form.paymentMethod === 'cod' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-muted/20'
                                    }`}>
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                checked={form.paymentMethod === 'cod'}
                                                onChange={() => setForm({ ...form, paymentMethod: 'cod' })}
                                                className="mt-1 size-4 accent-primary"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-bold text-xs text-foreground">💵 ক্যাশ-অন-ডেলিভারি (Cash on Delivery)</p>
                                                    <span className="rounded-full bg-forest-deep/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                                                        সবচেয়ে জনপ্রিয়
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground mt-1">
                                                    পণ্য হাতে পেয়ে দেখে ডেলিভারি ম্যানকে মূল্য পরিশোধ করুন। কোনো অগ্রিম পেমেন্টের ঝুঁকি নেই।
                                                </p>
                                                {form.paymentMethod === 'cod' && (
                                                    <div className="mt-3 rounded-xl bg-background/80 p-3 text-[11px] text-muted-foreground border border-border flex items-start gap-2">
                                                        <Info className="size-4 text-accent shrink-0 mt-0.5" />
                                                        <span>
                                                            <strong>পাহাড়িকা নিশ্চয়তা:</strong> সাজেক, বান্দরবান ও খাগড়াছড়ি থেকে তাজা ফল ও হস্তশিল্প সরাসরি প্রেরিত হয়। আপনার অর্ডারটি সম্মানিত কারিগরদের প্রেরণা যোগায়।
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </label>

                                    {/* Option 2: bKash / Nagad / Rocket */}
                                    <label className={`block rounded-2xl border p-4 cursor-pointer transition-all ${
                                        form.paymentMethod === 'mfs' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-muted/20'
                                    }`}>
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                checked={form.paymentMethod === 'mfs'}
                                                onChange={() => setForm({ ...form, paymentMethod: 'mfs' })}
                                                className="mt-1 size-4 accent-primary"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-bold text-xs text-foreground">📱 বিকাশ / নগদ / রকেট (bKash / Nagad / Rocket)</p>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
                                                        <span className="bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded font-bold">bKash</span>
                                                        <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">Nagad</span>
                                                    </div>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground mt-1">
                                                    মোবাইল ব্যাংকিংয়ের মাধ্যমে সহজে ও দ্রুত পেমেন্ট সম্পন্ন করুন।
                                                </p>

                                                {/* Sub-inputs if MFS selected */}
                                                {form.paymentMethod === 'mfs' && (
                                                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-semibold text-foreground">মাধ্যম নির্বাচন করুন:</span>
                                                            <div className="flex gap-2">
                                                                {['bkash', 'nagad', 'rocket'].map(mfs => (
                                                                    <button
                                                                        type="button"
                                                                        key={mfs}
                                                                        onClick={() => setForm({ ...form, mfsProvider: mfs })}
                                                                        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                                                                            form.mfsProvider === mfs 
                                                                                ? 'bg-primary text-white shadow-xs' 
                                                                                : 'border border-border bg-card text-foreground hover:bg-muted'
                                                                        }`}
                                                                    >
                                                                        {mfs}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="rounded-xl bg-primary/5 p-3 text-xs border border-primary/20 space-y-1">
                                                            <p className="text-muted-foreground">
                                                                আমাদের অফিশিয়াল <strong>{form.mfsProvider.toUpperCase()} মার্চেন্ট/পেমেন্ট নম্বর:</strong>
                                                            </p>
                                                            <p className="font-mono text-sm font-bold text-primary flex items-center justify-between">
                                                                <span>01712-384910</span>
                                                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded">মার্চেন্ট অ্যাকাউন্ট</span>
                                                            </p>
                                                            <p className="text-[10px] text-muted-foreground">
                                                                * মোট প্রদেয় <strong>৳ {grandTotal.toLocaleString('en-IN')}</strong> টাকা পেমেন্ট করে নিচের বক্সে তথ্য লিখুন।
                                                            </p>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                                            <div>
                                                                <label className="block text-[11px] font-semibold text-foreground mb-1">
                                                                    যে নম্বর থেকে পাঠিয়েছেন <span className="text-red-500">*</span>
                                                                </label>
                                                                <input
                                                                    type="tel"
                                                                    value={form.mfsSenderNumber}
                                                                    onChange={(e) => setForm({ ...form, mfsSenderNumber: e.target.value })}
                                                                    placeholder="01XXXXXXXXX"
                                                                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono"
                                                                />
                                                                {formErrors.mfsSenderNumber && (
                                                                    <p className="mt-1 text-[10px] text-red-600">{formErrors.mfsSenderNumber}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <label className="block text-[11px] font-semibold text-foreground mb-1">
                                                                    ট্রানজেকশন আইডি (TrxID) <span className="text-red-500">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={form.mfsTrxId}
                                                                    onChange={(e) => setForm({ ...form, mfsTrxId: e.target.value })}
                                                                    placeholder="যেমন: 9J4K829L1"
                                                                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono uppercase"
                                                                />
                                                                {formErrors.mfsTrxId && (
                                                                    <p className="mt-1 text-[10px] text-red-600">{formErrors.mfsTrxId}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </label>

                                    {/* Option 3: Cards & Net Banking */}
                                    <label className={`block rounded-2xl border p-4 cursor-pointer transition-all ${
                                        form.paymentMethod === 'card' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-muted/20'
                                    }`}>
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                checked={form.paymentMethod === 'card'}
                                                onChange={() => setForm({ ...form, paymentMethod: 'card' })}
                                                className="mt-1 size-4 accent-primary"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-bold text-xs text-foreground">💳 ডেবিট/ক্রেডিট কার্ড ও ইন্টারনেট ব্যাংকিং</p>
                                                    <span className="text-[10px] text-muted-foreground font-mono">VISA / MasterCard</span>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground mt-1">
                                                    SSLCommerz 256-bit এনক্রিপ্টেড সুরক্ষিত পেমেন্ট গেটওয়ের মাধ্যমে সরাসরি পরিশোধ করুন।
                                                </p>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* 4. Hill Craft Gift Packaging & Safety Notes */}
                            <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-4">
                                <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
                                    <Gift className="size-4 text-accent" /> ৪. বিশেষ উপহার ও পাহাড়ি পণ্যের সুরক্ষা
                                </h2>

                                <label className="flex items-start gap-3 cursor-pointer select-none rounded-2xl border border-border/80 bg-muted/20 p-4 hover:bg-muted/40 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={form.giftWrap}
                                        onChange={(e) => setForm({ ...form, giftWrap: e.target.checked })}
                                        className="mt-1 size-4 rounded accent-primary cursor-pointer"
                                    />
                                    <div className="flex-1 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-foreground">🎁 পাহাড়ি ইকো-ফ্রেন্ডলি গিফট প্যাকেজিং (+ ৳৫০)</span>
                                            <span className="font-mono font-bold text-primary">৳ ৫০</span>
                                        </div>
                                        <p className="text-muted-foreground text-[11px] mt-0.5">
                                            ঐতিহ্যবাহী পাহাড়ি পাট ও ক্রাফট পেপারে আকর্ষণীয় উপহারের মোড়ক এবং বিশেষ শুভেচ্ছা চিঠি।
                                        </p>
                                    </div>
                                </label>

                                {form.giftWrap && (
                                    <div className="pt-2 animate-fadeIn">
                                        <label className="block text-xs font-semibold text-foreground mb-1">
                                            প্রিয়জনের জন্য শুভেচ্ছা বার্তা (Gift Message)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={form.giftMessage}
                                            onChange={(e) => setForm({ ...form, giftMessage: e.target.value })}
                                            placeholder="যেমন: শুভ জন্মদিন! পাহাড়ের বিশুদ্ধ ভালোবাসাসহ..."
                                            className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-primary"
                                        />
                                    </div>
                                )}

                                {/* Perishable / Fresh food disclaimer */}
                                <div className="rounded-2xl border border-border/60 bg-emerald-500/5 p-4 text-[11px] text-muted-foreground space-y-1.5">
                                    <p className="font-semibold text-foreground flex items-center gap-1.5">
                                        <ShieldCheck className="size-4 text-emerald-600" /> পাহাড়ি কাঁচের জার ও ফলমূল প্যাকেজিং গ্যারান্টি:
                                    </p>
                                    <p>
                                        • মধু ও আচারের কাঁচের জার বিশেষ ডাবল-লেয়ার বাবলর্যাপ ও কুশন বক্সে প্যাক করা হয় যাতে পরিবহনে কোনো ক্ষতি না হয়।
                                    </p>
                                    <p>
                                        • তাজা আনারস, কমলা ও মৌসুমি ফল ২৪ ঘণ্টার মধ্যে ডেলিভারির পর কোনো ত্রুটি দেখা দিলে ছবিসহ জানালে তাৎক্ষণিক প্রতিস্থাপন করা হবে।
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sticky Order Summary & Vendor Grouping (5 Cols) */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-5 sticky top-24">
                                <div className="flex items-center justify-between border-b border-border pb-3">
                                    <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                                        <ShoppingBag className="size-4 text-primary" /> অর্ডার সারাংশ (Order Summary)
                                    </h2>
                                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-foreground">
                                        {cartCount} টি পণ্য
                                    </span>
                                </div>

                                {/* Multi-Vendor Grouped Cart Items */}
                                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                                    {Object.entries(groupedCart).map(([vendorName, items]) => (
                                        <div key={vendorName} className="rounded-2xl border border-border bg-muted/20 p-3 space-y-2.5">
                                            <div className="flex items-center justify-between text-[11px] font-bold text-primary pb-1.5 border-b border-border/60">
                                                <span>🏔️ {vendorName}</span>
                                                <span className="text-[10px] text-muted-foreground font-normal">আদিবাসী কারিগর</span>
                                            </div>

                                            <div className="space-y-3">
                                                {items.map(item => (
                                                    <div key={`${item.id}-${item.color}`} className="flex items-center gap-3">
                                                        <img
                                                            src={item.image}
                                                            alt=""
                                                            className="size-12 rounded-xl object-cover border border-border shrink-0"
                                                        />
                                                        <div className="flex-1 min-w-0 text-xs">
                                                            <p className="font-semibold text-foreground truncate">{item.name}</p>
                                                            <p className="text-[10px] text-muted-foreground">{item.color} · ৳ {item.price.toLocaleString('en-IN')}</p>
                                                            
                                                            {/* Quantity modifiers in order summary */}
                                                            <div className="mt-1 flex items-center gap-2">
                                                                <div className="flex items-center border border-border rounded-lg bg-background">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => updateQuantity(item.id, -1)}
                                                                        className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                                                                    >
                                                                        <Minus className="size-3" />
                                                                    </button>
                                                                    <span className="px-2 font-mono font-bold text-[11px] text-foreground">
                                                                        {item.quantity}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => updateQuantity(item.id, 1)}
                                                                        className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                                                                    >
                                                                        <Plus className="size-3" />
                                                                    </button>
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeFromCart(item.id)}
                                                                    className="text-muted-foreground hover:text-red-500 transition-colors p-1 cursor-pointer"
                                                                    title="আইটেমটি মুছুন"
                                                                >
                                                                    <Trash2 className="size-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <span className="font-display font-bold text-xs text-foreground shrink-0">
                                                            ৳ {(item.price * item.quantity).toLocaleString('en-IN')}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Coupon Promo Box */}
                                <div className="border-t border-border pt-4">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                            <Tag className="size-3.5 text-primary" /> কুপন কোড
                                        </label>
                                        {appliedCoupon && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveCoupon}
                                                className="text-[11px] font-semibold text-red-600 hover:underline cursor-pointer"
                                            >
                                                মুছে ফেলুন
                                            </button>
                                        )}
                                    </div>

                                    {appliedCoupon ? (
                                        <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-800">
                                            <span className="font-semibold flex items-center gap-1">
                                                <Check className="size-3.5 text-emerald-600" />
                                                <strong>{appliedCoupon.code}</strong> ({appliedCoupon.label})
                                            </span>
                                            <span className="font-bold text-emerald-700 font-mono">
                                                - ৳ {couponDiscount.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={couponInput}
                                                    onChange={(e) => setCouponInput(e.target.value)}
                                                    placeholder="PAHARIKA10 বা HILLLOVE"
                                                    className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary uppercase font-mono"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleApplyCoupon()}
                                                    className="rounded-xl bg-secondary px-4 py-2 text-xs font-bold text-foreground hover:bg-muted border border-border cursor-pointer transition-colors"
                                                >
                                                    প্রয়োগ
                                                </button>
                                            </div>
                                            {couponError && (
                                                <p className="text-[10px] text-red-600">{couponError}</p>
                                            )}

                                            {/* Quick suggestion chips */}
                                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-0.5">
                                                <span>সাজেস্টেড:</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleApplyCoupon('PAHARIKA10')}
                                                    className="underline hover:text-primary font-mono cursor-pointer"
                                                >
                                                    PAHARIKA10 (১০%)
                                                </button>
                                                <span>·</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleApplyCoupon('HILLLOVE')}
                                                    className="underline hover:text-primary font-mono cursor-pointer"
                                                >
                                                    HILLLOVE (৳১০০)
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Detailed Pricing Breakdown */}
                                <div className="border-t border-border pt-4 space-y-2 text-xs">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>পণ্যের উপমোট (Subtotal):</span>
                                        <span className="font-semibold text-foreground">৳ {cartTotal.toLocaleString('en-IN')}</span>
                                    </div>

                                    <div className="flex justify-between text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            ডেলিভারি চার্জ:
                                            <span className="text-[10px] text-muted-foreground/80">({deliveryInfo.zone})</span>
                                        </span>
                                        <span className="font-semibold">
                                            {deliveryFee === 0 ? (
                                                <span className="font-bold text-emerald-600">ফ্রি (Free Shipping)</span>
                                            ) : (
                                                `৳ ${deliveryFee}`
                                            )}
                                        </span>
                                    </div>

                                    {form.giftWrap && (
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>ইকো গিফট র্যাপিং:</span>
                                            <span className="font-semibold text-foreground">৳ ৫০</span>
                                        </div>
                                    )}

                                    {appliedCoupon && (
                                        <div className="flex justify-between text-emerald-600">
                                            <span>কুপন ডিসকাউন্ট:</span>
                                            <span className="font-bold font-mono">- ৳ {couponDiscount.toLocaleString('en-IN')}</span>
                                        </div>
                                    )}

                                    <div className="border-t border-border pt-3.5 flex justify-between items-baseline">
                                        <div>
                                            <span className="font-bold text-sm text-foreground block">সর্বমোট প্রদেয় টাকা:</span>
                                            <span className="text-[10px] text-muted-foreground">ভ্যাট সহ মোট মূল্য</span>
                                        </div>
                                        <span className="font-display font-bold text-2xl text-primary">
                                            ৳ {grandTotal.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>

                                {/* Terms & Conditions agreement */}
                                <div className="pt-2">
                                    <label className="flex items-start gap-2 cursor-pointer text-[11px] text-muted-foreground select-none">
                                        <input
                                            type="checkbox"
                                            checked={form.agreeTerms}
                                            onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                                            className="mt-0.5 size-3.5 rounded accent-primary cursor-pointer"
                                        />
                                        <span>
                                            আমি পাহাড়িকার <Link href="/terms" className="text-primary underline">শর্তাবলী</Link> ও <Link href="/return-policy" className="text-primary underline">রিটার্ন পলিসি</Link> মেনে অর্ডার করছি।
                                        </span>
                                    </label>
                                    {formErrors.agreeTerms && (
                                        <p className="mt-1 text-[10px] text-red-600">{formErrors.agreeTerms}</p>
                                    )}
                                </div>

                                {/* Place Order CTA */}
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 rounded-full bg-accent py-4 text-xs font-bold text-accent-foreground hover:bg-terracotta-deep transition-all shadow-md cursor-pointer active:scale-98"
                                >
                                    <Check className="size-4" /> 
                                    {form.paymentMethod === 'cod' ? 'ক্যাশ-অন-ডেলিভারিতে অর্ডার নিশ্চিত করুন' : 'অর্ডার নিশ্চিত করুন'}
                                </button>

                                {/* Trust & WhatsApp Assistance */}
                                <div className="pt-3 border-t border-border space-y-2 text-center text-xs">
                                    <div className="flex items-center justify-center gap-3 text-muted-foreground text-[11px]">
                                        <span className="flex items-center gap-1">
                                            <ShieldCheck className="size-3.5 text-primary" /> ১০০% খাঁটি পণ্য
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Lock className="size-3.5 text-primary" /> নিরাপদ চেকআউট
                                        </span>
                                    </div>

                                    <div className="pt-2 flex items-center justify-center gap-2">
                                        <a
                                            href="https://wa.me/8801712384910"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 hover:bg-emerald-600/20 px-4 py-1.5 text-[11px] font-semibold text-emerald-700 transition-colors"
                                        >
                                            <MessageCircle className="size-3.5" /> যেকোনো প্রশ্নে WhatsApp-এ লিখুন
                                        </a>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">
                                        হেল্পলাইন: <span className="font-mono font-bold">01712-384910</span> (সকাল ৯টা - রাত ১০টা)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            <Footer />
            <CartDrawer />
        </div>
    );
}

export default function Checkout() {
    return (
        <CartProvider>
            <Head>
                <title>চেকআউট — অর্গানিক বাজার চাই</title>
            </Head>
            <CheckoutContent />
        </CartProvider>
    );
}
