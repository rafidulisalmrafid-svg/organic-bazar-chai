import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import ProductCard from '../Components/ProductCard';
import CartDrawer from '../Components/CartDrawer';
import { CartProvider } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown, SlidersHorizontal, X, MapPin, Users, Tag, Sparkles } from 'lucide-react';

export default function Shop({ products, categories, vendors, filters }) {
    const { isBn, formatCurrency, formatNumber, t } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(filters?.subcategory || null);
    const [selectedVendor, setSelectedVendor] = useState(filters?.vendor || null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [selectedPriceRange, setSelectedPriceRange] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [sortOption, setSortOption] = useState(filters?.sort || 'featured');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [searchFilter, setSearchFilter] = useState(filters?.search || '');

    const displayCategories = useMemo(() => {
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

    const sortOptions = [
        { id: 'featured', label: isBn ? 'জনপ্রিয়তা অনুযায়ী' : 'Featured' },
        { id: 'price-low', label: isBn ? 'মূল্য: কম থেকে বেশি' : 'Price: Low to High' },
        { id: 'price-high', label: isBn ? 'মূল্য: বেশি থেকে কম' : 'Price: High to Low' },
        { id: 'rating', label: isBn ? 'সেরা রেটিং' : 'Top Rated' },
    ];

    const priceRanges = [
        { id: 'all', label: isBn ? 'সকল মূল্য' : 'All Prices' },
        { id: 'under-1000', label: isBn ? '৳ ১,০০০ এর নিচে' : 'Under ৳ 1,000' },
        { id: '1000-2500', label: isBn ? '৳ ১,০০০ – ৳ ২,৫০০' : '৳ 1,000 – ৳ 2,500' },
        { id: 'above-2500', label: isBn ? '৳ ২,৫০০ এর বেশি' : 'Above ৳ 2,500' },
    ];

    const districts = ['Bandarban', 'Rangamati', 'Khagrachari'];
    const communities = ['Chakma', 'Marma', 'Tripura', 'Tanchangya', 'Bawm', 'Mro'];

    const filteredProducts = useMemo(() => {
        let list = products.filter((p) => {
            const matchesCat = !selectedCategory || 
                p.category.toLowerCase().includes(selectedCategory.toLowerCase()) || 
                selectedCategory.toLowerCase().includes(p.category.toLowerCase());
            
            const matchesSubcat = !selectedSubcategory || 
                (p.subcategory && (
                    p.subcategory.toLowerCase().includes(selectedSubcategory.toLowerCase()) ||
                    selectedSubcategory.toLowerCase().includes(p.subcategory.toLowerCase())
                ));

            const matchesVendor = !selectedVendor || p.vendor.toLowerCase() === selectedVendor.toLowerCase();

            const matchesDistrict = !selectedDistrict || 
                (p.district && p.district.toLowerCase() === selectedDistrict.toLowerCase()) ||
                (p.location && p.location.toLowerCase().includes(selectedDistrict.toLowerCase()));

            const matchesCommunity = !selectedCommunity ||
                (p.community && p.community.toLowerCase().includes(selectedCommunity.toLowerCase())) ||
                (p.description && p.description.toLowerCase().includes(selectedCommunity.toLowerCase())) ||
                (p.name && p.name.toLowerCase().includes(selectedCommunity.toLowerCase()));

            let matchesPrice = true;
            const price = Number(p.price) || 0;
            if (selectedPriceRange === 'under-1000') matchesPrice = price < 1000;
            else if (selectedPriceRange === '1000-2500') matchesPrice = price >= 1000 && price <= 2500;
            else if (selectedPriceRange === 'above-2500') matchesPrice = price > 2500;

            let matchesType = true;
            if (selectedType === 'variable') matchesType = p.product_type === 'variable' || (p.variations && p.variations.length > 0);
            else if (selectedType === 'simple') matchesType = p.product_type === 'simple' || !p.variations || p.variations.length === 0;
            else if (selectedType === 'organic') matchesType = Boolean(p.is_organic || (p.badge && p.badge.toLowerCase().includes('organic')));
            else if (selectedType === 'handmade') matchesType = Boolean(p.is_handmade || (p.badge && p.badge.toLowerCase().includes('handmade')));

            const matchesSearch = !searchFilter || 
                p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                p.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
                p.vendor.toLowerCase().includes(searchFilter.toLowerCase());

            return matchesCat && matchesSubcat && matchesVendor && matchesDistrict && matchesCommunity && matchesPrice && matchesType && matchesSearch;
        });

        if (sortOption === 'price-low') {
            list = [...list].sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-high') {
            list = [...list].sort((a, b) => b.price - a.price);
        } else if (sortOption === 'rating') {
            list = [...list].sort((a, b) => b.rating - a.rating);
        }

        return list;
    }, [products, selectedCategory, selectedSubcategory, selectedVendor, selectedDistrict, selectedCommunity, selectedPriceRange, selectedType, sortOption, searchFilter]);

    const hasActiveFilters = Boolean(
        selectedCategory || selectedSubcategory || selectedVendor || selectedDistrict || selectedCommunity || selectedPriceRange !== 'all' || selectedType !== 'all' || searchFilter
    );

    const clearAllFilters = () => {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setSelectedVendor(null);
        setSelectedDistrict(null);
        setSelectedCommunity(null);
        setSelectedPriceRange('all');
        setSelectedType('all');
        setSearchFilter('');
    };

    const filterSidebar = (
        <div className="space-y-7">
            {/* Active filters pill list & Reset */}
            {hasActiveFilters && (
                <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-2.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">সক্রিয় ফিল্টারসমূহ:</span>
                        <button 
                            type="button"
                            onClick={clearAllFilters}
                            className="text-[11px] font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                        >
                            <X className="size-3" /> সব মুছুন
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {selectedCategory && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                                {selectedCategory}
                                <button type="button" onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); }}>
                                    <X className="size-3" />
                                </button>
                            </span>
                        )}
                        {selectedDistrict && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-forest-deep/10 text-primary px-2.5 py-0.5 rounded-full">
                                জেলা: {selectedDistrict}
                                <button type="button" onClick={() => setSelectedDistrict(null)}>
                                    <X className="size-3" />
                                </button>
                            </span>
                        )}
                        {selectedCommunity && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-accent/15 text-accent px-2.5 py-0.5 rounded-full">
                                কারিগর: {selectedCommunity}
                                <button type="button" onClick={() => setSelectedCommunity(null)}>
                                    <X className="size-3" />
                                </button>
                            </span>
                        )}
                        {selectedPriceRange !== 'all' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-muted text-foreground px-2.5 py-0.5 rounded-full">
                                মূল্য: {priceRanges.find(r => r.id === selectedPriceRange)?.label}
                                <button type="button" onClick={() => setSelectedPriceRange('all')}>
                                    <X className="size-3" />
                                </button>
                            </span>
                        )}
                        {selectedType !== 'all' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-purple-500/15 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-full">
                                ধরন: {selectedType}
                                <button type="button" onClick={() => setSelectedType('all')}>
                                    <X className="size-3" />
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Price Filter */}
            <div>
                <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1.5">
                    <Tag className="size-3.5" /> মূল্য পরিসীমা (Price)
                </h3>
                <div className="mt-2.5 space-y-1">
                    {priceRanges.map((range) => (
                        <button
                            key={range.id}
                            type="button"
                            onClick={() => setSelectedPriceRange(range.id)}
                            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                                selectedPriceRange === range.id
                                    ? 'bg-primary text-primary-foreground font-bold shadow-2xs'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <span>{range.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Type Filter */}
            <div>
                <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1.5">
                    <Sparkles className="size-3.5" /> পণ্যের ধরন (Product Type)
                </h3>
                <div className="mt-2.5 space-y-1">
                    {[
                        { id: 'all', label: 'সকল পণ্য' },
                        { id: 'variable', label: 'ভেরিয়েশন পণ্য (Size/Color/Weight)' },
                        { id: 'simple', label: 'সাধারণ পণ্য (Simple)' },
                        { id: 'handmade', label: '১০০% হাতে তৈরি (Handmade)' },
                        { id: 'organic', label: 'অর্গানিক ও প্রাকৃতিক' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedType(item.id)}
                            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                                selectedType === item.id
                                    ? 'bg-primary text-primary-foreground font-bold shadow-2xs'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* District Filter */}
            <div>
                <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1.5">
                    <MapPin className="size-3.5" /> পাহাড়ি জেলা (District)
                </h3>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {districts.map((d) => {
                        const isSelected = selectedDistrict === d;
                        return (
                            <button
                                key={d}
                                type="button"
                                onClick={() => setSelectedDistrict(isSelected ? null : d)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                                    isSelected
                                        ? 'border-primary bg-primary text-primary-foreground shadow-2xs font-bold'
                                        : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50'
                                }`}
                            >
                                {d === 'Bandarban' ? 'বান্দরবান' : (d === 'Rangamati' ? 'রাঙ্গামাটি' : 'খাগড়াছড়ি')}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Community Filter */}
            <div>
                <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1.5">
                    <Users className="size-3.5" /> আদিবাসী জনগোষ্ঠী (Community)
                </h3>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {communities.map((c) => {
                        const isSelected = selectedCommunity === c;
                        return (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setSelectedCommunity(isSelected ? null : c)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                                    isSelected
                                        ? 'border-accent bg-accent text-white shadow-2xs font-bold'
                                        : 'border-border bg-card text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {c}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Category filter */}
            <div>
                <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    Category (ক্যাটাগরি)
                </h3>
                <ul className="mt-3 space-y-2">
                    <li>
                        <button 
                            type="button"
                            onClick={() => {
                                setSelectedCategory(null);
                                setSelectedSubcategory(null);
                            }}
                            className={`text-xs text-left transition-colors cursor-pointer w-full flex items-center justify-between ${
                                !selectedCategory && !selectedSubcategory
                                    ? 'font-bold text-primary' 
                                    : 'text-foreground hover:text-primary'
                            }`}
                        >
                            <span>সকল পণ্য</span>
                            <span className="text-muted-foreground font-mono">({products.length})</span>
                        </button>
                    </li>
                    {displayCategories.map((cat) => {
                        const isCatSelected = selectedCategory === cat.name;
                        const matchingProducts = products.filter(p => 
                            p.category.toLowerCase().includes(cat.name.toLowerCase()) || 
                            cat.name.toLowerCase().includes(p.category.toLowerCase())
                        );
                        const catCount = matchingProducts.length > 0 ? matchingProducts.length : (cat.count || 0);

                        return (
                            <li key={cat.id || cat.name} className="space-y-1">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        if (isCatSelected) {
                                            setSelectedCategory(null);
                                            setSelectedSubcategory(null);
                                        } else {
                                            setSelectedCategory(cat.name);
                                            setSelectedSubcategory(null);
                                        }
                                    }}
                                    className={`text-xs text-left transition-colors cursor-pointer flex items-center justify-between w-full py-0.5 ${
                                        isCatSelected 
                                            ? 'font-bold text-primary' 
                                            : 'text-foreground/90 hover:text-primary'
                                    }`}
                                >
                                    <span className="truncate pr-1">{cat.name}</span>
                                    <span className="text-[11px] text-muted-foreground font-mono">({catCount})</span>
                                </button>

                                {/* Subcategories dropdown */}
                                {isCatSelected && cat.subcategories && cat.subcategories.length > 0 && (
                                    <ul className="pl-3 py-1 space-y-1 border-l-2 border-primary/20 ml-1">
                                        {cat.subcategories.map((sub) => {
                                            const isSubSelected = selectedSubcategory === sub;
                                            return (
                                                <li key={sub}>
                                                    <button 
                                                        type="button"
                                                        onClick={() => setSelectedSubcategory(isSubSelected ? null : sub)}
                                                        className={`text-[11px] text-left transition-colors cursor-pointer flex items-center justify-between w-full py-0.5 ${
                                                            isSubSelected
                                                                ? 'font-bold text-accent'
                                                                : 'text-muted-foreground hover:text-primary'
                                                        }`}
                                                    >
                                                        <span className="truncate">{sub}</span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Vendor filter */}
            <div>
                <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    ভেন্ডর সমবায় (Vendor)
                </h3>
                <ul className="mt-3 space-y-1.5">
                    <li>
                        <button 
                            type="button"
                            onClick={() => setSelectedVendor(null)}
                            className={`text-xs text-left transition-colors cursor-pointer ${
                                !selectedVendor 
                                    ? 'font-bold text-primary' 
                                    : 'text-muted-foreground hover:text-primary'
                            }`}
                        >
                            সকল ভেন্ডর
                        </button>
                    </li>
                    {vendors.map((vendor) => (
                        <li key={vendor.name}>
                            <button 
                                type="button"
                                onClick={() => setSelectedVendor(selectedVendor === vendor.name ? null : vendor.name)}
                                className={`text-xs text-left transition-colors cursor-pointer flex items-center justify-between w-full ${
                                    selectedVendor === vendor.name 
                                        ? 'font-bold text-primary' 
                                        : 'text-foreground/85 hover:text-primary'
                                }`}
                            >
                                <span className="truncate pr-1">{vendor.name}</span>
                                <span className="text-[11px] text-muted-foreground">({vendor.products})</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    return (
        <CartProvider>
            <Head>
                <title>শপ ও পণ্যের তালিকা — অর্গানিক বাজার চাই</title>
                <meta name="description" content="খাঁটি অর্গানিক ও পাহাড়ি পণ্য সরাসরি কৃষকদের কাছ থেকে কিনুন — অর্গানিক বাজার চাই।" />
            </Head>

            <div className="min-h-screen bg-background">
                <Header />

                {/* Banner */}
                <div className="border-b border-border bg-secondary/50">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
                        <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                            {isBn ? 'মার্কেটপ্লেস' : 'The Marketplace'}
                        </p>
                        <h1 className="mt-1 font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                            {t('shopTitle')}
                        </h1>
                        <p className="mt-2 max-w-xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {t('shopSub')}
                        </p>
                    </div>
                </div>

                {/* Shop Container */}
                <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
                    <div className="flex gap-8">
                        {/* Desktop Aside */}
                        <aside className="hidden w-64 shrink-0 lg:block">
                            {filterSidebar}
                        </aside>

                        {/* Main Product Grid Column */}
                        <div className="flex-1 min-w-0">
                            {/* Toolbar */}
                            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
                                <button 
                                    type="button"
                                    onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold hover:border-primary lg:hidden cursor-pointer"
                                >
                                    <SlidersHorizontal className="size-3.5" /> {isBn ? 'ফিল্টার ও শ্রেণীবিন্যাস' : 'Filter & Sort'}
                                </button>

                                <p className="text-xs text-muted-foreground">
                                    {isBn ? (
                                        <>মোট <span className="font-bold text-foreground">{formatNumber(filteredProducts.length)}</span> টি পণ্য পাওয়া গেছে</>
                                    ) : (
                                        <><span className="font-bold text-foreground">{formatNumber(filteredProducts.length)}</span> {t('foundProducts')}</>
                                    )}
                                </p>

                                {/* Sort Dropdown */}
                                <div className="flex items-center gap-2">
                                    <label htmlFor="sort_select" className="text-xs text-muted-foreground hidden sm:inline">
                                        {isBn ? 'সাজান:' : 'Sort by:'}
                                    </label>
                                    <select
                                        id="sort_select"
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                        className="rounded-xl border border-input bg-card px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary cursor-pointer"
                                    >
                                        {sortOptions.map((opt) => (
                                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Mobile Filters Drawer Modal */}
                            {mobileFiltersOpen && (
                                <div className="fixed inset-0 z-50 flex items-start justify-end p-4 lg:hidden">
                                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileFiltersOpen(false)} />
                                    <div className="relative z-10 w-full max-w-xs h-full rounded-3xl bg-card border border-border p-6 shadow-2xl overflow-y-auto space-y-6">
                                        <div className="flex items-center justify-between border-b border-border pb-3">
                                            <h3 className="font-display font-bold text-base text-foreground">{isBn ? 'ফিল্টারসমূহ' : 'Filters'}</h3>
                                            <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-full hover:bg-muted text-muted-foreground">
                                                <X className="size-4" />
                                            </button>
                                        </div>
                                        {filterSidebar}
                                    </div>
                                </div>
                            )}

                            {/* Product Grid */}
                            {filteredProducts.length === 0 ? (
                                <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-4">
                                    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                        <SlidersHorizontal className="size-6" />
                                    </div>
                                    <h3 className="font-display font-bold text-lg text-foreground">{t('noProductsFound')}</h3>
                                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                        {t('noProductsFoundSub')}
                                    </p>
                                    <button 
                                        type="button"
                                        onClick={clearAllFilters}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:bg-forest-deep shadow-xs cursor-pointer"
                                    >
                                        {t('resetFilters')}
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-y-6">
                                    {filteredProducts.map((p) => (
                                        <ProductCard key={p.id} product={p} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Footer />
                <CartDrawer />
            </div>
        </CartProvider>
    );
}
