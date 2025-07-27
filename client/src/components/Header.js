import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCartItems } from '../services/api';

const Header = () => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchCartCount();
    }
  }, []);

  const fetchCartCount = async () => {
      try {
          const { data } = await getCartItems();
          setCartCount(data.length);
      } catch (error) {
          console.error("Gagal mengambil data keranjang", error);
          setCartCount(0);
      }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCartCount(0);
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">Rent-A-Top</Link>
        <nav className="space-x-4 flex items-center">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          
          {user ? (
            <>
              {/* --- LINK RIWAYAT DITAMBAHKAN --- */}
              <Link to="/history" className="text-gray-600 hover:text-blue-600">Riwayat</Link>

              <Link to="/cart" className="relative text-gray-600 hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                    </span>
                )}
              </Link>

              <span className="text-gray-800 hidden md:inline">Selamat datang, <span className="font-semibold">{user.name}</span>!</span>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-gray-600 hover:text-blue-600">Admin</Link>
              )}
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
