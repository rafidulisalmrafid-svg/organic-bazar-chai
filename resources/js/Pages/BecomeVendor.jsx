import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import CartDrawer from '../Components/CartDrawer';
import { CartProvider } from '../context/CartContext';
import { 
    Store, 
    User, 
    FileText, 
    CreditCard, 
    ShieldCheck, 
    Upload, 
    Check, 
    CheckCircle2, 
    ArrowRight, 
    Image as ImageIcon,
    Phone,
    Mail,
    MapPin,
    AlertCircle,
    Info,
    Sparkles
} from 'lucide-react';

function BecomeVendorContent({ categories, districts, tribes }) {
    // Form state
    const [formData, setFormData] = useState({
        // 1. Personal Info
        fullName: '',
        email: '',
        phone: '',
        otpSent: false,
        otpCode: '',
        isPhoneVerified: false,
        nidFrontPreview: '/images/prod-shawl.jpg',
        nidBackPreview: '/images/cat-bamboo.jpg',

        // 2. Store Info
        storeName: '',
        category: 'Handloom Textiles',
        logoPreview: '/images/cat-textiles.jpg',
        coverPreview: '/images/hero.jpg', // Store cover photo!
        district: 'Rangamati',
        tribe: 'Chakma',
        address: '',
        storeDescription: '',

        // 3. Business Docs (OPTIONAL: dile hobe, na dile hobe)
        hasTradeLicense: false,
        tradeLicenseFile: '',
        hasTinCert: false,
        tinCertFile: '',
        binNumber: '',

        // 4. Payment Info
        paymentMethod: 'bkash', // 'bkash', 'nagad', 'bank'
        bankName: 'Islami Bank Bangladesh Ltd',
        branchName: 'Rangamati Branch',
        accountName: '',
        accountNumber: '',
        mobileBankingNumber: '',
        mobileBankingType: 'Merchant',

        // 5. Terms
        agreeTerms: false,
    });

    const [submitted, setSubmitted] = useState(false);
    const [applicationId, setApplicationId] = useState('');

    // OTP verification simulation
    const handleSendOtp = () => {
        if (!formData.phone || formData.phone.length < 10) {
            alert('অনুগ্রহ করে সঠিক মোবাইল নম্বর লিখুন (যেমন: 01712345678)');
            return;
        }
        setFormData({ ...formData, otpSent: true, otpCode: '4829' });
        alert('আপনার নম্বরে ওটিপি পাঠানো হয়েছে: 4829 (সিমুলেটেড কোড)');
    };

    const handleVerifyOtp = () => {
        if (formData.otpCode === '4829') {
            setFormData({ ...formData, isPhoneVerified: true });
            alert('মোবাইল নম্বর সফলভাবে ভেরিফাইড হয়েছে! ✔');
        } else {
            alert('ভুল ওটিপি কোড। অনুগ্রহ করে 4829 কোডটি ব্যবহার করুন।');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.phone) {
            alert('অনুগ্রহ করে আপনার ব্যক্তিগত তথ্য (নাম, ইমেইল ও ফোন) পূরণ করুন।');
            return;
        }

        if (!formData.storeName || !formData.address) {
            alert('অনুগ্রহ করে স্টোরের নাম এবং ব্যবসার পূর্ণ ঠিকানা পূরণ করুন।');
            return;
        }

        if (!formData.agreeTerms) {
            alert('আবেদন জমা দিতে পাহাড়িকা ভেন্ডর পলিসি ও শর্তাবলীতে সম্মতি প্রদান করুন।');
            return;
        }

        const newAppId = '#VAPP-' + Math.floor(104 + Math.random() * 90);
        setApplicationId(newAppId);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Confirmation Screen after submission
    if (submitted) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24 text-center">
                    <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CheckCircle2 className="size-12" />
                    </div>

                    <span className="mt-6 inline-block rounded-full bg-forest-deep px-4 py-1.5 text-xs font-bold text-white uppercase tracking-widest shadow-xs">
                        আবেদন স্ট্যাটাস: পেন্ডিং (Pending Review)
                    </span>

                    <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-foreground">
                        আপনার আবেদন জমা হয়েছে, অ্যাডমিন রিভিউ করছে।
                    </h1>

                    <p className="mt-3 text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
                        ধন্যবাদ <span className="font-semibold text-foreground">{formData.fullName}</span>। আপনার স্টোর <span className="font-semibold text-foreground">"{formData.storeName}"</span>-এর আবেদনটি সফলভাবে আমাদের সিস্টেমে নথিভুক্ত হয়েছে।
                    </p>

                    {/* Reference Card */}
                    <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8 text-left shadow-sm space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
                            <div>
                                <span className="text-xs text-muted-foreground font-semibold">আবেদন রেফারেন্স নম্বর:</span>
                                <p className="font-mono text-xl font-bold text-primary">{applicationId}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-bold text-xs">
                                Verification in Progress
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <p className="text-muted-foreground font-medium">স্টোরের নাম:</p>
                                <p className="font-semibold text-foreground mt-0.5">{formData.storeName}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium">ক্যাটাগরি ও জেলা:</p>
                                <p className="font-semibold text-foreground mt-0.5">{formData.category} · {formData.district}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium">ইমেইল কনফার্মেশন প্রেরিত:</p>
                                <p className="font-semibold text-foreground mt-0.5 font-mono">{formData.email}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium">পেমেন্ট মেথড:</p>
                                <p className="font-semibold text-foreground mt-0.5 capitalize">{formData.paymentMethod} Payment</p>
                            </div>
                        </div>

                        {/* Email Simulation Note */}
                        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3 text-xs">
                            <Mail className="size-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-foreground">ইমেইল নোটিফিকেশন কনফার্মেশন:</p>
                                <p className="text-muted-foreground mt-0.5">
                                    একটি কনফার্মেশন বার্তা ভেন্ডরের ইমেইলে পাঠানো হয়েছে। অ্যাডমিন অনুমোদন প্রদান করলে ইমেইলের মাধ্যমে তাৎক্ষণিক লগইন পাসওয়ার্ড ও স্টোর অ্যাক্সেস পাঠানো হবে।
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs font-bold text-primary-foreground hover:bg-forest-deep shadow-md"
                        >
                            সুপার অ্যাডমিন ড্যাশবোর্ডে আবেদনটি দেখুন <ArrowRight className="size-4" />
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold text-foreground hover:bg-muted"
                        >
                            হোমপেজে ফিরে যান
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Top Banner */}
            <section className="relative overflow-hidden bg-forest-deep py-14 sm:py-20 text-center text-primary-foreground">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 border border-accent/30 px-3.5 py-1 text-xs font-semibold text-sand uppercase tracking-widest">
                        <Sparkles className="size-3.5 text-accent" /> Sell With Us — ভেন্ডর হিসেবে যোগ দিন
                    </span>
                    <h1 className="mt-4 font-display text-3xl sm:text-5xl font-bold tracking-tight text-ivory">
                        পাহাড়িকা ভেন্ডর সমবায় ও কারিগর রেজিস্ট্রেশন
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-primary-foreground/80 leading-relaxed">
                        আপনার হাতে তৈরি তাঁতশিল্প, পাহাড়ি অরগানিক খাদ্য, বাঁশ-বেত ও মৃৎশিল্প পৌঁছে দিন দেশব্যাপী হাজারো ক্রেতার কাছে।
                    </p>
                </div>
            </section>

            {/* Registration Form Container */}
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="space-y-10">

                    {/* ================= SECTION 1: PERSONAL INFO ================= */}
                    <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-border">
                            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                ১
                            </span>
                            <div>
                                <h2 className="font-display text-lg font-bold text-foreground">
                                    ব্যক্তিগত তথ্য (Personal Information)
                                </h2>
                                <p className="text-xs text-muted-foreground">আবেদনকারী প্রতিনিধি বা কারিগরের ব্যক্তিগত পরিচয়।</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    পূর্ণ নাম (Full Name) *
                                </label>
                                <input 
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="আপনার জাতীয় পরিচয়পত্র অনুযায়ী নাম"
                                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-xs outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    ইমেইল অ্যাড্রেস (Email Address) *
                                </label>
                                <input 
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="example@mail.com"
                                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-xs outline-none focus:border-primary font-mono"
                                />
                            </div>
                        </div>

                        {/* Phone & OTP Verification */}
                        <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                                মোবাইল নম্বর (ভেরিফিকেশনের জন্য OTP যাবে) *
                            </label>
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="01XXXXXXXXX"
                                    className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-xs outline-none focus:border-primary font-mono"
                                />
                                {!formData.isPhoneVerified ? (
                                    <button 
                                        type="button" 
                                        onClick={handleSendOtp}
                                        className="rounded-xl bg-secondary px-5 py-3 text-xs font-bold text-primary hover:bg-secondary/80 border border-border cursor-pointer whitespace-nowrap"
                                    >
                                        OTP পাঠান
                                    </button>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded-xl bg-primary/10 border border-primary/20 px-4 py-3 text-xs font-bold text-primary whitespace-nowrap">
                                        <Check className="size-4" /> ভেরিফাইড (Verified)
                                    </span>
                                )}
                            </div>

                            {formData.otpSent && !formData.isPhoneVerified && (
                                <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-secondary/30 border border-border">
                                    <input 
                                        type="text"
                                        value={formData.otpCode}
                                        onChange={(e) => setFormData({ ...formData, otpCode: e.target.value })}
                                        placeholder="৪ সংখ্যার কোড লিখুন (যেমন: 4829)"
                                        className="w-36 rounded-lg border border-input bg-background px-3 py-2 text-xs font-mono font-bold"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleVerifyOtp}
                                        className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-forest-deep"
                                    >
                                        কোড নিশ্চিত করুন
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* NID Upload Preview */}
                        <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                                জাতীয় পরিচয়পত্র কপি আপলোড (NID Card Front & Back) *
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="rounded-2xl border-2 border-dashed border-border p-4 text-center bg-secondary/20 hover:border-primary transition-colors cursor-pointer">
                                    <img src={formData.nidFrontPreview} alt="NID Front" className="h-24 w-full object-cover rounded-xl mx-auto border" />
                                    <p className="mt-2 text-xs font-semibold text-foreground flex items-center justify-center gap-1.5">
                                        <Upload className="size-3.5 text-primary" /> NID সামনের পাতা (সংযুক্ত)
                                    </p>
                                </div>
                                <div className="rounded-2xl border-2 border-dashed border-border p-4 text-center bg-secondary/20 hover:border-primary transition-colors cursor-pointer">
                                    <img src={formData.nidBackPreview} alt="NID Back" className="h-24 w-full object-cover rounded-xl mx-auto border" />
                                    <p className="mt-2 text-xs font-semibold text-foreground flex items-center justify-center gap-1.5">
                                        <Upload className="size-3.5 text-primary" /> NID পেছনের পাতা (সংযুক্ত)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================= SECTION 2: STORE INFO & COVER ================= */}
                    <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-border">
                            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                ২
                            </span>
                            <div>
                                <h2 className="font-display text-lg font-bold text-foreground">
                                    স্টোর ও ব্যবসার তথ্য (Store Details & Cover Banner)
                                </h2>
                                <p className="text-xs text-muted-foreground">আপনার দোকান বা সমবায়ের ব্র্যান্ডিং ও বিবরণ।</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    স্টোরের নাম (Store Name) *
                                </label>
                                <input 
                                    type="text"
                                    required
                                    value={formData.storeName}
                                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                    placeholder="যেমন: মারমা ক্রাফট কুটির"
                                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-xs outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    স্টোরের ধরন / ক্যাটাগরি *
                                </label>
                                <select 
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-xs outline-none focus:border-primary cursor-pointer"
                                >
                                    {categories.map(c => (
                                        <option key={c.name} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Store Cover Photo & Logo (Explicitly requested feature) */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {/* Logo */}
                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    স্টোরের লোগো (Store Logo)
                                </label>
                                <div className="rounded-2xl border-2 border-dashed border-border p-3 text-center bg-secondary/20">
                                    <img src={formData.logoPreview} alt="Logo" className="size-20 rounded-full object-cover mx-auto border" />
                                    <p className="mt-2 text-[11px] text-muted-foreground">লোগো সংযুক্ত আছে</p>
                                </div>
                            </div>

                            {/* Store Cover Photo Banner */}
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    স্টোরের কভার ফটো (Store Cover Photo Banner)
                                </label>
                                <div className="rounded-2xl border-2 border-dashed border-border p-3 text-center bg-secondary/20">
                                    <img src={formData.coverPreview} alt="Cover Banner" className="h-20 w-full object-cover rounded-xl border" />
                                    <p className="mt-2 text-[11px] text-muted-foreground">
                                        ব্যানার প্রিভিউ (প্রোফাইলে সুন্দরভাবে প্রদর্শিত হবে)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Address & District */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    মূল জেলা (Hill District) *
                                </label>
                                <select 
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-xs outline-none focus:border-primary"
                                >
                                    {districts.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    আদিবাসী সম্প্রদায় (Tribe / Community)
                                </label>
                                <select 
                                    value={formData.tribe}
                                    onChange={(e) => setFormData({ ...formData, tribe: e.target.value })}
                                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-xs outline-none focus:border-primary"
                                >
                                    {tribes.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                                ব্যবসার সম্পূর্ণ ঠিকানা (Workplace / Shop Address) *
                            </label>
                            <textarea 
                                rows={2}
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="উপজেলা, পাড়া/গ্রাম, পোস্ট কোড ও সম্পূর্ণ সড়ক ঠিকানা"
                                className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                                স্টোরের সংক্ষিপ্ত বিবরণ (Store Story & Products)
                            </label>
                            <textarea 
                                rows={3}
                                value={formData.storeDescription}
                                onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                                placeholder="আপনার স্টোরে কী ধরনের ঐতিহ্যবাহী পাহাড়ি পণ্য পাওয়া যাবে এবং কারিগরদের ঐতিহ্য বর্ণনা করুন..."
                                className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* ================= SECTION 3: BUSINESS DOCS (OPTIONAL) ================= */}
                    <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                    ৩
                                </span>
                                <div>
                                    <h2 className="font-display text-lg font-bold text-foreground">
                                        ব্যবসায়িক ডকুমেন্ট (Business Verification Docs)
                                    </h2>
                                    <p className="text-xs text-muted-foreground">ট্রেড লাইসেন্স, টিআইএন বা ভ্যাট সংক্রান্ত কাগজপত্র।</p>
                                </div>
                            </div>
                            <span className="rounded-full bg-secondary text-primary px-3 py-1 text-xs font-bold border border-border">
                                সম্পূর্ণ ঐচ্ছিক (Optional)
                            </span>
                        </div>

                        {/* Informational Banner */}
                        <div className="rounded-2xl border border-border bg-secondary/30 p-4 flex items-start gap-3 text-xs">
                            <Info className="size-5 text-accent shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-foreground">ডকুমেন্ট দিলে হবে, না দিলে হবে:</p>
                                <p className="text-muted-foreground mt-0.5 leading-relaxed">
                                    পাহাড়ি প্রান্তিক কারিগর ও তাঁতিদের জন্য ট্রেড লাইসেন্স বাধ্যতামূলক নয়। থাকলে আপলোড করতে পারেন, না থাকলে খালি রেখেও ফর্মটি সফলভাবে জমা দেওয়া যাবে।
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {/* Trade License */}
                            <div className="p-4 rounded-2xl border border-border bg-background space-y-2">
                                <p className="text-xs font-bold text-foreground">ট্রেড লাইসেন্স (যদি থাকে)</p>
                                <div className="rounded-xl border border-dashed border-input p-3 text-center text-xs text-muted-foreground hover:border-primary cursor-pointer">
                                    <Upload className="size-5 text-muted-foreground mx-auto mb-1" />
                                    <span>কপি আপলোড করুন</span>
                                </div>
                            </div>

                            {/* TIN Certificate */}
                            <div className="p-4 rounded-2xl border border-border bg-background space-y-2">
                                <p className="text-xs font-bold text-foreground">TIN সার্টিফিকেট (যদি থাকে)</p>
                                <div className="rounded-xl border border-dashed border-input p-3 text-center text-xs text-muted-foreground hover:border-primary cursor-pointer">
                                    <Upload className="size-5 text-muted-foreground mx-auto mb-1" />
                                    <span>কপি আপলোড করুন</span>
                                </div>
                            </div>

                            {/* BIN / VAT */}
                            <div className="p-4 rounded-2xl border border-border bg-background space-y-2">
                                <p className="text-xs font-bold text-foreground">BIN / ভ্যাট নম্বর (যদি থাকে)</p>
                                <input 
                                    type="text"
                                    value={formData.binNumber}
                                    onChange={(e) => setFormData({ ...formData, binNumber: e.target.value })}
                                    placeholder="BIN-XXXXXXXXX"
                                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs outline-none font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ================= SECTION 4: PAYMENT INFO ================= */}
                    <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-border">
                            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                ৪
                            </span>
                            <div>
                                <h2 className="font-display text-lg font-bold text-foreground">
                                    পেমেন্ট তথ্য (Payment Info for Vendor Payout)
                                </h2>
                                <p className="text-xs text-muted-foreground">পণ্য বিক্রির পর আপনার টাকা পাওয়ার সঠিক মাধ্যম নির্ধারণ করুন।</p>
                            </div>
                        </div>

                        {/* Payment Selector Pills */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                                formData.paymentMethod === 'bkash' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border'
                            }`}>
                                <input 
                                    type="radio" 
                                    name="pay" 
                                    checked={formData.paymentMethod === 'bkash'} 
                                    onChange={() => setFormData({ ...formData, paymentMethod: 'bkash' })} 
                                    className="accent-primary" 
                                />
                                <div>
                                    <p className="font-bold text-xs text-foreground">মোবাইল ব্যাংকিং (bKash / Nagad)</p>
                                    <p className="text-[11px] text-muted-foreground">বিকাশ বা নগদ নম্বরে সহজে টাকা গ্রহণ।</p>
                                </div>
                            </label>

                            <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                                formData.paymentMethod === 'bank' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border'
                            }`}>
                                <input 
                                    type="radio" 
                                    name="pay" 
                                    checked={formData.paymentMethod === 'bank'} 
                                    onChange={() => setFormData({ ...formData, paymentMethod: 'bank' })} 
                                    className="accent-primary" 
                                />
                                <div>
                                    <p className="font-bold text-xs text-foreground">ব্যাংক অ্যাকাউন্ট (Bank Account)</p>
                                    <p className="text-[11px] text-muted-foreground">সরাসরি যেকোনা ব্যাংক অ্যাকাউন্টে পে-আউট।</p>
                                </div>
                            </label>
                        </div>

                        {/* Mobile Banking Fields */}
                        {formData.paymentMethod === 'bkash' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-secondary/20 border border-border">
                                <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                                        বিকাশ / নগদ মোবাইল নম্বর *
                                    </label>
                                    <input 
                                        type="text"
                                        required
                                        value={formData.mobileBankingNumber}
                                        onChange={(e) => setFormData({ ...formData, mobileBankingNumber: e.target.value })}
                                        placeholder="01XXXXXXXXX"
                                        className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-xs outline-none font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                                        অ্যাকাউন্টের ধরন
                                    </label>
                                    <select 
                                        value={formData.mobileBankingType}
                                        onChange={(e) => setFormData({ ...formData, mobileBankingType: e.target.value })}
                                        className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-xs outline-none"
                                    >
                                        <option value="Personal">Personal (পার্সোনাল)</option>
                                        <option value="Merchant">Merchant (মার্চেন্ট)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Bank Account Fields */}
                        {formData.paymentMethod === 'bank' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-secondary/20 border border-border">
                                <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1.5">ব্যাংকের নাম *</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.bankName} 
                                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} 
                                        className="w-full rounded-xl border border-input bg-card px-4 py-2 text-xs" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1.5">ব্রাঞ্চের নাম *</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.branchName} 
                                        onChange={(e) => setFormData({ ...formData, branchName: e.target.value })} 
                                        className="w-full rounded-xl border border-input bg-card px-4 py-2 text-xs" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1.5">অ্যাকাউন্ট হোল্ডারের নাম *</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.accountName} 
                                        onChange={(e) => setFormData({ ...formData, accountName: e.target.value })} 
                                        className="w-full rounded-xl border border-input bg-card px-4 py-2 text-xs" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1.5">অ্যাকাউন্ট নম্বর *</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.accountNumber} 
                                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} 
                                        className="w-full rounded-xl border border-input bg-card px-4 py-2 text-xs font-mono" 
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ================= SECTION 5: TERMS & AGREEMENTS ================= */}
                    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input 
                                type="checkbox"
                                required
                                checked={formData.agreeTerms}
                                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                                className="mt-1 size-4 accent-primary"
                            />
                            <span className="text-xs text-foreground leading-relaxed">
                                আমি পাহাড়িকা মার্কেটপ্লেসের <span className="font-semibold text-primary underline">Terms & Conditions</span> এবং <span className="font-semibold text-primary underline">Vendor Marketplace Policy</span> পড়েছি এবং তাতে পূর্ণ সম্মতি জানাচ্ছি। আমি নিশ্চিত করছি যে আমার প্রদত্ত তথ্য ও পণ্য সম্পূর্ণ খাঁটি।
                            </span>
                        </label>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-border flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-full bg-accent px-9 py-4 text-xs font-bold text-accent-foreground hover:bg-terracotta-deep transition-all shadow-md active:scale-98 cursor-pointer"
                            >
                                <Check className="size-4" /> ভেন্ডর আবেদন জমা দিন (Submit Application)
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <Footer />
            <CartDrawer />
        </div>
    );
}

export default function BecomeVendor(props) {
    return (
        <CartProvider>
            <Head>
                <title>ভেন্ডর ও কৃষক আবেদন (Sell With Us) — অর্গানিক বাজার চাই</title>
                <meta name="description" content="খাঁটি অর্গানিক ও কৃষিজাত পণ্য বিক্রির জন্য ভেন্ডর বা সেলার হিসেবে আবেদন করুন — অর্গানিক বাজার চাই।" />
            </Head>
            <BecomeVendorContent {...props} />
        </CartProvider>
    );
}
