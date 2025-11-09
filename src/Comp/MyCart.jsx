// MyCart.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

function MyCart({ cartItems, setCartItems, darkMode }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Load saved cart on mount (only once)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('CartItems');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only update if parsed is an array
        if (Array.isArray(parsed)) setCartItems(parsed);
      }
    } catch (err) {
      console.error('Failed to parse saved cart:', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('CartItems', JSON.stringify(cartItems || []));
    } catch (err) {
      console.error('Failed to save cart:', err);
    }
  }, [cartItems]);

  const upQty = (id, d) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((i) => i.id !== id));
  };

  // Navigate to checkout page -- pass cart and total using state
  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      // use navigate instead of window.location to keep SPA behavior
      return navigate('/login', { replace: true });
    }

    if (!cartItems || cartItems.length === 0) {
      return alert('Your cart is empty.');
    }

    // compute total
    const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    // Navigate to checkout; pass cart and total via location state
    navigate('/cart-checkout', { state: { cartItems, total } });
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (!isAuthenticated) {
    return (
      <div className={`${darkMode ? 'bg-gradient-to-t from-[#3c3f88cb] via-[#0B1059] to-[#3c3f88cb] text-gray-100' : 'bg-gradient-to-br from-blue-200 via-purple-200 to-pink-300 text-gray-500'} min-w-[50%] sm:w-[30%] shadow-lg h-[88vh] mr-2 top-16 rounded-md p-2 right-0 fixed flex flex-col z-50`}>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold  mb-4">Please Login to View Cart</h3>
            <p className=" mb-6">You need to be logged in to access your shopping cart.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#fd366e] text-white px-6 py-2 rounded-md hover:bg-[#ed366e] transition cursor-pointer"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={` min-w-[50%] sm:w-[30%] shadow-lg h-[88vh] mr-2 top-16 rounded-md  p-1 md:p-2 right-0 fixed flex flex-col z-50 ${
      darkMode
        ? 'bg-gradient-to-b  from-[#070F2B] to-[#1B1A55] text-gray-100'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800'
    }`}>
      <div className="p-3 rounded-md mb-3 shadow-zinc-500 shadow-2xl">
        <p className="text-sm ">Welcome, <span className="font-semibold">{user?.name}</span>!</p>
      </div>

      <div className="flex-1 overflow-y-auto p-1 md:p-4 space-y-3">
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="mb-2">Your cart is empty</p>
            <p className="text-sm">Start shopping to add items!</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className={`${darkMode ? 'bg-[#1b1a55] text-gray-100' : 'bg-gray-200 text-gray-800'} flex gap-1 md:gap-3 items-center shadow-2xl rounded p-1 md:p-2`}
            >
              <img src={item.img} alt={item.title} className="w-12 h-12 rounded" />
              <div className="flex-1 text-sm md:text-lg">
                <h3 className="font-semibold">{item.title}</h3>
                <span>${item.price}</span>
              </div>

              <button onClick={() => navigate(`/itemdetails/${item.id}`)} className="mx-4 text-sm p-[3px] rounded-md cursor-pointer shadow-2xl transition-all duration-500 bg-[#fd366e] text-white hover:bg-[#ed366e] font-semibold">
                View
              </button>

              <div className="flex items-center gap-2">
                <button className="px-2 bg-[#fd366e] rounded cursor-pointer hover:bg-[#ed366e] text-white transition" onClick={() => upQty(item.id, -1)}>-</button>
                <span>{item.qty < 10 ? `0${item.qty}` : item.qty}</span>
                <button className="px-2 bg-[#fd366e] rounded cursor-pointer hover:bg-[#ed366e] text-white transition" onClick={() => upQty(item.id, 1)}>+</button>
              </div>

              <button className="text-[#fd366e] text-sm ml-2 cursor-pointer hover:text-red-700 transition" onClick={() => removeItem(item.id)}>✕</button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between mb-3">
          <span className="font-semibold">Total:</span>
          <span className="font-bold">${total.toFixed(2)}</span>
        </div>
        <button
          className={`w-full font-semibold py-2 rounded transition cursor-pointer ${cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white`}
          onClick={handlePlaceOrder}
          disabled={cartItems.length === 0}
        >
          {cartItems.length === 0 ? 'Cart is Empty' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
}

export default MyCart;
