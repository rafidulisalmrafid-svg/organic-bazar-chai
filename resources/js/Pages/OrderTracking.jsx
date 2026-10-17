import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import CartDrawer from '../Components/CartDrawer';
import { CartProvider } from '../context/CartContext';
import { 
    Search, 
    CheckCircle2, 
    Clock, 
    Truck, 
    Package, 
    MapPin, 
    Phone, 
    Calendar,
    ArrowRight
} from 'lucide-react';

function OrderTrackingContent({ selectedOrder, recentOrders }) {
    const [searchId, setSearchId] = useState('');
    const [currentOrder, setCurrentOrder] = useState(selectedOrder);

    const handleSearch = (e) => {
        e.preventDefault();
        const found = recentOrders.find(o => o.id.toLowerCase() === searchId.trim().toLowerCase());
        if (found) {
            setCurrentOrder(found);
        } else {
            alert('এই আইডি দিয়ে কোনো অর্ডার পাওয়া যায়নি। অনুগ্রহ করে সঠিক আইডি লিখুন (যেমন: #PH-2481)');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Banner */}
            <div className="border-b border-border bg-secondary/50">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                        Live Tracking
                    </p>
                    <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        পাহাড়ি অর্ডার লাইভ ট্র্যাকিং (Order Tracking)
                    </h1>
                    <p className="mt-2 text-xs text-muted-foreground max-w-xl">
                        পাহাড় থেকে আপনার ঘরে পণ্য পৌঁছানোর প্রতিটি ধাপ রিয়েলটাইমে পর্যবেক্ষণ করুন।
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex gap-2 p-2 rounded-2xl border border-border bg-card shadow-sm">
                    <input 
                        type="text"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="আপনার অর্ডার আইডি লিখুন (যেমন: #PH-2481, #PH-2480)"
                        className="flex-1 px-4 py-2.5 text-xs outline-none bg-transparent"
                    />
                    <button 
                        type="submit" 
                        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-forest-deep flex items-center gap-1.5 cursor-pointer"
                    >
                        <Search className="size-4" /> ট্র্যাক করুন
                    </button>
                </form>

                {/* Tracking Details Card */}
                {currentOrder && (
                    <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-8">
                        {/* Status Header */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
                            <div>
                                <span className="text-xs text-muted-foreground uppercase font-semibold">অর্ডার রেফারেন্স:</span>
                                <h2 className="font-display text-2xl font-bold text-foreground font-mono">{currentOrder.id}</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">অর্ডার তারিখ: {currentOrder.date}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-muted-foreground uppercase font-semibold">বর্তমান স্ট্যাটাস:</span>
                                <p className="mt-1">
                                    <span className="rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-bold">
                                        {currentOrder.status}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Interactive Timeline */}
                        <div className="space-y-6">
                            <h3 className="font-display text-base font-bold text-foreground">
                                শিপমেন্ট অগ্রগতি টাইমলাইন (Shipment Journey)
                            </h3>

                            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
                                {(currentOrder.timeline || []).map((step, idx) => (
                                    <div key={idx} className="relative flex items-start gap-4">
                                        <span className={`absolute -left-6 sm:-left-8 flex size-6 sm:size-7 items-center justify-center rounded-full text-xs font-bold ${
                                            step.done ? 'bg-primary text-white shadow-xs' : 'bg-muted border border-border text-muted-foreground'
                                        }`}>
                                            {step.done ? <CheckCircle2 className="size-4" /> : idx + 1}
                                        </span>
                                        <div>
                                            <p className={`text-sm font-semibold ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {step.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {step.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Specifics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 border-t border-border">
                            <div className="rounded-2xl border border-border bg-secondary/30 p-5 space-y-2 text-xs">
                                <p className="font-bold text-sm text-foreground flex items-center gap-1.5">
                                    <Package className="size-4 text-primary" /> অর্ডারের পণ্য বিবরণ
                                </p>
                                <p className="font-semibold text-foreground">{currentOrder.product}</p>
                                <p className="text-muted-foreground">পরিমাণ: {currentOrder.quantity || 1} পিস · মূল্য: {currentOrder.total}</p>
                                <p className="text-muted-foreground">পেমেন্ট মেথড: {currentOrder.payment}</p>
                            </div>

                            <div className="rounded-2xl border border-border bg-secondary/30 p-5 space-y-2 text-xs">
                                <p className="font-bold text-sm text-foreground flex items-center gap-1.5">
                                    <MapPin className="size-4 text-accent" /> ডেলিভারি গন্তব্য
                                </p>
                                <p className="font-semibold text-foreground">{currentOrder.customer}</p>
                                <p className="text-muted-foreground">{currentOrder.address}, {currentOrder.district}</p>
                                <p className="text-muted-foreground">ফোন: {currentOrder.phone}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick select other orders */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
                    <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        অন্যান্য সাম্প্রতিক পাহাড়ি অর্ডার ট্র্যাক করুন:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {recentOrders.map(ord => (
                            <button
                                key={ord.id}
                                onClick={() => setCurrentOrder(ord)}
                                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                    currentOrder.id === ord.id ? 'border-primary bg-primary text-white' : 'border-border hover:border-primary'
                                }`}
                            >
                                {ord.id} ({ord.customer})
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
            <CartDrawer />
        </div>
    );
}

export default function OrderTracking(props) {
    return (
        <CartProvider>
            <Head>
                <title>অর্ডার ট্র্যাকিং — অর্গানিক বাজার চাই</title>
            </Head>
            <OrderTrackingContent {...props} />
        </CartProvider>
    );
}
