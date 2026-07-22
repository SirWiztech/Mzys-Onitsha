export default function Footer() {
  return (
    <footer className="bg-mzys-navy text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-lg">MZYS Onitsha</span>
            </div>
            <p className="text-sm text-blue-200">
              Mount Zion Youth Society — Digitizing membership, strengthening community.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li><a href="/dashboard/members" className="hover:text-white transition-colors">Member Directory</a></li>
              <li><a href="/dashboard/events" className="hover:text-white transition-colors">Events</a></li>
              <li><a href="/dashboard/leadership" className="hover:text-white transition-colors">Leadership</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>Mount Zion Youth Society</li>
              <li>Onitsha, Anambra State</li>
              <li>mzysonitsha.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-4 text-center text-sm text-blue-200">
          &copy; {new Date().getFullYear()} MZYS Onitsha. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
