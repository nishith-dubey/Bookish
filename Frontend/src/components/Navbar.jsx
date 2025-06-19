import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes, FaBook } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const buttonClasses = "border-2 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-y-0.5 hover:translate-x-0.5 transition-all";

  return (
    <nav className="bg-white text-black border-b-4 border-black fixed w-full block z-[1000]">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <FaBook size={28} />
          <span className="text-2xl font-black">Bookish</span>
        </Link>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-black">
            {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </button>
        </div>

        <div className="hidden md:flex md:items-center md:space-x-6">
          {user ? (
            <>
              {user?.user?.role === 'admin' && (
                <Link to="/admin" className={`${buttonClasses} bg-green-400 hover:bg-green-500`}>
                  Manage Books
                </Link>
              )}
              <Link to="/users/profile" className="flex items-center space-x-2 font-bold">
                <FaUserCircle size={24} />
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className={`${buttonClasses} bg-red-400 hover:bg-red-500`}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className={`${buttonClasses} bg-blue-400 hover:bg-blue-500`}>
              Login
            </Link>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t-4 border-black p-4">
          {user ? (
             <div className="flex flex-col items-start space-y-4">
               {user.user.role === 'admin' && (
                <Link to="/admin" className={`${buttonClasses} w-full text-center bg-green-400 hover:bg-green-500`}>
                  Manage Books
                </Link>
              )}
              <Link to="/users/profile" className="flex items-center space-x-2 font-bold hover:underline text-lg">
                <FaUserCircle size={24} />
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className={`${buttonClasses} w-full text-center bg-red-400 hover:bg-red-500`}>
                Logout
              </button>
             </div>
          ) : (
            <Link to="/auth" className={`${buttonClasses} w-full text-center bg-blue-400 hover:bg-blue-500`}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;