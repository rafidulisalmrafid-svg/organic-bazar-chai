import React from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function CartDrawer() {
    const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
    const { isBn, formatCurrency, formatNumber, t } = useLanguage();

    if (!isCartOpen) return null;

    const freeShippingThreshold = 3000;
    const progress = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
    const amountLeft = Math.max(0, freeShippingThreshold - cartTotal);

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Slide-over panel */}
            <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-card shadow-2xl animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border p-4 sm:p-5">
                    <div className="flex items-center gap-2.5">
                        <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <ShoppingBag className="size-5" />
                        </span>
                        <div>
                            <h2 className="font-display text-base sm:text-lg font-semibold">{t('cartTitle')}</h2>
                            <p className="text-xs text-muted-foreground">
                                {formatNumber(cartCount)} {isBn ? 'টি পণ্য কার্টে আছে' : 'items in cart'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsCartOpen(false)}
                        className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                        aria-label="Close cart"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Free shipping progress */}
                <div className="border-b border-border bg-secondary/40 p-4">
                    <div className="flex justify-between text-xs font-semibold">
                        {amountLeft === 0 ? (
                            <span className="text-primary font-bold">🎉 {t('freeDeliveryUnlocked')}</span>
                        ) : (
                            <span className="text-muted-foreground">
                                {isBn ? (
                                    <>আর মাত্র <span className="font-bold text-foreground">{formatCurrency(amountLeft)}</span> টাকার পণ্য যোগ করলেই ফ্রি ডেলিভারি!</>
                                ) : (
                                    <>Add <span className="font-bold text-foreground">{formatCurrency(amountLeft)}</span> more for Free Delivery</>
                                )}
                            </span>
                        )}
                        <span className="text-muted-foreground font-medium">{formatNumber(Math.round(progress))}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div 
                            className="h-full bg-primary transition-all duration-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                    {cart.length === 0 ? (
                        <div className="py-16 text-center">
                            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <ShoppingBag className="size-8" />
                            </div>
                            <h3 className="mt-4 font-display text-lg font-semibold">{t('emptyCart')}</h3>
                            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto">
                                {t('emptyCartSub')}
                            </p>
                            <Link
                                href="/shop"
                                onClick={() => setIsCartOpen(false)}
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-forest-deep transition-colors shadow-xs"
                            >
                                {t('startShopping')} <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.cartKey || `${item.id}-${item.color}-${item.size}`} className="flex gap-3 sm:gap-4 border-b border-border/60 pb-4 last:border-0">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="size-16 sm:size-20 rounded-xl object-cover border border-border shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[11px] font-medium text-muted-foreground uppercase truncate">{item.vendor}</p>
                                            <h4 className="font-display text-sm sm:text-base font-semibold text-foreground truncate">{item.name}</h4>
                                            {(item.variationText || item.color || item.size) && (
                                                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                                                    {item.variationText ? item.variationText : `${item.color} · ${item.size}`}
                                                </p>
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.cartKey || item.id)}
                                            className="text-muted-foreground hover:text-accent transition-colors cursor-pointer p-1"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex items-center rounded-full border border-border bg-card">
                                            <button 
                                                onClick={() => updateQuantity(item.cartKey || item.id, -1)}
                                                className="p-1 hover:text-primary transition-colors cursor-pointer"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus className="size-3.5" />
                                            </button>
                                            <span className="w-8 text-center text-xs font-semibold">{formatNumber(item.quantity)}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.cartKey || item.id, 1)}
                                                className="p-1 hover:text-primary transition-colors cursor-pointer"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus className="size-3.5" />
                                            </button>
                                        </div>
                                        <span className="font-display font-bold text-foreground text-sm sm:text-base">
                                            {formatCurrency(item.price * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Summary */}
                {cart.length > 0 && (
                    <div className="border-t border-border bg-card p-4 sm:p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                            <span>{t('subtotal')}</span>
                            <span className="font-semibold text-foreground">{formatCurrency(cartTotal)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                            <span>{t('deliveryFee')}</span>
                            <span>{cartTotal >= freeShippingThreshold ? <span className="font-semibold text-primary">{isBn ? 'ফ্রি' : 'Free'}</span> : formatCurrency(120)}</span>
                        </div>
                        <div className="border-t border-border pt-3 flex items-center justify-between">
                            <span className="font-display text-base font-bold">{t('total')}</span>
                            <span className="font-display text-lg sm:text-xl font-bold text-primary">
                                {formatCurrency(cartTotal + (cartTotal >= freeShippingThreshold ? 0 : 120))}
                            </span>
                        </div>

                        <Link 
                            href="/checkout"
                            onClick={() => setIsCartOpen(false)}
                            className="w-full flex items-center justify-center gap-2 rounded-full bg-accent py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-accent-foreground hover:bg-terracotta-deep transition-colors shadow-sm"
                        >
                            {t('proceedCheckout')} <ArrowRight className="size-4" />
                        </Link>
                        <p className="text-center text-[10px] sm:text-[11px] text-muted-foreground">
                            🔒 {isBn ? 'সারা বাংলাদেশে ১০০% খাঁটি অর্গানিক পণ্যের নিরাপদ ডেলিভারি' : '100% Guaranteed Safe & Authentic Organic Delivery across Bangladesh'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
