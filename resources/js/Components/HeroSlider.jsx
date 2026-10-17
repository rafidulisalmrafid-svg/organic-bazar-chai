import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Pause, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HeroSlider({ slides = [] }) {
    const { isBn, t, formatNumber } = useLanguage();
    const defaultSlides = [
        {
            id: 1,
            badge_bn: '১০০% খাঁটি পাহাড়ি পণ্য',
            badge_en: '100% Authentic Hill Products',
            title_bn: 'পাহাড়ের খাঁটি কারুশিল্প সরাসরি আপনার ঘরে',
            title_en: 'Authentic Hill Crafts Direct to Your Door',
            subtitle_bn: 'রাঙ্গামাটি, বান্দরবান ও খাগড়াছড়ির আদিবাসী তাঁতি, মৌয়াল ও মৃৎশিল্পীদের শতবর্ষের ঐতিহ্যবাহী হস্তশিল্প ও প্রাকৃতিক খাদ্য সম্ভার।',
            subtitle_en: 'Centuries of indigenous weaving, pure forest honey and artisanal crafts from Chittagong Hill Tracts.',
            image_url: '/images/hero.jpg',
            button_text_bn: 'পণ্য দেখুন',
            button_text_en: 'Explore Marketplace',
            button_link: '/shop',
            is_active: true,
        },
        {
            id: 2,
            badge_bn: 'ঐতিহ্যবাহী কোমর তাঁত',
            badge_en: 'Traditional Waist-Loom Weaves',
            title_bn: 'চাকমা ও তঞ্চঙ্গ্যাদের বোনা পিনন, হাদি ও শাল',
            title_en: 'Exquisite Indigenous Handloom & Textiles',
            subtitle_bn: 'প্রাকৃতিক রঙে রঞ্জিত সুতা এবং পাহাড়ের চিরন্তন মোটিফে বোনা খাঁটি শাল, থামি ও কুশন কাভার।',
            subtitle_en: 'Naturally dyed yarns and timeless tribal geometric motifs handcrafted by village artisan collectives.',
            image_url: '/images/cat-textiles.jpg',
            button_text_bn: 'তাঁতবস্ত্র দেখুন',
            button_text_en: 'Shop Handlooms',
            button_link: '/shop?category=ঐতিহ্যবাহী পোশাক ও তাঁতবস্ত্র',
            is_active: true,
        },
        {
            id: 3,
            badge_bn: 'প্রাকৃতিক বনজ উপহার',
            badge_en: 'Pure Forest Harvest',
            title_bn: 'কেওক্রাডং ও সাজেকের বন্য কাঁচা পাহাড়ি মধু',
            title_en: 'Wild Canopy Honey & Hillside Harvests',
            subtitle_bn: 'গভীর অরণ্যের প্রাকৃতিক মৌচাক থেকে আদিবাসী মৌয়ালদের সংগৃহীত অপরিশোধিত ও হিটিংমুক্ত খাঁটি মধু।',
            subtitle_en: 'Unheated, raw forest honey harvested directly from high canopy beehives in deep reserve forests.',
            image_url: '/images/artisan.jpg',
            button_text_bn: 'মধু ও অর্গানিক পণ্য',
            button_text_en: 'Shop Organics',
            button_link: '/shop?category=মধু ও মৌচাকজাত পণ্য',
            is_active: true,
        },
    ];

    const activeSlides = (slides && slides.length > 0)
        ? slides.filter(s => s.is_active !== false)
        : defaultSlides;

    const finalSlides = activeSlides.length > 0 ? activeSlides : defaultSlides;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [touchStartX, setTouchStartX] = useState(null);

    const SLIDE_DURATION = 4000; // 4 seconds requirement

    // Next slide
    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % finalSlides.length);
    };

    // Prev slide
    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + finalSlides.length) % finalSlides.length);
    };

    // Auto-advance timer (every 4 seconds)
    useEffect(() => {
        if (finalSlides.length <= 1 || isPaused) return;

        const timer = setInterval(() => {
            handleNext();
        }, SLIDE_DURATION);

        return () => clearInterval(timer);
    }, [currentIndex, isPaused, finalSlides.length]);

    // Touch swipe handling for mobile
    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        if (touchStartX === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (diff > 50) {
            handleNext(); // swipe left
        } else if (diff < -50) {
            handlePrev(); // swipe right
        }
        setTouchStartX(null);
    };

    return (
        <section 
            aria-label="Paharika Hero Banner Slider"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="group relative w-full overflow-hidden bg-black select-none"
        >
            {/* Slider Container with responsive aspect ratio & min-height */}
            <div className="relative h-[480px] sm:h-[540px] md:h-[600px] lg:h-[650px] w-full overflow-hidden">
                {finalSlides.map((slide, index) => {
                    const isActive = index === currentIndex;

                    return (
                        <div
                            key={slide.id || index}
                            className={`absolute inset-0 size-full transition-all duration-1000 ease-in-out ${
                                isActive 
                                    ? 'opacity-100 z-10 scale-100 pointer-events-auto' 
                                    : 'opacity-0 z-0 scale-105 pointer-events-none'
                            }`}
                        >
                            {/* Background Image with subtle Ken Burns effect */}
                            <div className="absolute inset-0 overflow-hidden">
                                <img
                                    src={slide.image_url}
                                    alt={slide.title_bn || slide.title_en || 'Paharika Cover'}
                                    className={`size-full object-cover object-center transition-transform duration-7000 ease-out ${
                                        isActive ? 'scale-108' : 'scale-100'
                                    }`}
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                />
                                {/* Dual Gradient Layer for high-contrast legible text */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
                            </div>

                            {/* Slide Content Box */}
                            <div className="relative z-20 flex size-full items-center">
                                <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 py-10">
                                    <div className="max-w-2xl space-y-4 sm:space-y-5">
                                        {/* Badge / Pill */}
                                        {(slide.badge_bn || slide.badge_en) && (
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                <span className="inline-flex items-center gap-2 rounded-full border border-sand/30 bg-black/40 px-3.5 py-1 text-xs font-bold text-sand backdrop-blur-md shadow-sm">
                                                    <Sparkles className="size-3.5 text-accent animate-pulse" />
                                                    <span>{isBn ? (slide.badge_bn || slide.badge_en) : (slide.badge_en || slide.badge_bn)}</span>
                                                </span>
                                            </div>
                                        )}

                                        {/* Headline */}
                                        <h1 className="font-display text-3xl font-bold tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl leading-[1.15] animate-in fade-in slide-in-from-bottom-5 duration-800">
                                            {isBn ? (slide.title_bn || slide.title_en) : (slide.title_en || slide.title_bn)}
                                        </h1>

                                        {/* Subtitle */}
                                        <p className="text-xs sm:text-sm md:text-base text-sand/90 leading-relaxed max-w-xl drop-shadow-xs animate-in fade-in slide-in-from-bottom-6 duration-900">
                                            {isBn ? (slide.subtitle_bn || slide.subtitle_en) : (slide.subtitle_en || slide.subtitle_bn)}
                                        </p>

                                        {/* Action Buttons */}
                                        <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3.5 animate-in fade-in slide-in-from-bottom-7 duration-1000">
                                            <Link
                                                href={slide.button_link || '/shop'}
                                                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs sm:text-sm font-bold text-primary-foreground hover:bg-forest-deep transition-all shadow-lg hover:shadow-primary/30 active:scale-98 cursor-pointer"
                                            >
                                                <span>{isBn ? (slide.button_text_bn || slide.button_text_en || 'পণ্য দেখুন') : (slide.button_text_en || slide.button_text_bn || 'Shop Now')}</span>
                                                <ArrowRight className="size-4" />
                                            </Link>

                                            <Link
                                                href="/shop"
                                                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 transition-all active:scale-98 cursor-pointer"
                                            >
                                                <span>{isBn ? 'সকল ক্যাটাগরি' : 'All Categories'}</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation Arrows (Prev / Next) */}
            {finalSlides.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Previous Slide"
                        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 flex size-10 sm:size-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-black/70 hover:scale-105 active:scale-95 transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                    >
                        <ChevronLeft className="size-5 sm:size-6" />
                    </button>

                    <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Next Slide"
                        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex size-10 sm:size-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-black/70 hover:scale-105 active:scale-95 transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                    >
                        <ChevronRight className="size-5 sm:size-6" />
                    </button>
                </>
            )}

            {/* Bottom Controls Bar: Dots Indicator & 4-Second Live Progress Bar */}
            {finalSlides.length > 1 && (
                <div className="absolute bottom-5 sm:bottom-7 inset-x-0 z-30 flex flex-col items-center gap-2.5">
                    {/* Slide Dots */}
                    <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3.5 py-1.5 backdrop-blur-md">
                        {finalSlides.map((_, idx) => {
                            const isCurrent = idx === currentIndex;
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setCurrentIndex(idx)}
                                    aria-label={`Go to slide ${idx + 1}`}
                                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                        isCurrent 
                                            ? 'w-7 bg-primary' 
                                            : 'w-2 bg-white/40 hover:bg-white/80'
                                    }`}
                                />
                            );
                        })}
                    </div>

                    {/* Auto-Slide Progress Bar */}
                    <div className="w-32 sm:w-48 h-0.5 rounded-full bg-white/20 overflow-hidden">
                        <div 
                            key={currentIndex + (isPaused ? '-paused' : '-running')}
                            className="h-full bg-primary"
                            style={{
                                animation: isPaused ? 'none' : `paharikaSlideProgress ${SLIDE_DURATION}ms linear forwards`
                            }}
                        />
                    </div>
                </div>
            )}

            {/* CSS Animation for 4s progress bar */}
            <style>{`
                @keyframes paharikaSlideProgress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
        </section>
    );
}
