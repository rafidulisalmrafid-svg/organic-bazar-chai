import React, { useState } from 'react';
import { 
    X, 
    ChevronRight, 
    ChevronLeft, 
    Check, 
    Sparkles, 
    Image as ImageIcon, 
    Layers, 
    MapPin, 
    Tag, 
    Sliders, 
    Boxes, 
    Eye,
    Plus,
    Trash2
} from 'lucide-react';

export default function ProductWizardModal({ isOpen, onClose, onProductCreated, categories: allCategories = [], dynamicFields, onCategoryRequest }) {
    if (!isOpen) return null;

    const categories = allCategories.filter(c => c.status !== 'Inactive');
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 8;

    // Vendor Category Request state
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [reqCategoryName, setReqCategoryName] = useState('');
    const [reqParentCategory, setReqParentCategory] = useState(categories[0]?.name || 'Handloom Textiles');
    const [reqReason, setReqReason] = useState('');

    const handleCategoryRequestSubmit = (e) => {
        if (e) e.preventDefault();
        const trimmed = reqCategoryName.trim();
        if (!trimmed) {
            alert('অনুগ্রহ করে প্রস্তাবিত ক্যাটাগরির নাম লিখুন।');
            return;
        }
        if (onCategoryRequest) {
            onCategoryRequest({
                id: 'req-' + Date.now(),
                vendorName: 'Artisan Vendor',
                requestedCategory: trimmed,
                parentCategory: reqParentCategory,
                reason: reqReason.trim() || 'পাহাড়ি কারিগরদের ঐতিহ্যবাহী পণ্যের বিশেষ ক্যাটাগরি',
                status: 'Pending',
                date: 'Just Now'
            });
        }
        alert(`আপনার "${trimmed}" ক্যাটাগরির অনুরোধটি সফলভাবে অ্যাডমিন প্যানেলে পাঠানো হয়েছে!\nঅ্যাডমিন অনুমোদন করার সাথে সাথে এটি পণ্য আপলোড ড্রপডাউনে দৃশ্যমান হবে।`);
        setIsRequestModalOpen(false);
        setReqCategoryName('');
        setReqReason('');
    };

    const [formData, setFormData] = useState({
        // Step 1: Basic Info
        name: '',
        category: categories[0]?.name || 'Handloom Textiles',
        subcategory: categories[0]?.subcategories?.[0] || 'Traditional Shawls',
        description: '',

        // Step 2: Hill Origin & Artisan
        district: 'Rangamati',
        tribe: 'Chakma',
        artisanName: '',
        artisanVillage: '',
        artisanStory: '',

        // Step 3: Dynamic Specifications
        specs: {
            loom_type: 'Traditional Backstrap Loom (কোমর তাঁত)',
            dye_type: '100% Natural Plant Dye (উদ্ভিজ্জ রং)',
            tribal_motif: 'Alom Geometrical Diamond Motif',
            harvest_valley: 'Deep Sajek Valley (সাজেক)',
            purity_certification: '100% Raw Unfiltered (অপরিশোধিত)',
            cane_treatment: 'Sun-cured Hill Bamboo (রোদে শুকানো)',
            clay_origin: 'Sangu River Clay (সাঙ্গু নদী)',
        },

        // Step 4: Pricing & Commission
        price: 2400,
        oldPrice: 2800,
        commissionRate: 10,

        // Step 5: Variants
        colors: ['Forest Green', 'Terracotta Red', 'Natural Ivory'],
        sizes: ['Standard', 'Large'],
        newColorInput: '',

        // Step 6: Inventory & SKU
        sku: 'RW-HILL-' + Math.floor(1000 + Math.random() * 9000),
        stock: 25,
        lowStockAlert: 5,

        // Step 7: Photos & Badges
        image: '/images/prod-shawl.jpg',
        badge: '100% Handmade',

        // Step 8: Status
        status: 'Live',
    });

    const steps = [
        { num: 1, label: 'মৌলিক তথ্য', icon: Tag },
        { num: 2, label: 'পাহাড়ি উৎস', icon: MapPin },
        { num: 3, label: 'স্পেসিফিকেশন', icon: Sliders },
        { num: 4, label: 'প্রাইসিং ও কমিশন', icon: Sparkles },
        { num: 5, label: 'ভ্যারিয়েন্ট', icon: Layers },
        { num: 6, label: 'ইনভেন্টরি ও স্টক', icon: Boxes },
        { num: 7, label: 'ফটো ও মিডিয়া', icon: ImageIcon },
        { num: 8, label: 'প্রিভিউ ও সাবমিট', icon: Eye },
    ];

    const currentCategoryObj = categories.find(c => c.name === formData.category) || categories[0];
    const subcategories = currentCategoryObj.subcategories || [];

    const handleNext = () => {
        if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleAddColor = () => {
        if (formData.newColorInput.trim() && !formData.colors.includes(formData.newColorInput.trim())) {
            setFormData({
                ...formData,
                colors: [...formData.colors, formData.newColorInput.trim()],
                newColorInput: ''
            });
        }
    };

    const handleRemoveColor = (c) => {
        setFormData({
            ...formData,
            colors: formData.colors.filter(item => item !== c)
        });
    };

    const handleFinalSubmit = (e) => {
        e.preventDefault();
        const newProduct = {
            id: formData.name.toLowerCase().replace(/\s+/g, '-') || 'hill-prod-' + Date.now(),
            name: formData.name || 'Authentic Hill Craft Piece',
            category: formData.category,
            subcategory: formData.subcategory,
            price: Number(formData.price),
            oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
            rating: 5.0,
            reviews: 1,
            vendor: 'Rangamati Weaves',
            location: formData.district,
            stock: Number(formData.stock),
            sku: formData.sku,
            image: formData.image || '/images/prod-shawl.jpg',
            badge: formData.badge,
            description: formData.description || 'Authentic handmade hill product crafted with sustainable indigenous heritage methods.',
            specs: formData.specs
        };

        if (onProductCreated) {
            onProductCreated(newProduct);
        }
        onClose();
        alert('অভিনন্দন! আপনার পাহাড়ি পণ্যটি সফলভাবে মার্কেটপ্লেসে যুক্ত হয়েছে।');
    };

    const netEarning = formData.price - (formData.price * (formData.commissionRate / 100));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Dialog */}
            <div className="relative z-10 flex h-[92vh] w-full max-w-4xl flex-col rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Sparkles className="size-4" />
                        </span>
                        <div>
                            <h2 className="font-display text-lg font-semibold text-foreground">
                                ৮-ধাপের পাহাড়ি পণ্য আপলোড উইজার্ড (Vendor Product Wizard)
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                ধাপ {currentStep} / {totalSteps}: {steps[currentStep - 1].label}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Stepper Progress Indicator */}
                <div className="border-b border-border bg-card px-6 py-3 overflow-x-auto">
                    <div className="flex items-center justify-between min-w-[650px] gap-2">
                        {steps.map((s) => {
                            const isDone = s.num < currentStep;
                            const isCurrent = s.num === currentStep;
                            return (
                                <button
                                    key={s.num}
                                    type="button"
                                    onClick={() => setCurrentStep(s.num)}
                                    className={`flex items-center gap-2 text-xs font-semibold px-2.5 py-1.5 rounded-full transition-all cursor-pointer ${
                                        isCurrent 
                                            ? 'bg-primary text-primary-foreground shadow-xs' 
                                            : isDone 
                                                ? 'bg-secondary text-primary hover:bg-secondary/80' 
                                                : 'text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    <span className={`flex size-5 items-center justify-center rounded-full text-[10px] ${
                                        isCurrent ? 'bg-primary-foreground text-primary font-bold' : isDone ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                    }`}>
                                        {isDone ? <Check className="size-3" /> : s.num}
                                    </span>
                                    <span>{s.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Wizard Form Content */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div>
                                <h3 className="font-display text-xl font-semibold text-foreground">ধাপ ১: মৌলিক তথ্যাবলী (Basic Information)</h3>
                                <p className="text-sm text-muted-foreground mt-1">পণ্যের মূল নাম এবং উপযুক্ত ক্যাটাগরি নির্ধারণ করুন।</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                                        পণ্যের নাম (Product Title) *
                                    </label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="যেমন: চাকমা ঐতিহ্যবাহী পিনন-হাদি শাল (Pure Organic Cotton)"
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-1.5">
                                            প্রধান ক্যাটাগরি (Primary Category)
                                        </label>
                                        <select 
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                                            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary cursor-pointer"
                                        >
                                            {categories.map((c) => (
                                                <option key={c.name} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-1.5">
                                            সাব-ক্যাটাগরি (Sub-category)
                                        </label>
                                        <select 
                                            value={formData.subcategory}
                                            onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                                            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary cursor-pointer"
                                        >
                                            {subcategories.map((sc) => (
                                                <option key={sc} value={sc}>{sc}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Request New Category CTA */}
                                <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-secondary/30 border border-border text-xs">
                                    <span className="text-muted-foreground">
                                        💡 ভেন্ডররা শুধুমাত্র অ্যাডমিনের অনুমোদিত সক্রিয় ক্যাটাগরি নির্বাচন করতে পারবেন।
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setIsRequestModalOpen(true)}
                                        className="font-bold text-primary hover:text-forest-deep hover:underline flex items-center gap-1 cursor-pointer ml-auto"
                                    >
                                        <Sparkles className="size-3.5 text-accent" />
                                        নতুন ক্যাটাগরির অনুরোধ পাঠান (Request Category)
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                                        সংক্ষিপ্ত বিবরণ (Description & Story)
                                    </label>
                                    <textarea 
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="পণ্যের বৈশিষ্ট্য, তৈরি পদ্ধতি এবং কারিগরি গুরুত্ব বর্ণনা করুন..."
                                        className="w-full rounded-xl border border-input bg-background p-4 text-sm outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Hill Origin & Artisan Attribution */}
                    {currentStep === 2 && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div>
                                <h3 className="font-display text-xl font-semibold text-foreground">ধাপ ২: পাহাড়ি উৎস ও আদিবাসী কারিগর (Hill Origin & Artisan)</h3>
                                <p className="text-sm text-muted-foreground mt-1">পণ্যটি কোন পাহাড় ও কারিগর সম্প্রদায়ের তৈরি তা নিশ্চিত করুন।</p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-1.5">
                                            উৎস জেলা (District Origin)
                                        </label>
                                        <select 
                                            value={formData.district}
                                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                                        >
                                            <option value="Rangamati">Rangamati (রাঙ্গামাটি)</option>
                                            <option value="Bandarban">Bandarban (বান্দরবান)</option>
                                            <option value="Khagrachari">Khagrachari (খাগড়াছড়ি)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-1.5">
                                            কারিগর সম্প্রদায় (Artisan Tribe)
                                        </label>
                                        <select 
                                            value={formData.tribe}
                                            onChange={(e) => setFormData({ ...formData, tribe: e.target.value })}
                                            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                                        >
                                            <option value="Chakma">Chakma (চাকমা)</option>
                                            <option value="Marma">Marma (মারমা)</option>
                                            <option value="Tripura">Tripura (ত্রিপুরা)</option>
                                            <option value="Tanchangya">Tanchangya (তঞ্চঙ্গ্যা)</option>
                                            <option value="Bawm">Bawm (বম)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                                        প্রধান কারিগর/সমবায় নাম (Master Artisan / Cooperative)
                                    </label>
                                    <input 
                                        type="text" 
                                        value={formData.artisanName}
                                        onChange={(e) => setFormData({ ...formData, artisanName: e.target.value })}
                                        placeholder="যেমন: বাসন্তী চাকমা ও উপজাতীয় মহিলা সমিতি"
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                                        গ্রাম বা পাড়া (Village / Para Location)
                                    </label>
                                    <input 
                                        type="text" 
                                        value={formData.artisanVillage}
                                        onChange={(e) => setFormData({ ...formData, artisanVillage: e.target.value })}
                                        placeholder="যেমন: মানিকছড়ি পাড়া, রাঙ্গামাটি সদর"
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Dynamic Specifications */}
                    {currentStep === 3 && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div>
                                <h3 className="font-display text-xl font-semibold text-foreground">ধাপ ৩: ডাইনামিক ফিল্ড স্পেসিফিকেশন (Category Attributes)</h3>
                                <p className="text-sm text-muted-foreground mt-1">নির্বাচিত ক্যাটাগরি ({formData.category}) অনুযায়ী নির্ধারিত বিশেষ বৈশিষ্ট্যসমূহ পূরণ করুন।</p>
                            </div>

                            <div className="space-y-4 rounded-2xl border border-border bg-secondary/20 p-5">
                                {formData.category === 'Handloom Textiles' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold text-foreground mb-1.5">তাঁতের ধরণ (Loom Type)</label>
                                            <select 
                                                value={formData.specs.loom_type}
                                                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, loom_type: e.target.value } })}
                                                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none"
                                            >
                                                <option>Traditional Backstrap Loom (কোমর তাঁত)</option>
                                                <option>Pit Loom (খটখটি তাঁত)</option>
                                                <option>Frame Handloom</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-foreground mb-1.5">রং প্রক্রিয়া (Dye Method)</label>
                                            <select 
                                                value={formData.specs.dye_type}
                                                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, dye_type: e.target.value } })}
                                                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none"
                                            >
                                                <option>100% Natural Plant Dye (উদ্ভিজ্জ রং)</option>
                                                <option>Natural Bark & Turmeric Dye</option>
                                                <option>Chemical-free Colorfast</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-foreground mb-1.5">ঐতিহ্যবাহী নকশা (Tribal Motif Name)</label>
                                            <input 
                                                type="text"
                                                value={formData.specs.tribal_motif}
                                                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, tribal_motif: e.target.value } })}
                                                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none"
                                            />
                                        </div>
                                    </>
                                )}

                                {formData.category === 'Hill Pantry' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold text-foreground mb-1.5">সংগ্রহের উপত্যকা (Harvest Valley)</label>
                                            <select 
                                                value={formData.specs.harvest_valley}
                                                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, harvest_valley: e.target.value } })}
                                                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none"
                                            >
                                                <option>Deep Sajek Valley (সাজেক)</option>
                                                <option>Keokradong Forest Reserve (কেওক্রাডং)</option>
                                                <option>Alikadam Deep Hills (আলীকদম)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-foreground mb-1.5">বিশুদ্ধতার লেবেল (Purity Certificate)</label>
                                            <select 
                                                value={formData.specs.purity_certification}
                                                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, purity_certification: e.target.value } })}
                                                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none"
                                            >
                                                <option>100% Raw Unfiltered (অপরিশোধিত)</option>
                                                <option>Paharika Certified Pure Wild Batch</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {formData.category === 'Bamboo & Cane' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-1.5">বাঁশ প্রসেসিং পদ্ধতি (Bamboo Curing)</label>
                                        <select 
                                            value={formData.specs.cane_treatment}
                                            onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, cane_treatment: e.target.value } })}
                                            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none"
                                        >
                                            <option>Sun-cured Hill Bamboo (রোদে শুকানো)</option>
                                            <option>Smoked & Termite-proofed</option>
                                        </select>
                                    </div>
                                )}

                                {formData.category === 'Terracotta & Clay' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-1.5">মাটির উৎস (Clay Origin)</label>
                                        <select 
                                            value={formData.specs.clay_origin}
                                            onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, clay_origin: e.target.value } })}
                                            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none"
                                        >
                                            <option>Sangu River Clay (সাঙ্গু নদী)</option>
                                            <option>Kaptai Lake Clay Bed</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Pricing & Commission */}
                    {currentStep === 4 && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div>
                                <h3 className="font-display text-xl font-semibold text-foreground">ধাপ ৪: প্রাইসিং ও প্ল্যাটফর্ম কমিশন (Pricing & Commission)</h3>
                                <p className="text-sm text-muted-foreground mt-1">পণ্যের বিক্রয়মূল্য নির্ধারণ করুন এবং আপনার নিট আয় হিসাব দেখুন।</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                                        বিক্রয়মূল্য (Selling Price in ৳) *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">৳</span>
                                        <input 
                                            type="number" 
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                            className="w-full rounded-xl border border-input bg-background py-3 pl-8 pr-4 text-base font-bold outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                                        পূর্বের মূল্য (Old Price for Discount Tag)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">৳</span>
                                        <input 
                                            type="number" 
                                            value={formData.oldPrice}
                                            onChange={(e) => setFormData({ ...formData, oldPrice: Number(e.target.value) })}
                                            className="w-full rounded-xl border border-input bg-background py-3 pl-8 pr-4 text-base font-bold outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Transparent Commission Breakdown Card */}
                            <div className="rounded-2xl border border-border bg-secondary/50 p-5 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">গ্রাহক প্রদান করবে:</span>
                                    <span className="font-bold text-foreground">৳ {formData.price.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">পাহাড়িকা প্ল্যাটফর্ম ফি ({formData.commissionRate}%):</span>
                                    <span className="font-semibold text-accent">- ৳ {(formData.price * (formData.commissionRate / 100)).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="border-t border-border pt-3 flex items-center justify-between">
                                    <span className="font-semibold text-foreground">ভেন্ডরের নিট আয় (Net Vendor Payout):</span>
                                    <span className="font-display text-xl font-bold text-primary">
                                        ৳ {netEarning.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Variants */}
                    {currentStep === 5 && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div>
                                <h3 className="font-display text-xl font-semibold text-foreground">ধাপ ৫: ভ্যারিয়েন্ট কনফিগারেশন (Colors & Sizes)</h3>
                                <p className="text-sm text-muted-foreground mt-1">পণ্যটির বিভিন্ন রঙ এবং সাইজ অপশন সংযুক্ত করুন।</p>
                            </div>

                            {/* Colors */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-foreground">
                                    উপলব্ধ রঙসমূহ (Color Variants)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {formData.colors.map((c) => (
                                        <span key={c} className="flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold text-secondary-foreground border border-border">
                                            {c}
                                            <button type="button" onClick={() => handleRemoveColor(c)} className="hover:text-accent">
                                                <X className="size-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        value={formData.newColorInput}
                                        onChange={(e) => setFormData({ ...formData, newColorInput: e.target.value })}
                                        placeholder="নতুন রঙ লিখুন (যেমন: Mustard Ochre)"
                                        className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleAddColor}
                                        className="rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-forest-deep"
                                    >
                                        <Plus className="size-4 inline mr-1" /> যোগ করুন
                                    </button>
                                </div>
                            </div>

                            {/* Sizes */}
                            <div className="space-y-2 pt-4 border-t border-border">
                                <label className="block text-sm font-semibold text-foreground">
                                    সাইজ অপশন (Sizes)
                                </label>
                                <div className="flex gap-3">
                                    {['Standard', 'Large', 'Extra Large', 'Set of 3'].map((sz) => {
                                        const checked = formData.sizes.includes(sz);
                                        return (
                                            <button
                                                key={sz}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({
                                                        ...formData,
                                                        sizes: checked ? formData.sizes.filter(s => s !== sz) : [...formData.sizes, sz]
                                                    });
                                                }}
                                                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
                                                    checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:border-primary'
                                                }`}
                                            >
                                                {sz}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 6: Inventory & SKU */}
                    {currentStep === 6 && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div>
                                <h3 className="font-display text-xl font-semibold text-foreground">ধাপ ৬: ইনভেন্টরি ও স্টক নিয়ন্ত্রণ (Inventory & SKU)</h3>
                                <p className="text-sm text-muted-foreground mt-1">স্টকের পরিমাণ এবং ট্র্যাকিং কোড নির্ধারণ করুন।</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                                        SKU কোড (Unique Identifier)
                                    </label>
                                    <input 
                                        type="text" 
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-mono outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                                        মজুদ পরিমাণ (Stock Quantity Units) *
                                    </label>
                                    <input 
                                        type="number" 
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-bold outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-1.5">
                                    কম স্টক অ্যালার্ট (Low Stock Threshold)
                                </label>
                                <input 
                                    type="number" 
                                    value={formData.lowStockAlert}
                                    onChange={(e) => setFormData({ ...formData, lowStockAlert: Number(e.target.value) })}
                                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none"
                                />
                                <p className="text-xs text-muted-foreground mt-1">মজুদ ৫ টিতে নেমে এলে আপনাকে স্বয়ংক্রিয় এসএমএস/ইমেইল পাঠানো হবে।</p>
                            </div>
                        </div>
                    )}

                    {/* Step 7: Photos & Badges */}
                    {currentStep === 7 && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div>
                                <h3 className="font-display text-xl font-semibold text-foreground">ধাপ ৭: ফটোগ্রাফি ও ব্যাজ (Media & Tags)</h3>
                                <p className="text-sm text-muted-foreground mt-1">উচ্চমানের ছবি নির্বাচন করুন এবং বিশেষ ব্যাজ যুক্ত করুন।</p>
                            </div>

                            {/* Badge Select */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    হাইলাইট ব্যাজ (Promotional Badge)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {['100% Handmade', 'Best Seller', 'New Arrival', 'Limited Edition', 'Pure Organic'].map((b) => (
                                        <button
                                            key={b}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, badge: b })}
                                            className={`rounded-full px-4 py-2 text-xs font-semibold border transition-all ${
                                                formData.badge === b ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary'
                                            }`}
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Image Selection Presets */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    প্রধান ছবি নির্বাচন (Select Photo Preset or Upload)
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                    {[
                                        { name: 'Shawl', src: '/images/prod-shawl.jpg' },
                                        { name: 'Bamboo Tote', src: '/images/prod-bag.jpg' },
                                        { name: 'Wild Honey', src: '/images/prod-honey.jpg' },
                                        { name: 'Vase', src: '/images/prod-vase.jpg' },
                                        { name: 'Cushions', src: '/images/prod-cushion.jpg' },
                                        { name: 'Hill Tea', src: '/images/prod-tea.jpg' },
                                    ].map((pic) => (
                                        <div 
                                            key={pic.name}
                                            onClick={() => setFormData({ ...formData, image: pic.src })}
                                            className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                                                formData.image === pic.src ? 'border-primary ring-2 ring-primary/30 scale-102' : 'border-border hover:border-primary'
                                            }`}
                                        >
                                            <img src={pic.src} alt="" className="size-full object-cover" />
                                            {formData.image === pic.src && (
                                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                    <span className="size-6 rounded-full bg-primary text-white flex items-center justify-center">
                                                        <Check className="size-3.5" />
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 8: Live Preview & Final Submit */}
                    {currentStep === 8 && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div>
                                <h3 className="font-display text-xl font-semibold text-foreground">ধাপ ৮: লাইভ প্রিভিউ ও ফাইনাল পাবলিশ (Review & Submit)</h3>
                                <p className="text-sm text-muted-foreground mt-1">সব তথ্য পুনরায় যাচাই করুন এবং মার্কেটপ্লেসে পণ্যটি লাইভ করুন।</p>
                            </div>

                            {/* Live Card Preview */}
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
                                <img 
                                    src={formData.image} 
                                    alt={formData.name} 
                                    className="size-36 rounded-2xl object-cover border border-border shadow-xs"
                                />
                                <div className="flex-1 space-y-1.5 text-center sm:text-left">
                                    <span className="inline-block rounded-full bg-forest-deep px-3 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase">
                                        {formData.badge}
                                    </span>
                                    <h4 className="font-display text-xl font-bold text-foreground">
                                        {formData.name || 'পাহাড়ি কারুশিল্প পণ্য'}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        {formData.category} · {formData.district} · SKU: {formData.sku}
                                    </p>
                                    <div className="flex items-baseline gap-2 justify-center sm:justify-start pt-1">
                                        <span className="font-display text-2xl font-bold text-primary">
                                            ৳ {formData.price.toLocaleString('en-IN')}
                                        </span>
                                        {formData.oldPrice && (
                                            <span className="text-sm text-muted-foreground line-through">
                                                ৳ {formData.oldPrice.toLocaleString('en-IN')}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium">
                                        কারিগর: <span className="text-foreground">{formData.artisanName || 'বাসন্তী চাকমা'} ({formData.tribe})</span>
                                    </p>
                                </div>
                            </div>

                            {/* Summary Checklist */}
                            <div className="rounded-2xl border border-border bg-secondary/30 p-5 space-y-2 text-xs text-foreground">
                                <div className="flex justify-between py-1 border-b border-border/50">
                                    <span className="text-muted-foreground">ভ্যারিয়েন্ট কালার:</span>
                                    <span className="font-semibold">{formData.colors.join(', ')}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-border/50">
                                    <span className="text-muted-foreground">মজুদ স্টক:</span>
                                    <span className="font-semibold">{formData.stock} units</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-muted-foreground">ভেন্ডর নিট পে-আউট:</span>
                                    <span className="font-bold text-primary">৳ {netEarning.toLocaleString('en-IN')} / পিস</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="border-t border-border bg-card p-4 sm:px-8 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentStep === 1}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <ChevronLeft className="size-4" /> পূর্ববর্তী
                    </button>

                    {currentStep < totalSteps ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-7 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-forest-deep transition-colors shadow-sm cursor-pointer"
                        >
                            পরবর্তী ধাপ <ChevronRight className="size-4" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleFinalSubmit}
                            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-2.5 text-sm font-bold text-accent-foreground hover:bg-terracotta-deep transition-colors shadow-md cursor-pointer animate-pulse"
                        >
                            <Check className="size-4" /> মার্কেটপ্লেসে লাইভ পাবলিশ করুন
                        </button>
                    )}
                </div>
            </div>

            {/* Vendor Category Request Modal */}
            {isRequestModalOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsRequestModalOpen(false)} />
                    <div className="relative z-10 w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <div className="flex items-center gap-2.5">
                                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Sparkles className="size-4" />
                                </span>
                                <div>
                                    <h3 className="font-display text-base font-bold text-foreground">
                                        নতুন ক্যাটাগরির অনুরোধ পাঠান (Request Category)
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        অ্যাডমিন রিভিউ করে এটি অনুমোদন করলে সাইটে যুক্ত হবে
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsRequestModalOpen(false)}
                                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted cursor-pointer"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCategoryRequestSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    প্রস্তাবিত নতুন ক্যাটাগরির নাম <span className="text-destructive">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    required
                                    value={reqCategoryName}
                                    onChange={(e) => setReqCategoryName(e.target.value)}
                                    placeholder="যেমন: Tribal Musical Instruments (বাঁশের বাঁশি ও দোতারা)"
                                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs font-medium outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    প্রস্তাবিত অভিভাবক ক্যাটাগরি (Parent Category)
                                </label>
                                <select 
                                    value={reqParentCategory}
                                    onChange={(e) => setReqParentCategory(e.target.value)}
                                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs font-medium outline-none focus:border-primary cursor-pointer"
                                >
                                    <option value="">মূল ক্যাটাগরি হিসেবে (Root Category)</option>
                                    {categories.map((c) => (
                                        <option key={c.name} value={c.name}>অধীনে: {c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    আবেদনের কারণ ও পণ্যের বিবরণ (Reason / Artisan Rationale) *
                                </label>
                                <textarea 
                                    rows={3}
                                    required
                                    value={reqReason}
                                    onChange={(e) => setReqReason(e.target.value)}
                                    placeholder="আমাদের কারিগররা কী ধরণের বিশেষ ঐতিহ্যবাহী পণ্য তৈরি করছেন এবং কেন নতুন ক্যাটাগরি প্রয়োজন..."
                                    className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-primary"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setIsRequestModalOpen(false)}
                                    className="px-4 py-2 rounded-full border border-border text-xs font-semibold hover:bg-muted cursor-pointer"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-forest-deep shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                                >
                                    <Check className="size-3.5" /> অনুরোধ জমা দিন
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
