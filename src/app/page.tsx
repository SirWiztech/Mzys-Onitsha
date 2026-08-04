import Link from 'next/link';
import {
  Users,
  Wallet,
  CalendarDays,
  Shield,
  MessageCircle,
  Building2,
} from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import HeroCarousel from '@/components/hero-carousel';
import Ferrofluid from '@/components/ferrofluid';
import BorderGlow from '@/components/border-glow';
import GlassIcon from '@/components/glass-icon';
import SpecularButton from '@/components/specular-button';
import CardSwap, { Card } from '@/components/card-swap';
import ChromaGrid from '@/components/chroma-grid';
import ProfileCard from '@/components/profile-card';
import Prism from '@/components/prism';

const SECTION_BG = '#0B1120';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navbar />

      <HeroCarousel />

      {/* Marquee */}
      <section className="relative overflow-hidden py-14" style={{ background: '#0B1120' }}>
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-16 animate-[marquee_30s_linear_infinite] shrink-0">
            {['MZYS', 'KDA', 'ZION DAUGHTERS', 'ESA', 'ORE OFE', 'OGO OLUWA', 'ARMY OF SALVATION', 'E T B A'].map((name) => (
              <span key={name} className="text-5xl md:text-7xl font-bold text-white/10 whitespace-nowrap tracking-tight hover:text-white/30 transition-colors">
                {name}
              </span>
            ))}
          </div>
          <div className="flex gap-16 animate-[marquee_30s_linear_infinite] shrink-0" aria-hidden>
            {['MZYS', 'KDA', 'ZION DAUGHTERS', 'ESA', 'ORE OFE', 'OGO OLUWA', 'ARMY OF SALVATION', 'E T B A'].map((name) => (
              <span key={name} className="text-5xl md:text-7xl font-bold text-white/10 whitespace-nowrap tracking-tight">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

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
              { title: 'Member Directory', desc: 'Searchable directory with profiles, contact info, branch, and occupation details.', icon: Users },
              { title: 'Financial Tracking', desc: 'Track membership dues, branch remittances, and maintain transparent records.', icon: Wallet },
              { title: 'Events Calendar', desc: 'Shared calendar for meetings, conferences, programs, and special gatherings.', icon: CalendarDays },
              { title: 'Leadership Directory', desc: 'View provincial and branch executives with their roles and responsibilities.', icon: Shield },
              { title: 'Support System', desc: 'Submit complaints, report issues, or give suggestions directly to leadership.', icon: MessageCircle },
              { title: 'Multi-Branch', desc: 'Manage all MZYS branches from one platform with branch-specific data.', icon: Building2 },
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
          <div className="min-h-[700px] h-auto relative">
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
              name="Ebere Godspower Nnamdi"
              title="President"
              unit="Inland Town District"
              avatarUrl="/images/Nnamdi Godspower.jpg"
              status="Active"
              behindGlowColor="rgba(59, 130, 246, 0.67)"
            />
            <ProfileCard
              name="Okorie Confidence"
              title="Vice President"
              unit="Ogbeumuonitsha"
              avatarUrl="/images/Okorie Confidence.jpg"
              status="Active"
              behindGlowColor="rgba(139, 92, 246, 0.67)"
            />
            <ProfileCard
              name="Chukwuma Nduka"
              title="General Secretary"
              unit="ESOCS Mount of Miracle, Obosi"
              avatarUrl="/images/Chukwuma  Nduka.jpg"
              status="Active"
              behindGlowColor="rgba(16, 185, 129, 0.67)"
            />
            <ProfileCard
              name="Ogbonna Agbai"
              title="Assistant Secretary"
              unit="MZYS Onitsha"
              avatarUrl="/images/Agbai.jpg"
              status="Active"
              behindGlowColor="rgba(6, 182, 212, 0.67)"
            />
            <ProfileCard
              name="Agbo Precious Nzube"
              title="Treasurer"
              unit="Obosi Branch"
              avatarUrl="/images/sis-precious-agbo.jpg"
              status="Active"
              behindGlowColor="rgba(245, 158, 11, 0.67)"
            />
            <ProfileCard
              name="Chibuogwu Emmanuel Onyedikachi"
              title="Media & Publicity Director"
              unit="ESOCS Obosi Branch"
              avatarUrl="/images/Chibuogwu Emmanuel.jpg"
              status="Active"
              behindGlowColor="rgba(244, 63, 94, 0.67)"
            />
            <ProfileCard
              name="Achonu Chidera Destiny"
              title="Welfare Officer"
              unit="Inland Town Branch"
              avatarUrl="/images/Achonu Chidera.jpg"
              status="Active"
              behindGlowColor="rgba(16, 185, 129, 0.67)"
            />
            <ProfileCard
              name="Samuel Anyanwu"
              title="Provost"
              unit="Fegge Provincial HQ Branch"
              avatarUrl="/images/Anyanwu Samuel.jpg"
              status="Active"
              behindGlowColor="rgba(59, 130, 246, 0.67)"
            />
            <ProfileCard
              name="Udechukwu Ruth Agbo"
              title="Evangelism Dept. / Evangelical Follow-Up 1"
              unit="Obosi Branch"
              avatarUrl="/images/Ruth Udechukwu.jpg"
              status="Active"
              behindGlowColor="rgba(139, 92, 246, 0.67)"
            />
            <ProfileCard
              name="Mama Oluchukwu Friday"
              title="Evangelical / Prayer Unit"
              unit="Nkpor 3"
              avatarUrl="/images/Mama Friday.jpg"
              status="Active"
              behindGlowColor="rgba(245, 158, 11, 0.67)"
            />
            <ProfileCard
              name="Ogaraku Ugochukwu"
              title="Music & Drama Department"
              unit="Fegge Branch"
              avatarUrl="/images/ugochukwu ogaraku.jpg"
              status="Active"
              behindGlowColor="rgba(139, 92, 246, 0.67)"
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
            <div className="flex-1 min-h-[350px] max-md:mb-10 relative">
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
                      <span className="text-xs font-semibold uppercase tracking-wider text-mzys-light">Tuesday</span>
                      <h3 className="text-2xl font-bold text-white mt-2 font-display">Bible Classes</h3>
                      <p className="text-mzys-gray-300 mt-3">Join us for weekly Bible classes and grow deeper in God's Word.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-mzys-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      8:00 PM — 9:00 PM
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3A6CF6] p-8 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-mzys-light">Thursday</span>
                      <h3 className="text-2xl font-bold text-white mt-2 font-display">Sisters Forum (Online)</h3>
                      <p className="text-mzys-gray-300 mt-3">Online teaching for the sisters — 3rd Thursday of every month.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-mzys-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      9:00 PM · 3rd Thursday
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#0A1F5C] to-[#1E3A8A] p-8 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-mzys-light">Friday</span>
                      <h3 className="text-2xl font-bold text-white mt-2 font-display">Sisters Fellowship (Physical)</h3>
                      <p className="text-mzys-gray-300 mt-3">Physical fellowship meeting for the sisters — last Friday of the month.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-mzys-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Last Friday of the month
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-mzys-primary to-mzys-light p-8 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/70">Sunday</span>
                      <h3 className="text-2xl font-bold text-white mt-2 font-display">G-Force Teaching</h3>
                      <p className="text-white/80 mt-3">Join the G-Force teaching session and be equipped for growth.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      6:00 PM
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

      <Footer />
    </div>
  );
}
