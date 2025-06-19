// src/components/Footer.jsx

import React from 'react';

const Footer = () => {
  return (
    // No top border here. It's just a background.
    <footer className="bg-zinc-800 text-white">
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="font-bold">
          © {new Date().getFullYear()} Bookish. All Rights Reserved.
        </p>
        <p className="text-sm text-zinc-400 mt-2">
          Designed with ❤️ <span> - Nishith</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;