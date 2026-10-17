import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ className = '', variant = 'pill' }) {
    const { lang, setLang, toggleLang, isBn } = useLanguage();

    if (variant === 'simple') {
        return (
            <button
                type="button"
                onClick={toggleLang}
                title={isBn ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer ${className}`}
            >
                <Globe className="size-3.5 text-primary" />
                <span>{isBn ? 'EN' : 'বাং'}</span>
            </button>
        );
    }

    return (
        <div 
            className={`inline-flex items-center rounded-full border border-border bg-card/90 p-0.5 shadow-2xs backdrop-blur-xs ${className}`}
            role="group"
            aria-label="Language Selector"
        >
            <button
                type="button"
                onClick={() => setLang('bn')}
                className={`relative px-2.5 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
                    isBn 
                        ? 'bg-primary text-primary-foreground shadow-xs' 
                        : 'text-muted-foreground hover:text-foreground'
                }`}
            >
                বাংলা
            </button>
            <button
                type="button"
                onClick={() => setLang('en')}
                className={`relative px-2.5 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
                    !isBn 
                        ? 'bg-primary text-primary-foreground shadow-xs' 
                        : 'text-muted-foreground hover:text-foreground'
                }`}
            >
                English
            </button>
        </div>
    );
}
