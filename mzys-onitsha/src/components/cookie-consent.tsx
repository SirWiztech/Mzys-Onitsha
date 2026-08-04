'use client';

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookies-accepted');
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[70] bg-[#0B1120] border-t border-white/10 px-4 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:flex-1">
          <Cookie className="w-5 h-5 text-blue-400 shrink-0" />
          <p className="text-sm text-gray-300">
            We use cookies to improve your experience. By continuing, you agree to our use of cookies.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={accept}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => setVisible(false)}
            className="w-8 h-8 rounded-full text-gray-400 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
