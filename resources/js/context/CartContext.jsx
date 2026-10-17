import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const initialCart = [
    {
        id: 'chakma-shawl',
        name: 'Chakma Heritage Shawl',
        price: 2450,
        image: '/images/prod-shawl.jpg',
        vendor: 'Rangamati Weaves',
        quantity: 1,
        color: 'Forest',
        size: 'Standard',
    },
    {
        id: 'wild-honey',
        name: 'Wild Forest Honey',
        price: 890,
        image: '/images/prod-honey.jpg',
        vendor: 'Khagrachari Organics',
        quantity: 2,
        color: 'Natural',
        size: 'Standard',
    },
];

const initialWishlist = [
    'chakma-shawl',
    'bamboo-tote',
];

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('paharika_cart');
            return saved ? JSON.parse(saved) : initialCart;
        } catch {
            return initialCart;
        }
    });

    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem('paharika_wishlist');
            return saved ? JSON.parse(saved) : initialWishlist;
        } catch {
            return initialWishlist;
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem('paharika_cart', JSON.stringify(cart));
        } catch {}
    }, [cart]);

    useEffect(() => {
        try {
            localStorage.setItem('paharika_wishlist', JSON.stringify(wishlist));
        } catch {}
    }, [wishlist]);

    const addToCart = (product, quantity = 1, color = 'Forest', size = 'Standard', variation = null) => {
        setCart(prev => {
            const itemKey = variation ? `${product.id}-${variation.id}` : `${product.id}-${color}-${size}`;
            const existingIndex = prev.findIndex(item => (item.cartKey ? item.cartKey === itemKey : (item.id === product.id && item.color === color && item.size === size)));
            const itemPrice = variation ? (variation.sale_price || variation.price) : product.price;
            const itemImage = (variation && variation.image_url) ? variation.image_url : product.image;
            const itemSku = (variation && variation.sku) ? variation.sku : product.sku;

            if (existingIndex > -1) {
                const next = [...prev];
                next[existingIndex].quantity += quantity;
                return next;
            }
            return [...prev, {
                cartKey: itemKey,
                id: product.id,
                variationId: variation?.id || null,
                name: product.name,
                price: itemPrice,
                image: itemImage,
                vendor: product.vendor,
                quantity,
                color,
                size,
                sku: itemSku,
                variationText: variation?.attributes ? Object.values(variation.attributes).map(a => a.name_bn || a.name_en).join(' / ') : null,
            }];
        });
        setIsCartOpen(true);
    };

    const updateQuantity = (keyOrId, delta) => {
        setCart(prev => prev.map(item => {
            if ((item.cartKey && item.cartKey === keyOrId) || item.id === keyOrId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
        }).filter(Boolean));
    };

    const removeFromCart = (keyOrId) => {
        setCart(prev => prev.filter(item => (item.cartKey ? item.cartKey !== keyOrId : item.id !== keyOrId)));
    };

    const toggleWishlist = (productId) => {
        setWishlist(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const isWishlisted = (productId) => wishlist.includes(productId);

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            cartCount,
            cartTotal,
            isCartOpen,
            setIsCartOpen,
            wishlist,
            toggleWishlist,
            isWishlisted,
            isWishlistOpen,
            setIsWishlistOpen,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
