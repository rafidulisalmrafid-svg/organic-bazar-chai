import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import { LanguageProvider } from './context/LanguageContext';

const appName = import.meta.env.VITE_APP_NAME || 'অর্গানিক বাজার চাই';

createInertiaApp({
    title: (title) => title ? `${title} — ${appName}` : `${appName} — খাঁটি অর্গানিক ও পাহাড়ি পণ্য মার্কেটপ্লেস`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <LanguageProvider>
                <App {...props} />
            </LanguageProvider>
        );
    },
    progress: {
        color: '#C85A32',
    },
});
