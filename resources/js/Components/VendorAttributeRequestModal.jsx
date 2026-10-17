import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCircle2 } from 'lucide-react';

export default function VendorAttributeRequestModal({ 
    isOpen, 
    onClose, 
    attributes = [], 
    categories = [],
    onRequestSubmitted 
}) {
    if (!isOpen) return null;

    const [form, setForm] = useState({
        vendor_name: 'Rangamati Weaves',
        request_type: 'attribute', // 'attribute' | 'value' | 'unit'
        name_en: '',
        name_bn: '',
        attribute_id: attributes[0]?.id || '',
        category_id: categories[0]?.id || '',
        details: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name_bn.trim() || !form.name_en.trim()) {
            alert('অনুগ্রহ করে বাংলা ও ইংরেজি উভয় নাম পূরণ করুন।');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/vendor/attribute-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                alert('আপনার অনুরোধটি সফলভাবে অ্যাডমিন প্যানেলে পাঠানো হয়েছে! অ্যাডমিন অনুমোদন করার সাথে সাথে এটি সিস্টেমে দৃশ্যমান হবে।');
                if (onRequestSubmitted) {
                    onRequestSubmitted(data.request);
                }
                onClose();
            } else {
                alert('ত্রুটি: ' + data.message);
            }
        } catch (err) {
            alert('সার্ভার এরর: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-scale-up">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2.5">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Sparkles className="size-4" />
                        </span>
                        <div>
                            <h3 className="font-display font-bold text-base text-foreground">
                                নতুন Attribute, মান বা Unit-এর অনুরোধ
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                ভেন্ডর হিসেবে আপনার প্রয়োজনীয় বৈশিষ্ট্য অনুমোদনের জন্য অ্যাডমিনকে জানান।
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="size-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">অনুরোধের ধরন</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { key: 'attribute', label: 'নতুন Attribute' },
                                { key: 'value', label: 'বিদ্যমান Attribute-এর মান' },
                                { key: 'unit', label: 'নতুন Unit (একক)' },
                            ].map(t => (
                                <button
                                    key={t.key}
                                    type="button"
                                    onClick={() => setForm({ ...form, request_type: t.key })}
                                    className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                        form.request_type === t.key
                                            ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                                            : 'border border-border bg-background text-foreground hover:bg-muted'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {form.request_type === 'value' && (
                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1">কোন Attribute-এর জন্য মান?</label>
                            <select
                                value={form.attribute_id}
                                onChange={e => setForm({ ...form, attribute_id: e.target.value })}
                                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold text-foreground"
                            >
                                {attributes.map(a => (
                                    <option key={a.id} value={a.id}>{a.name_bn} ({a.name_en})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1">নাম (বাংলা)</label>
                            <input
                                type="text"
                                required
                                placeholder="উদা: নীল রং, ডজন, কাঁসার গহনা"
                                value={form.name_bn}
                                onChange={e => setForm({ ...form, name_bn: e.target.value })}
                                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold text-foreground"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1">Name (English)</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Indigo Blue, Dozen, Brass"
                                value={form.name_en}
                                onChange={e => setForm({ ...form, name_en: e.target.value })}
                                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold text-foreground"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">প্রযোজ্য ক্যাটাগরি (ঐচ্ছিক)</label>
                        <select
                            value={form.category_id}
                            onChange={e => setForm({ ...form, category_id: e.target.value })}
                            className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold text-foreground"
                        >
                            <option value="">সকল ক্যাটাগরি</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">কেন এই মানটি প্রয়োজন? (বিবরণ / কারণ)</label>
                        <textarea
                            rows={3}
                            placeholder="আমরা পাহাড়ি তাঁতের নতুন ধরনের নীল সুতা তৈরি করেছি যা ভ্যারিয়েশনে প্রয়োজন..."
                            value={form.details}
                            onChange={e => setForm({ ...form, details: e.target.value })}
                            className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-medium text-foreground"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                        >
                            বাতিল
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 disabled:opacity-50"
                        >
                            <Send className="size-3.5" />
                            <span>{submitting ? 'পাঠানো হচ্ছে...' : 'অনুরোধ পাঠান'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
