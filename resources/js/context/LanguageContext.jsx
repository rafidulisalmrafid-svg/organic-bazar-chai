import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
    bn: {
        // Brand & Meta
        brandName: 'অর্গানিক বাজার চাই',
        tagline: 'খাঁটি প্রাকৃতিক পণ্যের হাট',
        subTagline: 'পাহাড় ও কৃষকের খাঁটি অর্গানিক সম্ভার',
        metaDescription: 'খাঁটি অর্গানিক পণ্য, পাহাড়ি মধু, কৃষিজাত ফলমূল ও ঐতিহ্যবাহী হস্তশিল্পের বিশ্বস্ত মার্কেটপ্লেস — অর্গানিক বাজার চাই।',
        
        // Navigation & Header
        navHome: 'হোম',
        navShop: 'শপ ও পণ্য',
        navCategories: 'সকল ক্যাটাগরি',
        navBecomeVendor: 'ভেন্ডর হন',
        navDashboard: 'ড্যাশবোর্ড',
        navTrackOrder: 'অর্ডার ট্র্যাকিং',
        searchPlaceholder: 'পাহাড়ি মধু, জুমের চাল, বাঁশের পণ্য, ফলমূল খুঁজুন...',
        searchBtn: 'খুঁজুন',
        cart: 'কার্ট',
        wishlist: 'পছন্দের তালিকা',
        login: 'লগইন',
        freeDeliveryNotice: 'সারাদেশে ৩,০০০ টাকার অর্ডারে ফ্রি হোম ডেলিভারি!',
        hotline: 'হটলাইন: +৮৮০ ১৩১৯-০৫৫৬২১',

        // Trust Badges
        trustOrganicTitle: '১০০% খাঁটি ও অর্গানিক',
        trustOrganicDesc: 'সরাসরি পাহাড়ি ও স্থানীয় কৃষকের উৎপাদিত',
        trustFairTradeTitle: 'ন্যায্য বাণিজ্য (Fair Trade)',
        trustFairTradeDesc: 'কৃষক ও কারিগরদের সরাসরি ন্যায্য মূল্য প্রদান',
        trustDeliveryTitle: 'দেশজুড়ে ডেলিভারি',
        trustDeliveryDesc: '৬৪ জেলায় দ্রুত ও নিরাপদ হোম ডেলিভারি',
        trustPromiseTitle: 'সত্যতার শতভাগ নিশ্চয়তা',
        trustPromiseDesc: 'প্রতিটি পণ্যের গুণগত মান পরীক্ষিত ও প্রমাণিত',

        // Hero Slider
        heroBadgeDefault: '১০০% খাঁটি পাহাড়ি পণ্য',
        heroShopBtn: 'পণ্য দেখুন',
        heroExploreBtn: 'বাজার ঘুরে দেখুন',
        slideCount: 'স্লাইড',

        // Home Sections
        featuredCategories: 'জনপ্রিয় ক্যাটাগরি সমূহ',
        featuredCategoriesSub: 'পাহাড় ও প্রান্তিক কৃষকদের সেরা প্রাকৃতিক উপহার',
        viewAllCategories: 'সব ক্যাটাগরি দেখুন',
        bestSellers: 'সেরা বিক্রিত পণ্য',
        bestSellersSub: 'গ্রাহকদের পছন্দের শীর্ষে থাকা খাঁটি অর্গানিক পণ্য',
        newArrivals: 'নতুন সংযোজিত পণ্য',
        newArrivalsSub: 'সদ্য সংগৃহীত তাজা কৃষিপণ্য ও অনন্য হস্তশিল্প',
        viewAll: 'সবগুলো দেখুন',
        exploreShop: 'সম্পূর্ণ শপে যান',

        // Product Card & Details
        inStock: 'স্টকে আছে',
        outOfStock: 'স্টক শেষ',
        addToCart: 'কার্টে যোগ করুন',
        addedToCart: 'যোগ করা হয়েছে',
        buyNow: 'এখনই কিনুন',
        quickView: 'একনজরে দেখুন',
        rating: 'রেটিং',
        reviews: 'রিভিউ',
        artisan: 'কারিগর / কৃষক',
        origin: 'উৎস',
        deliveryTime: 'ডেলিভারি সময়',
        share: 'শেয়ার করুন',
        relatedProducts: 'সম্পর্কিত আরও পণ্য',
        productDesc: 'পণ্যের বিবরণ',
        productSpecs: 'বৈশিষ্ট্য ও স্পেসিফিকেশন',
        customerReviews: 'গ্রাহকদের মতামত',

        // Cart Drawer
        cartTitle: 'আপনার শপিং কার্ট',
        emptyCart: 'আপনার কার্ট বর্তমানে খালি আছে',
        emptyCartSub: 'পাহাড়ের খাঁটি পণ্য ও তাজা ফলমূল ঘুরে দেখুন!',
        startShopping: 'শপিং শুরু করুন',
        subtotal: 'সাবটোটাল',
        deliveryFee: 'ডেলিভারি চার্জ',
        free: 'ফ্রি',
        total: 'সর্বমোট',
        proceedCheckout: 'চেকআউটে এগিয়ে যান',
        addMoreForFreeDelivery: 'আর মাত্র',
        forFreeDelivery: 'টাকার পণ্য যোগ করলেই ফ্রি ডেলিভারি!',
        freeDeliveryUnlocked: 'অভিনন্দন! আপনি ফ্রি ডেলিভারি পেয়েছেন।',

        // Shop Page
        shopTitle: 'শপ ও পণ্যের তালিকা',
        shopSub: 'পাহাড়ের খাঁটি অর্গানিক পণ্য, ফলমূল ও ঐতিহ্যবাহী হস্তশিল্প',
        filterBy: 'ফিল্টার করুন',
        filterCategories: 'ক্যাটাগরি সমূহ',
        filterDistricts: 'জেলা / অঞ্চল',
        filterPrice: 'মূল্য সীমা',
        sortBy: 'সাজান',
        sortFeatured: 'জনপ্রিয়তা অনুযায়ী',
        sortPriceLow: 'মূল্য: কম থেকে বেশি',
        sortPriceHigh: 'মূল্য: বেশি থেকে কম',
        sortRating: 'সেরা রেটিং',
        sortNewest: 'নতুন সংযোজিত',
        resetFilters: 'ফিল্টার মুছুন',
        foundProducts: 'টি পণ্য পাওয়া গেছে',
        noProductsFound: 'কোনো পণ্য পাওয়া যায়নি!',
        noProductsFoundSub: 'অনুগ্রহ করে ভিন্ন কোনো শব্দ বা ক্যাটাগরি দিয়ে চেষ্টা করুন।',

        // Checkout Page
        checkoutTitle: 'নিরাপদ চেকআউট',
        checkoutSub: 'আপনার অর্ডারটি নিরাপদে সম্পন্ন করুন',
        customerInfo: '১. গ্রাহকের তথ্য',
        shippingAddress: '২. ডেলিভারি ঠিকানা',
        fullName: 'আপনার সম্পূর্ণ নাম',
        phoneNumber: 'সচল মোবাইল নম্বর',
        emailAddress: 'ইমেইল অ্যাড্রেস (ঐচ্ছিক)',
        selectDistrict: 'জেলা নির্বাচন করুন',
        fullAddress: 'বিস্তারিত ঠিকানা (বাড়ি নং, রোড নং, এলাকা)',
        deliveryNote: 'ডেলিভারি বিশেষ নোট (যদি থাকে)',
        deliveryMethod: '৩. ডেলিভারি পদ্ধতি',
        standardDelivery: 'স্ট্যান্ডার্ড ডেলিভারি (২-৪ দিন)',
        expressDelivery: 'এক্সপ্রেস দ্রুত ডেলিভারি (২৪-৪৮ ঘণ্টা)',
        paymentMethod: '৪. পেমেন্ট মেথড নির্বাচন',
        cod: 'ক্যাশ অন ডেলিভারি (পণ্য পেয়ে মূল্য পরিশোধ)',
        bkash: 'বিকাশ (bKash Online / Manual)',
        nagad: 'নগদ (Nagad Online / Manual)',
        rocket: 'রকেট (Rocket Online / Manual)',
        couponCode: 'কুপন বা ডিসকাউন্ট কোড',
        applyCoupon: 'প্রয়োগ করুন',
        couponApplied: 'কুপন সফলভাবে প্রয়োগ করা হয়েছে!',
        orderSummary: 'অর্ডারের বিবরণ',
        placeOrder: 'অর্ডার নিশ্চিত করুন',
        processingOrder: 'অর্ডার প্রসেস হচ্ছে...',
        orderSuccess: 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে!',
        orderSuccessSub: 'আপনার অর্ডারের কপি আপনার মোবাইল ও ইমেইলে পাঠানো হয়েছে।',

        // Order Tracking
        trackingTitle: 'অর্ডার ট্র্যাকিং',
        trackingSub: 'আপনার অর্ডার নম্বর দিয়ে বর্তমান অবস্থান জানুন',
        orderNumber: 'অর্ডার নম্বর',
        orderNumberPlaceholder: 'যেমন: #PH-2481',
        trackBtn: 'ট্র্যাক করুন',
        orderStatus: 'বর্তমান স্ট্যাটাস',
        orderPlaced: 'অর্ডার গ্রহণ',
        processing: 'প্যাকেজিং ও প্রস্তুতি',
        shipped: 'কুরিয়ারে হস্তান্তর',
        outForDelivery: 'ডেলিভারির জন্য বের হয়েছে',
        delivered: 'সফলভাবে ডেলিভার্ড',
        courierPartner: 'কুরিয়ার পার্টনার',
        estimatedDelivery: 'আনুমানিক ডেলিভারি তারিখ',

        // Become a Vendor
        vendorRegTitle: 'ভেন্ডর বা সেলার হিসেবে যোগ দিন',
        vendorRegSub: 'পাহাড় ও সমতলের খাঁটি অর্গানিক পণ্যের সবচেয়ে বড় প্ল্যাটফর্মে আপনার পণ্য বিক্রি করুন',
        shopName: 'দোকান বা খামারের নাম',
        ownerName: 'মালিক বা উদ্যোক্তার নাম',
        nidNumber: 'জাতীয় পরিচয়পত্র (NID) নম্বর',
        productType: 'পণ্যের ধরণ / ক্যাটাগরি',
        districtCity: 'জেলা / অবস্থান',
        artisanCount: 'কারিগর বা শ্রমিকের সংখ্যা',
        submitApplication: 'আবেদন জমা দিন',

        // Dashboard
        dashboardTitle: 'নিয়ন্ত্রণ কেন্দ্র (Dashboard)',
        adminPortal: 'সুপার অ্যাডমিন প্যানেল',
        vendorPortal: 'ভেন্ডর কন্ট্রোল প্যানেল',
        overview: 'সার্বিক চিত্র (Overview)',
        heroSliderTab: 'হিরো ব্যানার ও স্লাইডার',
        attributeTab: 'অ্যাট্রিবিউট ও ইউনিট',
        vendorAppTab: 'ভেন্ডর আবেদন',
        categoryTab: 'ক্যাটাগরি হাব',
        fieldConfigTab: 'ডাইনামিক ফিল্ডস',
        financeTab: 'আর্থিক হিসাব ও পে-আউট',
        ordersTab: 'অর্ডার তালিকা',
        backToStore: 'মূল মার্কেটপ্লেসে ফিরে যান',

        // Common Buttons & Labels
        save: 'সংরক্ষণ করুন',
        cancel: 'বাতিল',
        delete: 'মুছে ফেলুন',
        edit: 'সম্পাদনা',
        active: 'সক্রিয়',
        inactive: 'নিষ্ক্রিয়',
        loading: 'লোড হচ্ছে...',
        success: 'সফল',
        error: 'ত্রুটি',
        yes: 'হ্যাঁ',
        no: 'না',
        close: 'বন্ধ করুন',
        taka: '৳',

        // Footer
        footerAboutText: 'খাঁটি অর্গানিক কৃষি পণ্য, পাহাড়ি ঐতিহ্যবাহী মধু, টাটকা ফলমূল ও পরিবেশবান্ধব হস্তশিল্পের বিশ্বস্ত মার্কেটপ্লেস।',
        quickLinks: 'প্রয়োজনীয় লিঙ্ক',
        customerCare: 'গ্রাহক সেবা',
        termsConditions: 'শর্তাবলী ও নীতিমালা',
        privacyPolicy: 'গোপনীয়তা নীতি',
        returnPolicy: 'রিটার্ন ও রিফান্ড নীতি',
        contactUs: 'যোগাযোগ করুন',
        allRightsReserved: 'সর্বস্বত্ব সংরক্ষিত।',
        craftMessage: 'খাঁটি অর্গানিক ও পাহাড়ি পণ্যের নির্ভরযোগ্য প্ল্যাটফর্ম',
    },

    en: {
        // Brand & Meta
        brandName: 'Organic Bazar Chai',
        tagline: 'Authentic Pure & Organic Marketplace',
        subTagline: 'Pure hill harvests & farm-fresh produce',
        metaDescription: 'Trusted marketplace for pure organic farm produce, raw hill honey, seasonal fruits and handcrafted artisanal goods — Organic Bazar Chai.',

        // Navigation & Header
        navHome: 'Home',
        navShop: 'Shop',
        navCategories: 'All Categories',
        navBecomeVendor: 'Become a Vendor',
        navDashboard: 'Dashboard',
        navTrackOrder: 'Track Order',
        searchPlaceholder: 'Search raw wild honey, hill fruits, organic spices...',
        searchBtn: 'Search',
        cart: 'Cart',
        wishlist: 'Wishlist',
        login: 'Login',
        freeDeliveryNotice: 'Free nationwide delivery on orders over ৳ 3,000!',
        hotline: 'Hotline: +880 1319-055621',

        // Trust Badges
        trustOrganicTitle: '100% Pure & Organic',
        trustOrganicDesc: 'Sourced directly from indigenous & local farmers',
        trustFairTradeTitle: 'Fair Trade Certified',
        trustFairTradeDesc: 'Fair wages paid directly to farmers and artisans',
        trustDeliveryTitle: 'Nationwide Delivery',
        trustDeliveryDesc: 'Fast & secure home delivery across all 64 districts',
        trustPromiseTitle: '100% Authenticity Guarantee',
        trustPromiseDesc: 'Every product tested, certified and genuine',

        // Hero Slider
        heroBadgeDefault: '100% Pure Organic Products',
        heroShopBtn: 'Shop Now',
        heroExploreBtn: 'Explore Marketplace',
        slideCount: 'Slide',

        // Home Sections
        featuredCategories: 'Featured Categories',
        featuredCategoriesSub: 'Finest organic harvests from indigenous highlands and lush green farms',
        viewAllCategories: 'View All Categories',
        bestSellers: 'Best Selling Products',
        bestSellersSub: 'Top-rated authentic organic items loved by our customers',
        newArrivals: 'New Arrivals',
        newArrivalsSub: 'Freshly harvested farm produce and unique handmade crafts',
        viewAll: 'View All',
        exploreShop: 'Visit Full Shop',

        // Product Card & Details
        inStock: 'In Stock',
        outOfStock: 'Out of Stock',
        addToCart: 'Add to Cart',
        addedToCart: 'Added to Cart',
        buyNow: 'Buy Now',
        quickView: 'Quick View',
        rating: 'Rating',
        reviews: 'Reviews',
        artisan: 'Artisan / Farmer',
        origin: 'Origin',
        deliveryTime: 'Delivery Time',
        share: 'Share',
        relatedProducts: 'Related Products',
        productDesc: 'Product Description',
        productSpecs: 'Features & Specifications',
        customerReviews: 'Customer Reviews',

        // Cart Drawer
        cartTitle: 'Your Shopping Cart',
        emptyCart: 'Your cart is currently empty',
        emptyCartSub: 'Explore our pure organic products and fresh harvests!',
        startShopping: 'Start Shopping',
        subtotal: 'Subtotal',
        deliveryFee: 'Delivery Fee',
        free: 'Free',
        total: 'Grand Total',
        proceedCheckout: 'Proceed to Checkout',
        addMoreForFreeDelivery: 'Add ৳ ',
        forFreeDelivery: ' more for free home delivery!',
        freeDeliveryUnlocked: 'Congratulations! You unlocked Free Delivery.',

        // Shop Page
        shopTitle: 'Shop Organic Products',
        shopSub: 'Pure organic farm produce, raw hill honey & authentic handmade crafts',
        filterBy: 'Filter By',
        filterCategories: 'Categories',
        filterDistricts: 'Districts / Origin',
        filterPrice: 'Price Range',
        sortBy: 'Sort By',
        sortFeatured: 'Featured',
        sortPriceLow: 'Price: Low to High',
        sortPriceHigh: 'Price: High to Low',
        sortRating: 'Highest Rated',
        sortNewest: 'Newest Arrivals',
        resetFilters: 'Reset Filters',
        foundProducts: 'products found',
        noProductsFound: 'No products found!',
        noProductsFoundSub: 'Try searching with different keywords or clear filters.',

        // Checkout Page
        checkoutTitle: 'Secure Checkout',
        checkoutSub: 'Complete your purchase safely and seamlessly',
        customerInfo: '1. Customer Details',
        shippingAddress: '2. Shipping Address',
        fullName: 'Full Name',
        phoneNumber: 'Active Phone Number',
        emailAddress: 'Email Address (Optional)',
        selectDistrict: 'Select District',
        fullAddress: 'Full Street Address (House, Road, Area)',
        deliveryNote: 'Delivery Instructions (Optional)',
        deliveryMethod: '3. Delivery Method',
        standardDelivery: 'Standard Delivery (2-4 Days)',
        expressDelivery: 'Express Priority Delivery (24-48 Hours)',
        paymentMethod: '4. Select Payment Method',
        cod: 'Cash on Delivery (Pay upon delivery)',
        bkash: 'bKash (Instant / Manual Payment)',
        nagad: 'Nagad (Instant / Manual Payment)',
        rocket: 'Rocket (Instant / Manual Payment)',
        couponCode: 'Promo or Coupon Code',
        applyCoupon: 'Apply Code',
        couponApplied: 'Coupon applied successfully!',
        orderSummary: 'Order Summary',
        placeOrder: 'Confirm & Place Order',
        processingOrder: 'Processing order...',
        orderSuccess: 'Order Placed Successfully!',
        orderSuccessSub: 'Order confirmation has been sent to your phone and email.',

        // Order Tracking
        trackingTitle: 'Track Your Order',
        trackingSub: 'Enter your order ID to see real-time delivery status',
        orderNumber: 'Order Number',
        orderNumberPlaceholder: 'e.g. #PH-2481',
        trackBtn: 'Track Now',
        orderStatus: 'Current Status',
        orderPlaced: 'Order Placed',
        processing: 'Packaging & Quality Check',
        shipped: 'Handed to Courier',
        outForDelivery: 'Out for Delivery',
        delivered: 'Delivered',
        courierPartner: 'Courier Partner',
        estimatedDelivery: 'Estimated Delivery Date',

        // Become a Vendor
        vendorRegTitle: 'Sell With Us (Vendor Registration)',
        vendorRegSub: 'Join Bangladesh’s largest authentic organic marketplace and reach thousands of conscious consumers',
        shopName: 'Store or Farm Name',
        ownerName: 'Owner or Entrepreneur Name',
        nidNumber: 'National ID (NID) Number',
        productType: 'Product Category / Type',
        districtCity: 'District / Region',
        artisanCount: 'Number of Farmers / Artisans',
        submitApplication: 'Submit Application',

        // Dashboard
        dashboardTitle: 'Control Center (Dashboard)',
        adminPortal: 'Super Admin Portal',
        vendorPortal: 'Artisan & Farmer Portal',
        overview: 'Overview',
        heroSliderTab: 'Hero Banner & Slider',
        attributeTab: 'Attributes & Units',
        vendorAppTab: 'Vendor Applications',
        categoryTab: 'Category Hub',
        fieldConfigTab: 'Dynamic Fields',
        financeTab: 'Financial Payouts',
        ordersTab: 'Marketplace Orders',
        backToStore: 'Back to Marketplace',

        // Common Buttons & Labels
        save: 'Save Changes',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        active: 'Active',
        inactive: 'Inactive',
        loading: 'Loading...',
        success: 'Success',
        error: 'Error',
        yes: 'Yes',
        no: 'No',
        close: 'Close',
        taka: '৳',

        // Footer
        footerAboutText: 'Trusted marketplace for pure organic farm produce, raw forest honey, fresh highland fruits and sustainable artisanal handicrafts.',
        quickLinks: 'Quick Links',
        customerCare: 'Customer Care',
        termsConditions: 'Terms & Conditions',
        privacyPolicy: 'Privacy Policy',
        returnPolicy: 'Return & Refund Policy',
        contactUs: 'Contact Us',
        allRightsReserved: 'All rights reserved.',
        craftMessage: 'Reliable platform for 100% authentic organic & hill products',
    }
};

export function LanguageProvider({ children }) {
    const [lang, setLangState] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('organic_bazar_lang');
            if (saved === 'en' || saved === 'bn') return saved;
        }
        return 'bn'; // default Bangla
    });

    const setLang = (newLang) => {
        const target = newLang === 'en' ? 'en' : 'bn';
        setLangState(target);
        if (typeof window !== 'undefined') {
            localStorage.setItem('organic_bazar_lang', target);
            document.documentElement.lang = target;
        }
    };

    const toggleLang = () => {
        setLang(lang === 'bn' ? 'en' : 'bn');
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.lang = lang;
        }
    }, [lang]);

    const t = (key, fallback = '') => {
        if (translations[lang] && translations[lang][key] !== undefined) {
            return translations[lang][key];
        }
        if (translations['bn'] && translations['bn'][key] !== undefined) {
            return translations['bn'][key];
        }
        return fallback || key;
    };

    // Helper: format numbers (Bengali digits vs English digits)
    const formatNumber = (num) => {
        if (num === null || num === undefined) return '';
        const numStr = String(num);
        if (lang === 'bn') {
            const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            return numStr.replace(/\d/g, (d) => bnDigits[d]);
        }
        return Number(num).toLocaleString('en-US');
    };

    // Helper: format currency
    const formatCurrency = (amount) => {
        const val = Number(amount) || 0;
        if (lang === 'bn') {
            const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const formatted = val.toLocaleString('en-IN').replace(/\d/g, (d) => bnDigits[d]);
            return `৳ ${formatted}`;
        }
        return `৳ ${val.toLocaleString('en-US')}`;
    };

    const value = {
        lang,
        setLang,
        toggleLang,
        isBn: lang === 'bn',
        isEn: lang === 'en',
        t,
        formatNumber,
        formatCurrency,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        // Fallback if rendered outside provider
        return {
            lang: 'bn',
            setLang: () => {},
            toggleLang: () => {},
            isBn: true,
            isEn: false,
            t: (k, fb = '') => translations.bn[k] || fb || k,
            formatNumber: (n) => String(n),
            formatCurrency: (n) => `৳ ${n}`,
        };
    }
    return context;
}
