import React from 'react';

const Footer = () => (
  <footer className="bg-gray-900/80 border-t border-violet-700 text-gray-300 py-6 mt-12">
    <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
      <div className="text-sm">
        &copy; {new Date().getFullYear()} <span className="text-violet-300 font-semibold">FantastyWiki</span>. All rights reserved.
      </div>
      <nav className="flex flex-wrap gap-4 text-xs">
        <a href="/about" className="hover:text-violet-300 transition">About us</a>
        <a href="/contact" className="hover:text-violet-300 transition">Contact us</a>
        <a href="/privacy" className="hover:text-violet-300 transition">Privacy Policy</a>
        <a href="/terms" className="hover:text-violet-300 transition">Terms of Service</a>
      </nav>
    </div>
  </footer>
);

export default Footer;