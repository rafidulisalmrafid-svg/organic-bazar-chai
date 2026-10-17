import React, { useState } from 'react';
import { 
    Sliders, 
    Plus, 
    Edit2, 
    Trash2, 
    MoveUp, 
    MoveDown, 
    Eye, 
    EyeOff, 
    Upload, 
    Link as LinkIcon, 
    Check, 
    X, 
    Sparkles, 
    Image as ImageIcon,
    ExternalLink
} from 'lucide-react';

export default function AdminHeroStudio({ initialSlides = [] }) {
    const [slides, setSlides] = useState(initialSlides);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title_bn: '',
        title_en: '',
        subtitle_bn: '',
        subtitle_en: '',
        badge_bn: '১০০% খাঁটি পাহাড়ি পণ্য',
        badge_en: '100% Authentic Hill Products',
        button_text_bn: 'পণ্য দেখুন',
        button_text_en: 'Shop Now',
        button_link: '/shop',
        image_url: '/images/hero.jpg',
        image_mode: 'url', // 'url' | 'upload'
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('/images/hero.jpg');

    const handleOpenAddModal = () => {
        setEditingSlide(null);
        setFormData({
            title_bn: '',
            title_en: '',
            subtitle_bn: '',
            subtitle_en: '',
            badge_bn: '১০০% খাঁটি পাহাড়ি পণ্য',
            badge_en: '100% Authentic Hill Products',
            button_text_bn: 'পণ্য দেখুন',
            button_text_en: 'Shop Now',
            button_link: '/shop',
            image_url: '/images/hero.jpg',
            image_mode: 'upload',
        });
        setSelectedFile(null);
        setPreviewUrl('/images/hero.jpg');
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (slide) => {
        setEditingSlide(slide);
        setFormData({
            title_bn: slide.title_bn || '',
            title_en: slide.title_en || '',
            subtitle_bn: slide.subtitle_bn || '',
            subtitle_en: slide.subtitle_en || '',
            badge_bn: slide.badge_bn || '',
            badge_en: slide.badge_en || '',
            button_text_bn: slide.button_text_bn || 'পণ্য দেখুন',
            button_text_en: slide.button_text_en || 'Shop Now',
            button_link: slide.button_link || '/shop',
            image_url: slide.image_url || '/images/hero.jpg',
            image_mode: 'upload',
        });
        setSelectedFile(null);
        setPreviewUrl(slide.image_url || '/images/hero.jpg');
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (file.size > 15 * 1024 * 1024) {
            alert('ছবির সাইজ সর্বোচ্চ 15MB হতে পারবে।');
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
            setPreviewUrl(uploadEvent.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleClearFile = () => {
        setSelectedFile(null);
        setPreviewUrl(formData.image_url || '/images/hero.jpg');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const data = new FormData();
            data.append('title_bn', formData.title_bn || '');
            data.append('title_en', formData.title_en || '');
            data.append('subtitle_bn', formData.subtitle_bn || '');
            data.append('subtitle_en', formData.subtitle_en || '');
            data.append('badge_bn', formData.badge_bn || '');
            data.append('badge_en', formData.badge_en || '');
            data.append('button_text_bn', formData.button_text_bn || '');
            data.append('button_text_en', formData.button_text_en || '');
            data.append('button_link', formData.button_link || '');

            if (selectedFile) {
                data.append('image_file', selectedFile);
            } else if (formData.image_url) {
                data.append('image_url', formData.image_url);
            }

            const url = editingSlide ? `/admin/hero-slides/${editingSlide.id}` : '/admin/hero-slides';
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: data
            });

            const json = await res.json();
            if (json.success && json.slide) {
                if (editingSlide) {
                    setSlides(prev => prev.map(s => s.id === editingSlide.id ? json.slide : s));
                } else {
                    setSlides(prev => [...prev, json.slide]);
                }
                setIsModalOpen(false);
                setSelectedFile(null);
                alert(json.message || 'ব্যানার সফলভাবে সংরক্ষিত হয়েছে!');
            } else {
                alert('ত্রুটি: ' + (json.message || 'সংরক্ষণ ব্যর্থ হয়েছে।'));
            }
        } catch (err) {
            alert('নেটওয়ার্ক ত্রুটি: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('আপনি কি এই হিরো স্লাইডার ব্যানারটি মুছে ফেলতে চান?')) return;

        try {
            const res = await fetch(`/admin/hero-slides/${id}`, { method: 'DELETE' });
            const json = await res.json();
            if (json.success) {
                setSlides(prev => prev.filter(s => s.id !== id));
            }
        } catch (err) {
            alert('ডিলিট ব্যর্থ: ' + err.message);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const res = await fetch(`/admin/hero-slides/${id}/toggle`, { method: 'PATCH' });
            const json = await res.json();
            if (json.success) {
                setSlides(prev => prev.map(s => s.id === id ? { ...s, is_active: json.is_active } : s));
            }
        } catch (err) {
            alert('স্ট্যাটাস আপডেট ব্যর্থ: ' + err.message);
        }
    };

    const handleMoveOrder = async (index, direction) => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= slides.length) return;

        const newArr = [...slides];
        const temp = newArr[index];
        newArr[index] = newArr[targetIndex];
        newArr[targetIndex] = temp;

        const updated = newArr.map((item, idx) => ({ ...item, order: idx + 1 }));
        setSlides(updated);

        try {
            await fetch('/admin/hero-slides-reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orders: updated.map(u => ({ id: u.id, order: u.order }))
                })
            });
        } catch (e) {
            console.error('Reorder sync error', e);
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
                <div>
                    <h2 className="font-display text-xl font-bold flex items-center gap-2 text-foreground">
                        <ImageIcon className="size-5 text-primary" /> হোমপেজ হিরো ব্যানার ও স্লাইডার স্টুডিও
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        হোমপেজের মূল কভার ফটো আপলোড, একাধিক ব্যানার স্লাইডার হিসেবে নিয়ন্ত্রণ এবং প্রতি ৪ সেকেন্ড পরপর স্বয়ংক্রিয় ট্রানজিশন পরিচালনা করুন।
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-forest-deep shadow-sm cursor-pointer shrink-0"
                >
                    <Plus className="size-4" /> নতুন স্লাইডার ব্যানার যোগ করুন
                </button>
            </div>

            {/* Quick Stat Pill */}
            <div className="flex items-center gap-3 text-xs">
                <span className="rounded-full bg-primary/10 text-primary px-3 py-1 font-bold">
                    মোট স্লাইড: {slides.length} টি
                </span>
                <span className="rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1 font-bold">
                    সক্রিয়: {slides.filter(s => s.is_active).length} টি
                </span>
                <span className="text-muted-foreground">
                    (হোমপেজে প্রতি ৪ সেকেন্ড পরপর স্মুথ ট্রানজিশনে প্রদর্শিত হবে)
                </span>
            </div>

            {/* Slides Cards List */}
            <div className="grid gap-5">
                {slides.map((slide, index) => (
                    <div 
                        key={slide.id} 
                        className={`overflow-hidden rounded-2xl border transition-all ${
                            slide.is_active 
                                ? 'border-border bg-card shadow-sm hover:border-primary/40' 
                                : 'border-border/60 bg-muted/20 opacity-70'
                        }`}
                    >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-5">
                            {/* Left: Thumbnail & Content Info */}
                            <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                                {/* Thumbnail */}
                                <div className="relative size-24 sm:size-28 rounded-xl overflow-hidden border border-border bg-black shrink-0">
                                    <img 
                                        src={slide.image_url} 
                                        alt={slide.title_bn} 
                                        className="size-full object-cover"
                                    />
                                    <span className="absolute bottom-1 right-1 rounded-md bg-black/75 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-xs">
                                        #{slide.order}
                                    </span>
                                </div>

                                {/* Text Details */}
                                <div className="space-y-1.5 flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {slide.badge_bn && (
                                            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                                                {slide.badge_bn}
                                            </span>
                                        )}
                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                            slide.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                        }`}>
                                            {slide.is_active ? 'সক্রিয় (Live)' : 'নিষ্ক্রিয় (Off)'}
                                        </span>
                                    </div>

                                    <h3 className="font-display text-base font-bold text-foreground truncate">
                                        {slide.title_bn || slide.title_en}
                                    </h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {slide.subtitle_bn || slide.subtitle_en}
                                    </p>
                                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-0.5">
                                        <span>বাটন: <strong>{slide.button_text_bn || 'পণ্য দেখুন'}</strong></span>
                                        <span>·</span>
                                        <span className="flex items-center gap-1 font-mono text-[10px]">
                                            লিংক: {slide.button_link}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Actions (Move, Toggle, Edit, Delete) */}
                            <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end">
                                {/* Move Up / Down */}
                                <div className="flex items-center rounded-xl border border-border bg-background">
                                    <button
                                        type="button"
                                        disabled={index === 0}
                                        onClick={() => handleMoveOrder(index, 'up')}
                                        title="উপরে নিন"
                                        className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                                    >
                                        <MoveUp className="size-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        disabled={index === slides.length - 1}
                                        onClick={() => handleMoveOrder(index, 'down')}
                                        title="নিচে নিন"
                                        className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                                    >
                                        <MoveDown className="size-3.5" />
                                    </button>
                                </div>

                                {/* Active Toggle */}
                                <button
                                    type="button"
                                    onClick={() => handleToggleStatus(slide.id)}
                                    title={slide.is_active ? 'হাইড করুন' : 'শো করুন'}
                                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                                        slide.is_active
                                            ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20'
                                            : 'border-border bg-muted/30 text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {slide.is_active ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                                    <span>{slide.is_active ? 'সক্রিয়' : 'লুকানো'}</span>
                                </button>

                                {/* Edit Button */}
                                <button
                                    type="button"
                                    onClick={() => handleOpenEditModal(slide)}
                                    className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted text-foreground flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Edit2 className="size-3.5" />
                                    <span>সম্পাদনা</span>
                                </button>

                                {/* Delete Button */}
                                <button
                                    type="button"
                                    onClick={() => handleDelete(slide.id)}
                                    className="p-2 rounded-xl border border-border text-destructive/80 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                                    title="মুছে ফেলুন"
                                >
                                    <Trash2 className="size-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for Add / Edit Slide */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => !isSaving && setIsModalOpen(false)} />
                    <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-border">
                            <h3 className="font-display text-lg font-bold text-foreground">
                                {editingSlide ? 'হিরো ব্যানার সম্পাদনা' : 'নতুন হিরো ব্যানার যোগ'}
                            </h3>
                            <button 
                                type="button" 
                                disabled={isSaving}
                                onClick={() => setIsModalOpen(false)} 
                                className="rounded-full p-1.5 hover:bg-muted text-muted-foreground disabled:opacity-30 cursor-pointer"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Unified Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Image Upload & Picker Section */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold text-foreground">ব্যানার কভার ছবি *</label>
                                    <div className="flex rounded-lg border border-border bg-muted p-0.5 text-[11px]">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, image_mode: 'upload' })}
                                            className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                                                formData.image_mode === 'upload' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            সরাসরি ফাইল আপলোড
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, image_mode: 'url' })}
                                            className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                                                formData.image_mode === 'url' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            অনলাইন লিঙ্ক / প্রিসেট
                                        </button>
                                    </div>
                                </div>

                                {formData.image_mode === 'upload' ? (
                                    <div className="space-y-2">
                                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-primary/40 hover:border-primary rounded-2xl p-6 text-center space-y-2 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer">
                                            <Upload className="size-8 text-primary mx-auto" />
                                            <div>
                                                <p className="text-xs sm:text-sm font-bold text-foreground">
                                                    {selectedFile ? 'অন্য ছবি পরিবর্তন করতে ক্লিক করুন' : 'কম্পিউটার বা মোবাইল থেকে ছবি সিলেক্ট করুন'}
                                                </p>
                                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                                    JPG, PNG, WEBP, AVIF (সর্বোচ্চ ১৫ মেগাবাইট)
                                                </p>
                                            </div>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>

                                        {selectedFile && (
                                            <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 text-xs">
                                                <div className="flex items-center gap-2 truncate">
                                                    <Check className="size-4 text-primary shrink-0" />
                                                    <span className="font-semibold text-foreground truncate">{selectedFile.name}</span>
                                                    <span className="text-[11px] text-muted-foreground shrink-0">
                                                        ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleClearFile}
                                                    className="text-[11px] text-destructive hover:underline font-bold shrink-0 ml-2 cursor-pointer"
                                                >
                                                    রিমুভ করুন
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <input 
                                            type="text" 
                                            value={formData.image_url} 
                                            onChange={(e) => {
                                                setFormData({ ...formData, image_url: e.target.value });
                                                setPreviewUrl(e.target.value);
                                                setSelectedFile(null);
                                            }}
                                            placeholder="/images/hero.jpg অথবা ছবির ওয়েব লিঙ্ক"
                                            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                                        />
                                        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                                            <span className="text-muted-foreground font-semibold">ডিফল্ট প্রিসেট:</span>
                                            {[
                                                { label: 'পাহাড়ি ল্যান্ডস্কেপ', url: '/images/hero.jpg' },
                                                { label: 'কোমর তাঁত', url: '/images/cat-textiles.jpg' },
                                                { label: 'কারিগর জীবন', url: '/images/artisan.jpg' },
                                                { label: 'বাঁশ ও বেত', url: '/images/cat-bamboo.jpg' }
                                            ].map(preset => (
                                                <button
                                                    key={preset.url}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, image_url: preset.url });
                                                        setPreviewUrl(preset.url);
                                                        setSelectedFile(null);
                                                    }}
                                                    className="px-2 py-0.5 rounded-md border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                                                >
                                                    {preset.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Live Card Preview */}
                                <div className="mt-3 rounded-2xl overflow-hidden border border-border bg-black relative h-36">
                                    <img 
                                        src={previewUrl} 
                                        alt="Preview" 
                                        className="size-full object-cover opacity-80 transition-all duration-300" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end text-white">
                                        {formData.badge_bn && (
                                            <span className="text-[10px] font-bold text-sand bg-black/50 px-2 py-0.5 rounded-full w-fit mb-1 border border-sand/30">
                                                {formData.badge_bn}
                                            </span>
                                        )}
                                        <p className="font-display font-bold text-sm sm:text-base leading-tight drop-shadow-sm">
                                            {formData.title_bn || 'ব্যানারের মূল শিরোনাম এখানে দেখা যাবে...'}
                                        </p>
                                        <p className="text-[11px] text-sand/80 truncate mt-0.5">
                                            {formData.subtitle_bn || 'উপ-শিরোনাম বা বিস্তারিত বিবরণ...'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Text Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">মূল শিরোনাম (বাংলা) *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.title_bn} 
                                        onChange={(e) => setFormData({ ...formData, title_bn: e.target.value })}
                                        placeholder="যেমন: পাহাড়ের খাঁটি কারুশিল্প"
                                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">শিরোনাম (English)</label>
                                    <input 
                                        type="text" 
                                        value={formData.title_en} 
                                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                        placeholder="e.g. Authentic Hill Crafts"
                                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">উপ-শিরোনাম (বাংলা)</label>
                                    <textarea 
                                        rows={2}
                                        value={formData.subtitle_bn} 
                                        onChange={(e) => setFormData({ ...formData, subtitle_bn: e.target.value })}
                                        placeholder="রাঙ্গামাটি, বান্দরবান ও খাগড়াছড়ির আদিবাসী কারুশিল্প..."
                                        className="w-full rounded-xl border border-input bg-background p-2.5 text-xs outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">উপ-শিরোনাম (English)</label>
                                    <textarea 
                                        rows={2}
                                        value={formData.subtitle_en} 
                                        onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
                                        placeholder="Handcrafted indigenous goods directly to your door..."
                                        className="w-full rounded-xl border border-input bg-background p-2.5 text-xs outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">ব্যাজ টেক্সট</label>
                                    <input 
                                        type="text" 
                                        value={formData.badge_bn} 
                                        onChange={(e) => setFormData({ ...formData, badge_bn: e.target.value })}
                                        placeholder="১০০% খাঁটি পাহাড়ি পণ্য"
                                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">বাটন টেক্সট</label>
                                    <input 
                                        type="text" 
                                        value={formData.button_text_bn} 
                                        onChange={(e) => setFormData({ ...formData, button_text_bn: e.target.value })}
                                        placeholder="পণ্য দেখুন"
                                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">বাটন লিঙ্ক (URL)</label>
                                    <input 
                                        type="text" 
                                        value={formData.button_link} 
                                        onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                                        placeholder="/shop অথবা নির্দিষ্ট লিঙ্ক"
                                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                                <button
                                    type="button"
                                    disabled={isSaving}
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-full border border-border text-xs font-semibold hover:bg-muted cursor-pointer disabled:opacity-40"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-forest-deep shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>ছবি আপলোড ও সংরক্ষণ হচ্ছে...</span>
                                        </>
                                    ) : (
                                        <span>{editingSlide ? 'আপডেট সম্পন্ন করুন' : 'ব্যানার সংরক্ষণ করুন'}</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
