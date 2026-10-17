import React from 'react';
import { Link } from '@inertiajs/react';
import { Mountain } from 'lucide-react';

function FacebookIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
    );
}

function InstagramIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
    );
}

function TwitterIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
        </svg>
    );
}

export default function Footer() {
    const footerColumns = [
        {
            title: 'Shop',
            links: [
                { label: 'Handloom Textiles', href: '/shop?category=Handloom+Textiles' },
                { label: 'Bamboo & Cane', href: '/shop?category=Bamboo+%26+Cane' },
                { label: 'Hill Pantry', href: '/shop?category=Hill+Pantry' },
                { label: 'Terracotta & Clay', href: '/shop?category=Terracotta+%26+Clay' },
                { label: 'Gift Sets', href: '/shop' },
            ],
        },
        {
            title: 'Marketplace',
            links: [
                { label: 'Become a Vendor', href: '/become-a-vendor' },
                { label: 'Artisan Stories', href: '/#artisans' },
                { label: 'Vendor Dashboard', href: '/dashboard' },
                { label: 'Fair Trade Promise', href: '/shop' },
            ],
        },
        {
            title: 'Support',
            links: [
                { label: 'Delivery & Returns', href: '/shop' },
                { label: 'Track Order', href: '/track-order' },
                { label: 'Contact Us', href: '/shop' },
                { label: 'FAQs', href: '/shop' },
            ],
        },
    ];

    return (
        <footer className="bg-forest-deep text-primary-foreground">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
                {/* Brand Story Column */}
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-3">
                        <img 
                            src="/images/logo.png" 
                            alt="অর্গানিক বাজার চাই" 
                            className="h-10 w-auto object-contain rounded-lg bg-white p-1 shadow-xs"
                        />
                        <span className="font-display text-2xl font-bold">অর্গানিক বাজার চাই</span>
                    </div>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
                        খাঁটি অর্গানিক কৃষি পণ্য, পাহাড়ি ঐতিহ্যবাহী মধু, টাটকা ফলমূল ও পরিবেশবান্ধব হস্তশিল্পের বিশ্বস্ত মার্কেটপ্লেস।
                    </p>
                    <div className="mt-6 flex gap-3">
                        <a 
                            href="https://facebook.com" 
                            target="_blank" 
                            rel="noreferrer"
                            aria-label="Facebook" 
                            className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <FacebookIcon className="size-4" />
                        </a>
                        <a 
                            href="https://instagram.com" 
                            target="_blank" 
                            rel="noreferrer"
                            aria-label="Instagram" 
                            className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <InstagramIcon className="size-4" />
                        </a>
                        <a 
                            href="https://twitter.com" 
                            target="_blank" 
                            rel="noreferrer"
                            aria-label="Twitter" 
                            className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <TwitterIcon className="size-4" />
                        </a>
                    </div>
                </div>

                {/* Footer Navigation Columns */}
                {footerColumns.map((col) => (
                    <div key={col.title}>
                        <h4 className="text-sm font-semibold tracking-widest uppercase text-sand">
                            {col.title}
                        </h4>
                        <ul className="mt-4 space-y-2.5">
                            {col.links.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Bottom copyright row */}
            <div className="border-t border-primary-foreground/10">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-primary-foreground/60 sm:flex-row sm:px-6 lg:px-8">
                    <p>© 2026 অর্গানিক বাজার চাই। সর্বস্বত্ব সংরক্ষিত।</p>
                    <p>খাঁটি অর্গানিক ও পাহাড়ি পণ্যের নির্ভরযোগ্য প্ল্যাটফর্ম</p>
                </div>
            </div>
        </footer>
    );
}
