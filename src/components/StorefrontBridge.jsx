import React, { useState } from 'react';
import { useCommission } from '../context/SpendCapContext';
import { ShoppingBag, Star, Package, Zap } from 'lucide-react';

const ProductCard = ({ product, onBuy, loading }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-indigo-500 transition-colors group flex flex-col justify-between">
        <div>
            <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                {product.icon}
            </div>
            <h4 className="font-semibold text-white mb-1">{product.name}</h4>
            <p className="text-xs text-gray-400 mb-3">{product.description}</p>
        </div>

        <div className="flex items-center justify-between mt-auto">
            <span className="text-lg font-bold text-white">\${product.price}</span>
            <button
                onClick={() => onBuy(product)}
                disabled={loading}
                className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? '...' : 'קנה עכשיו'}
            </button>
        </div>
    </div>
);

const StorefrontBridge = () => {
    const { addSpend } = useCommission();
    const [loadingId, setLoadingId] = useState(null);

    const products = [
        {
            id: 1,
            name: 'ערכת התחלה',
            price: 100,
            description: 'מגדיל את התקרה ב-$100',
            icon: <Package size={24} />
        },
        {
            id: 2,
            name: 'מארז VIP',
            price: 250,
            description: 'שחרור דרגות גבוהות באופן מיידי',
            icon: <Star size={24} />
        },
        {
            id: 3,
            name: 'מילוי כוח',
            price: 50,
            description: 'בוסט מהיר של $50',
            icon: <Zap size={24} />
        },
    ];

    const handleBuy = (product) => {
        setLoadingId(product.id);
        // Simulate API call
        setTimeout(() => {
            addSpend(product.price);
            setLoadingId(null);
        }, 600);
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <ShoppingBag className="text-indigo-500" />
                    גשר החנות
                </h3>
                <span className="text-xs text-indigo-400 font-medium px-2 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                    הגדל את התקרה שלך
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onBuy={handleBuy}
                        loading={loadingId === product.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default StorefrontBridge;
