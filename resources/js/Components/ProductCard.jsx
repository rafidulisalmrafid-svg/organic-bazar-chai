import React from 'react';
import { Link } from '@inertiajs/react';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProductCard({ product }) {
    const { addToCart, toggleWishlist, isWishlisted } = useCart();
    const { formatCurrency, formatNumber, t } = useLanguage();
    const wishlisted = isWishlisted(product.id);

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] flex flex-col justify-between">
            {/* Image link & container */}
            <div className="relative aspect-square overflow-hidden bg-secondary">
                <Link href={`/product/${product.id}`} className="block size-full">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        loading="lazy" 
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>

                {/* Badge if present */}
                {product.badge && (
                    <span className="absolute top-3 left-3 rounded-full bg-forest-deep px-3 py-1 text-[11px] font-semibold tracking-wide text-primary-foreground uppercase shadow-xs pointer-events-none">
                        {product.badge}
                    </span>
                )}

                {/* Wishlist toggle */}
                <button 
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product.id);
                    }}
                    aria-label="Add to wishlist" 
                    className={`absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-card/90 shadow-sm transition-all ${
                        wishlisted 
                            ? 'text-accent opacity-100' 
                            : 'text-foreground opacity-0 group-hover:opacity-100 hover:text-accent'
                    }`}
                >
                    <Heart className={`size-4 ${wishlisted ? 'fill-accent' : ''}`} />
                </button>
            </div>

            {/* Info Section */}
            <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {product.vendor} · {product.location}
                    </p>
                    <Link href={`/product/${product.id}`}>
                        <h3 className="mt-1 font-display text-lg leading-snug font-semibold text-foreground transition-colors group-hover:text-primary">
                            {product.name}
                        </h3>
                    </Link>
                    <div className="mt-1.5 flex items-center gap-1 text-sm">
                        <Star className="size-3.5 fill-accent text-accent" />
                        <span className="font-medium text-foreground">{formatNumber(product.rating)}</span>
                        <span className="text-muted-foreground">({formatNumber(product.reviews)})</span>
                    </div>
                </div>

                {/* Price and Add to Cart */}
                <div className="mt-4 flex items-center justify-between pt-1">
                    <div className="flex items-baseline gap-2">
                        <span className="font-display text-lg font-bold text-foreground">
                            {formatCurrency(product.price)}
                        </span>
                        {product.oldPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                                {formatCurrency(product.oldPrice)}
                            </span>
                        )}
                    </div>
                    <button 
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(product, 1);
                        }}
                        aria-label="Add to cart" 
                        className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-forest-deep shadow-xs cursor-pointer active:scale-95"
                    >
                        <ShoppingBag className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
