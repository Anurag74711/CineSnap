import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';

const AdminNavbar = () => {
  return (
    <div className="h-16 w-full bg-gray-900 text-white flex items-center justify-between px-6 border-b border-gray-800 z-50">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="h-10 w-auto" />
      </Link>
      
    </div>
  );
};

export default AdminNavbar;


