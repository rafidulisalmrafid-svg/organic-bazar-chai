import React, { useState, useEffect } from 'react';
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
    Trash2,
    Upload,
    Video,
    Truck,
    ShieldCheck,
    Calendar,
    Copy,
    AlertCircle,
    Info,
    CheckCircle2,
    Palette,
    Scale,
    FileSpreadsheet,
    HelpCircle
} from 'lucide-react';

export default function VendorProductWizardModal({ 
    isOpen, 
    onClose, 
    onProductCreated, 
    categories = [],
    attributes = [],
    categoryMappings = [],
    onOpenAttributeRequest
}) {
    if (!isOpen) return null;

    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 9;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    // Bulk Edit Modal for Variations
    const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
    const [bulkPrice, setBulkPrice] = useState('');
    const [bulkSalePrice, setBulkSalePrice] = useState('');
    const [bulkStock, setBulkStock] = useState('');

    // Default active categories
    const activeCategories = categories.filter(c => c.status !== 'Inactive');
    const initialCat = activeCategories[0] || { id: 'cat-apparel', name: 'ঐতিহ্যবাহী পোশাক ও তাঁতবস্ত্র', subcategories: [] };

    // Master Form State
    const [formData, setFormData] = useState(() => {
        try {
            const saved = localStorage.getItem('paharika_vendor_product_draft_v1');
            if (saved) return JSON.parse(saved);
        } catch (e) {}

        return {
            // Step 1: Basic
            name_en: '',
            name_bn: '',
            category_id: initialCat.id,
            subcategory: initialCat.subcategories?.[0] || '',
            brand: '',
            short_description: '',
            description: '',

            // Step 2: Media
            image: '/images/hero.jpg',
            gallery_images: [
                { id: 'img-1', image_path: '/images/hero.jpg', color_value_id: null },
            ],
            video_url: '',

            // Step 3: Product Type
            product_type: 'simple', // 'simple' | 'variable'

            // Step 4: Variations & Attributes
            selected_attributes: {}, // { [attribute_id]: [valId1, valId2] }
            variations: [], // array of variation objects

            // Step 5: Pricing & Stock (Simple product)
            price: '',
            old_price: '',
            sale_start_date: '',
            sale_end_date: '',
            stock: '25',
            sku: '',
            low_stock_threshold: '5',
            min_order_qty: '1',
            max_order_qty: '50',

            // Step 6: Shipping
            weight_val: '0.5',
            weight_unit: 'kg',
            length: '10',
            width: '8',
            height: '4',
            delivery_time: '২-৩ দিন',
            is_cod_available: true,

            // Step 7: Hill Specifics
            district: 'বান্দরবান',
            community: 'চাকমা',
            is_handmade: true,
            is_natural: true,
            is_organic: false,
            is_food: false,
            production_date: '',
            expiry_date: '',
            storage_instructions: '',

            // Step 8: SEO & Tags
            tags_input: 'পাহাড়ি পণ্য, অর্গানিক, হ্যান্ডমেড',
            seo_title: '',
            seo_description: '',
        };
    });

    // Auto-save draft to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('paharika_vendor_product_draft_v1', JSON.stringify(formData));
        } catch (e) {}
    }, [formData]);

    // Current category object
    const currentCategory = activeCategories.find(c => c.id === formData.category_id) || initialCat;

    // Is this a food-related category?
    const isFoodCategory = ['cat-fruits', 'cat-honey', 'cat-food', 'cat-tea', 'cat-spices'].includes(formData.category_id) || formData.is_food;

    // Attributes mapped to this category
    const mappedAttrIds = categoryMappings
        .filter(m => m.category_id === formData.category_id)
        .map(m => m.attribute_id);

    const availableAttributes = attributes.filter(a => mappedAttrIds.includes(a.id));

    // Handle Category Change
    const handleCategoryChange = (catId) => {
        const cat = activeCategories.find(c => c.id === catId);
        const isFood = ['cat-fruits', 'cat-honey', 'cat-food', 'cat-tea', 'cat-spices'].includes(catId);
        setFormData(prev => ({
            ...prev,
            category_id: catId,
            subcategory: cat?.subcategories?.[0] || '',
            is_food: isFood,
            selected_attributes: {},
            variations: []
        }));
    };

    // Toggle Attribute Value Selection for Variations
    const toggleAttributeValue = (attrId, valId) => {
        setFormData(prev => {
            const currentVals = prev.selected_attributes[attrId] || [];
            const exists = currentVals.includes(valId);
            const nextVals = exists 
                ? currentVals.filter(id => id !== valId) 
                : [...currentVals, valId];

            return {
                ...prev,
                selected_attributes: {
                    ...prev.selected_attributes,
                    [attrId]: nextVals
                }
            };
        });
    };

    // Auto-Generate Cartesian Variations
    const handleGenerateVariations = () => {
        const attrKeys = Object.keys(formData.selected_attributes).filter(
            k => (formData.selected_attributes[k] || []).length > 0
        );

        if (attrKeys.length === 0) {
            alert('ভ্যারিয়েশন তৈরির জন্য অনুগ্রহ করে অন্তত একটি Attribute এবং তার মান বাছাই করুন।');
            return;
        }

        // Generate combinations
        const attributeArrays = attrKeys.map(attrId => {
            const attrObj = attributes.find(a => a.id === parseInt(attrId));
            const valIds = formData.selected_attributes[attrId];
            return valIds.map(valId => {
                const valObj = attrObj?.values?.find(v => v.id === valId);
                return {
                    attrId: parseInt(attrId),
                    attrName: attrObj?.name_bn || attrObj?.name_en,
                    attrCode: attrObj?.code,
                    valId: valId,
                    valName: valObj?.name_bn || valObj?.name_en,
                    valNameEn: valObj?.name_en,
                    hexColor: valObj?.hex_color
                };
            });
        });

        // Cartesian product helper
        const cartesian = (arrays) => {
            return arrays.reduce((acc, curr) => {
                return acc.flatMap(a => curr.map(c => [...a, c]));
            }, [[]]);
        };

        const combinations = cartesian(attributeArrays);

        const newVariations = combinations.map((comb, index) => {
            const baseSku = formData.sku || (formData.name_en ? formData.name_en.substring(0, 3).toUpperCase() : 'PROD');
            const comboCode = comb.map(c => c.valNameEn || c.valName).join('-');
            const sku = `${baseSku}-${comboCode}-${index + 1}`.toUpperCase().replace(/\s+/g, '');

            const attrValuesMap = {};
            comb.forEach(c => {
                attrValuesMap[c.attrId] = c.valId;
            });

            return {
                id: 'var-' + Date.now() + '-' + index,
                combination: comb,
                attribute_values: attrValuesMap,
                sku: sku,
                price: formData.price || '500',
                sale_price: formData.old_price ? formData.price : '',
                stock: '15',
                image_url: formData.image || '/images/hero.jpg',
                is_active: true
            };
        });

        setFormData(prev => ({
            ...prev,
            variations: newVariations
        }));

        alert(`অভিনন্দন! মোট ${newVariations.length}টি ভ্যারিয়েশন কম্বিনেশন স্বয়ংক্রিয়ভাবে তৈরি হয়েছে।`);
    };

    // Bulk Edit Variations
    const applyBulkEdit = () => {
        setFormData(prev => ({
            ...prev,
            variations: prev.variations.map(v => ({
                ...v,
                price: bulkPrice !== '' ? bulkPrice : v.price,
                sale_price: bulkSalePrice !== '' ? bulkSalePrice : v.sale_price,
                stock: bulkStock !== '' ? bulkStock : v.stock
            }))
        }));
        setIsBulkEditOpen(false);
        setBulkPrice('');
        setBulkSalePrice('');
        setBulkStock('');
    };

    // Gallery Image Handlers
    const addGalleryImage = () => {
        const nextId = 'img-' + Date.now();
        setFormData(prev => ({
            ...prev,
            gallery_images: [
                ...prev.gallery_images,
                { id: nextId, image_path: '/images/hero.jpg', color_value_id: null }
            ]
        }));
    };

    const removeGalleryImage = (idx) => {
        setFormData(prev => ({
            ...prev,
            gallery_images: prev.gallery_images.filter((_, i) => i !== idx)
        }));
    };

    // Color attributes for image linking
    const colorAttribute = attributes.find(a => a.code === 'color');

    // Validation per step
    const validateStep = (step) => {
        const errs = {};
        if (step === 1) {
            if (!formData.name_bn.trim()) errs.name_bn = 'পণ্যের বাংলা নাম আবশ্যক';
            if (!formData.name_en.trim()) errs.name_en = 'পণ্যের ইংরেজি নাম আবশ্যক';
            if (!formData.category_id) errs.category_id = 'ক্যাটাগরি নির্বাচন করুন';
        } else if (step === 3) {
            if (!formData.product_type) errs.product_type = 'পণ্যের ধরন নির্বাচন করুন';
        } else if (step === 4 && formData.product_type === 'variable') {
            if (formData.variations.length === 0) {
                errs.variations = 'কমপক্ষে একটি Variation তৈরি করতে হবে। মান বাছাই করে "Generate Variations" চাপুন।';
            }
        } else if (step === 5 && formData.product_type === 'simple') {
            if (!formData.price || Number(formData.price) <= 0) errs.price = 'সঠিক নিয়মিত দাম লিখুন';
            if (!formData.stock || Number(formData.stock) < 0) errs.stock = 'স্টক সংখ্যা লিখুন';
        }
        setValidationErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // Final Submission (Draft vs Review)
    const handleSubmit = async (submitStatus) => {
        if (!validateStep(1) || !validateStep(3)) {
            alert('অনুগ্রহ করে ধাপ ১ ও ধাপ ৩-এর প্রয়োজনীয় তথ্য পূরণ করুন।');
            return;
        }

        setIsSubmitting(true);
        try {
            const tags = formData.tags_input.split(',').map(t => t.trim()).filter(Boolean);
            const payload = {
                ...formData,
                status: submitStatus, // 'Draft' or 'Pending_Review'
                price: Number(formData.price) || 0,
                old_price: formData.old_price ? Number(formData.old_price) : null,
                stock: Number(formData.stock) || 0,
                tags: tags,
            };

            const res = await fetch('/vendor/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                localStorage.removeItem('paharika_vendor_product_draft_v1');
                if (onProductCreated) {
                    onProductCreated(data.product);
                }
                alert(data.message);
                onClose();
            } else {
                alert('ত্রুটি: ' + (data.message || 'পণ্য সংরক্ষণ করা সম্ভব হয়নি।'));
            }
        } catch (err) {
            alert('সার্ভার এরর: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
            <div className="relative w-full max-w-4xl rounded-3xl border border-border bg-card shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-scale-up">
                
                {/* Wizard Header */}
                <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold shadow-xs">
                            {currentStep}
                        </span>
                        <div>
                            <h2 className="font-display text-base sm:text-lg font-bold text-foreground">
                                পাহাড়ি পণ্য আপলোড উইজার্ড ({currentStep}/{totalSteps})
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                {currentStep === 1 && 'ধাপ ১: মৌলিক তথ্য (বাংলা ও ইংরেজি)'}
                                {currentStep === 2 && 'ধাপ ২: ছবি, গ্যালারি ও ভিডিও'}
                                {currentStep === 3 && 'ধাপ ৩: পণ্যের ধরন (Simple vs Variable)'}
                                {currentStep === 4 && 'ধাপ ৪: Variation ম্যাট্রিক্স ও বাল্ক এডিট'}
                                {currentStep === 5 && 'ধাপ ৫: দাম ও স্টক ম্যানেজমেন্ট'}
                                {currentStep === 6 && 'ধাপ ৬: শিপিং ও কুরিয়ার তথ্য'}
                                {currentStep === 7 && 'ধাপ ৭: পাহাড়ি ঐতিহ্যের বিশেষ তথ্য'}
                                {currentStep === 8 && 'ধাপ ৮: এসইও ও মেটা ট্যাগ'}
                                {currentStep === 9 && 'ধাপ ৯: রিভিউ ও সাবমিশন'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {onOpenAttributeRequest && (
                            <button
                                onClick={onOpenAttributeRequest}
                                type="button"
                                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-primary/30 bg-secondary/50 text-primary px-3 py-1.5 text-xs font-bold hover:bg-secondary cursor-pointer"
                            >
                                <Plus className="size-3.5" />
                                <span>নতুন Attribute/Unit এর অনুরোধ</span>
                            </button>
                        )}

                        <button 
                            onClick={onClose} 
                            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                        >
                            <X className="size-5" />
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-border h-1.5">
                    <div 
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    />
                </div>

                {/* Wizard Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* ======================================================== */}
                    {/* STEP 1: মৌলিক তথ্য                                      */}
                    {/* ======================================================== */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">
                                        পণ্যের নাম (বাংলায়) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="উদা: চাকমা কোমর তাঁতে বোনা পিনন-হাদি"
                                        value={formData.name_bn}
                                        onChange={e => setFormData({ ...formData, name_bn: e.target.value })}
                                        className={`w-full rounded-xl border bg-background p-3 text-xs font-semibold text-foreground ${
                                            validationErrors.name_bn ? 'border-red-500' : 'border-border'
                                        }`}
                                    />
                                    {validationErrors.name_bn && (
                                        <p className="text-[11px] text-red-500 mt-1">{validationErrors.name_bn}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">
                                        Product Name (English) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Chakma Handwoven Pinon & Hadi"
                                        value={formData.name_en}
                                        onChange={e => setFormData({ ...formData, name_en: e.target.value })}
                                        className={`w-full rounded-xl border bg-background p-3 text-xs font-semibold text-foreground ${
                                            validationErrors.name_en ? 'border-red-500' : 'border-border'
                                        }`}
                                    />
                                    {validationErrors.name_en && (
                                        <p className="text-[11px] text-red-500 mt-1">{validationErrors.name_en}</p>
                                    )}
                                </div>
                            </div>

                            {/* Dependent Category & Subcategory */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">
                                        মূল ক্যাটাগরি <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.category_id}
                                        onChange={e => handleCategoryChange(e.target.value)}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold text-foreground"
                                    >
                                        {activeCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">
                                        সাব-ক্যাটাগরি
                                    </label>
                                    <select
                                        value={formData.subcategory}
                                        onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold text-foreground"
                                    >
                                        {(currentCategory.subcategories || ['সাধারন']).map(sub => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">
                                        ব্র্যান্ড / ক্রাফট লাইন (ঐচ্ছিক)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="উদা: Rangamati Artisans"
                                        value={formData.brand}
                                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold text-foreground"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-foreground mb-1">
                                    সংক্ষিপ্ত বিবরণ (Short Description)
                                </label>
                                <input
                                    type="text"
                                    placeholder="পণ্যটি সম্পর্কে এক নজরে আকর্ষণীয় ১-২ লাইন লিখুন"
                                    value={formData.short_description}
                                    onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold text-foreground"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-foreground mb-1">
                                    বিস্তারিত বিবরণ (Detailed Description)
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="পণ্যের উৎস, তৈরির পদ্ধতি, উপাদান এবং আদিবাসী ঐতিহ্যের গল্প বিস্তারিতভাবে লিখুন..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-background p-3 text-xs font-medium text-foreground leading-relaxed"
                                />
                            </div>
                        </div>
                    )}

                    {/* ======================================================== */}
                    {/* STEP 2: ছবি ও ভিডিও                                     */}
                    {/* ======================================================== */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="p-4 rounded-2xl border border-primary/20 bg-secondary/30 text-xs text-foreground flex items-center justify-between">
                                <div>
                                    <strong className="text-primary font-bold">ছবি নির্দেশনা:</strong> কমপক্ষে ৫টি এবং সর্বোচ্চ ৮টি ছবি আপলোড করুন। আপলোডের সময় ছবিগুলো স্বয়ংক্রিয়ভাবে ওয়েব-ফরম্যাটে অপ্টিমাইজ ও কমপ্রেস হবে।
                                </div>
                            </div>

                            {/* Primary Image */}
                            <div>
                                <label className="block text-xs font-bold text-foreground mb-1">
                                    মূল ছবি (Featured Primary Image)
                                </label>
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={formData.image || '/images/hero.jpg'} 
                                        alt="Preview" 
                                        className="size-20 rounded-2xl object-cover border border-border shadow-xs" 
                                    />
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="ছবির লিংক বা পাথ (উদা: /images/prod-pinon.jpg)"
                                            value={formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold text-foreground"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Gallery Images with Color Linking */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-foreground">
                                        গ্যালারি ছবি ও কালার লিঙ্ক ({formData.gallery_images.length})
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addGalleryImage}
                                        className="flex items-center gap-1 rounded-xl bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold hover:bg-primary/90 cursor-pointer"
                                    >
                                        <Plus className="size-3.5" />
                                        <span>ছবি যোগ করুন</span>
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {formData.gallery_images.map((gImg, idx) => (
                                        <div key={gImg.id} className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-background">
                                            <img src={gImg.image_path} alt="Gallery" className="size-12 rounded-xl object-cover border border-border" />
                                            <input
                                                type="text"
                                                value={gImg.image_path}
                                                onChange={e => {
                                                    const path = e.target.value;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        gallery_images: prev.gallery_images.map((im, i) => i === idx ? { ...im, image_path: path } : im)
                                                    }));
                                                }}
                                                placeholder="ছবির লিংক"
                                                className="flex-1 rounded-xl border border-border bg-card p-2 text-xs font-semibold text-foreground"
                                            />

                                            {/* Link with Color Swatch (Optional) */}
                                            {colorAttribute && (
                                                <select
                                                    value={gImg.color_value_id || ''}
                                                    onChange={e => {
                                                        const valId = e.target.value ? Number(e.target.value) : null;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            gallery_images: prev.gallery_images.map((im, i) => i === idx ? { ...im, color_value_id: valId } : im)
                                                        }));
                                                    }}
                                                    className="w-40 rounded-xl border border-border bg-card p-2 text-xs font-semibold text-foreground"
                                                >
                                                    <option value="">কোনো কালার লিঙ্ক নেই</option>
                                                    {colorAttribute.values?.map(c => (
                                                        <option key={c.id} value={c.id}>{c.name_bn} ({c.name_en})</option>
                                                    ))}
                                                </select>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(idx)}
                                                className="p-2 text-muted-foreground hover:text-red-500 rounded-lg"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Video URL */}
                            <div>
                                <label className="block text-xs font-bold text-foreground mb-1">
                                    ভিডিও লিংক (ইউটিউব বা ভিডিও ইউআরএল - ঐচ্ছিক)
                                </label>
                                <input
                                    type="text"
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={formData.video_url}
                                    onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold text-foreground"
                                />
                            </div>
                        </div>
                    )}

                    {/* ======================================================== */}
                    {/* STEP 3: পণ্যের ধরন (Simple vs Variable)                  */}
                    {/* ======================================================== */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <p className="text-xs text-muted-foreground">
                                আপনার পণ্যটি কি একটাই নির্দিষ্ট রূপের নাকি বিভিন্ন সাইজ, রং বা ওজনে পাওয়া যায়?
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Simple Product Card */}
                                <div
                                    onClick={() => setFormData({ ...formData, product_type: 'simple' })}
                                    className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                                        formData.product_type === 'simple'
                                            ? 'border-primary bg-secondary/30 shadow-md'
                                            : 'border-border bg-card hover:border-primary/40'
                                    }`}
                                >
                                    <div className="space-y-3">
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <Boxes className="size-6" />
                                        </div>
                                        <h3 className="font-display font-bold text-base text-foreground">
                                            Simple Product (একক রূপ)
                                        </h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            পণ্যটির একটাই নির্দিষ্ট সাইজ, রং বা রূপ। পণ্যের দাম এবং স্টক একটাই নির্ধারিত থাকবে। (যেমন: একটি নির্দিষ্ট বাঁশের ফুলদানি বা খাঁটি মধু বয়াম)।
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                                        <span className="text-xs font-bold text-primary">সরাসরি মূল্য ও স্টক</span>
                                        {formData.product_type === 'simple' && <CheckCircle2 className="size-5 text-primary" />}
                                    </div>
                                </div>

                                {/* Variable Product Card */}
                                <div
                                    onClick={() => setFormData({ ...formData, product_type: 'variable' })}
                                    className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                                        formData.product_type === 'variable'
                                            ? 'border-primary bg-secondary/30 shadow-md'
                                            : 'border-border bg-card hover:border-primary/40'
                                    }`}
                                >
                                    <div className="space-y-3">
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                                            <Sliders className="size-6" />
                                        </div>
                                        <h3 className="font-display font-bold text-base text-foreground">
                                            Variable Product (একাধিক রূপ)
                                        </h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            পণ্যটি একাধিক সাইজ (S, M, L, XL), রং (লাল, নীল) বা ওজনে (২৫০ গ্রাম, ৫০০ গ্রাম, ১ কেজি) পাওয়া যায়। প্রতিটি রূপের জন্য আলাদা দাম, স্টক ও SKU থাকবে।
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                                        <span className="text-xs font-bold text-accent">স্বয়ংক্রিয় ভ্যারিয়েশন জেনারেটর</span>
                                        {formData.product_type === 'variable' && <CheckCircle2 className="size-5 text-primary" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ======================================================== */}
                    {/* STEP 4: VARIATION (Variable Product Only)                */}
                    {/* ======================================================== */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            {formData.product_type === 'simple' ? (
                                <div className="text-center py-12 rounded-2xl border border-dashed border-border p-6 text-muted-foreground">
                                    <Boxes className="size-10 mx-auto mb-2 opacity-50 text-primary" />
                                    <h4 className="font-bold text-sm text-foreground">আপনি Simple Product নির্বাচন করেছেন</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Simple Product-এর জন্য কোনো Variation প্রয়োজন নেই। পরবর্তী ধাপে গিয়ে পণ্যের দাম ও স্টক নির্ধারণ করুন।
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Mapped Attributes Selection */}
                                    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                                        <div className="flex items-center justify-between border-b border-border pb-3">
                                            <div>
                                                <h3 className="font-display font-bold text-sm text-foreground">
                                                    "{currentCategory.name}"-এর জন্য অনুমোদিত Attribute ও মান নির্বাচন
                                                </h3>
                                                <p className="text-xs text-muted-foreground">
                                                    যে যে সাইজ বা রঙে পণ্যটি পাওয়া যায় সেগুলোতে টিক দিন।
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleGenerateVariations}
                                                className="flex items-center gap-1.5 rounded-xl bg-forest-deep text-white px-4 py-2 text-xs font-bold hover:bg-forest-deep/90 shadow-xs cursor-pointer"
                                            >
                                                <Sparkles className="size-4 text-emerald-300" />
                                                <span>Generate Variations</span>
                                            </button>
                                        </div>

                                        {availableAttributes.length > 0 ? (
                                            <div className="space-y-4">
                                                {availableAttributes.map(attr => {
                                                    const selectedVals = formData.selected_attributes[attr.id] || [];
                                                    return (
                                                        <div key={attr.id} className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-bold text-foreground">
                                                                    {attr.name_bn} ({attr.name_en})
                                                                </span>
                                                                <span className="text-[11px] text-muted-foreground">
                                                                    {selectedVals.length} নির্বাচিত
                                                                </span>
                                                            </div>

                                                            <div className="flex flex-wrap gap-2">
                                                                {attr.values?.map(val => {
                                                                    const isSelected = selectedVals.includes(val.id);
                                                                    return (
                                                                        <button
                                                                            key={val.id}
                                                                            type="button"
                                                                            onClick={() => toggleAttributeValue(attr.id, val.id)}
                                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                                                                isSelected
                                                                                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                                                                                    : 'bg-background border border-border text-foreground hover:bg-muted'
                                                                            }`}
                                                                        >
                                                                            {val.hex_color && (
                                                                                <span 
                                                                                    className="size-3.5 rounded-full border border-black/20"
                                                                                    style={{ backgroundColor: val.hex_color }} 
                                                                                />
                                                                            )}
                                                                            <span>{val.name_bn}</span>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 text-xs text-muted-foreground">
                                                এই ক্যাটাগরির জন্য এখনো কোনো Attribute ম্যাপিং করা হয়নি। অ্যাডমিন ড্যাশবোর্ড থেকে ম্যাপিং সম্পন্ন করুন।
                                            </div>
                                        )}
                                    </div>

                                    {/* Generated Variations Matrix */}
                                    {formData.variations.length > 0 && (
                                        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                                            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
                                                <div>
                                                    <h3 className="font-display font-bold text-sm text-foreground">
                                                        উত্পন্ন ভ্যারিয়েশন তালিকা ({formData.variations.length}টি কম্বিনেশন)
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground">
                                                        প্রতিটি কম্বিনেশনের জন্য দাম, ছাড়ের মূল্য, স্টক এবং SKU আলাদাভাবে এডিট করতে পারবেন।
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => setIsBulkEditOpen(true)}
                                                    className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-secondary px-3 py-1.5 text-xs font-bold text-primary hover:bg-secondary/80 cursor-pointer"
                                                >
                                                    <Sliders className="size-3.5" />
                                                    <span>Bulk Edit (একসাথে মান বসান)</span>
                                                </button>
                                            </div>

                                            {/* Variations Table */}
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left text-xs">
                                                    <thead className="bg-muted text-muted-foreground font-semibold border-b border-border">
                                                        <tr>
                                                            <th className="p-3">ভ্যারিয়েশন / কম্বিনেশন</th>
                                                            <th className="p-3">SKU</th>
                                                            <th className="p-3">নিয়মিত দাম (৳)</th>
                                                            <th className="p-3">অফার দাম (৳)</th>
                                                            <th className="p-3">স্টক</th>
                                                            <th className="p-3 text-center">চালু / বন্ধ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border">
                                                        {formData.variations.map((v, idx) => (
                                                            <tr key={v.id} className={!v.is_active ? 'opacity-40 bg-muted/20' : ''}>
                                                                <td className="p-3 font-semibold text-foreground">
                                                                    <div className="flex items-center gap-2">
                                                                        {v.combination.map(c => (
                                                                            <span key={c.attrId} className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-bold">
                                                                                {c.valName}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                                <td className="p-3">
                                                                    <input
                                                                        type="text"
                                                                        value={v.sku}
                                                                        onChange={e => {
                                                                            const val = e.target.value;
                                                                            setFormData(prev => ({
                                                                                ...prev,
                                                                                variations: prev.variations.map((item, i) => i === idx ? { ...item, sku: val } : item)
                                                                            }));
                                                                        }}
                                                                        className="w-32 rounded-lg border border-border bg-background p-1.5 font-mono text-xs"
                                                                    />
                                                                </td>
                                                                <td className="p-3">
                                                                    <input
                                                                        type="number"
                                                                        value={v.price}
                                                                        onChange={e => {
                                                                            const val = e.target.value;
                                                                            setFormData(prev => ({
                                                                                ...prev,
                                                                                variations: prev.variations.map((item, i) => i === idx ? { ...item, price: val } : item)
                                                                            }));
                                                                        }}
                                                                        className="w-24 rounded-lg border border-border bg-background p-1.5 text-xs font-bold"
                                                                    />
                                                                </td>
                                                                <td className="p-3">
                                                                    <input
                                                                        type="number"
                                                                        value={v.sale_price || ''}
                                                                        placeholder="ঐচ্ছিক"
                                                                        onChange={e => {
                                                                            const val = e.target.value;
                                                                            setFormData(prev => ({
                                                                                ...prev,
                                                                                variations: prev.variations.map((item, i) => i === idx ? { ...item, sale_price: val } : item)
                                                                            }));
                                                                        }}
                                                                        className="w-24 rounded-lg border border-border bg-background p-1.5 text-xs font-bold text-accent"
                                                                    />
                                                                </td>
                                                                <td className="p-3">
                                                                    <input
                                                                        type="number"
                                                                        value={v.stock}
                                                                        onChange={e => {
                                                                            const val = e.target.value;
                                                                            setFormData(prev => ({
                                                                                ...prev,
                                                                                variations: prev.variations.map((item, i) => i === idx ? { ...item, stock: val } : item)
                                                                            }));
                                                                        }}
                                                                        className="w-20 rounded-lg border border-border bg-background p-1.5 text-xs font-bold"
                                                                    />
                                                                </td>
                                                                <td className="p-3 text-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setFormData(prev => ({
                                                                                ...prev,
                                                                                variations: prev.variations.map((item, i) => i === idx ? { ...item, is_active: !item.is_active } : item)
                                                                            }));
                                                                        }}
                                                                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                                                                            v.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                                                        }`}
                                                                    >
                                                                        {v.is_active ? 'সক্রিয়' : 'বন্ধ'}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Bulk Edit Modal */}
                            {isBulkEditOpen && (
                                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                                    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
                                        <h3 className="font-display font-bold text-base text-foreground">
                                            সব ভ্যারিয়েশনের মান একসাথে বসান
                                        </h3>
                                        <div>
                                            <label className="block text-xs font-semibold text-muted-foreground mb-1">নিয়মিত দাম (৳)</label>
                                            <input
                                                type="number"
                                                placeholder="উদা: 4500"
                                                value={bulkPrice}
                                                onChange={e => setBulkPrice(e.target.value)}
                                                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-muted-foreground mb-1">অফার দাম (৳)</label>
                                            <input
                                                type="number"
                                                placeholder="উদা: 4200"
                                                value={bulkSalePrice}
                                                onChange={e => setBulkSalePrice(e.target.value)}
                                                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-bold text-accent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-muted-foreground mb-1">স্টক সংখ্যা</label>
                                            <input
                                                type="number"
                                                placeholder="উদা: 20"
                                                value={bulkStock}
                                                onChange={e => setBulkStock(e.target.value)}
                                                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-bold"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2 border-t border-border">
                                            <button
                                                type="button"
                                                onClick={() => setIsBulkEditOpen(false)}
                                                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold"
                                            >
                                                বাতিল
                                            </button>
                                            <button
                                                type="button"
                                                onClick={applyBulkEdit}
                                                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
                                            >
                                                প্রয়োগ করুন
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ======================================================== */}
                    {/* STEP 5: দাম ও স্টক                                       */}
                    {/* ======================================================== */}
                    {currentStep === 5 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">
                                        নিয়মিত মূল্য (Regular Price ৳) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="উদা: 1200"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-bold text-foreground text-base"
                                    />
                                    {validationErrors.price && (
                                        <p className="text-[11px] text-red-500 mt-1">{validationErrors.price}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">
                                        ছাড়ের মূল্য / অফার দাম (Sale Price ৳ - ঐচ্ছিক)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="উদা: 990"
                                        value={formData.old_price}
                                        onChange={e => setFormData({ ...formData, old_price: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-bold text-accent text-base"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">ডিসকাউন্ট শুরুর তারিখ</label>
                                    <input
                                        type="date"
                                        value={formData.sale_start_date}
                                        onChange={e => setFormData({ ...formData, sale_start_date: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">ডিসকাউন্ট শেষের তারিখ</label>
                                    <input
                                        type="date"
                                        value={formData.sale_end_date}
                                        onChange={e => setFormData({ ...formData, sale_end_date: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">
                                        মোট স্টক সংখ্যা <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="25"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">SKU কোড</label>
                                    <input
                                        type="text"
                                        placeholder="উদা: TEX-SHAWL-01"
                                        value={formData.sku}
                                        onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-mono font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">Low Stock Alert সীমা</label>
                                    <input
                                        type="number"
                                        placeholder="5"
                                        value={formData.low_stock_threshold}
                                        onChange={e => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">সর্বনিম্ন অর্ডারের পরিমাণ</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.min_order_qty}
                                        onChange={e => setFormData({ ...formData, min_order_qty: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">সর্বোচ্চ অর্ডারের পরিমাণ</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.max_order_qty}
                                        onChange={e => setFormData({ ...formData, max_order_qty: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ======================================================== */}
                    {/* STEP 6: শিপিং তথ্য                                       */}
                    {/* ======================================================== */}
                    {currentStep === 6 && (
                        <div className="space-y-4">
                            <p className="text-xs text-muted-foreground">
                                প্যাকেজের ওজন ও মাত্রা কুরিয়ার চার্জ এবং ডেলিভারি হিসাবের জন্য ব্যবহৃত হবে।
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">প্যাকেজ ওজন (কেজি)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.weight_val}
                                        onChange={e => setFormData({ ...formData, weight_val: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">দৈর্ঘ্য (ইঞ্চি)</label>
                                    <input
                                        type="number"
                                        value={formData.length}
                                        onChange={e => setFormData({ ...formData, length: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">প্রস্থ (ইঞ্চি)</label>
                                    <input
                                        type="number"
                                        value={formData.width}
                                        onChange={e => setFormData({ ...formData, width: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">উচ্চতা (ইঞ্চি)</label>
                                    <input
                                        type="number"
                                        value={formData.height}
                                        onChange={e => setFormData({ ...formData, height: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">আনুমানিক ডেলিভারি সময়</label>
                                    <select
                                        value={formData.delivery_time}
                                        onChange={e => setFormData({ ...formData, delivery_time: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold"
                                    >
                                        <option value="১-২ দিন">১-২ দিন (এক্সপ্রেস পাহাড়ি ডেলিভারি)</option>
                                        <option value="২-৩ দিন">২-৩ দিন (স্ট্যান্ডার্ড কুরিয়ার)</option>
                                        <option value="৩-৫ দিন">৩-৫ দিন (দূরবর্তী পার্বত্য অঞ্চল)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">ক্যাশ অন ডেলিভারি (COD)</label>
                                    <select
                                        value={formData.is_cod_available ? 'yes' : 'no'}
                                        onChange={e => setFormData({ ...formData, is_cod_available: e.target.value === 'yes' })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold"
                                    >
                                        <option value="yes">হ্যাঁ (ক্যাশ অন ডেলিভারি প্রযোজ্য)</option>
                                        <option value="no">না (শুধু অনলাইন অগ্রিম পেমেন্ট)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ======================================================== */}
                    {/* STEP 7: পাহাড়ি পণ্যের বিশেষ তথ্য                         */}
                    {/* ======================================================== */}
                    {currentStep === 7 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">উৎপত্তিস্থল জেলা</label>
                                    <select
                                        value={formData.district}
                                        onChange={e => setFormData({ ...formData, district: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold"
                                    >
                                        <option value="বান্দরবান">বান্দরবান (Bandarban)</option>
                                        <option value="রাঙামাটি">রাঙামাটি (Rangamati)</option>
                                        <option value="খাগড়াছড়ি">খাগড়াছড়ি (Khagrachari)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-foreground mb-1">কারিগর / নৃগোষ্ঠী সম্প্রদায়</label>
                                    <select
                                        value={formData.community}
                                        onChange={e => setFormData({ ...formData, community: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold"
                                    >
                                        <option value="চাকমা">চাকমা (Chakma)</option>
                                        <option value="মারমা">মারমা (Marma)</option>
                                        <option value="ত্রিপুরা">ত্রিপুরা (Tripura)</option>
                                        <option value="বম">বম (Bawm)</option>
                                        <option value="তঞ্চঙ্গ্যা">তঞ্চঙ্গ্যা (Tanchangya)</option>
                                        <option value="ম্রো">ম্রো (Mro)</option>
                                        <option value="খুমি">খুমি (Khumi)</option>
                                        <option value="অন্যান্য">অন্যান্য পাহাড়ি সম্প্রদায়</option>
                                    </select>
                                </div>
                            </div>

                            {/* Tags Checkbox */}
                            <div>
                                <label className="block text-xs font-bold text-foreground mb-2">পণ্যের বিশুদ্ধতার বৈশিষ্ট্য</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer ${
                                        formData.is_handmade ? 'border-primary bg-secondary/30 font-bold' : 'border-border'
                                    }`}>
                                        <input
                                            type="checkbox"
                                            checked={formData.is_handmade}
                                            onChange={e => setFormData({ ...formData, is_handmade: e.target.checked })}
                                            className="rounded"
                                        />
                                        <span className="text-xs">হাতে তৈরি (Handmade)</span>
                                    </label>

                                    <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer ${
                                        formData.is_natural ? 'border-primary bg-secondary/30 font-bold' : 'border-border'
                                    }`}>
                                        <input
                                            type="checkbox"
                                            checked={formData.is_natural}
                                            onChange={e => setFormData({ ...formData, is_natural: e.target.checked })}
                                            className="rounded"
                                        />
                                        <span className="text-xs">প্রাকৃতিক (Natural)</span>
                                    </label>

                                    <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer ${
                                        formData.is_organic ? 'border-primary bg-secondary/30 font-bold' : 'border-border'
                                    }`}>
                                        <input
                                            type="checkbox"
                                            checked={formData.is_organic}
                                            onChange={e => setFormData({ ...formData, is_organic: e.target.checked })}
                                            className="rounded"
                                        />
                                        <span className="text-xs">অর্গানিক (Organic)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Dynamic Food Section (Conditional) */}
                            {isFoodCategory && (
                                <div className="rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-5 space-y-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                                        <AlertCircle className="size-4" />
                                        <span>খাদ্য ও পচনশীল পণ্যের বিশেষ তথ্য (Food Compliance)</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-foreground mb-1">উৎপাদন / প্রক্রিয়াজাতকরণের তারিখ</label>
                                            <input
                                                type="date"
                                                value={formData.production_date}
                                                onChange={e => setFormData({ ...formData, production_date: e.target.value })}
                                                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-foreground mb-1">মেয়াদ উত্তীর্ণের তারিখ (Expiry Date)</label>
                                            <input
                                                type="date"
                                                value={formData.expiry_date}
                                                onChange={e => setFormData({ ...formData, expiry_date: e.target.value })}
                                                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-foreground mb-1">সংরক্ষণ পদ্ধতি ও সতর্কতা</label>
                                        <input
                                            type="text"
                                            placeholder="উদা: স্বাভাবিক তাপমাত্রায় শুকনো স্থানে রাখুন অথবা ফ্রিজে ৪° সেলসিয়াসে সংরক্ষণ করুন।"
                                            value={formData.storage_instructions}
                                            onChange={e => setFormData({ ...formData, storage_instructions: e.target.value })}
                                            className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ======================================================== */}
                    {/* STEP 8: SEO ও ট্যাগ                                      */}
                    {/* ======================================================== */}
                    {currentStep === 8 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-foreground mb-1">
                                    সার্চ ট্যাগ (কমা দিয়ে আলাদা করুন)
                                </label>
                                <input
                                    type="text"
                                    placeholder="উদা: পাহাড়ি শাল, কোমর তাঁত, চাকমা ড্রেস, রাঙ্গামাটি"
                                    value={formData.tags_input}
                                    onChange={e => setFormData({ ...formData, tags_input: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-foreground mb-1">
                                    SEO মেটা টাইটেল (ঐচ্ছিক)
                                </label>
                                <input
                                    type="text"
                                    placeholder={formData.name_bn || 'Paharika Hill Marketplace'}
                                    value={formData.seo_title}
                                    onChange={e => setFormData({ ...formData, seo_title: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-background p-3 text-xs font-semibold"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-foreground mb-1">
                                    SEO মেটা বিবরণ (Meta Description)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="গুগল সার্চে ক্রেতাদের আকর্ষণ করার জন্য ১৫০ অক্ষরের মধ্যে আকর্ষণীয় বিবরণ লিখুন"
                                    value={formData.seo_description}
                                    onChange={e => setFormData({ ...formData, seo_description: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-background p-3 text-xs font-medium"
                                />
                            </div>
                        </div>
                    )}

                    {/* ======================================================== */}
                    {/* STEP 9: সাবমিট ও ফাইনাল প্রিভিউ                          */}
                    {/* ======================================================== */}
                    {currentStep === 9 && (
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                                <h3 className="font-display font-bold text-base text-foreground pb-2 border-b border-border">
                                    পণ্যের সারসংক্ষেপ ও চূড়ান্ত প্রিভিউ
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <p className="text-muted-foreground">পণ্যের নাম (বাংলা):</p>
                                        <p className="font-bold text-foreground text-sm">{formData.name_bn}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Product Name (EN):</p>
                                        <p className="font-bold text-foreground text-sm">{formData.name_en}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">ক্যাটাগরি:</p>
                                        <p className="font-semibold text-foreground">{currentCategory.name} &gt; {formData.subcategory}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">পণ্যের ধরন:</p>
                                        <p className="font-semibold text-foreground">
                                            {formData.product_type === 'variable' ? `Variable (${formData.variations.length}টি রূপ)` : 'Simple Product'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">মূল্য:</p>
                                        <p className="font-bold text-primary text-base">
                                            ৳ {formData.price} {formData.old_price && <span className="line-through text-xs text-muted-foreground">৳ {formData.old_price}</span>}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">স্টক ও জেলা:</p>
                                        <p className="font-semibold text-foreground">{formData.stock} পিস • {formData.district} ({formData.community})</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-secondary/40 border border-primary/20 text-xs text-foreground flex items-center gap-3">
                                <ShieldCheck className="size-6 text-primary shrink-0" />
                                <div>
                                    <strong className="text-primary font-bold">অ্যাডমিন রিভিউ পলিসি:</strong> "Submit for Review" বাটনে ক্লিক করলে পণ্যটি সুপার অ্যাডমিন প্যানেলে জমা হবে। অ্যাডমিন অনুমোদন করার সাথে সাথে এটি মূল মার্কেটপ্লেসে লাইভ হবে এবং আপনি নোটিফিকেশন পাবেন।
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Wizard Footer Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/40 px-6 py-4">
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-40 cursor-pointer"
                    >
                        <ChevronLeft className="size-4" />
                        <span>পূর্ববর্তী</span>
                    </button>

                    <div className="flex items-center gap-2">
                        {currentStep < totalSteps ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => handleSubmit('Draft')}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                    Save as Draft
                                </button>

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 cursor-pointer"
                                >
                                    <span>পরবর্তী ধাপ</span>
                                    <ChevronRight className="size-4" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => handleSubmit('Draft')}
                                    disabled={isSubmitting}
                                    className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                    ড্রাফট সংরক্ষণ
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleSubmit('Pending_Review')}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-1.5 px-7 py-2.5 rounded-xl bg-forest-deep text-white text-xs font-bold shadow-md hover:bg-forest-deep/90 cursor-pointer"
                                >
                                    <Check className="size-4 text-emerald-300" />
                                    <span>{isSubmitting ? 'জমা হচ্ছে...' : 'Submit for Review'}</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
