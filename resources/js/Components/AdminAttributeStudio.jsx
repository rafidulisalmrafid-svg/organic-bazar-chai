import React, { useState, useEffect } from 'react';
import { 
    Layers, 
    Plus, 
    Edit2, 
    Trash2, 
    Check, 
    X, 
    Scale, 
    Droplet, 
    Boxes, 
    Ruler, 
    Tag, 
    Palette, 
    Sliders, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    ArrowRight,
    Sparkles,
    Search,
    RefreshCw
} from 'lucide-react';

export default function AdminAttributeStudio({ 
    initialUnits = [], 
    initialAttributes = [], 
    initialMappings = [], 
    initialRequests = [],
    categories = [] 
}) {
    const [activeStudioTab, setActiveStudioTab] = useState('units'); // 'units' | 'attributes' | 'mapping' | 'requests'

    // Units State
    const [units, setUnits] = useState(initialUnits);
    const [selectedUnitGroup, setSelectedUnitGroup] = useState('all');
    const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
    const [unitForm, setUnitForm] = useState({ name_en: '', name_bn: '', short_code: '', group: 'weight' });
    const [editingUnit, setEditingUnit] = useState(null);

    // Attributes State
    const [attributes, setAttributes] = useState(initialAttributes);
    const [selectedAttr, setSelectedAttr] = useState(initialAttributes[0] || null);
    const [isAddAttrOpen, setIsAddAttrOpen] = useState(false);
    const [attrForm, setAttrForm] = useState({ name_en: '', name_bn: '', code: '', type: 'button_group' });
    const [valueForm, setValueForm] = useState({ name_en: '', name_bn: '', hex_color: '#C85A32' });
    const [isAddValueOpen, setIsAddValueOpen] = useState(false);

    // Category Mapping State
    const [mappings, setMappings] = useState(initialMappings);
    const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || 'cat-apparel');
    const [savingMapping, setSavingMapping] = useState(false);

    // Attribute Requests State
    const [requests, setRequests] = useState(initialRequests);
    const [rejectingReqId, setRejectingReqId] = useState(null);
    const [rejectNote, setRejectNote] = useState('');
    const [requestFilter, setRequestFilter] = useState('all'); // 'all' | 'Pending' | 'Approved' | 'Rejected'

    // Status notifications
    const [toastMessage, setToastMessage] = useState('');
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 4000);
    };

    // Load fresh data if needed
    const refreshData = async () => {
        try {
            const [uRes, aRes, mRes, rRes] = await Promise.all([
                fetch('/admin/units'),
                fetch('/admin/attributes'),
                fetch('/admin/category-attributes'),
                fetch('/admin/attribute-requests')
            ]);
            const [uData, aData, mData, rData] = await Promise.all([
                uRes.json(), aRes.json(), mRes.json(), rRes.json()
            ]);
            if (uData.success) setUnits(uData.units);
            if (aData.success) {
                setAttributes(aData.attributes);
                if (!selectedAttr && aData.attributes.length > 0) {
                    setSelectedAttr(aData.attributes[0]);
                }
            }
            if (mData.success) setMappings(mData.mappings);
            if (rData.success) setRequests(rData.requests);
            showToast('ডাটা সফলভাবে রিফ্রেশ করা হয়েছে!');
        } catch (e) {
            console.error('Refresh error:', e);
        }
    };

    // ==========================================
    // UNIT HANDLERS
    // ==========================================
    const handleSaveUnit = async (e) => {
        e.preventDefault();
        try {
            if (editingUnit) {
                const res = await fetch(`/admin/units/${editingUnit.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(unitForm)
                });
                const data = await res.json();
                if (data.success) {
                    setUnits(prev => prev.map(u => u.id === editingUnit.id ? data.unit : u));
                    setEditingUnit(null);
                    setIsAddUnitOpen(false);
                    showToast('ইউনিট সফলভাবে আপডেট করা হয়েছে!');
                }
            } else {
                const res = await fetch('/admin/units', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(unitForm)
                });
                const data = await res.json();
                if (data.success) {
                    setUnits(prev => [...prev, data.unit]);
                    setIsAddUnitOpen(false);
                    setUnitForm({ name_en: '', name_bn: '', short_code: '', group: 'weight' });
                    showToast('নতুন ইউনিট সফলভাবে যোগ করা হয়েছে!');
                }
            }
        } catch (err) {
            alert('ত্রুটি: ' + err.message);
        }
    };

    const handleDeleteUnit = async (id) => {
        if (!confirm('আপনি কি এই ইউনিটটি মুছে ফেলতে চান?')) return;
        try {
            const res = await fetch(`/admin/units/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setUnits(prev => prev.filter(u => u.id !== id));
                showToast('ইউনিটটি মুছে ফেলা হয়েছে।');
            }
        } catch (err) {
            alert('ত্রুটি: ' + err.message);
        }
    };

    // ==========================================
    // ATTRIBUTE & VALUE HANDLERS
    // ==========================================
    const handleSaveAttribute = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/admin/attributes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(attrForm)
            });
            const data = await res.json();
            if (data.success) {
                setAttributes(prev => [...prev, data.attribute]);
                setSelectedAttr(data.attribute);
                setIsAddAttrOpen(false);
                setAttrForm({ name_en: '', name_bn: '', code: '', type: 'button_group' });
                showToast('নতুন অ্যাট্রিবিউট তৈরি হয়েছে!');
            }
        } catch (err) {
            alert('ত্রুটি: ' + err.message);
        }
    };

    const handleSaveValue = async (e) => {
        e.preventDefault();
        if (!selectedAttr) return;
        try {
            const res = await fetch(`/admin/attributes/${selectedAttr.id}/values`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(valueForm)
            });
            const data = await res.json();
            if (data.success) {
                const updatedAttr = {
                    ...selectedAttr,
                    values: [...(selectedAttr.values || []), data.value]
                };
                setSelectedAttr(updatedAttr);
                setAttributes(prev => prev.map(a => a.id === selectedAttr.id ? updatedAttr : a));
                setIsAddValueOpen(false);
                setValueForm({ name_en: '', name_bn: '', hex_color: '#C85A32' });
                showToast('নতুন মান সফলভাবে যোগ হয়েছে!');
            }
        } catch (err) {
            alert('ত্রুটি: ' + err.message);
        }
    };

    const handleDeleteValue = async (valId) => {
        if (!confirm('মানটি মুছে ফেলতে চান?')) return;
        try {
            const res = await fetch(`/admin/attributes/values/${valId}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                const updatedAttr = {
                    ...selectedAttr,
                    values: selectedAttr.values.filter(v => v.id !== valId)
                };
                setSelectedAttr(updatedAttr);
                setAttributes(prev => prev.map(a => a.id === selectedAttr.id ? updatedAttr : a));
                showToast('মান সফলভাবে মুছে ফেলা হয়েছে।');
            }
        } catch (err) {
            alert('ত্রুটি: ' + err.message);
        }
    };

    // ==========================================
    // CATEGORY MAPPING HANDLERS
    // ==========================================
    const categoryMappedAttrIds = mappings
        .filter(m => m.category_id === selectedCatId)
        .map(m => m.attribute_id);

    const toggleAttributeMapping = (attrId) => {
        const isMapped = categoryMappedAttrIds.includes(attrId);
        let newIds;
        if (isMapped) {
            newIds = categoryMappedAttrIds.filter(id => id !== attrId);
        } else {
            newIds = [...categoryMappedAttrIds, attrId];
        }

        // Update local mappings state
        setMappings(prev => {
            const others = prev.filter(m => m.category_id !== selectedCatId);
            const updated = newIds.map(id => ({
                category_id: selectedCatId,
                attribute_id: id,
                attribute: attributes.find(a => a.id === id)
            }));
            return [...others, ...updated];
        });
    };

    const handleSaveMapping = async () => {
        setSavingMapping(true);
        try {
            const res = await fetch('/admin/category-attributes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category_id: selectedCatId,
                    attribute_ids: categoryMappedAttrIds
                })
            });
            const data = await res.json();
            if (data.success) {
                showToast('ক্যাটাগরি অ্যাট্রিবিউট ম্যাপিং সফলভাবে ডাটাবেসে সেভ হয়েছে!');
            }
        } catch (err) {
            alert('ম্যাপিং সংরক্ষণে ত্রুটি: ' + err.message);
        } finally {
            setSavingMapping(false);
        }
    };

    // ==========================================
    // VENDOR REQUEST HANDLERS
    // ==========================================
    const handleApproveRequest = async (reqId) => {
        try {
            const res = await fetch(`/admin/attribute-requests/${reqId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Approved' })
            });
            const data = await res.json();
            if (data.success) {
                setRequests(prev => prev.map(r => r.id === reqId ? data.request : r));
                showToast('অনুরোধটি অনুমোদন করা হয়েছে এবং নতুন মান স্বয়ংক্রিয়ভাবে তৈরি হয়েছে!');
                refreshData();
            }
        } catch (err) {
            alert('অনুমোদনে সমস্যা: ' + err.message);
        }
    };

    const handleRejectRequest = async (reqId) => {
        if (!rejectNote.trim()) {
            alert('অনুগ্রহ করে বাতিলের কারণ বা নোট উল্লেখ করুন।');
            return;
        }
        try {
            const res = await fetch(`/admin/attribute-requests/${reqId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Rejected', admin_note: rejectNote.trim() })
            });
            const data = await res.json();
            if (data.success) {
                setRequests(prev => prev.map(r => r.id === reqId ? data.request : r));
                setRejectingReqId(null);
                setRejectNote('');
                showToast('অনুরোধটি কারণসহ বাতিল করা হয়েছে।');
            }
        } catch (err) {
            alert('বাতিলকরণে সমস্যা: ' + err.message);
        }
    };

    const filteredUnits = selectedUnitGroup === 'all' 
        ? units 
        : units.filter(u => u.group === selectedUnitGroup);

    const filteredRequests = requestFilter === 'all' 
        ? requests 
        : requests.filter(r => r.status === requestFilter);

    const selectedCategoryObj = categories.find(c => c.id === selectedCatId) || categories[0];

    return (
        <div className="space-y-6">
            {/* Toast Banner */}
            {toastMessage && (
                <div className="flex items-center justify-between rounded-xl bg-forest-deep text-white px-5 py-3 shadow-lg transition-all animate-fade-in">
                    <span className="flex items-center gap-2 text-xs font-semibold">
                        <CheckCircle2 className="size-4 text-emerald-300" /> {toastMessage}
                    </span>
                    <button onClick={() => setToastMessage('')} className="text-white/80 hover:text-white">
                        <X className="size-4" />
                    </button>
                </div>
            )}

            {/* Studio Navigation Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                    <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2.5">
                        <Layers className="size-5 text-primary" />
                        Attribute ও Unit সেন্ট্রাল ম্যানেজমেন্ট হাব
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        ভেন্ডর নিজে Attribute বা Unit তৈরি করতে পারবে না। শুধুমাত্র অ্যাডমিন নিয়ন্ত্রণ ও ক্যাটাগরি ম্যাপিং করবে।
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={refreshData}
                        className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                        <RefreshCw className="size-3.5" />
                        <span>রিফ্রেশ</span>
                    </button>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="flex gap-2 border-b border-border pb-2 overflow-x-auto">
                <button
                    onClick={() => setActiveStudioTab('units')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeStudioTab === 'units'
                            ? 'bg-primary text-primary-foreground shadow-xs'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                    <Scale className="size-4" />
                    <span>১. Unit (একক) CRUD ({units.length})</span>
                </button>

                <button
                    onClick={() => setActiveStudioTab('attributes')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeStudioTab === 'attributes'
                            ? 'bg-primary text-primary-foreground shadow-xs'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                    <Palette className="size-4" />
                    <span>২. Attribute ও মানসমূহ ({attributes.length})</span>
                </button>

                <button
                    onClick={() => setActiveStudioTab('mapping')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeStudioTab === 'mapping'
                            ? 'bg-primary text-primary-foreground shadow-xs'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                    <Sliders className="size-4" />
                    <span>৩. ক্যাটাগরি ম্যাপিং স্ক্রিন</span>
                </button>

                <button
                    onClick={() => setActiveStudioTab('requests')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeStudioTab === 'requests'
                            ? 'bg-primary text-primary-foreground shadow-xs'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                    <Clock className="size-4" />
                    <span>৪. ভেন্ডরের অনুরোধ ({requests.filter(r => r.status === 'Pending').length} পেন্ডিং)</span>
                </button>
            </div>

            {/* ======================================================== */}
            {/* TAB 1: UNIT (একক) CRUD                                  */}
            {/* ======================================================== */}
            {activeStudioTab === 'units' && (
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Group Filter Pills */}
                        <div className="flex flex-wrap items-center gap-2">
                            {[
                                { key: 'all', label: 'সব ইউনিট', icon: Boxes },
                                { key: 'weight', label: 'ওজন (Weight)', icon: Scale },
                                { key: 'liquid', label: 'তরল (Liquid)', icon: Droplet },
                                { key: 'count', label: 'গণনা (Count)', icon: Boxes },
                                { key: 'length', label: 'দৈর্ঘ্য (Length)', icon: Ruler },
                            ].map(grp => (
                                <button
                                    key={grp.key}
                                    onClick={() => setSelectedUnitGroup(grp.key)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                        selectedUnitGroup === grp.key
                                            ? 'bg-secondary text-primary font-bold border border-primary/20'
                                            : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <grp.icon className="size-3.5" />
                                    <span>{grp.label}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                setEditingUnit(null);
                                setUnitForm({ name_en: '', name_bn: '', short_code: '', group: selectedUnitGroup === 'all' ? 'weight' : selectedUnitGroup });
                                setIsAddUnitOpen(true);
                            }}
                            className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-bold shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
                        >
                            <Plus className="size-4" />
                            <span>নতুন ইউনিট যোগ করুন</span>
                        </button>
                    </div>

                    {/* Unit Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {filteredUnits.map(unit => (
                            <div 
                                key={unit.id}
                                className="group relative rounded-2xl border border-border bg-card p-4 hover:border-primary/50 transition-all shadow-xs flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between pb-2 border-b border-border/50">
                                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                            {unit.group === 'weight' && 'ওজন'}
                                            {unit.group === 'liquid' && 'তরল'}
                                            {unit.group === 'count' && 'গণনা'}
                                            {unit.group === 'length' && 'দৈর্ঘ্য'}
                                        </span>
                                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-secondary text-primary border border-primary/20">
                                            {unit.short_code}
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <h4 className="font-display font-bold text-foreground text-sm">{unit.name_bn}</h4>
                                        <p className="text-xs text-muted-foreground">{unit.name_en}</p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100">
                                    <button
                                        onClick={() => {
                                            setEditingUnit(unit);
                                            setUnitForm({
                                                name_en: unit.name_en,
                                                name_bn: unit.name_bn,
                                                short_code: unit.short_code,
                                                group: unit.group
                                            });
                                            setIsAddUnitOpen(true);
                                        }}
                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary cursor-pointer"
                                        title="এডিট"
                                    >
                                        <Edit2 className="size-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUnit(unit.id)}
                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                                        title="মুছে ফেলুন"
                                    >
                                        <Trash2 className="size-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add/Edit Unit Modal */}
                    {isAddUnitOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
                                <div className="flex items-center justify-between pb-4 border-b border-border">
                                    <h3 className="font-display font-bold text-base text-foreground">
                                        {editingUnit ? 'ইউনিট সম্পাদনা করুন' : 'নতুন ইউনিট যোগ করুন'}
                                    </h3>
                                    <button onClick={() => setIsAddUnitOpen(false)} className="text-muted-foreground hover:text-foreground">
                                        <X className="size-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSaveUnit} className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-muted-foreground mb-1">গ্রুপ (Group)</label>
                                        <select
                                            value={unitForm.group}
                                            onChange={e => setUnitForm({ ...unitForm, group: e.target.value })}
                                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground"
                                        >
                                            <option value="weight">ওজন (গ্রাম, কেজি)</option>
                                            <option value="liquid">তরল (মিলি, লিটার)</option>
                                            <option value="count">গণনা (পিস, ডজন, হালি, জোড়া, সেট, ইত্যাদি)</option>
                                            <option value="length">দৈর্ঘ্য (ইঞ্চি, ফুট, মিটার, গজ)</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-muted-foreground mb-1">নাম (বাংলা)</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="উদা: গ্রাম, কেজি, হালি"
                                                value={unitForm.name_bn}
                                                onChange={e => setUnitForm({ ...unitForm, name_bn: e.target.value })}
                                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-muted-foreground mb-1">Name (English)</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Gram, Kg, Piece"
                                                value={unitForm.name_en}
                                                onChange={e => setUnitForm({ ...unitForm, name_en: e.target.value })}
                                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-muted-foreground mb-1">শর্ট কোড (Short Code)</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. g, kg, ml, L, pc, hali"
                                            value={unitForm.short_code}
                                            onChange={e => setUnitForm({ ...unitForm, short_code: e.target.value })}
                                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground"
                                        />
                                    </div>

                                    <div className="pt-3 border-t border-border flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddUnitOpen(false)}
                                            className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                                        >
                                            বাতিল
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90"
                                        >
                                            {editingUnit ? 'আপডেট করুন' : 'যোগ করুন'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: ATTRIBUTE ও মানসমূহ (Size, Color, Material, etc.)  */}
            {/* ======================================================== */}
            {activeStudioTab === 'attributes' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Attributes Master List */}
                    <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-border">
                            <h3 className="font-display font-bold text-sm text-foreground">
                                Attribute তালিকা ({attributes.length})
                            </h3>
                            <button
                                onClick={() => setIsAddAttrOpen(true)}
                                className="flex items-center gap-1 rounded-lg bg-primary text-primary-foreground px-2.5 py-1 text-xs font-bold hover:bg-primary/90 cursor-pointer"
                            >
                                <Plus className="size-3.5" />
                                <span>নতুন</span>
                            </button>
                        </div>

                        <div className="space-y-2">
                            {attributes.map(attr => (
                                <button
                                    key={attr.id}
                                    onClick={() => setSelectedAttr(attr)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                                        selectedAttr?.id === attr.id
                                            ? 'bg-secondary border border-primary/30 text-primary font-bold shadow-xs'
                                            : 'border border-border/50 hover:bg-muted text-foreground'
                                    }`}
                                >
                                    <div>
                                        <p className="text-xs font-bold">{attr.name_bn}</p>
                                        <p className="text-[11px] text-muted-foreground">{attr.name_en} ({attr.code})</p>
                                    </div>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted font-bold text-muted-foreground">
                                        {attr.values?.length || 0} মান
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Selected Attribute Values Management */}
                    <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-6">
                        {selectedAttr ? (
                            <>
                                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                {selectedAttr.type}
                                            </span>
                                            <h3 className="font-display font-bold text-lg text-foreground">
                                                {selectedAttr.name_bn}
                                            </h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Code: <span className="font-mono">{selectedAttr.code}</span> — {selectedAttr.name_en}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setIsAddValueOpen(true)}
                                        className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-bold shadow-xs hover:bg-primary/90 cursor-pointer"
                                    >
                                        <Plus className="size-4" />
                                        <span>নতুন মান যোগ করুন</span>
                                    </button>
                                </div>

                                {/* Values Grid */}
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground mb-3">
                                        বিদ্যমান মানসমূহ ({selectedAttr.values?.length || 0})
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {selectedAttr.values?.map(val => (
                                            <div
                                                key={val.id}
                                                className="group relative flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:border-primary/40 transition-all shadow-xs"
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    {val.hex_color && (
                                                        <span 
                                                            className="size-5 rounded-full border border-black/20 shrink-0 shadow-2xs"
                                                            style={{ backgroundColor: val.hex_color }}
                                                            title={val.hex_color}
                                                        />
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-foreground truncate">{val.name_bn}</p>
                                                        <p className="text-[10px] text-muted-foreground truncate">{val.name_en}</p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleDeleteValue(val.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-red-500 rounded-md transition-all cursor-pointer"
                                                    title="মুছুন"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <Palette className="size-8 mx-auto mb-2 opacity-50" />
                                <p className="text-xs font-semibold">বাম পাশ থেকে একটি Attribute নির্বাচন করুন</p>
                            </div>
                        )}
                    </div>

                    {/* Add Attribute Modal */}
                    {isAddAttrOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
                                <div className="flex items-center justify-between pb-4 border-b border-border">
                                    <h3 className="font-display font-bold text-base text-foreground">নতুন Attribute যোগ করুন</h3>
                                    <button onClick={() => setIsAddAttrOpen(false)} className="text-muted-foreground hover:text-foreground">
                                        <X className="size-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSaveAttribute} className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-muted-foreground mb-1">নাম (বাংলা)</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="উদা: উপাদান / ম্যাটেরিয়াল, সাইজ"
                                            value={attrForm.name_bn}
                                            onChange={e => setAttrForm({ ...attrForm, name_bn: e.target.value })}
                                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Name (English)</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Material, Shoe Size"
                                            value={attrForm.name_en}
                                            onChange={e => setAttrForm({ ...attrForm, name_en: e.target.value })}
                                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-muted-foreground mb-1">ইউনিক কোড (Code)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. material, shoe_size (ফাঁকা রাখলে অটো হবে)"
                                            value={attrForm.code}
                                            onChange={e => setAttrForm({ ...attrForm, code: e.target.value })}
                                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-muted-foreground mb-1">প্রদর্শন ধরন (UI Type)</label>
                                        <select
                                            value={attrForm.type}
                                            onChange={e => setAttrForm({ ...attrForm, type: e.target.value })}
                                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground"
                                        >
                                            <option value="button_group">বাটন গ্রুপ (S, M, L, XL, Free Size)</option>
                                            <option value="color_swatch">কালার সোয়াচ (রঙিন বৃত্তাকার সার্কেল)</option>
                                            <option value="select">ড্রপডাউন সিলেক্ট (উপাদান, প্যাক টাইপ)</option>
                                            <option value="text">টেক্সট ইনপুট</option>
                                        </select>
                                    </div>

                                    <div className="pt-3 border-t border-border flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddAttrOpen(false)}
                                            className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                                        >
                                            বাতিল
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90"
                                        >
                                            তৈরি করুন
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Add Value Modal */}
                    {isAddValueOpen && selectedAttr && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
                                <div className="flex items-center justify-between pb-4 border-b border-border">
                                    <h3 className="font-display font-bold text-base text-foreground">
                                        "{selectedAttr.name_bn}"-এ নতুন মান যোগ করুন
                                    </h3>
                                    <button onClick={() => setIsAddValueOpen(false)} className="text-muted-foreground hover:text-foreground">
                                        <X className="size-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSaveValue} className="mt-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-muted-foreground mb-1">মান (বাংলা)</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="উদা: লাল, ১ কেজি, বাঁশ"
                                                value={valueForm.name_bn}
                                                onChange={e => setValueForm({ ...valueForm, name_bn: e.target.value })}
                                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-muted-foreground mb-1">Value (English)</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Red, 1kg, Bamboo"
                                                value={valueForm.name_en}
                                                onChange={e => setValueForm({ ...valueForm, name_en: e.target.value })}
                                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground"
                                            />
                                        </div>
                                    </div>

                                    {selectedAttr.type === 'color_swatch' && (
                                        <div>
                                            <label className="block text-xs font-semibold text-muted-foreground mb-1">কালার হেক্স কোড (Hex Color)</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={valueForm.hex_color || '#C85A32'}
                                                    onChange={e => setValueForm({ ...valueForm, hex_color: e.target.value })}
                                                    className="size-10 rounded-lg border border-border cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={valueForm.hex_color || '#C85A32'}
                                                    onChange={e => setValueForm({ ...valueForm, hex_color: e.target.value })}
                                                    className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono font-bold text-foreground"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-border flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddValueOpen(false)}
                                            className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                                        >
                                            বাতিল
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90"
                                        >
                                            যোগ করুন
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: CATEGORY ATTRIBUTE MAPPING                       */}
            {/* ======================================================== */}
            {activeStudioTab === 'mapping' && (
                <div className="space-y-6">
                    <div className="rounded-2xl border border-primary/20 bg-secondary/30 p-4 text-xs font-medium text-foreground flex items-center justify-between">
                        <div>
                            <span className="font-bold text-primary">নোট:</span> অ্যাডমিন ঠিক করবে কোন ক্যাটাগরিতে কোন Attribute প্রযোজ্য হবে। ভেন্ডর যখন সেই ক্যাটাগরি বাছাই করবে, তখন শুধু ম্যাপ করা Attribute গুলো ভ্যারিয়েশনে দৃশ্যমান হবে। সাব-ক্যাটাগরি স্বয়ংক্রিয়ভাবে মূল ক্যাটাগরির সেটিং পাবে।
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Category Selector List */}
                        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                            <p className="text-xs font-bold text-muted-foreground pb-2 border-b border-border">
                                ক্যাটাগরি নির্বাচন করুন
                            </p>
                            <div className="space-y-1">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCatId(cat.id)}
                                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                                            selectedCatId === cat.id
                                                ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                                                : 'text-foreground hover:bg-muted'
                                        }`}
                                    >
                                        <span>{cat.name}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                            selectedCatId === cat.id ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                                        }`}>
                                            {mappings.filter(m => m.category_id === cat.id).length}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mapped Attributes Checkboxes */}
                        <div className="md:col-span-3 rounded-2xl border border-border bg-card p-6 space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
                                <div>
                                    <h3 className="font-display font-bold text-base text-foreground">
                                        "{selectedCategoryObj?.name}"-এর জন্য প্রযোজ্য Attribute নির্ধারণ
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        যে যে Attribute এই ক্যাটাগরির পণ্যের জন্য প্রযোজ্য, সেগুলোতে টিক দিন।
                                    </p>
                                </div>

                                <button
                                    onClick={handleSaveMapping}
                                    disabled={savingMapping}
                                    className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2 text-xs font-bold shadow-xs hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                                >
                                    <Check className="size-4" />
                                    <span>{savingMapping ? 'সংরক্ষণ হচ্ছে...' : 'ম্যাপিং সংরক্ষণ করুন'}</span>
                                </button>
                            </div>

                            {/* Attributes Checkbox Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {attributes.map(attr => {
                                    const isChecked = categoryMappedAttrIds.includes(attr.id);
                                    return (
                                        <div
                                            key={attr.id}
                                            onClick={() => toggleAttributeMapping(attr.id)}
                                            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                                                isChecked
                                                    ? 'border-primary bg-secondary/30 shadow-xs'
                                                    : 'border-border bg-background hover:bg-muted/50'
                                            }`}
                                        >
                                            <div className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                                                isChecked
                                                    ? 'border-primary bg-primary text-white'
                                                    : 'border-muted-foreground/30 bg-card'
                                            }`}>
                                                {isChecked && <Check className="size-3.5 stroke-[3]" />}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold text-foreground">{attr.name_bn}</p>
                                                <p className="text-[11px] text-muted-foreground">{attr.name_en}</p>
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {attr.values?.slice(0, 3).map(v => (
                                                        <span key={v.id} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                                            {v.name_bn}
                                                        </span>
                                                    ))}
                                                    {(attr.values?.length || 0) > 3 && (
                                                        <span className="text-[10px] text-muted-foreground">
                                                            +{attr.values.length - 3} আরও
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* TAB 4: VENDOR ATTRIBUTE REQUESTS                         */}
            {/* ======================================================== */}
            {activeStudioTab === 'requests' && (
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Request Filter Tabs */}
                        <div className="flex items-center gap-2">
                            {[
                                { key: 'all', label: `সব অনুরোধ (${requests.length})` },
                                { key: 'Pending', label: `অপেক্ষারত (${requests.filter(r => r.status === 'Pending').length})` },
                                { key: 'Approved', label: `অনুমোদিত (${requests.filter(r => r.status === 'Approved').length})` },
                                { key: 'Rejected', label: `বাতিলকৃত (${requests.filter(r => r.status === 'Rejected').length})` },
                            ].map(flt => (
                                <button
                                    key={flt.key}
                                    onClick={() => setRequestFilter(flt.key)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                        requestFilter === flt.key
                                            ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                                            : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {flt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Requests List */}
                    <div className="space-y-3">
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map(req => (
                                <div
                                    key={req.id}
                                    className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    <div className="space-y-1.5 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                                req.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' :
                                                req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' :
                                                'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                                            }`}>
                                                {req.status === 'Pending' ? 'অপেক্ষারত' : req.status === 'Approved' ? 'অনুমোদিত' : 'বাতিল'}
                                            </span>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                                ধরন: {req.request_type === 'attribute' ? 'নতুন Attribute' : req.request_type === 'value' ? 'নতুন মান (Value)' : 'নতুন Unit'}
                                            </span>
                                            <span className="text-xs text-muted-foreground">• ভেন্ডর: <strong className="text-foreground">{req.vendor_name}</strong></span>
                                        </div>

                                        <h4 className="font-display font-bold text-sm text-foreground">
                                            {req.name_bn} <span className="text-xs font-normal text-muted-foreground">({req.name_en})</span>
                                        </h4>

                                        {req.details && (
                                            <p className="text-xs text-muted-foreground bg-muted/50 p-2.5 rounded-xl border border-border/50">
                                                "{req.details}"
                                            </p>
                                        )}

                                        {req.admin_note && (
                                            <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                                                অ্যাডমিন নোট: {req.admin_note}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Buttons for Pending Requests */}
                                    {req.status === 'Pending' && (
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => handleApproveRequest(req.id)}
                                                className="flex items-center gap-1.5 rounded-xl bg-forest-deep text-white px-4 py-2 text-xs font-bold hover:bg-forest-deep/90 shadow-xs cursor-pointer"
                                            >
                                                <Check className="size-4 text-emerald-300" />
                                                <span>অনুমোদন করুন</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setRejectingReqId(req.id);
                                                    setRejectNote('');
                                                }}
                                                className="flex items-center gap-1.5 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 px-3.5 py-2 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                                            >
                                                <X className="size-4" />
                                                <span>বাতিল</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 rounded-2xl border border-dashed border-border bg-card text-muted-foreground">
                                <Clock className="size-8 mx-auto mb-2 opacity-50" />
                                <p className="text-xs font-semibold">কোনো অনুরোধ পাওয়া যায়নি।</p>
                            </div>
                        )}
                    </div>

                    {/* Reject Reason Modal */}
                    {rejectingReqId && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
                                <h3 className="font-display font-bold text-base text-foreground mb-2">
                                    অনুরোধ বাতিলের কারণ উল্লেখ করুন
                                </h3>
                                <p className="text-xs text-muted-foreground mb-4">
                                    ভেন্ডর তার ড্যাশবোর্ডে এই নোটটি দেখতে পাবে যাতে সে প্রয়োজনীয় সংশোধনী আনতে পারে।
                                </p>
                                <textarea
                                    rows={3}
                                    placeholder="উদা: এই মানটি ইতিমধ্যে সিস্টেমে বিদ্যমান রয়েছে অথবা নামের বানান সঠিক নয়।"
                                    value={rejectNote}
                                    onChange={e => setRejectNote(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-background p-3 text-xs font-medium text-foreground"
                                />
                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => setRejectingReqId(null)}
                                        className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                                    >
                                        বাতিল
                                    </button>
                                    <button
                                        onClick={() => handleRejectRequest(rejectingReqId)}
                                        className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-xs"
                                    >
                                        বাতিলকরণ নিশ্চিত করুন
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
