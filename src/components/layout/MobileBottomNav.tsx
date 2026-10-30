import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, TrendingUp, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const MobileBottomNav: React.FC = () => {
  const { totalItemsCount } = useCart();
  const { totalWishlistCount } = useWishlist();

  const links = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/shop', icon: Compass },
    { name: 'Rates', path: '/gold-rates', icon: TrendingUp },
    { name: 'Wishlist', path: '/wishlist', icon: Heart, count: totalWishlistCount },
    { name: 'Cart', path: '/cart', icon: ShoppingBag, count: totalItemsCount },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 border-t border-stone-800 backdrop-blur-md pb-safe">
      <div className="grid grid-cols-5 h-14">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center text-[10px] font-medium transition-colors ${
                  isActive ? 'text-amber-400' : 'text-stone-400 hover:text-stone-200'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-3.5 h-3.5 rounded-full bg-amber-500 text-stone-950 text-[9px] font-bold flex items-center justify-center tabular-nums">
                    {item.count}
                  </span>
                )}
              </div>
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
