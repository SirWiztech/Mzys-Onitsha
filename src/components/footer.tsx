'use client';

export default function Footer() {
  return (
    <footer className="relative bg-[#0B1120] mt-auto">
      {/* Radial vignette overlay for smooth edge blending */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(11,17,32,0.6) 70%, rgba(11,17,32,1) 100%)',
        }}
      />

      {/* Main footer content sits above the watermark */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/images/main-mzys-logo.png"
                alt="MZYS"
                className="w-12 h-12 object-contain rounded-full bg-white/10 p-1"
              />
              <div>
                <span className="font-bold text-lg text-white block leading-tight">MZYS Onitsha</span>
                <span className="text-xs text-gray-500">Mount Zion Youth Society</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Mount Zion Youth Society — Digitizing membership, strengthening community.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-gray-200">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/dashboard/members" className="hover:text-blue-400 transition-colors">Member Directory</a></li>
              <li><a href="/dashboard/events" className="hover:text-blue-400 transition-colors">Events</a></li>
              <li><a href="/dashboard/leadership" className="hover:text-blue-400 transition-colors">Leadership</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-gray-200">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Mount Zion Youth Society</li>
              <li>Onitsha, Anambra State</li>
              <li>mzysonitsha.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mb-8 pt-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} MZYS Onitsha. All rights reserved.
        </div>
      </div>

      {/* Oversized ghost-text watermark — bleeds off the bottom edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none relative z-0 -mt-10 sm:-mt-8 text-center whitespace-nowrap"
      >
        <span
          className="block font-black tracking-tight leading-none text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] xl:text-[11vw] bg-gradient-to-b from-gray-400 via-gray-600 to-gray-800 bg-clip-text text-transparent opacity-30"
        >
          MZYS ONITSHA
        </span>
      </div>
    </footer>
  );
}
