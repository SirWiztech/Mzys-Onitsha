import Link from 'next/link';
import {
  Users,
  Wallet,
  CalendarDays,
  Shield,
  MessageCircle,
  Building2,
  CalendarRange,
  Sparkles,
} from 'lucide-react';
import HeroCarousel from '@/components/hero-carousel';
import Ferrofluid from '@/components/ferrofluid';
import BorderGlow from '@/components/border-glow';
import SpecularButton from '@/components/specular-button';
import CardSwap, { Card } from '@/components/card-swap';
import ChromaGrid from '@/components/chroma-grid';
import ProfileCard from '@/components/profile-card';
import Prism from '@/components/prism';

const SECTION_BG = '#0B1120';

const features = [
  { title: 'Member Directory', desc: 'Searchable directory with profiles, contact info, branch, and occupation details.', icon: Users },
  { title: 'Financial Tracking', desc: 'Track membership dues, branch remittances, and maintain transparent records.', icon: Wallet },
  { title: 'Events Calendar', desc: 'Shared calendar for meetings, conferences, programs, and special gatherings.', icon: CalendarDays },
  { title: 'Leadership Directory', desc: 'View provincial and branch executives with their roles and responsibilities.', icon: Shield },
  { title: 'Support System', desc: 'Submit complaints, report issues, or give suggestions directly to leadership.', icon: MessageCircle },
  { title: 'Multi-Branch', desc: 'Manage all MZYS branches from one platform with branch-specific data.', icon: Building2 },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroCarousel />

      <section id="features" className="relative py-20 overflow-hidden" style={{ background: SECTION_BG }}>
        <div className="absolute inset-0 z-0">
          <Ferrofluid
            colors={['#0A1F5C', '#1E3A8A', '#3A6CF6', '#0A1F5C']}
            speed={0.4}
            scale={1.6}
            turbulence={1}
            fluidity={0.1}
            rimWidth={0.2}
            sharpness={2.5}
            shimmer={1.5}
            glow={2}
            flowDirection="down"
            opacity={1}
            mouseInteraction
            mouseStrength={1}
            mouseRadius={0.35}
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white font-display">Everything You Need</h2>
            <p className="mt-3 text-lg text-mzys-gray-300">
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
              <BorderGlow
                key={feature.title}
                glowColor="224 70% 55%"
                backgroundColor="#0F172A"
                borderRadius={16}
                glowRadius={30}
                glowIntensity={1.2}
                coneSpread={25}
                edgeSensitivity={30}
                colors={['#3A6CF6', '#0A1F5C', '#5B8DEF']}
              >
                <div className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-mzys-primary/20 flex items-center justify-center mb-4">
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
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm text-mzys-gray-400">{feature.desc}</p>
                </div>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      <section id="special-activities" className="relative py-20 overflow-hidden" style={{ background: SECTION_BG }}>
        <div className="absolute inset-0 z-0">
          <Ferrofluid
            colors={['#3A6CF6', '#0A1F5C', '#5B8DEF', '#0A1F5C']}
            speed={0.3}
            scale={1.4}
            turbulence={0.8}
            fluidity={0.15}
            rimWidth={0.2}
            sharpness={2}
            shimmer={1.2}
            glow={1.5}
            flowDirection="down"
            opacity={0.6}
            mouseInteraction
            mouseStrength={0.8}
            mouseRadius={0.35}
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white font-display">Special Activities</h2>
            <p className="mt-3 text-lg text-mzys-gray-300">
              Join a team and serve in your area of passion and gifting.
            </p>
          </div>
          <div className="h-[700px] relative">
            <ChromaGrid />
          </div>
        </div>
      </section>

      <section id="excos" className="relative py-20 overflow-hidden" style={{ background: '#0F172A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white font-display">The Excos</h2>
            <p className="mt-3 text-lg text-mzys-gray-300">
              Meet the dedicated team steering MZYS forward.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <ProfileCard
              name="Bro. John Okafor"
              title="President"
              unit="Presidential"
              avatarUrl="/images/mzys-president.jpg"
              status="Active"
              behindGlowColor="rgba(59, 130, 246, 0.67)"
            />
            <ProfileCard
              name="Sis. Chiamaka Nwosu"
              title="Vice President"
              unit="Administration"
              avatarUrl="/images/sis-chiamaka.jpg"
              status="Active"
              behindGlowColor="rgba(139, 92, 246, 0.67)"
            />
            <ProfileCard
              name="Bro. Joel Okonkwo"
              title="General Secretary"
              unit="Secretariat"
              avatarUrl="/images/bro-joel.jpg"
              status="Active"
              behindGlowColor="rgba(16, 185, 129, 0.67)"
            />
            <ProfileCard
              name="Sis. Precious Eze"
              title="Financial Secretary"
              unit="Finance"
              avatarUrl="/images/Precious-pray.jpg"
              status="Active"
              behindGlowColor="rgba(245, 158, 11, 0.67)"
            />
            <ProfileCard
              name="Bro. Michael Ugwu"
              title="Media Director"
              unit="Media & Publicity"
              avatarUrl="/images/mzys-media-team.jpg"
              status="Active"
              behindGlowColor="rgba(6, 182, 212, 0.67)"
            />
          </div>
        </div>
      </section>

      <section id="activities" className="relative py-20 overflow-hidden" style={{ background: SECTION_BG }}>
        <div className="absolute inset-0 z-0">
          <Ferrofluid
            colors={['#0A1F5C', '#1E3A8A', '#3A6CF6', '#0A1F5C']}
            speed={0.4}
            scale={1.6}
            turbulence={1}
            fluidity={0.1}
            rimWidth={0.2}
            sharpness={2.5}
            shimmer={1.5}
            glow={2}
            flowDirection="down"
            opacity={1}
            mouseInteraction
            mouseStrength={1}
            mouseRadius={0.35}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white font-display">Weekly Activities</h2>
              <p className="mt-4 text-lg text-mzys-gray-300 max-w-lg">
                Stay connected with our regular programs — from prayer meetings to Bible study,
                worship sessions, and community outreach.
              </p>
              <div className="mt-8">
                <SpecularButton
                  size="lg"
                  radius={18}
                  tint="#3A6CF6"
                  tintOpacity={0.2}
                  textColor="#ffffff"
                  lineColor="#93C5FD"
                  baseColor="#0A1F5C"
                  intensity={1.2}
                  shineSize={10}
                  shineFade={40}
                  thickness={1.2}
                  speed={0.35}
                  followMouse
                  proximity={250}
                >
                  View Schedule
                </SpecularButton>
              </div>
            </div>
            <div className="flex-1 h-[600px] relative">
              <CardSwap
                width={420}
                height={340}
                cardDistance={60}
                verticalDistance={70}
                delay={4000}
                pauseOnHover
                skewAmount={6}
                easing="elastic"
              >
                <Card>
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-mzys-navy to-mzys-primary p-8 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-mzys-light">Monday</span>
                      <h3 className="text-2xl font-bold text-white mt-2 font-display">Prayer Meeting</h3>
                      <p className="text-mzys-gray-300 mt-3">Join us for a powerful time of intercession and spiritual refreshment.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-mzys-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      6:00 PM — 7:30 PM
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3A6CF6] p-8 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-mzys-light">Wednesday</span>
                      <h3 className="text-2xl font-bold text-white mt-2 font-display">Bible Study</h3>
                      <p className="text-mzys-gray-300 mt-3">Deep dive into God's Word with interactive group discussions.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-mzys-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      5:30 PM — 7:00 PM
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#0A1F5C] to-[#1E3A8A] p-8 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-mzys-light">Friday</span>
                      <h3 className="text-2xl font-bold text-white mt-2 font-display">Worship Night</h3>
                      <p className="text-mzys-gray-300 mt-3">An evening of praise, worship, and encounter with God's presence.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-mzys-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      7:00 PM — 9:00 PM
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-mzys-primary to-mzys-light p-8 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/70">Saturday</span>
                      <h3 className="text-2xl font-bold text-white mt-2 font-display">Outreach</h3>
                      <p className="text-white/80 mt-3">Community service and evangelism — making a difference in Onitsha.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      9:00 AM — 12:00 PM
                    </div>
                  </div>
                </Card>
              </CardSwap>
            </div>
          </div>
        </div>
      </section>

      <section id="join" className="relative py-32 overflow-hidden" style={{ background: SECTION_BG }}>
        <div className="absolute inset-0 z-0">
          <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            noise={0}
            glow={1}
            bloom={1.5}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white font-display">Ready to Join?</h2>
          <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
            Register now to become part of the digital MZYS community. Access your profile,
            connect with members, and stay updated.
          </p>
          <div className="mt-10">
            <Link href="/register">
              <SpecularButton
                size="lg"
                radius={18}
                tint="#3A6CF6"
                tintOpacity={0.2}
                textColor="#ffffff"
                lineColor="#93C5FD"
                baseColor="#0A1F5C"
                intensity={1.2}
                shineSize={10}
                shineFade={40}
                thickness={1.2}
                speed={0.35}
                followMouse
                proximity={250}
              >
                Register Now
              </SpecularButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
