import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import ProductCard from '../Components/ProductCard';
import CartDrawer from '../Components/CartDrawer';
import { CartProvider } from '../context/CartContext';
import { 
    ArrowRight, 
    Leaf, 
    ShieldCheck, 
    Truck, 
    Award, 
    Star,
    Store
} from 'lucide-react';

import HeroSlider from '../Components/HeroSlider';
import { useLanguage } from '../context/LanguageContext';

export default function Home({ products, categories, vendors, bestSellers, newArrivals, heroSlides = [] }) {
    const { isBn, formatCurrency, formatNumber, t } = useLanguage();

    const displayCategories = React.useMemo(() => {
        try {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('paharika_custom_categories_v2');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.length >= 10) return parsed.filter(c => c.status !== 'Inactive');
                }
            }
        } catch (e) {}
        return (categories || []).filter(c => c.status !== 'Inactive');
    }, [categories]);

    const trustFeatures = [
        {
            icon: Leaf,
            title: t('trustOrganicTitle'),
            text: t('trustOrganicDesc'),
        },
        {
            icon: ShieldCheck,
            title: t('trustFairTradeTitle'),
            text: t('trustFairTradeDesc'),
        },
        {
            icon: Truck,
            title: t('trustDeliveryTitle'),
            text: t('trustDeliveryDesc'),
        },
        {
            icon: Award,
            title: t('trustPromiseTitle'),
            text: t('trustPromiseDesc'),
        },
    ];

    return (
        <CartProvider>
            <Head>
                <title>অর্গানিক বাজার চাই — খাঁটি অর্গানিক ও পাহাড়ি পণ্য মার্কেটপ্লেস</title>
                <meta name="description" content="খাঁটি অর্গানিক কৃষি পণ্য, পাহাড়ি মধু, টাটকা ফলমূল ও ঐতিহ্যবাহী কারুশিল্প সরাসরি কৃষকের হাত থেকে আপনার ঘরে — অর্গানিক বাজার চাই।" />
            </Head>

            <div className="min-h-screen bg-background">
                <Header />

                {/* Dynamic 4-Second Hero Banner Slider */}
                <HeroSlider slides={heroSlides} />

                {/* Trust Badges Bar */}
                <section className="border-b border-border bg-card">
                    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
                        {trustFeatures.map((feat) => {
                            const Icon = feat.icon;
                            return (
                                <div key={feat.title} className="flex items-start gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                                        <Icon className="size-5" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{feat.title}</p>
                                        <p className="text-sm text-muted-foreground">{feat.text}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Shop by Craft (Collections) */}
                <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
                    <div className="mb-8 sm:mb-10 flex items-end justify-between gap-6">
                        <div>
                            <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                                {isBn ? 'সংগ্রহ ও ঐতিহ্য' : 'Collections'}
                            </p>
                            <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
                                {t('featuredCategories')}
                            </h2>
                            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                                {t('featuredCategoriesSub')}
                            </p>
                        </div>
                        <Link 
                            href="/shop"
                            className="hidden items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-forest-deep sm:inline-flex"
                        >
                            {t('viewAllCategories')} <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
                        {displayCategories.map((cat) => (
                            <Link 
                                key={cat.id || cat.name}
                                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                className="group relative overflow-hidden rounded-2xl shadow-xs border border-border/60 hover:shadow-md transition-shadow"
                            >
                                <img 
                                    src={cat.image} 
                                    alt={cat.name} 
                                    loading="lazy" 
                                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/30 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                                    <h3 className="font-display text-sm sm:text-base font-semibold text-ivory leading-snug">
                                        {cat.name}
                                    </h3>
                                    <p className="mt-0.5 text-[11px] sm:text-xs text-ivory/80">
                                        {formatNumber(cat.count || 0)} {isBn ? 'টি পণ্য' : 'products'}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Best Sellers */}
                <section className="bg-secondary/40 py-16 sm:py-20 border-y border-border/50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 sm:mb-10 flex items-end justify-between gap-6">
                            <div>
                                <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                                    {isBn ? 'জনপ্রিয় পছন্দ' : 'Most Loved'}
                                </p>
                                <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
                                    {t('bestSellers')}
                                </h2>
                                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                                    {t('bestSellersSub')}
                                </p>
                            </div>
                            <Link 
                                href="/shop"
                                className="hidden items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-forest-deep sm:inline-flex"
                            >
                                {t('viewAll')} <ArrowRight className="size-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
                            {bestSellers.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Meet the Artisans & Organic Farmers */}
                <section id="artisans" className="mx-auto max-w-7xl px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                        <div className="relative">
                            <img 
                                src="/images/artisan.jpg" 
                                alt={isBn ? "খাঁটি অর্গানিক উৎপাদক ও কারিগর" : "Pure Organic Artisans & Farmers"} 
                                loading="lazy" 
                                className="aspect-[5/4] w-full rounded-3xl object-cover shadow-[var(--shadow-lift)]"
                            />
                            <div className="absolute -right-3 -bottom-5 hidden rounded-2xl bg-accent px-5 py-3.5 text-accent-foreground shadow-lg sm:block">
                                <p className="font-display text-2xl sm:text-3xl font-bold">{formatNumber(300)}+</p>
                                <p className="text-[11px] font-bold tracking-wide uppercase">{isBn ? 'কৃষক ও কারিগর পরিবার' : 'Farmer & Artisan Families'}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                                {isBn ? 'কারিগর ও কৃষকদের গল্প' : 'Farmer & Artisan Stories'}
                            </p>
                            <h2 className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
                                {isBn ? 'প্রতিটি পণ্যের পেছনে জড়িয়ে আছে খাঁটি যত্ন ও মাটির মমতা' : 'Every harvest tells a story of pure nature'}
                            </h2>
                            <p className="mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed text-muted-foreground">
                                {isBn 
                                    ? 'পাহাড় ও প্রত্যন্ত গ্রামীণ খামার থেকে সরাসরি সংগৃহীত খাঁটি মধু, দেশি ঘি, কাঁচা হলুদ, আদা ও ঐতিহ্যবাহী হস্তশিল্প। অর্গানিক বাজার চাই মধ্যস্বত্বভোগী ছাড়া উৎপাদকদের ন্যায্য মূল্য নিশ্চিত করে।'
                                    : 'Behind each product is a dedicated farmer or artisan. Organic Bazar Chai pays producers directly and ensures pure, chemical-free goods reach your doorstep.'}
                            </p>
                            
                            <div className="mt-5 flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="size-4 fill-accent text-accent" />
                                ))}
                                <span className="ml-2 text-xs sm:text-sm font-medium text-muted-foreground">
                                    {isBn ? '৪.৯ গড় রেটিং (২,৪০০+ গ্রাহক রিভিউ)' : '4.9 average from 2,400+ verified reviews'}
                                </span>
                            </div>

                            <Link 
                                href="/shop"
                                className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-forest-deep shadow-sm"
                            >
                                {isBn ? 'খাঁটি পণ্য ঘুরে দেখুন' : 'Explore Pure Harvests'} <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* New Arrivals */}
                <section className="mx-auto max-w-7xl px-4 pb-16 sm:pb-20 sm:px-6 lg:px-8">
                    <div className="mb-8 sm:mb-10 flex items-end justify-between gap-6">
                        <div>
                            <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                                {isBn ? 'সদ্য সংগৃহীত' : 'Just Landed'}
                            </p>
                            <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
                                {t('newArrivals')}
                            </h2>
                            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                                {t('newArrivalsSub')}
                            </p>
                        </div>
                        <Link 
                            href="/shop"
                            className="hidden items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-forest-deep sm:inline-flex"
                        >
                            {t('viewAll')} <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
                        {newArrivals.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                {/* Seasonal Harvest Promo Banner */}
                <section className="mx-auto max-w-7xl px-4 pb-16 sm:pb-20 sm:px-6 lg:px-8">
                    <div className="texture-weave relative overflow-hidden rounded-3xl bg-primary px-6 py-12 sm:py-16 text-center sm:px-12 shadow-md">
                        <p className="text-xs font-semibold tracking-[0.25em] text-primary-foreground/75 uppercase">
                            {isBn ? 'মৌসুমি অর্গানিক অফার' : 'The Seasonal Harvest Offer'}
                        </p>
                        <h2 className="mx-auto mt-3 max-w-2xl font-display text-2xl sm:text-4xl lg:text-5xl font-semibold text-primary-foreground">
                            {isBn ? 'খাঁটি পাহাড়ি মধু ও অর্গানিক গ্রিন টি-তে ২৫% পর্যন্ত ছাড়' : "Up to 25% off wild forest honey & hill green tea"}
                        </h2>
                        <p className="mx-auto mt-3 sm:mt-4 max-w-xl text-xs sm:text-base text-primary-foreground/80 leading-relaxed">
                            {isBn ? 'রাসায়নিকমুক্ত তাজা কৃষিজ পণ্য সরাসরি সংগৃহীত — নির্দিষ্ট মেয়াদ পর্যন্ত বিশেষ ছাড়ে কিনুন।' : 'Small-batch organic goods gathered straight from nature — available while supplies last.'}
                        </p>
                        <Link 
                            href="/shop"
                            className="mt-6 sm:mt-8 inline-flex items-center gap-2 rounded-full bg-ivory px-7 py-3 text-sm font-bold text-foreground transition-colors hover:bg-sand shadow-sm"
                        >
                            {isBn ? 'অফার পণ্য দেখুন' : 'Shop the Harvest'} <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </section>

                {/* Popular Vendor Stores */}
                <section className="bg-secondary/40 py-16 sm:py-20 border-y border-border/50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 sm:mb-10 flex items-end justify-between gap-6">
                            <div>
                                <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                                    {isBn ? 'অনুমোদিত ভেন্ডর' : 'Marketplace'}
                                </p>
                                <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
                                    {isBn ? 'জনপ্রিয় ভেন্ডর ও খামার সমূহ' : 'Popular Vendor Stores'}
                                </h2>
                            </div>
                            <Link 
                                href="/shop"
                                className="hidden items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-forest-deep sm:inline-flex"
                            >
                                {isBn ? 'সব ভেন্ডর' : 'All vendors'} <ArrowRight className="size-4" />
                            </Link>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                            {vendors.map((vendor) => (
                                <Link 
                                    key={vendor.name}
                                    href={`/shop?vendor=${encodeURIComponent(vendor.name)}`}
                                    className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                                >
                                    <div className="relative h-32 overflow-hidden">
                                        <img 
                                            src={vendor.image} 
                                            alt={vendor.specialty} 
                                            loading="lazy" 
                                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-forest-deep/25" />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-display text-base sm:text-lg font-semibold text-foreground">
                                            {vendor.name}
                                        </h3>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {vendor.specialty} · {vendor.location}
                                        </p>
                                        <div className="mt-3 flex items-center justify-between text-xs sm:text-sm">
                                            <span className="flex items-center gap-1 font-medium text-foreground">
                                                <Star className="size-3.5 fill-accent text-accent" /> {formatNumber(vendor.rating)}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {formatNumber(vendor.products)} {isBn ? 'টি পণ্য' : 'products'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Become a Vendor / Sell With Us CTA Banner */}
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-forest-deep via-[#1B3022] to-[#2C4A34] p-6 sm:p-12 text-white shadow-xl">
                        <div className="relative z-10 max-w-2xl">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3.5 py-1 text-xs font-bold text-sand uppercase tracking-wider">
                                <Store className="size-3.5" /> {isBn ? 'অর্গানিক কৃষক ও উৎপাদকদের জন্য' : 'For Organic Farmers & Artisans'}
                            </span>
                            <h2 className="mt-4 font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ivory">
                                {isBn ? 'আপনার খাঁটি পণ্য পৌঁছে দিন সারাদেশে হাজারো সচেতন ক্রেতার কাছে' : 'Sell your authentic organic products across Bangladesh'}
                            </h2>
                            <p className="mt-3 text-xs sm:text-sm text-ivory/80 leading-relaxed sm:text-base">
                                {isBn 
                                    ? 'আপনি কি খাঁটি মধু, দেশি ঘি, পাহাড়ি ফলমূল, চাল, মসলা বা ঐতিহ্যবাহী বাঁশ-বেতের সামগ্রী উৎপাদন করেন? অর্গানিক বাজার চাই-এর অনুমোদিত ভেন্ডর হিসেবে দেশজুড়ে ব্যবসা পরিচালনা করুন।'
                                    : 'Do you produce pure honey, hill fruits, organic rice, spices, or natural handmade crafts? Join Organic Bazar Chai as a certified vendor.'}
                            </p>
                            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
                                <Link
                                    href="/become-a-vendor"
                                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 sm:px-7 py-3 text-xs sm:text-sm font-bold text-accent-foreground transition-all hover:bg-terracotta-deep shadow-md"
                                >
                                    {isBn ? 'ভেন্ডর হিসেবে আবেদন করুন (Sell With Us)' : 'Apply as a Vendor'} <ArrowRight className="size-4" />
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center gap-2 rounded-full border border-ivory/30 px-5 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-ivory hover:bg-ivory/10 transition-colors"
                                >
                                    {isBn ? 'ভেন্ডর ড্যাশবোর্ড' : 'Vendor Dashboard'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
                <CartDrawer />
            </div>
        </CartProvider>
    );
}
