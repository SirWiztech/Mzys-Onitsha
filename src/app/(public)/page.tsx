import Link from 'next/link';
import {
  Users,
  Wallet,
  CalendarDays,
  Shield,
  MessageCircle,
  Building2,
} from 'lucide-react';
import HeroCarousel from '@/components/hero-carousel';
import Ferrofluid from '@/components/ferrofluid';
import BorderGlow from '@/components/border-glow';
import GlassIcon from '@/components/glass-icon';
import SpecularButton from '@/components/specular-button';
import CardSwap, { Card } from '@/components/card-swap';
import ChromaGrid from '@/components/chroma-grid';
import ExcoGrid from '@/components/exco-grid';
import HideScrollbar from '@/components/hide-scrollbar';
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
      <HideScrollbar />
      <HeroCarousel />

      <section id="features" className="relative py-20 overflow-hidden" style={{ background: SECTION_BG, contain: 'layout style' }}>
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
            {features.map((feature) => (
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
                  <GlassIcon
                    icon={<feature.icon className="w-[1.2em] h-[1.2em]" />}
                    label={feature.title}
                    active
                  />
                  <div className="mt-3" />
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm text-mzys-gray-400">{feature.desc}</p>
                </div>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      <section id="special-activities" className="relative py-20 overflow-hidden" style={{ background: SECTION_BG, contain: 'layout style' }}>
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

      <section id="excos" className="relative py-20 overflow-hidden" style={{ background: '#0F172A', contain: 'layout style' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white font-display">The Excos</h2>
            <p className="mt-3 text-lg text-mzys-gray-300">
              Meet the dedicated team steering MZYS forward.
            </p>
          </div>
          <ExcoGrid />
        </div>
      </section>

      <section id="activities" className="relative py-20 overflow-hidden" style={{ background: SECTION_BG, contain: 'layout style' }}>
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
          <div className="flex flex-col lg:flex-row items-center gap-12 overflow-hidden">
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
            </div>            <div className="relative w-full flex-1 h-[440px] sm:h-[600px] max-w-full flex items-center justify-center mt-10 lg:mt-0">
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

      <section id="join" className="relative py-32 overflow-hidden" style={{ background: SECTION_BG, contain: 'layout style' }}>
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
            suspendWhenOffscreen
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
