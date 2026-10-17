import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    Mountain, 
    Search, 
    User, 
    Heart, 
    ShoppingBag, 
    Menu, 
    X, 
    ChevronDown, 
    ChevronRight,
    Shirt, 
    TreePine, 
    Coffee, 
    Flower2, 
    Sparkles, 
    ArrowRight 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { getLucideCategoryIcon } from '../constants/categoryIcons';

const getCategoryIcon = (icon) => {
    return getLucideCategoryIcon(icon);
};

const defaultCategories = [
    {
        name: 'পাহাড়ি ফল',
        slug: 'hill-fruits',
        icon: 'Apple',
        subcategories: ['আনারস', 'কমলা / মাল্টা', 'কাঁঠাল', 'কলা', 'লিচু', 'আম', 'ড্রাগন ফল / অন্যান্য'],
        image: '/images/prod-pineapple.jpg',
        featured: true,
        count: 32
    },
    {
        name: 'মধু ও মৌচাকজাত পণ্য',
        slug: 'honey-and-bee-products',
        icon: 'Droplet',
        subcategories: ['বন্য মধু', 'খামারের মধু', 'মোম'],
        image: '/images/prod-honey.jpg',
        featured: true,
        count: 24
    },
    {
        name: 'পাহাড়ি খাদ্য ও শুঁটকি',
        slug: 'hill-food-and-dried-fish',
        icon: 'Soup',
        subcategories: ['বাঁশ কোড়ল (বাঁশের কোঁড়) ও আচার', 'শুঁটকি মাছ', 'পাহাড়ি চাল (জুমের চাল)', 'ঐতিহ্যবাহী পিঠা ও শুকনো খাবার', 'মাশরুম', 'আচার ও চাটনি'],
        image: '/images/prod-bamboo-shoot.jpg',
        featured: true,
        count: 38
    },
    {
        name: 'হস্তশিল্প',
        slug: 'handicrafts',
        icon: 'TreePine',
        subcategories: ['বাঁশের তৈরি পণ্য (ঝুড়ি, টুপি, হাতপাখা, কলম দানি)', 'বেতের তৈরি পণ্য (চেয়ার, মোড়া, ঝুড়ি)', 'কাঠের তৈরি শোপিস', 'মাটি ও সিরামিক পণ্য', 'ঘর সাজানোর জিনিস'],
        image: '/images/cat-bamboo.jpg',
        featured: true,
        count: 54
    },
    {
        name: 'ঐতিহ্যবাহী পোশাক ও তাঁতবস্ত্র',
        slug: 'traditional-apparel',
        icon: 'Shirt',
        subcategories: ['নারীদের পোশাক (থামি, পিনন, খাদি)', 'পুরুষদের পোশাক', 'শাল ও চাদর', 'ব্যাগ ও পার্স (হাতে বোনা)', 'স্কার্ফ ও মাফলার', 'বিছানার চাদর ও কুশন কভার'],
        image: '/images/prod-pinon.jpg',
        featured: true,
        count: 65
    },
    {
        name: 'গহনা ও অলংকার',
        slug: 'jewellery-and-ornaments',
        icon: 'Gem',
        subcategories: ['রুপার গহনা', 'পুঁতির মালা', 'কানের দুল ও চুড়ি', 'ঐতিহ্যবাহী অলংকার'],
        image: '/images/prod-silver.jpg',
        featured: true,
        count: 28
    },
    {
        name: 'চা ও কফি',
        slug: 'hill-tea-and-coffee',
        icon: 'Coffee',
        subcategories: ['পাহাড়ি চা', 'পাহাড়ি কফি', 'হারবাল চা'],
        image: '/images/prod-coffee.jpg',
        featured: true,
        count: 22
    },
    {
        name: 'ভেষজ ও প্রাকৃতিক পণ্য',
        slug: 'herbal-and-natural',
        icon: 'Leaf',
        subcategories: ['ভেষজ তেল', 'ভেষজ গাছগাছড়া', 'প্রাকৃতিক সাবান ও স্কিনকেয়ার', 'আগর ও সুগন্ধি পণ্য'],
        image: '/images/prod-herbal.jpg',
        featured: true,
        count: 30
    },
    {
        name: 'উপহার ও গিফট প্যাক',
        slug: 'gifts-and-souvenirs',
        icon: 'Gift',
        subcategories: ['গিফট বক্স', 'পর্যটক স্যুভেনির', 'কম্বো প্যাক (মধু + মসলা + চা)'],
        image: '/images/prod-giftbox.jpg',
        featured: true,
        count: 19
    },
    {
        name: 'পাহাড়ি মসলা',
        slug: 'hill-spices',
        icon: 'Flame',
        subcategories: ['Hill Ginger (আদা)', 'Wild Garlic (রসুন)', 'Forest Turmeric (হলুদ)', 'Black Pepper (গোলমরিচ)'],
        image: '/images/cat-pantry.jpg',
        featured: true,
        count: 18
    }
];

export default function Header() {
    const { url, props } = usePage();
    const { cartCount, setIsCartOpen, wishlist } = useCart();
    const { t, isBn } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
    const [megaMenuOpen, setMegaMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [customCategories, setCustomCategories] = useState(() => {
        try {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('paharika_custom_categories_v2');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.length >= 10) return parsed;
                }
            }
        } catch (e) {}
        return null;
    });

    const pageCategories = customCategories || (props?.categories ? props.categories.filter(c => c.status !== 'Inactive') : defaultCategories);
    const activeCategories = pageCategories.length > 0 ? pageCategories : defaultCategories;

    const navLinks = [
        { label: 'Home', href: '/' },
        { label: 'Shop', href: '/shop' },
        { label: 'Become a Vendor', href: '/become-a-vendor' },
        { label: 'Dashboard', href: '/dashboard' },
    ];

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
            {/* Announcement Top Banner */}
            <div className="bg-forest-deep py-1.5 px-4 text-xs font-medium text-primary-foreground">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                    <p className="truncate text-[11px] sm:text-xs">
                        {t('freeDeliveryNotice')}
                    </p>
                    <div className="flex items-center gap-4 shrink-0">
                        <span className="hidden md:inline text-[11px] text-primary-foreground/80 font-mono">
                            {t('hotline')}
                        </span>
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>

            <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
                {/* Mobile Menu Toggle */}
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="rounded-md p-2 text-foreground hover:bg-muted md:hidden"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>

                {/* Logo & Brand */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <img 
                        src="/images/logo.png" 
                        alt="অর্গানিক বাজার চাই" 
                        className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                    <div className="flex flex-col">
                        <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground leading-tight">
                            অর্গানিক বাজার চাই
                        </span>
                        <span className="text-[10px] tracking-wider text-primary font-semibold uppercase hidden sm:block">
                            খাঁটি প্রাকৃতিক পণ্যের হাট
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="ml-6 hidden items-center gap-6 md:flex relative">
                    <Link
                        href="/"
                        className={`text-sm font-medium transition-colors hover:text-foreground ${
                            url === '/' ? 'text-foreground font-semibold' : 'text-muted-foreground'
                        }`}
                    >
                        {t('navHome')}
                    </Link>

                    {/* Categories Mega Menu Trigger */}
                    <div 
                        className="relative"
                        onMouseEnter={() => setMegaMenuOpen(true)}
                        onMouseLeave={() => setMegaMenuOpen(false)}
                    >
                        <button
                            type="button"
                            onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-foreground py-2 cursor-pointer ${
                                megaMenuOpen ? 'text-primary font-bold' : 'text-muted-foreground'
                            }`}
                        >
                            <span>{t('navCategories')}</span>
                            <ChevronDown className={`size-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180 text-primary' : ''}`} />
                        </button>

                        {/* Mega Menu Dropdown */}
                        {megaMenuOpen && (
                            <div className="absolute top-full left-0 w-[940px] -ml-36 rounded-3xl border border-border bg-card/95 backdrop-blur-xl p-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200 z-50">
                                <div className="grid grid-cols-12 gap-6">
                                    {/* All Categories Grid (8 cols) */}
                                    <div className="col-span-8 grid grid-cols-3 gap-5 max-h-[480px] overflow-y-auto pr-2">
                                        {activeCategories.map((cat) => {
                                            const IconComp = getCategoryIcon(cat.icon);
                                            return (
                                                <div key={cat.id || cat.name} className="space-y-2">
                                                    <Link 
                                                        href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                                        onClick={() => setMegaMenuOpen(false)}
                                                        className="group flex items-center gap-1.5 font-display text-sm font-bold text-foreground hover:text-primary transition-colors"
                                                    >
                                                        <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all shrink-0">
                                                            <IconComp className="size-3.5" />
                                                        </span>
                                                        <span className="truncate">{cat.name}</span>
                                                    </Link>

                                                    <ul className="space-y-1 pl-8 text-xs">
                                                        {(cat.subcategories || []).slice(0, 5).map((sub) => (
                                                            <li key={sub}>
                                                                <Link
                                                                    href={`/shop?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub)}`}
                                                                    onClick={() => setMegaMenuOpen(false)}
                                                                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 py-0.5"
                                                                >
                                                                    <span className="size-1 rounded-full bg-border shrink-0" />
                                                                    <span className="truncate">{sub}</span>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Right Promo Banner (4 cols) */}
                                    <div className="col-span-4 rounded-2xl bg-gradient-to-br from-forest-deep to-forest-mid p-5 text-white flex flex-col justify-between shadow-inner">
                                        <div className="space-y-2">
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-sand bg-black/30 px-2 py-0.5 rounded-full">
                                                <Sparkles className="size-3" /> Indigenous Heritage
                                            </span>
                                            <h4 className="font-display text-base font-bold text-white leading-tight">
                                                ১০০% খাঁটি আদিবাসী পাহাড়ি পণ্য
                                            </h4>
                                            <p className="text-[11px] text-sand/80 leading-relaxed">
                                                রাঙ্গামাটি, বান্দরবান ও খাগড়াছড়ির বম, চাকমা ও মারমা কারিগরদের তৈরি ঐতিহ্যবাহী সংগ্রহ।
                                            </p>
                                        </div>

                                        <Link
                                            href="/shop"
                                            onClick={() => setMegaMenuOpen(false)}
                                            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-sand hover:text-white transition-colors"
                                        >
                                            <span>সব পণ্য দেখুন</span>
                                            <ArrowRight className="size-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Link
                        href="/shop"
                        className={`text-sm font-medium transition-colors hover:text-foreground ${
                            url.startsWith('/shop') ? 'text-foreground font-semibold' : 'text-muted-foreground'
                        }`}
                    >
                        {t('navShop')}
                    </Link>

                    <Link
                        href="/become-a-vendor"
                        className={`text-sm font-medium transition-colors hover:text-foreground ${
                            url.startsWith('/become-a-vendor') ? 'text-foreground font-semibold' : 'text-muted-foreground'
                        }`}
                    >
                        {t('navBecomeVendor')}
                    </Link>

                    <Link
                        href="/dashboard"
                        className={`text-sm font-medium transition-colors hover:text-foreground ${
                            url.startsWith('/dashboard') ? 'text-foreground font-semibold' : 'text-muted-foreground'
                        }`}
                    >
                        {t('navDashboard')}
                    </Link>
                </nav>

                {/* Sell with us CTA badge */}
                <Link
                    href="/become-a-vendor"
                    className="hidden xl:inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-xs font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-all"
                >
                    {t('navBecomeVendor')}
                </Link>

                {/* Desktop Search */}
                <form 
                    onSubmit={handleSearchSubmit}
                    className="ml-auto hidden max-w-xs flex-1 items-center gap-2 rounded-full border border-input bg-card px-4 py-2 transition-colors focus-within:border-primary md:flex"
                >
                    <Search className="size-4 text-muted-foreground shrink-0" />
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('searchPlaceholder')}
                        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                </form>

                {/* Right Action Icons */}
                <div className="ml-auto flex items-center gap-1 md:ml-0">
                    {/* Mobile Language Switcher button */}
                    <div className="md:hidden mr-1">
                        <LanguageSwitcher variant="simple" />
                    </div>

                    {/* Mobile Search Button */}
                    <button 
                        onClick={() => setSearchOpen(!searchOpen)}
                        aria-label="Search" 
                        className="rounded-full p-2 text-foreground hover:bg-muted md:hidden"
                    >
                        <Search className="size-5" />
                    </button>

                    {/* Account Button */}
                    <Link
                        href="/dashboard"
                        aria-label="Account" 
                        className="rounded-full p-2 text-foreground hover:bg-muted transition-colors"
                        title="Vendor & Admin Dashboard"
                    >
                        <User className="size-5" />
                    </Link>

                    {/* Wishlist Button */}
                    <Link
                        href="/shop"
                        aria-label="Wishlist" 
                        className="relative rounded-full p-2 text-foreground hover:bg-muted transition-colors"
                        title={`Wishlist (${wishlist.length})`}
                    >
                        <Heart className="size-5" />
                        {wishlist.length > 0 && (
                            <span className="absolute top-1 right-1 size-2 rounded-full bg-accent animate-pulse" />
                        )}
                    </Link>

                    {/* Cart Button */}
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        aria-label="Cart" 
                        className="relative rounded-full p-2 text-foreground hover:bg-muted transition-colors cursor-pointer"
                        title="View Cart"
                    >
                        <ShoppingBag className="size-5" />
                        <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground shadow-xs">
                            {cartCount}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Search input bar */}
            {searchOpen && (
                <div className="border-t border-border p-3 bg-card md:hidden">
                    <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 rounded-full border border-input bg-background px-4 py-2">
                        <Search className="size-4 text-muted-foreground" />
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search shawls, honey, bamboo…"
                            className="w-full bg-transparent text-sm outline-none"
                            autoFocus
                        />
                    </form>
                </div>
            )}

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <nav className="border-t border-border px-4 py-3 bg-card md:hidden animate-in fade-in duration-200 space-y-2">
                    <div className="flex items-center justify-between py-2 px-1 border-b border-border">
                        <span className="text-xs font-bold text-muted-foreground">{isBn ? 'ভাষা নির্বাচন করুন:' : 'Language:'}</span>
                        <LanguageSwitcher />
                    </div>

                    <Link
                        href="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            url === '/' ? 'bg-secondary font-semibold text-primary' : 'text-foreground hover:bg-muted'
                        }`}
                    >
                        {t('navHome')}
                    </Link>

                    {/* Mobile Categories Accordion */}
                    <div>
                        <button
                            type="button"
                            onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted cursor-pointer"
                        >
                            <span>Categories (ক্যাটাগরি সমূহ)</span>
                            <ChevronDown className={`size-4 transition-transform ${mobileCategoriesOpen ? 'rotate-180 text-primary' : ''}`} />
                        </button>

                        {mobileCategoriesOpen && (
                            <div className="pl-4 pr-2 py-1 space-y-2 border-l-2 border-primary/20 ml-3 mt-1">
                                {activeCategories.map((cat) => (
                                    <div key={cat.name} className="space-y-1">
                                        <Link
                                            href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block text-xs font-bold text-foreground hover:text-primary py-1"
                                        >
                                            {cat.name}
                                        </Link>
                                        <div className="pl-2 space-y-0.5">
                                            {(cat.subcategories || []).map((sub) => (
                                                <Link
                                                    key={sub}
                                                    href={`/shop?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub)}`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="block text-[11px] text-muted-foreground hover:text-primary py-0.5"
                                                >
                                                    • {sub}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        href="/shop"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            url.startsWith('/shop') ? 'bg-secondary font-semibold text-primary' : 'text-foreground hover:bg-muted'
                        }`}
                    >
                        {t('navShop')}
                    </Link>

                    <Link
                        href="/become-a-vendor"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            url.startsWith('/become-a-vendor') ? 'bg-secondary font-semibold text-primary' : 'text-foreground hover:bg-muted'
                        }`}
                    >
                        {t('navBecomeVendor')}
                    </Link>

                    <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            url.startsWith('/dashboard') ? 'bg-secondary font-semibold text-primary' : 'text-foreground hover:bg-muted'
                        }`}
                    >
                        {t('navDashboard')}
                    </Link>
                </nav>
            )}
        </header>
    );
}
