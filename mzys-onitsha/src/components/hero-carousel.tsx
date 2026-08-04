'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { UserPlus, LogIn } from 'lucide-react';
import SpecularButton from '@/components/specular-button';


const allImages = [
  '/images/Bro-Friday-Preaching.jpg',
  '/images/favour-in-the-market.jpg',
  '/images/frfiday preaching 2.jpg',
  '/images/Mzys-District-Chairman.jpg',
  '/images/Mzys-Member-1.jpg',
  '/images/Mzys-member-4.jpg',
  '/images/Mzys-Member.jpg',
  '/images/mzys-memebr-2.jpg',
  '/images/Mzys-Preacher.jpg',
  '/images/mzys-president.jpg',
  '/images/Mzys-Seceratary.jpg',
  '/images/Mzys-Trumpeters.jpg',
  '/images/Nkpor-District-Chairman.jpg',
  '/images/prosper=preaching.jpg',
];

const textVariants = [
  {
    title: 'Mount Zion Youth Society',
    subtitle: 'Strengthening faith, building community, empowering youth across every branch.',
    cta: 'Get Started',
  },
  {
    title: 'One Platform, Every Branch',
    subtitle: 'Digitizing membership records, finances, and events — all in one place.',
    cta: 'Explore Features',
  },
  {
    title: 'Connect & Collaborate',
    subtitle: 'Find members by profession, attend events, and grow together as a community.',
    cta: 'Join Now',
  },
];

const slides = allImages.map((image, i) => ({
  ...textVariants[i % textVariants.length],
  image,
}));

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative h-[650px] md:h-[760px]">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
            i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-[center_top_15%] bg-no-repeat"
            style={{ backgroundImage: `url(${encodeURI(s.image)})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-mzys-navy/85 via-mzys-navy/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-3xl">
          <h1
            key={`title-${current}`}
            className="text-4xl md:text-6xl font-bold leading-tight font-display text-white animate-fadeSlideUp"
          >
            {slide.title}
          </h1>
          <p
            key={`sub-${current}`}
            className="mt-4 text-lg md:text-xl text-white/80 max-w-xl animate-fadeSlideUp"
            style={{ animationDelay: '100ms' }}
          >
            {slide.subtitle}
          </p>
          <div
            className="mt-8 flex flex-col sm:flex-row gap-4 animate-fadeSlideUp"
            style={{ animationDelay: '200ms' }}
          >
            <Link href="/register" className="w-full sm:w-auto">
              <SpecularButton
                size="lg"
                radius={18}
                tint="#3A6CF6"
                tintOpacity={0.2}
                textColor="#ffffff"
                lineColor="#93C5FD"
                baseColor="#1E3A8A"
                intensity={1.2}
                shineSize={10}
                shineFade={40}
                thickness={1.2}
                speed={0.35}
                followMouse
                proximity={250}
                className="w-full sm:w-auto"
              >
                <UserPlus className="w-5 h-5" />
                {slide.cta}
              </SpecularButton>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <SpecularButton
                size="lg"
                radius={18}
                tint="#ffffff"
                tintOpacity={0.05}
                textColor="#ffffff"
                lineColor="#E0E7FF"
                baseColor="#0A1F5C"
                intensity={0.9}
                shineSize={10}
                shineFade={40}
                thickness={1}
                speed={0.35}
                followMouse
                proximity={250}
                className="w-full sm:w-auto"
              >
                <LogIn className="w-5 h-5" />
                Member Login
              </SpecularButton>
            </Link>
          </div>
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50 w-1.5'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

    </section>
  );
}
