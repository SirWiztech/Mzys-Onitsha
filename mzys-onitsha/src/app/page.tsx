import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="gradient-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Mount Zion Youth Society
            </h1>
            <p className="mt-4 text-xl text-blue-100">
              A centralized platform for managing member records, finances, events, and
              communication across all MZYS branches.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium bg-white text-mzys-navy rounded-lg hover:bg-blue-50 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium border-2 border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Member Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-mzys-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-mzys-navy">Everything You Need</h2>
            <p className="mt-3 text-lg text-mzys-gray-500">
              Built for transparency, engagement, and community growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Member Directory',
                desc: 'Searchable directory with profiles, contact info, branch, and occupation details.',
                icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
              },
              {
                title: 'Financial Tracking',
                desc: 'Track membership dues, branch remittances, and maintain transparent records.',
                icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
              },
              {
                title: 'Events Calendar',
                desc: 'Shared calendar for meetings, conferences, programs, and special gatherings.',
                icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
              },
              {
                title: 'Leadership Directory',
                desc: 'View provincial and branch executives with their roles and responsibilities.',
                icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
              },
              {
                title: 'Support System',
                desc: 'Submit complaints, report issues, or give suggestions directly to leadership.',
                icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
              },
              {
                title: 'Multi-Branch',
                desc: 'Manage all MZYS branches from one platform with branch-specific data.',
                icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 border border-mzys-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-mzys-primary/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 text-mzys-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={feature.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-mzys-navy">{feature.title}</h3>
                <p className="mt-2 text-sm text-mzys-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-mzys-navy">Ready to Join?</h2>
          <p className="mt-3 text-lg text-mzys-gray-500 max-w-xl mx-auto">
            Register now to become part of the digital MZYS community. Access your profile,
            connect with members, and stay updated.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3 mt-8 text-base font-medium text-white bg-mzys-primary rounded-lg hover:bg-mzys-blue transition-colors"
          >
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
}
