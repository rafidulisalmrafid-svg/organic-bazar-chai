import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import ProductCard from '../Components/ProductCard';
import CartDrawer from '../Components/CartDrawer';
import { CartProvider, useCart } from '../context/CartContext';
import { 
    ChevronRight, 
    Star, 
    Plus, 
    Minus, 
    ShoppingBag, 
    Heart, 
    Truck, 
    RotateCcw, 
    ShieldCheck, 
    Store, 
    MapPin,
    Check,
    MessageSquare,
    CheckCircle2,
    Send,
    AlertCircle,
    Calendar,
    Sparkles,
    Leaf
} from 'lucide-react';

function ProductContent({ product, vendor, relatedProducts, allProducts }) {
    const { addToCart, toggleWishlist, isWishlisted } = useCart();
    const wishlisted = isWishlisted(product.id);

    const hasVariations = product.product_type === 'variable' && Array.isArray(product.variations) && product.variations.length > 0;

    // Gallery images: from product.gallery or fallback
    const galleryImages = useMemo(() => {
        if (product.gallery && product.gallery.length > 0) {
            return product.gallery.map(g => g.image_path);
        }
        return [
            product.image,
            ...allProducts.filter(p => p.id !== product.id).slice(0, 3).map(p => p.image)
        ];
    }, [product, allProducts]);

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addedToast, setAddedToast] = useState(false);

    // Group variations attributes
    const attributeGroups = useMemo(() => {
        if (!hasVariations) return [];

        if (product.product_attributes && product.product_attributes.length > 0) {
            return product.product_attributes.map(pa => ({
                id: pa.id,
                code: pa.code,
                name_en: pa.name_en,
                name_bn: pa.name_bn,
                type: pa.type || (pa.code === 'color' ? 'color' : 'button'),
                values: pa.values || []
            }));
        }

        const groups = {};
        product.variations.forEach(v => {
            if (v.attributes) {
                Object.entries(v.attributes).forEach(([code, val]) => {
                    if (!groups[code]) {
                        groups[code] = {
                            code,
                            name_en: code.toUpperCase(),
                            name_bn: code === 'size' ? 'সাইজ' : (code === 'color' ? 'রং' : (code === 'weight' ? 'ওজন' : code)),
                            type: code === 'color' ? 'color' : 'button',
                            valuesMap: {}
                        };
                    }
                    if (val && val.id) {
                        groups[code].valuesMap[val.id] = val;
                    }
                });
            }
        });

        return Object.values(groups).map(g => ({
            ...g,
            values: Object.values(g.valuesMap)
        }));
    }, [product, hasVariations]);

    // Selected attributes: { [code]: valId }
    const [selectedAttributes, setSelectedAttributes] = useState(() => {
        if (!hasVariations || attributeGroups.length === 0) return {};
        const firstActive = product.variations.find(v => v.is_active && v.stock > 0) || product.variations[0];
        const initial = {};
        if (firstActive && firstActive.attributes) {
            Object.entries(firstActive.attributes).forEach(([code, val]) => {
                initial[code] = val.id;
            });
        } else {
            attributeGroups.forEach(grp => {
                if (grp.values.length > 0) {
                    initial[grp.code] = grp.values[0].id;
                }
            });
        }
        return initial;
    });

    // Fallback simple color/size if not variable
    const [simpleColor, setSimpleColor] = useState('Forest');
    const [simpleSize, setSimpleSize] = useState('Standard');

    // Find currently matched variation
    const matchedVariation = useMemo(() => {
        if (!hasVariations) return null;
        return product.variations.find(v => {
            if (!v.attributes) return false;
            return Object.entries(selectedAttributes).every(([code, valId]) => {
                return v.attributes[code] && v.attributes[code].id === valId;
            });
        }) || null;
    }, [hasVariations, product.variations, selectedAttributes]);

    // Handle attribute selection
    const handleSelectAttribute = (groupCode, val) => {
        setSelectedAttributes(prev => ({
            ...prev,
            [groupCode]: val.id
        }));

        // Switch to color-linked image if available
        if (groupCode === 'color' && product.gallery) {
            const linkedIdx = product.gallery.findIndex(g => g.color_value_id === val.id);
            if (linkedIdx !== -1) {
                setActiveImageIndex(linkedIdx);
            }
        }
    };

    // When matchedVariation changes, update image if variation has custom image_url
    useEffect(() => {
        if (matchedVariation && matchedVariation.image_url) {
            const imgIdx = galleryImages.findIndex(img => img === matchedVariation.image_url);
            if (imgIdx !== -1) {
                setActiveImageIndex(imgIdx);
            }
        }
    }, [matchedVariation, galleryImages]);

    // Price, Old Price, Stock, SKU
    const currentPrice = matchedVariation 
        ? (matchedVariation.sale_price || matchedVariation.price) 
        : product.price;

    const currentOldPrice = matchedVariation
        ? (matchedVariation.sale_price ? matchedVariation.price : null)
        : product.oldPrice;

    const currentStock = matchedVariation
        ? matchedVariation.stock
        : (product.stock !== undefined ? product.stock : 18);

    const currentSku = matchedVariation
        ? matchedVariation.sku
        : (product.sku || 'N/A');

    const isOutOfStock = matchedVariation
        ? (!matchedVariation.is_active || matchedVariation.stock <= 0)
        : (currentStock <= 0);

    const formatPrice = (amount) => `৳ ${Number(amount).toLocaleString('en-IN')}`;

    const discountPercent = currentOldPrice 
        ? Math.round((1 - currentPrice / currentOldPrice) * 100) 
        : null;

    // Customer reviews state
    const [reviewsList, setReviewsList] = useState([
        {
            id: 1,
            author: 'তনুশ্রী চাকমা',
            district: 'ঢাকা',
            rating: 5,
            date: '২ দিন আগে',
            comment: 'শালটির সুতার বুনন এবং প্রাকৃতিক রঙ অসাধারণ। একদম রাঙ্গামাটির খাঁটি কোমর তাঁতের কাজের ছোঁয়া পাওয়া যায়। অত্যন্ত সন্তুষ্ট!',
            verified: true,
        },
        {
            id: 2,
            author: 'আহমেদ জামান',
            district: 'চট্টগ্রাম',
            rating: 5,
            date: '৫ দিন আগে',
            comment: 'ক্যাশ অন ডেলিভারিতে নিয়েছি। ২ দিনের মধ্যেই সাঙ্গু নদীর খাঁটি কারুশিল্পের পণ্য হাতে পেয়েছি। প্যাকিং খুব যত্নশীল ছিল।',
            verified: true,
        },
        {
            id: 3,
            author: 'সাবরিনা সুলতানা',
            district: 'সিলেট',
            rating: 4,
            date: '১ সপ্তাহ আগে',
            comment: 'পাহাড়ি খাঁটি জিনিস। ড্রইং রুমে বা উপহার দেওয়ার জন্য অসাধারণ একটি আইটেম।',
            verified: true,
        }
    ]);

    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [newAuthor, setNewAuthor] = useState('');
    const [newDistrict, setNewDistrict] = useState('ঢাকা');

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        const colorName = hasVariations 
            ? (matchedVariation?.attributes?.color?.name_bn || matchedVariation?.attributes?.color?.name_en || '') 
            : simpleColor;
        const sizeName = hasVariations 
            ? (matchedVariation?.attributes?.size?.name_bn || matchedVariation?.attributes?.size?.name_en || '') 
            : simpleSize;

        addToCart(product, quantity, colorName, sizeName, matchedVariation);
        setAddedToast(true);
        setTimeout(() => setAddedToast(false), 2000);
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim() || !newAuthor.trim()) {
            alert('অনুগ্রহ করে আপনার নাম এবং রিভিউয়ের বিবরণ লিখুন।');
            return;
        }

        const newRev = {
            id: Date.now(),
            author: newAuthor.trim(),
            district: newDistrict,
            rating: newRating,
            date: 'আজকে',
            comment: newComment.trim(),
            verified: true,
        };

        setReviewsList([newRev, ...reviewsList]);
        setNewComment('');
        setNewAuthor('');
        alert('আপনার মূল্যবান রিভিউটি সফলভাবে প্রকাশিত হয়েছে। ধন্যবাদ!');
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <ChevronRight className="size-3.5 text-border" />
                    <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
                    <ChevronRight className="size-3.5 text-border" />
                    <span className="text-muted-foreground">{product.category}</span>
                    <ChevronRight className="size-3.5 text-border" />
                    <span className="text-foreground font-medium truncate max-w-xs">{product.name}</span>
                </nav>

                {/* Main Product Section */}
                <div className="mt-8 grid gap-12 lg:grid-cols-2">
                    {/* Left: Image Gallery */}
                    <div>
                        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                            <img 
                                src={galleryImages[activeImageIndex] || product.image} 
                                alt={product.name} 
                                className="aspect-square w-full object-cover transition-all duration-300"
                            />

                            {/* Type badge on image */}
                            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                                {hasVariations ? (
                                    <span className="rounded-full bg-purple-600/90 backdrop-blur-xs px-3 py-1 text-[11px] font-bold text-white shadow-xs">
                                        মাল্টি-ভেরিয়েশন পণ্য
                                    </span>
                                ) : (
                                    <span className="rounded-full bg-black/60 backdrop-blur-xs px-3 py-1 text-[11px] font-bold text-white shadow-xs">
                                        খাঁটি পাহাড়ের পণ্য
                                    </span>
                                )}
                                {product.badge && (
                                    <span className="rounded-full bg-secondary/90 px-3 py-1 text-[11px] font-semibold text-secondary-foreground uppercase shadow-xs">
                                        {product.badge}
                                    </span>
                                )}
                            </div>

                            {/* Stock status overlay if out of stock */}
                            {isOutOfStock && (
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                                    <span className="rounded-2xl bg-destructive px-5 py-2.5 text-sm font-bold text-white shadow-lg animate-pulse">
                                        স্টক নেই (Out of Stock)
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className="mt-4 grid grid-cols-4 sm:grid-cols-5 gap-3">
                            {galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setActiveImageIndex(idx)}
                                    aria-label={`View image ${idx + 1}`}
                                    className={`overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                                        activeImageIndex === idx 
                                            ? 'border-primary ring-2 ring-primary/20 scale-102' 
                                            : 'border-transparent hover:border-border'
                                    }`}
                                >
                                    <img 
                                        src={img} 
                                        alt="" 
                                        loading="lazy" 
                                        className="aspect-square w-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Details & Buying Options */}
                    <div className="space-y-6">
                        <div>
                            {/* Hill Provenance Badges */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                {product.district && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold">
                                        <MapPin className="size-3" /> {product.district}
                                    </span>
                                )}
                                {product.community && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-bold">
                                        কারিগর: {product.community}
                                    </span>
                                )}
                                {product.is_handmade && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1 text-xs font-bold">
                                        <Sparkles className="size-3" /> ১০০% হাতে তৈরি
                                    </span>
                                )}
                                {product.is_organic && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-1 text-xs font-bold">
                                        <Leaf className="size-3" /> অর্গানিক
                                    </span>
                                )}
                            </div>

                            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                {product.name}
                            </h1>

                            {/* Reviews & SKU */}
                            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            className={`size-4 ${
                                                i < Math.round(product.rating || 5) 
                                                    ? 'fill-accent text-accent' 
                                                    : 'text-border'
                                            }`} 
                                        />
                                    ))}
                                </div>
                                <span className="font-semibold text-foreground">{product.rating || 4.9}</span>
                                <span className="text-muted-foreground">· {reviewsList.length} টি যাচাইকৃত রিভিউ</span>
                                <span className="text-border">|</span>
                                <span className="font-mono text-xs text-muted-foreground">SKU: <strong className="text-foreground">{currentSku}</strong></span>
                            </div>
                        </div>

                        {/* Price & Stock status */}
                        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                            <div className="flex items-baseline gap-3">
                                <span className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                                    {formatPrice(currentPrice)}
                                </span>
                                {currentOldPrice && (
                                    <>
                                        <span className="text-base text-muted-foreground line-through">
                                            {formatPrice(currentOldPrice)}
                                        </span>
                                        {discountPercent && (
                                            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
                                                সেভ {discountPercent}%
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Stock notification badge */}
                            <div className="flex items-center gap-2">
                                {isOutOfStock ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 text-destructive px-3 py-1 text-xs font-bold">
                                        <AlertCircle className="size-3.5" /> স্টক শেষ (Out of Stock)
                                    </span>
                                ) : currentStock <= 5 ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 px-3 py-1 text-xs font-bold animate-pulse">
                                        <AlertCircle className="size-3.5" /> দ্রুত শেষ হচ্ছে! মাত্র {currentStock} টি বাকি
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold">
                                        <Check className="size-3.5" /> স্টকে পর্যাপ্ত মজুদ আছে ({currentStock} টি)
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <p className="leading-relaxed text-xs sm:text-sm text-muted-foreground">
                            {product.description}
                        </p>

                        {/* ================= DYNAMIC VARIATION ATTRIBUTES ================= */}
                        {hasVariations ? (
                            <div className="space-y-5 pt-2 border-t border-border">
                                {attributeGroups.map((group) => {
                                    const selectedValId = selectedAttributes[group.code];
                                    const selectedValObj = group.values.find(v => v.id === selectedValId);

                                    return (
                                        <div key={group.code} className="space-y-2.5">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-bold text-foreground">
                                                    {group.name_bn || group.name_en}:{' '}
                                                    <span className="font-normal text-primary">
                                                        {selectedValObj ? (selectedValObj.name_bn || selectedValObj.name_en) : 'নির্বাচন করুন'}
                                                    </span>
                                                </p>
                                                <span className="text-[10px] text-muted-foreground uppercase">{group.code}</span>
                                            </div>

                                            {/* COLOR SWATCHES */}
                                            {group.type === 'color' || group.code === 'color' ? (
                                                <div className="flex flex-wrap items-center gap-2.5">
                                                    {group.values.map((val) => {
                                                        const isSelected = selectedValId === val.id;
                                                        const hex = val.hex_color || '#2d5a27';

                                                        return (
                                                            <button
                                                                key={val.id}
                                                                type="button"
                                                                onClick={() => handleSelectAttribute(group.code, val)}
                                                                title={`${val.name_bn || val.name_en}`}
                                                                className={`relative flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all cursor-pointer ${
                                                                    isSelected 
                                                                        ? 'border-primary ring-2 ring-primary/25 bg-primary/5 font-bold' 
                                                                        : 'border-border bg-card hover:border-border/80'
                                                                }`}
                                                            >
                                                                <span 
                                                                    className="size-4 rounded-full border border-black/20 shrink-0 shadow-2xs" 
                                                                    style={{ backgroundColor: hex }}
                                                                />
                                                                <span className="text-xs text-foreground">
                                                                    {val.name_bn || val.name_en}
                                                                </span>
                                                                {isSelected && <Check className="size-3 text-primary shrink-0" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                /* SIZE / WEIGHT / VOLUME BUTTON PILLS */
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {group.values.map((val) => {
                                                        const isSelected = selectedValId === val.id;

                                                        return (
                                                            <button
                                                                key={val.id}
                                                                type="button"
                                                                onClick={() => handleSelectAttribute(group.code, val)}
                                                                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                                                                    isSelected
                                                                        ? 'border-primary bg-primary text-primary-foreground shadow-xs scale-102'
                                                                        : 'border-border bg-card text-foreground hover:border-primary/50'
                                                                }`}
                                                            >
                                                                {val.name_bn || val.name_en}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Simple Product Fallback Selectors */
                            <div className="space-y-4 pt-2 border-t border-border">
                                <div>
                                    <p className="text-xs font-bold text-foreground">
                                        রং (Colour): <span className="font-normal text-muted-foreground">{simpleColor}</span>
                                    </p>
                                    <div className="mt-2 flex gap-2">
                                        {['Forest Green', 'Terracotta Red', 'Natural Ivory'].map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setSimpleColor(c)}
                                                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                                                    simpleColor === c
                                                        ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                                                        : 'border-border text-foreground hover:border-primary'
                                                }`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quantity and Actions */}
                        <div className="mt-6 flex flex-wrap items-center gap-3 pt-2">
                            {/* Quantity Stepper */}
                            <div className="flex items-center rounded-full border border-border bg-card shadow-2xs">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={isOutOfStock}
                                    className="p-3 text-foreground hover:text-primary transition-colors cursor-pointer disabled:opacity-40"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="size-4" />
                                </button>
                                <span className="w-10 text-center text-sm font-semibold text-foreground">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.min(currentStock || 99, quantity + 1))}
                                    disabled={isOutOfStock}
                                    className="p-3 text-foreground hover:text-primary transition-colors cursor-pointer disabled:opacity-40"
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="size-4" />
                                </button>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold transition-all shadow-md active:scale-98 cursor-pointer ${
                                    isOutOfStock 
                                        ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-60' 
                                        : 'bg-primary text-primary-foreground hover:bg-forest-deep'
                                }`}
                            >
                                {isOutOfStock ? (
                                    <>
                                        <AlertCircle className="size-4" /> স্টক শেষ (Out of Stock)
                                    </>
                                ) : addedToast ? (
                                    <>
                                        <Check className="size-4" /> ব্যাগে যোগ হয়েছে ({quantity})
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="size-4" /> ব্যাগে যোগ করুন (Add to Cart)
                                    </>
                                )}
                            </button>

                            {/* Wishlist Button */}
                            <button
                                type="button"
                                onClick={() => toggleWishlist(product.id)}
                                aria-label="Add to wishlist"
                                className={`flex size-12 items-center justify-center rounded-full border transition-all cursor-pointer shrink-0 ${
                                    wishlisted
                                        ? 'border-accent bg-accent/10 text-accent'
                                        : 'border-border text-foreground hover:border-accent hover:text-accent'
                                }`}
                            >
                                <Heart className={`size-5 ${wishlisted ? 'fill-accent' : ''}`} />
                            </button>
                        </div>

                        {/* Food Compliance & Storage Box if food */}
                        {product.is_food && (
                            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2 text-xs">
                                <p className="font-bold text-primary flex items-center gap-1.5">
                                    <Calendar className="size-3.5" /> খাদ্য নিরাপত্তা ও সংরক্ষণ বিধি:
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-muted-foreground pt-1">
                                    <p><strong>উৎপাদনের তারিখ:</strong> {product.production_date || 'প্যাকেটে উল্লেখিত'}</p>
                                    <p><strong>মেয়াদোত্তীর্ণ:</strong> {product.expiry_date || 'প্যাকেটে উল্লেখিত'}</p>
                                </div>
                                {product.storage_instructions && (
                                    <p className="text-muted-foreground pt-1">
                                        <strong>সংরক্ষণ:</strong> {product.storage_instructions}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Value Proposition Highlights */}
                        <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 text-xs sm:grid-cols-3">
                            <div className="flex items-center gap-2 text-foreground">
                                <Truck className="size-4 shrink-0 text-primary" />
                                <span>২–৪ দিনে দেশব্যাপী হোম ডেলিভারি</span>
                            </div>
                            <div className="flex items-center gap-2 text-foreground">
                                <RotateCcw className="size-4 shrink-0 text-primary" />
                                <span>৭ দিনের সহজ রিটার্ন পলিসি</span>
                            </div>
                            <div className="flex items-center gap-2 text-foreground">
                                <ShieldCheck className="size-4 shrink-0 text-primary" />
                                <span>১০০% খাঁটি পাহাড়ি উৎস নিশ্চিত</span>
                            </div>
                        </div>

                        {/* Artisan / Vendor Profile Card */}
                        <div className="flex items-center gap-4 rounded-2xl border border-border bg-secondary/40 p-4">
                            <img 
                                src={vendor.image} 
                                alt={vendor.name} 
                                loading="lazy" 
                                className="size-14 rounded-full border border-border object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="flex items-center gap-1.5 font-semibold text-foreground truncate">
                                    <Store className="size-4 text-primary shrink-0" /> {vendor.name}
                                </p>
                                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground truncate">
                                    <MapPin className="size-3 shrink-0" /> 
                                    {vendor.location} · {vendor.products} টি পণ্য · {vendor.rating} ★
                                </p>
                            </div>
                            <Link 
                                href={`/shop?vendor=${encodeURIComponent(vendor.name)}`}
                                className="rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-foreground transition-colors hover:border-primary hover:text-primary whitespace-nowrap shadow-2xs"
                            >
                                স্টোর ভিজিট
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Customer Reviews Section */}
                <div className="mt-16 rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
                        <div>
                            <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                                <MessageSquare className="size-6 text-primary" /> গ্রাহক মতামত ও রিভিউ (Customer Reviews)
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                পাহাড়ি পণ্যের গুণমান ও অভিজ্ঞতার সরাসরি মূল্যায়ন
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-display text-3xl font-bold text-primary">{product.rating || 4.9}</span>
                            <div className="text-xs">
                                <div className="flex text-accent">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="size-3.5 fill-accent" />
                                    ))}
                                </div>
                                <span className="text-muted-foreground">{reviewsList.length} টি যাচাইকৃত রিভিউ</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-12">
                        {/* Left: Reviews Feed */}
                        <div className="lg:col-span-7 space-y-4">
                            {reviewsList.map((rev) => (
                                <div key={rev.id} className="p-4 rounded-2xl bg-secondary/20 border border-border space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-xs text-foreground">{rev.author}</span>
                                            <span className="text-[10px] text-muted-foreground">({rev.district})</span>
                                            {rev.verified && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                                    <CheckCircle2 className="size-3" /> ভেরিফাইড ক্রেতা
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[11px] text-muted-foreground">{rev.date}</span>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`size-3 ${i < rev.rating ? 'fill-accent text-accent' : 'text-border'}`} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-foreground/85 leading-relaxed">
                                        {rev.comment}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Right: Submit Review Form */}
                        <div className="lg:col-span-5">
                            <form onSubmit={handleReviewSubmit} className="rounded-2xl border border-border bg-secondary/30 p-6 space-y-4">
                                <h3 className="font-display text-sm font-bold text-foreground">
                                    আপনার রিভিউ লিখুন
                                </h3>

                                <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1">রেটিং নির্বাচন করুন</label>
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setNewRating(star)}
                                                className="cursor-pointer p-1"
                                            >
                                                <Star className={`size-5 ${star <= newRating ? 'fill-accent text-accent' : 'text-border'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-foreground mb-1">আপনার নাম</label>
                                        <input 
                                            type="text" 
                                            value={newAuthor}
                                            onChange={(e) => setNewAuthor(e.target.value)}
                                            placeholder="যেমন: সানজিদা"
                                            className="w-full rounded-xl border border-input bg-card px-3 py-2 text-xs outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-foreground mb-1">আপনার জেলা</label>
                                        <input 
                                            type="text" 
                                            value={newDistrict}
                                            onChange={(e) => setNewDistrict(e.target.value)}
                                            placeholder="যেমন: ঢাকা"
                                            className="w-full rounded-xl border border-input bg-card px-3 py-2 text-xs outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1">আপনার মতামত</label>
                                    <textarea 
                                        rows={3}
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="পণ্যের গুণগত মান ও কারুশিল্প নিয়ে আপনার মন্তব্য..."
                                        className="w-full rounded-xl border border-input bg-card p-3 text-xs outline-none focus:border-primary"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-1.5 rounded-full bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:bg-forest-deep transition-all shadow-xs cursor-pointer"
                                >
                                    <Send className="size-3.5" /> রিভিউ জমা দিন
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* More from Category */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20">
                        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                            More from {product.category}
                        </h2>
                        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
            <CartDrawer />
        </div>
    );
}

export default function Product(props) {
    return (
        <CartProvider>
            <Head>
                <title>{`${props.product.name} — অর্গানিক বাজার চাই`}</title>
                <meta name="description" content={props.product.description} />
            </Head>
            <ProductContent {...props} />
        </CartProvider>
    );
}
