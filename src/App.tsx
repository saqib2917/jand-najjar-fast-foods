import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Phone, 
  MapPin, 
  Clock, 
  Menu as MenuIcon, 
  X, 
  Moon, 
  Sun, 
  MessageCircle,
  ChevronRight,
  Star,
  Zap,
  CheckCircle,
  Flame,
  Rocket,
  Search,
  LogIn,
  LogOut,
  History,
  Send
} from 'lucide-react';
import { menuItems, MenuItem, Category } from './data/menu';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  handleFirestoreError,
  OperationType,
  Timestamp
} from './firebase';

// --- Types ---

interface CartItem extends MenuItem {
  quantity: number;
  selectedSize?: 'S' | 'M' | 'L';
}

interface Review {
  id: string;
  itemId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: string;
  createdAt: any;
}

const Logo = ({ isScrolled = false, isFooter = false }: { isScrolled?: boolean; isFooter?: boolean }) => {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.a 
      href="#" 
      onClick={scrollToTop}
      className="flex items-center gap-2 group cursor-pointer"
      whileHover="hover"
      title="Jand Najjar Fast Food - Home"
    >
      <motion.div 
        className="relative"
        variants={{
          hover: { scale: 1.1, rotate: 5 }
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[#e53935] rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden border-2 border-[#ffcc00]">
          <img 
            src="/src/logo.svg" 
            alt="Jandnajjar Logo" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-[#ffcc00] rounded-full border-2 border-white dark:border-[#111] animate-pulse"></div>
      </motion.div>
      <div className="flex flex-col text-left">
        <span className={`font-black text-sm sm:text-xl leading-none whitespace-nowrap ${isFooter ? 'text-white' : (isScrolled ? 'text-[#111] dark:text-white' : 'text-white')}`}>
          JAND NAJJAR
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[#ffcc00] font-bold text-[7px] sm:text-xs tracking-[0.1em] sm:tracking-[0.2em]">FAST FOOD</span>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Flame size={8} className="text-[#ffcc00] fill-[#ffcc00] sm:w-3 sm:h-3" />
          </motion.div>
        </div>
      </div>
    </motion.a>
  );
};

const Navbar = ({ 
  darkMode, 
  toggleDarkMode, 
  cartCount,
  onOpenCart,
  user,
  onLogin,
  onLogout,
  onOpenHistory
}: { 
  darkMode: boolean; 
  toggleDarkMode: () => void;
  cartCount: number;
  onOpenCart: () => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onOpenHistory: () => void;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white dark:bg-[#111] shadow-md py-1.5 sm:py-2' : 'bg-transparent py-3 sm:py-4'}`}>
      <div className="container mx-auto px-3 sm:px-4 flex justify-between items-center">
        <Logo isScrolled={isScrolled} />
        
        <div className="flex items-center gap-1 sm:gap-4">
          <button 
            onClick={toggleDarkMode}
            className={`p-1.5 sm:p-2 rounded-full transition-colors ${isScrolled ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200' : 'bg-white/20 text-white'}`}
          >
            {darkMode ? <Sun size={16} className="sm:w-5 sm:h-5" /> : <Moon size={16} className="sm:w-5 sm:h-5" />}
          </button>
          
          {user && (
            <button 
              onClick={onOpenHistory}
              className={`p-1.5 sm:p-2 rounded-full transition-colors ${isScrolled ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200' : 'bg-white/20 text-white'}`}
              title="Order History"
            >
              <History size={16} className="sm:w-5 sm:h-5" />
            </button>
          )}

          <div className="relative">
            <button 
              id="cart-icon"
              onClick={onOpenCart}
              className={`p-1.5 sm:p-2 rounded-full transition-colors ${isScrolled ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200' : 'bg-white/20 text-white'}`}
            >
              <ShoppingBag size={16} className="sm:w-5 sm:h-5" />
            </button>
            <AnimatePresence mode="wait">
              {cartCount > 0 && (
                <motion.span 
                  key={cartCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [1.5, 1], opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-1 -right-1 bg-[#e53935] text-white text-[8px] sm:text-[10px] font-bold w-3.5 h-3.5 sm:w-5 sm:h-5 flex items-center justify-center rounded-full border border-white dark:border-[#111]"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border-2 border-[#ffcc00]" />
              <button 
                onClick={onLogout}
                className={`p-1.5 sm:p-2 rounded-full transition-colors ${isScrolled ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200' : 'bg-white/20 text-white'}`}
                title="Logout"
              >
                <LogOut size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${isScrolled ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200' : 'bg-white/20 text-white'}`}
            >
              <LogIn size={16} />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}

          <a 
            href="#menu" 
            className="bg-[#ffcc00] hover:bg-[#ffb300] text-[#111] px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-sm transition-all active:scale-95 flex items-center gap-1 sm:gap-2 shadow-lg shadow-yellow-500/20"
          >
            Order Now
          </a>
        </div>
      </div>
    </nav>
  );
};

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove, 
  onUpdateQuantity,
  onCheckout
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  items: CartItem[];
  onRemove: (id: string, size?: string) => void;
  onUpdateQuantity: (id: string, size: string | undefined, delta: number) => void;
  onCheckout: () => void;
}) => {
  const total = items.reduce((sum, item) => {
    const price = item.prices ? item.prices[item.selectedSize!] : item.price!;
    return sum + (price * item.quantity);
  }, 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#111] z-[160] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-2xl font-black text-[#111] dark:text-white">Your Cart</h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors dark:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar overscroll-contain min-h-0">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-bold">Your cart is empty</p>
                  <button 
                    onClick={onClose}
                    className="mt-4 text-[#e53935] font-black uppercase text-sm tracking-widest hover:underline"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item, idx) => {
                    const price = item.prices ? item.prices[item.selectedSize!] : item.price!;
                    const uniqueKey = `${item.id}-${item.selectedSize || idx}`;
                    return (
                      <motion.div 
                        key={uniqueKey} 
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="flex gap-4"
                      >
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-black text-[#111] dark:text-white leading-tight">{item.name}</h4>
                            <button 
                              onClick={() => onRemove(item.id, item.selectedSize)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <p className="text-xs font-bold text-gray-400 mb-3">
                            {item.selectedSize ? `Size: ${item.selectedSize}` : item.category}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                              <button 
                                onClick={() => onUpdateQuantity(item.id, item.selectedSize, -1)}
                                className="text-gray-500 hover:text-[#e53935] font-bold"
                              >
                                -
                              </button>
                              <span className="text-sm font-black dark:text-white">{item.quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(item.id, item.selectedSize, 1)}
                                className="text-gray-500 hover:text-[#e53935] font-bold"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-black text-[#e53935]">Rs {price * item.quantity}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="text-2xl font-black text-[#111] dark:text-white">Rs {total}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-[#e53935] hover:bg-[#d32f2f] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  Checkout on WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1920&auto=format&fit=crop" 
          alt="Pizza Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
            Jand Najjar <br />
            <span className="text-[#ffcc00]">Fast Food</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto flex items-center justify-center gap-2">
            Delicious Food Delivered Fast <Flame size={20} className="text-[#ffcc00] fill-[#ffcc00]" />
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#menu" 
              className="bg-[#e53935] hover:bg-[#d32f2f] text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              Order Now (WhatsApp)
            </a>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2">
              <Flame size={20} className="text-[#ffcc00]" />
              Hot Deals Available
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-10 md:left-20 hidden lg:block"
      >
        <img src="https://pngimg.com/uploads/pizza/pizza_PNG44090.png" alt="Pizza" className="w-48 h-48 object-contain drop-shadow-2xl" referrerPolicy="no-referrer" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-10 md:right-20 hidden lg:block"
      >
        <img src="https://pngimg.com/uploads/burger_sandwich/burger_sandwich_PNG4135.png" alt="Burger" className="w-48 h-48 object-contain drop-shadow-2xl" referrerPolicy="no-referrer" />
      </motion.div>
    </section>
  );
};

const HotDealsBanner = () => {
  return (
    <div className="bg-[#ffcc00] py-3 overflow-hidden whitespace-nowrap border-b border-[#111]/10">
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex gap-10 items-center"
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-[#111] font-black text-xl uppercase flex items-center gap-2">
            <Flame size={20} fill="#111" /> Hot Deals: Buy 2 Large Pizza Get 1.5L Drink Free!
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const SpecialOffersBanner = () => {
  return (
    <div className="bg-[#e53935] py-3 overflow-hidden whitespace-nowrap">
      <motion.div 
        animate={{ x: [-1000, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="flex gap-10 items-center"
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-white font-black text-xl uppercase flex items-center gap-2">
            <Zap size={20} fill="white" /> Special Offers: Weekend Combos! Family Feast Deals!
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const ReviewSection = ({ 
  itemId, 
  user, 
  reviews 
}: { 
  itemId: string; 
  user: User | null; 
  reviews: Review[] 
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemReviews = reviews.filter(r => r.itemId === itemId);
  const avgRating = itemReviews.length > 0 
    ? (itemReviews.reduce((sum, r) => sum + r.rating, 0) / itemReviews.length).toFixed(1)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        itemId,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        rating,
        comment: comment.trim(),
        createdAt: serverTimestamp()
      });
      setComment('');
      setRating(5);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reviews');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-black text-[#111] dark:text-white uppercase tracking-widest">Reviews</h4>
        {avgRating && (
          <div className="flex items-center gap-1 text-[#ffcc00]">
            <Star size={14} fill="#ffcc00" />
            <span className="font-black text-sm">{avgRating}</span>
            <span className="text-[10px] text-gray-400 font-bold">({itemReviews.length})</span>
          </div>
        )}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transition-transform active:scale-90"
              >
                <Star 
                  size={20} 
                  className={star <= rating ? 'text-[#ffcc00] fill-[#ffcc00]' : 'text-gray-200 dark:text-gray-700'} 
                />
              </button>
            ))}
          </div>
          <div className="relative">
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[#ffcc00] outline-none text-sm font-bold dark:text-white resize-none h-20"
            />
            <button
              disabled={isSubmitting || !comment.trim()}
              className="absolute bottom-3 right-3 p-2 bg-[#ffcc00] text-[#111] rounded-lg disabled:opacity-50 disabled:grayscale transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      ) : (
        <p className="text-[10px] font-bold text-gray-400 mb-6 italic">Login to leave a review</p>
      )}

      <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
        {itemReviews.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No reviews yet. Be the first!</p>
        ) : (
          itemReviews.map(review => (
            <div key={review.id} className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black dark:text-white">{review.userName}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      size={8} 
                      className={star <= review.rating ? 'text-[#ffcc00] fill-[#ffcc00]' : 'text-gray-200 dark:text-gray-700'} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const HistoryDrawer = ({ 
  isOpen, 
  onClose, 
  orders,
  onReorder
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  orders: Order[];
  onReorder: (items: any[]) => void;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-full max-w-md bg-white dark:bg-[#111] z-[160] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-2xl font-black text-[#111] dark:text-white">Order History</h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors dark:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar overscroll-contain min-h-0">
              {orders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <History size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-bold">No orders found</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border-2 border-gray-100 dark:border-gray-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {order.createdAt?.toDate().toLocaleDateString()}
                      </span>
                      <span className="text-xs font-black text-[#e53935]">Rs {order.total}</span>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs font-bold dark:text-white">
                          <span>{item.name} {item.selectedSize && `(${item.selectedSize})`} x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        onReorder(order.items);
                        onClose();
                      }}
                      className="w-full py-3 bg-[#ffcc00] text-[#111] rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2"
                    >
                      <Rocket size={16} />
                      Reorder Now
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const MenuSection = ({ 
  onOrder, 
  onAddToCart,
  user,
  reviews
}: { 
  onOrder: (item: MenuItem, size?: 'S' | 'M' | 'L') => void;
  onAddToCart: (item: MenuItem, e: React.MouseEvent, size?: 'S' | 'M' | 'L') => void;
  user: User | null;
  reviews: Review[];
}) => {
  const [activeFilter, setActiveFilter] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let result = menuItems;
    
    if (activeFilter !== 'All') {
      result = result.filter(item => item.category === activeFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(result);
  }, [activeFilter, searchQuery]);

  const categories: (Category | 'All')[] = ['All', 'Pizza', 'Burgers', 'Shawarma', 'Deals'];

  return (
    <section id="menu" className="py-20 bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-[#111] dark:text-white mb-4">Our Delicious Menu</h2>
          <div className="w-20 h-1.5 bg-[#e53935] mx-auto rounded-full mb-8"></div>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8 relative">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400">
              <Search size={20} />
            </div>
            <input 
              type="text"
              placeholder="Search for your favorite food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white dark:bg-[#111] border-2 border-transparent focus:border-[#e53935] outline-none shadow-lg dark:text-white font-bold transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="flex overflow-x-auto pb-4 sm:pb-0 sm:flex-wrap justify-start sm:justify-center gap-2 mb-12 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-6 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeFilter === cat 
                    ? 'bg-[#e53935] text-white shadow-xl scale-105' 
                    : 'bg-white dark:bg-[#111] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-[#111] dark:text-white mb-2">No items found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('All');
              }}
              className="mt-6 text-[#e53935] font-black uppercase text-sm tracking-widest hover:underline"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => {
                const itemReviews = reviews.filter(r => r.itemId === item.id);
                const avgRating = itemReviews.length > 0 
                  ? (itemReviews.reduce((sum, r) => sum + r.rating, 0) / itemReviews.length).toFixed(1)
                  : null;

                return (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: (index % 3) * 0.1,
                      ease: [0.21, 1, 0.36, 1]
                    }}
                    className="bg-white dark:bg-[#111] rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all group border-2 border-transparent hover:border-[#e53935]/30 flex flex-col"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 bg-[#ffcc00] text-[#111] font-bold px-4 py-1.5 rounded-full text-xs shadow-lg">
                        {item.category}
                      </div>
                      {avgRating && (
                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-md text-[#ffcc00] font-black px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg">
                          <Star size={12} fill="#ffcc00" />
                          {avgRating}
                        </div>
                      )}
                      {item.subCategory && (
                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white font-bold px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider">
                          {item.subCategory}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 sm:p-8 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl sm:text-2xl font-black text-[#111] dark:text-white leading-tight">{item.name}</h3>
                        {!item.prices && (
                          <span className="text-lg sm:text-xl font-black text-[#e53935]">Rs {item.price}</span>
                        )}
                      </div>

                      <p className={`text-gray-500 dark:text-gray-400 text-sm mb-4 transition-all duration-300 ${expandedId === item.id ? '' : 'line-clamp-2'}`}>
                        {item.description}
                      </p>

                      <AnimatePresence>
                        {expandedId === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-6"
                          >
                            {item.ingredients && (
                              <>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Ingredients</h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {item.ingredients.map((ing, i) => (
                                    <span key={i} className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md">
                                      {ing}
                                    </span>
                                  ))}
                                </div>
                              </>
                            )}
                            <ReviewSection itemId={item.id} user={user} reviews={reviews} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button 
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="text-[#e53935] text-xs font-bold flex items-center gap-1 mb-6 hover:underline"
                      >
                        {expandedId === item.id ? 'Show Less' : 'View Details & Reviews'}
                        <ChevronRight size={14} className={`transition-transform ${expandedId === item.id ? 'rotate-90' : ''}`} />
                      </button>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                        {item.prices ? (
                          <div className="grid grid-cols-3 gap-3">
                            {(['S', 'M', 'L'] as const).map(size => (
                              <div key={size} className="flex flex-col gap-2">
                                <button
                                    onClick={(e) => onAddToCart(item, e, size)}
                                    className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-[#ffcc00] dark:hover:bg-[#ffcc00] hover:text-[#111] transition-all group/btn active:scale-95"
                                  >
                                  <span className="text-[10px] font-black text-gray-400 group-hover/btn:text-[#111] mb-1">{size}</span>
                                  <span className="font-black text-xs">Rs {item.prices![size]}</span>
                                </button>
                                <button 
                                  onClick={() => onOrder(item, size)}
                                  className="text-[10px] font-bold text-[#e53935] hover:underline"
                                >
                                  Order
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex gap-3">
                            <button
                              onClick={(e) => onAddToCart(item, e)}
                              className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#111] dark:text-white py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                              <ShoppingBag size={18} />
                              Add
                            </button>
                            <button
                              onClick={() => onOrder(item)}
                              className="flex-1 bg-[#e53935] hover:bg-[#d32f2f] text-white py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-red-500/20"
                            >
                              Order
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const Toast = ({ 
  message, 
  isVisible, 
  onClose,
  onAction
}: { 
  message: string; 
  isVisible: boolean; 
  onClose: () => void;
  onAction?: () => void;
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-6 sm:bottom-10 left-1/2 z-[200] bg-[#111] text-white px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/10 w-[92%] sm:w-auto min-w-[300px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle size={14} className="sm:w-[18px] sm:h-[18px]" />
            </div>
            <span className="font-bold text-sm sm:text-base whitespace-nowrap">{message}</span>
          </div>
          
          {onAction && (
            <button 
              onClick={() => {
                onAction();
                onClose();
              }}
              className="text-[#ffcc00] font-black text-xs uppercase tracking-widest hover:underline shrink-0"
            >
              View Cart
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const OrderModal = ({ 
  isOpen, 
  onClose, 
  item, 
  size,
  onSuccess
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  item: MenuItem | null; 
  size?: 'S' | 'M' | 'L';
  onSuccess: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryType: 'Home Delivery',
    quantity: 1
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    address: '',
    quantity: ''
  });

  const validateField = (name: string, value: any) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.trim().length < 3) error = 'Name must be at least 3 characters';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required';
        else if (!/^03\d{2}-?\d{7}$/.test(value.trim()) && !/^03\d{9}$/.test(value.trim())) {
          error = 'Invalid format (03xx-xxxxxxx)';
        }
        break;
      case 'address':
        if (!value.trim()) error = 'Address is required';
        else if (value.trim().length < 10) error = 'Please enter a complete address';
        break;
      case 'quantity':
        if (!value || value < 1) error = 'Quantity must be at least 1';
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset validation on open
      setErrors({ name: '', phone: '', address: '', quantity: '' });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!item) return null;

  const isFormValid = 
    formData.name.trim().length >= 3 &&
    ( /^03\d{2}-?\d{7}$/.test(formData.phone.trim()) || /^03\d{9}$/.test(formData.phone.trim()) ) &&
    formData.address.trim().length >= 10 &&
    formData.quantity >= 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    const price = item.prices ? item.prices[size!] : item.price;
    const message = `Assalamualaikum,
I want to order:

Item: ${item.name} ${size ? `(${size})` : ''}
Quantity: ${formData.quantity}
Price: Rs ${price! * formData.quantity}

Name: ${formData.name}
Phone: ${formData.phone}
Address: ${formData.address}

Delivery Type: ${formData.deliveryType}
Payment: Cash on Delivery`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/923368136019?text=${encodedMessage}`, '_blank');
    onSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          ></motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-[#111] w-full max-w-md rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden relative z-10 shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="bg-[#e53935] p-6 sm:p-8 text-white flex justify-between items-center relative overflow-hidden shrink-0">
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-black">Complete Order</h3>
                <p className="text-white/80 text-xs sm:text-sm font-bold">{item.name} {size && `(${size})`}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 sm:space-y-5 overflow-y-auto custom-scrollbar overscroll-contain flex-1 min-h-0">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Your Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => {
                      setFormData({...formData, name: e.target.value});
                      validateField('name', e.target.value);
                    }}
                    onBlur={() => validateField('name', formData.name)}
                    className={`w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 dark:bg-gray-900 outline-none transition-all dark:text-white font-bold ${
                      errors.name ? 'border-red-500' : 'border-gray-100 dark:border-gray-800 focus:border-[#e53935]'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e => {
                      setFormData({...formData, phone: e.target.value});
                      validateField('phone', e.target.value);
                    }}
                    onBlur={() => validateField('phone', formData.phone)}
                    className={`w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 dark:bg-gray-900 outline-none transition-all dark:text-white font-bold ${
                      errors.phone ? 'border-red-500' : 'border-gray-100 dark:border-gray-800 focus:border-[#e53935]'
                    }`}
                    placeholder="03xx-xxxxxxx"
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.phone}</p>}
                </div>
                
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Delivery Address</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={e => {
                      setFormData({...formData, address: e.target.value});
                      validateField('address', e.target.value);
                    }}
                    onBlur={() => validateField('address', formData.address)}
                    className={`w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 dark:bg-gray-900 outline-none transition-all dark:text-white font-bold h-24 resize-none ${
                      errors.address ? 'border-red-500' : 'border-gray-100 dark:border-gray-800 focus:border-[#e53935]'
                    }`}
                    placeholder="Enter your complete address"
                  ></textarea>
                  {errors.address && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={e => {
                        const val = parseInt(e.target.value) || 0;
                        setFormData({...formData, quantity: val});
                        validateField('quantity', val);
                      }}
                      className={`w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 dark:bg-gray-900 outline-none transition-all dark:text-white font-bold ${
                        errors.quantity ? 'border-red-500' : 'border-gray-100 dark:border-gray-800 focus:border-[#e53935]'
                      }`}
                    />
                    {errors.quantity && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.quantity}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Delivery Type</label>
                    <select
                      value={formData.deliveryType}
                      onChange={e => setFormData({...formData, deliveryType: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-[#e53935] outline-none transition-all dark:text-white font-bold"
                    >
                      <option>Home Delivery</option>
                      <option>Dine-in</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-[#ffcc00]/10 p-5 rounded-[2rem] flex items-center justify-between border-2 border-[#ffcc00]/20">
                <span className="font-black text-gray-500 text-sm uppercase tracking-widest">Total Price</span>
                <span className="text-3xl font-black text-[#e53935]">
                  Rs {(item.prices ? item.prices[size!] : item.price!) * formData.quantity}
                </span>
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all transform flex items-center justify-center gap-3 shadow-xl ${
                  isFormValid 
                    ? 'bg-[#e53935] hover:bg-[#d32f2f] text-white active:scale-95 shadow-red-500/20' 
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                <MessageCircle size={24} />
                Order on WhatsApp
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const CheckoutModal = ({ 
  isOpen, 
  onClose, 
  items, 
  onSuccess
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  items: CartItem[];
  onSuccess: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryType: 'Home Delivery',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState('');

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const calculateDeliveryTime = () => {
    const isDineIn = formData.deliveryType.includes('Dine-in');
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Base times
    let min = isDineIn ? 15 : 30;
    let max = isDineIn ? 25 : 45;

    // Volume factor (simulated)
    if (itemCount > 5) {
      min += 10;
      max += 15;
    } else if (itemCount > 3) {
      min += 5;
      max += 5;
    }

    return `${min}-${max} minutes`;
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.trim().length < 3) error = 'Name must be at least 3 characters';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required';
        else if (!/^03\d{2}-?\d{7}$/.test(value.trim()) && !/^03\d{9}$/.test(value.trim())) {
          error = 'Invalid format (03xx-xxxxxxx)';
        }
        break;
      case 'address':
        if (formData.deliveryType.includes('Home Delivery')) {
          if (!value.trim()) error = 'Address is required for delivery';
          else if (value.trim().length < 10) error = 'Please enter a complete address';
        }
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setErrors({ name: '', phone: '', address: '' });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const total = items.reduce((sum, item) => {
    const price = item.prices ? item.prices[item.selectedSize!] : item.price!;
    return sum + (price * item.quantity);
  }, 0);

  const isFormValid = 
    formData.name.trim().length >= 3 &&
    ( /^03\d{2}-?\d{7}$/.test(formData.phone.trim()) || /^03\d{9}$/.test(formData.phone.trim()) ) &&
    (formData.deliveryType.includes('Dine-in') || formData.address.trim().length >= 10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const itemsList = items.map(item => 
      `- ${item.name} ${item.selectedSize ? `(${item.selectedSize})` : ''} x${item.quantity} = Rs ${(item.prices ? item.prices[item.selectedSize!] : item.price!) * item.quantity}`
    ).join('\n');

    const estTime = calculateDeliveryTime();
    setDeliveryTime(estTime);

    const message = `Assalamualaikum,
I want to order:

${itemsList}

Total Amount: Rs ${total}
Estimated Time: ${estTime}

Name: ${formData.name}
Phone: ${formData.phone}
Address: ${formData.deliveryType.includes('Dine-in') ? 'Dine-in / Come and Eat' : formData.address}

Delivery Type: ${formData.deliveryType}
Payment: Cash on Delivery`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/923368136019?text=${encodedMessage}`, '_blank');
    setIsSubmitted(true);
    onSuccess();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        ></motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-[#111] w-full max-w-md rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden relative z-10 shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="bg-[#e53935] p-6 sm:p-8 text-white flex justify-between items-center relative overflow-hidden shrink-0">
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-black">
                {isSubmitted ? 'Order Confirmed!' : 'Checkout Details'}
              </h3>
              <p className="text-white/80 text-xs sm:text-sm font-bold">
                {isSubmitted ? 'Thank you for your order' : `${items.length} Items in Cart`}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          </div>
          
          {isSubmitted ? (
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={40} />
              </div>
              <div>
                <h4 className="text-xl font-black text-[#111] dark:text-white mb-2">Order Placed!</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Your order has been sent to WhatsApp. We'll start preparing it right away!
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border-2 border-blue-100 dark:border-blue-900/20">
                <div className="flex items-center justify-center gap-3 text-blue-600 mb-2">
                  <Clock size={20} />
                  <span className="font-black uppercase tracking-widest text-xs">Estimated Time</span>
                </div>
                <div className="text-3xl font-black text-blue-700 dark:text-blue-400">
                  {deliveryTime}
                </div>
                <p className="text-[10px] text-blue-500/70 font-bold mt-2 uppercase tracking-tighter">
                  Based on current order volume & distance
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 bg-[#111] dark:bg-white dark:text-[#111] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform"
              >
                Close & Continue
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 sm:space-y-5 overflow-y-auto custom-scrollbar overscroll-contain flex-1 min-h-0">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Your Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => {
                      setFormData({...formData, name: e.target.value});
                      validateField('name', e.target.value);
                    }}
                    className={`w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 dark:bg-gray-900 outline-none transition-all dark:text-white font-bold ${
                      errors.name ? 'border-red-500' : 'border-gray-100 dark:border-gray-800 focus:border-[#e53935]'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e => {
                      setFormData({...formData, phone: e.target.value});
                      validateField('phone', e.target.value);
                    }}
                    className={`w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 dark:bg-gray-900 outline-none transition-all dark:text-white font-bold ${
                      errors.phone ? 'border-red-500' : 'border-gray-100 dark:border-gray-800 focus:border-[#e53935]'
                    }`}
                    placeholder="03xx-xxxxxxx"
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Delivery Type</label>
                  <select
                    value={formData.deliveryType}
                    onChange={e => setFormData({...formData, deliveryType: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-[#e53935] outline-none transition-all dark:text-white font-bold"
                  >
                    <option>Home Delivery (Free under 5km)</option>
                    <option>Dine-in (Come and Eat)</option>
                  </select>
                </div>
                
                {formData.deliveryType.includes('Home Delivery') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Delivery Address</label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={e => {
                        setFormData({...formData, address: e.target.value});
                        validateField('address', e.target.value);
                      }}
                      className={`w-full px-5 py-4 rounded-2xl border-2 bg-gray-50 dark:bg-gray-900 outline-none transition-all dark:text-white font-bold h-24 resize-none ${
                        errors.address ? 'border-red-500' : 'border-gray-100 dark:border-gray-800 focus:border-[#e53935]'
                      }`}
                      placeholder="Enter your complete address"
                    ></textarea>
                    {errors.address && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.address}</p>}
                    <div className="mt-2 flex items-center gap-2 text-[#e53935] bg-red-50 dark:bg-red-900/10 p-3 rounded-xl">
                      <Zap size={14} className="fill-[#e53935]" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Free Delivery under 5km!</span>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="bg-[#ffcc00]/10 p-5 rounded-[2rem] flex items-center justify-between border-2 border-[#ffcc00]/20">
                <span className="font-black text-gray-500 text-sm uppercase tracking-widest">Total Amount</span>
                <span className="text-3xl font-black text-[#e53935]">
                  Rs {total}
                </span>
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all transform flex items-center justify-center gap-3 shadow-xl ${
                  isFormValid 
                    ? 'bg-[#e53935] hover:bg-[#d32f2f] text-white active:scale-95 shadow-red-500/20' 
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                <MessageCircle size={24} />
                Confirm Order on WhatsApp
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ContactSection = () => {
  return (
    <section className="py-20 bg-white dark:bg-[#111]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold mb-6">
              <CheckCircle size={16} />
              Food Authority Verified
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111] dark:text-white mb-6">Visit Our Shop</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
              Experience the best fast food in town. We use fresh ingredients and authentic recipes to bring you the taste you love.
            </p>
            
            <div className="space-y-6">
              <a 
                href="https://maps.google.com/maps?q=33.2559,73.3675" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-4 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-[#e53935] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#e53935] group-hover:text-white transition-colors">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#111] dark:text-white group-hover:text-[#e53935] transition-colors">Address</h4>
                  <p className="text-gray-500 dark:text-gray-400">Main Jand Najjar Chowk near Jand Najjar Boys High School</p>
                </div>
              </a>
              
              <a 
                href="tel:03368136019" 
                className="flex items-start gap-4 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 text-[#ffcc00] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#ffcc00] group-hover:text-[#111] transition-colors">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#111] dark:text-white group-hover:text-[#ffcc00] transition-colors">Contact</h4>
                  <p className="text-gray-500 dark:text-gray-400">Shams Mehmood: 0336-8136019</p>
                </div>
              </a>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#111] dark:text-white">Opening Hours</h4>
                  <p className="text-gray-500 dark:text-gray-400">Open Daily: 11:00 AM - 12:00 AM</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-video lg:aspect-square rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl lg:rotate-3 border-4 sm:border-8 border-white dark:border-gray-800">
              <iframe 
                src="https://maps.google.com/maps?q=33.2559,73.3675&z=17&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Jand Najjar Fast Food Location"
              ></iframe>
            </div>
            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-[#ffcc00] p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl -rotate-3 sm:-rotate-6 hidden xs:block">
              <div className="text-center">
                <span className="block text-2xl sm:text-4xl font-black text-[#111]">5 KM</span>
                <span className="block text-[10px] sm:text-sm font-bold text-[#111]/70 uppercase tracking-widest">Free Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#111] text-white py-12 border-t border-white/5">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <Logo isFooter />
        </div>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          The most delicious fast food in Jand Najjar. Quality you can trust, taste you will remember.
        </p>
        <div className="flex justify-center gap-6 mb-8">
          <a 
            href="https://wa.me/923368136019" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/5 hover:bg-[#25D366] rounded-full flex items-center justify-center transition-colors"
            title="WhatsApp"
          >
            <MessageCircle size={20} />
          </a>
          <a 
            href="tel:03368136019" 
            className="w-10 h-10 bg-white/5 hover:bg-[#ffcc00] hover:text-[#111] rounded-full flex items-center justify-center transition-colors"
            title="Call Us"
          >
            <Phone size={20} />
          </a>
          <a 
            href="https://maps.google.com/maps?q=33.2559,73.3675" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/5 hover:bg-[#e53935] rounded-full flex items-center justify-center transition-colors"
            title="Our Location"
          >
            <MapPin size={20} />
          </a>
        </div>
        <div className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Jand Najjar Fast Food. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const WhatsAppFloatingButton = () => {
  return (
    <a
      href="https://wa.me/923368136019"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[90] bg-[#25d366] text-white p-3 sm:p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group"
    >
      <MessageCircle size={24} className="sm:w-8 sm:h-8" />
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white dark:bg-[#111] text-[#111] dark:text-white px-4 py-2 rounded-xl font-bold text-sm shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-100 dark:border-gray-800">
        Chat with us!
      </span>
    </a>
  );
};

const FlyingItem = ({ 
  startPos, 
  endPos, 
  image, 
  onComplete 
}: { 
  startPos: { x: number; y: number }; 
  endPos: { x: number; y: number }; 
  image: string;
  onComplete: () => void;
  key?: any;
}) => {
  return (
    <motion.div
      initial={{ 
        x: startPos.x - 20, 
        y: startPos.y - 20, 
        scale: 1, 
        opacity: 1,
        rotate: 0
      }}
      animate={{ 
        x: endPos.x - 10, 
        y: endPos.y - 10, 
        scale: 0.2, 
        opacity: 0.5,
        rotate: 360
      }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      onAnimationComplete={onComplete}
      className="fixed top-0 left-0 z-[300] w-10 h-10 rounded-full overflow-hidden border-2 border-[#ffcc00] shadow-xl pointer-events-none"
    >
      <img src={image} alt="flying item" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | undefined>();
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [toast, setToast] = useState({ message: '', isVisible: false });
  const [flyingItems, setFlyingItems] = useState<{ id: number; start: { x: number; y: number }; end: { x: number; y: number }; image: string }[]>([]);
  
  // Firebase State
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Firebase Reviews Listener
  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reviews');
    });
    return () => unsubscribe();
  }, []);

  // Firebase Orders Listener
  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }
    const q = query(
      collection(db, 'orders'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setToast({ message: 'Welcome to Jand Najjar!', isVisible: true });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setToast({ message: 'Logged out successfully', isVisible: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleOrder = (item: MenuItem, size?: 'S' | 'M' | 'L') => {
    setSelectedItem(item);
    setSelectedSize(size);
    setIsModalOpen(true);
  };

  const handleAddToCart = (item: MenuItem, e: React.MouseEvent, size?: 'S' | 'M' | 'L') => {
    // Animation logic
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
      const rect = cartIcon.getBoundingClientRect();
      const startPos = { x: e.clientX, y: e.clientY };
      const endPos = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      
      const newFlyingItem = {
        id: Date.now() + Math.random(),
        start: startPos,
        end: endPos,
        image: item.image
      };
      
      setFlyingItems(prev => [...prev, newFlyingItem]);
    }

    setCartItems(prev => {
      const existingItem = prev.find(i => i.id === item.id && i.selectedSize === size);
      if (existingItem) {
        return prev.map(i => 
          (i.id === item.id && i.selectedSize === size) 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      }
      return [...prev, { ...item, quantity: 1, selectedSize: size }];
    });
    
    // Delay toast slightly to let animation finish
    setTimeout(() => {
      setToast({ message: `${item.name} added to cart!`, isVisible: true });
    }, 800);
  };

  const handleReorder = (items: any[]) => {
    setCartItems(prev => {
      const newItems = [...prev];
      items.forEach(item => {
        const existing = newItems.find(i => i.id === item.id && i.selectedSize === item.selectedSize);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          newItems.push({ ...item });
        }
      });
      return newItems;
    });
    setToast({ message: 'Items added from previous order!', isVisible: true });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string, size?: string) => {
    setCartItems(prev => prev.filter(i => !(i.id === id && i.selectedSize === size)));
  };

  const handleUpdateQuantity = (id: string, size: string | undefined, delta: number) => {
    setCartItems(prev => prev.map(i => {
      if (i.id === id && i.selectedSize === size) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handleOrderSuccess = async () => {
    if (user) {
      try {
        const total = cartItems.reduce((sum, item) => {
          const price = item.prices ? item.prices[item.selectedSize!] : item.price!;
          return sum + (price * item.quantity);
        }, 0);

        await addDoc(collection(db, 'orders'), {
          userId: user.uid,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.prices ? item.prices[item.selectedSize!] : item.price!,
            selectedSize: item.selectedSize || null,
            image: item.image
          })),
          total,
          status: 'pending',
          createdAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'orders');
      }
    }
    setToast({ message: 'Order sent to WhatsApp!', isVisible: true });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300 font-sans">
      <Navbar 
        darkMode={darkMode} 
        toggleDarkMode={() => setDarkMode(!darkMode)} 
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />
      
      <main>
        <Hero />
        <HotDealsBanner />
        <MenuSection 
          onOrder={handleOrder} 
          onAddToCart={handleAddToCart} 
          user={user}
          reviews={reviews}
        />
        <SpecialOffersBanner />
        <ContactSection />
      </main>

      {flyingItems.map(item => (
        <FlyingItem 
          key={item.id}
          startPos={item.start}
          endPos={item.end}
          image={item.image}
          onComplete={() => setFlyingItems(prev => prev.filter(i => i.id !== item.id))}
        />
      ))}

      <Footer />
      
      <WhatsAppFloatingButton />
      
      <OrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        item={selectedItem} 
        size={selectedSize} 
        onSuccess={handleOrderSuccess}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        items={cartItems}
        onSuccess={() => {
          handleOrderSuccess();
          setCartItems([]);
          setToast({ message: 'Order placed successfully!', isVisible: true });
        }}
      />

      <HistoryDrawer 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        orders={orders}
        onReorder={handleReorder}
      />

      <Toast 
        message={toast.message} 
        isVisible={toast.isVisible} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
        onAction={toast.message.includes('added to cart') ? () => setIsCartOpen(true) : undefined}
      />
    </div>
  );
}
