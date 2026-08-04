'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export default function TiltedCard({
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
}: {
  imageSrc: string;
  altText?: string;
  captionText?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: ReactNode | null;
  displayOverlayContent?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 40,
    mass: 1,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((offsetY - centerY) / centerY) * -rotateAmplitude;
    const rY = ((offsetX - centerX) / centerX) * rotateAmplitude;

    rotateX.set(rX);
    rotateY.set(rY);
    x.set(offsetX - centerX);
    y.set(offsetY - centerY);
    scale.set(scaleOnHover);
    opacity.set(1);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    x.set(0);
    y.set(0);
    scale.set(1);
    opacity.set(0);
  };

  const handleMouseMoveFigcaption = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentX = (offsetX / rect.width) * 100;
    rotateFigcaption.set(percentX);
  };

  return (
    <figure
      ref={ref}
      className="relative inline-flex flex-col items-center [perspective:800px]"
      style={{
        height: containerHeight,
        width: containerWidth,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="sm:hidden absolute bottom-2 left-2 right-2 z-20 text-[10px] text-gray-400 text-center bg-black/50 rounded px-1 py-0.5">
          Best viewed on desktop
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d] w-full h-full rounded-xl overflow-hidden cursor-pointer"
        style={{
          rotateX,
          rotateY,
          scale,
        }}
      >
        <motion.img
          src={imageSrc}
          alt={altText}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            x,
            y,
          }}
          drag={false}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        />

        {displayOverlayContent && overlayContent && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{ opacity }}
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && captionText && (
        <motion.figcaption
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-gray-400 whitespace-nowrap"
          style={{
            opacity,
            rotate: rotateFigcaption,
          }}
          onMouseMove={handleMouseMoveFigcaption}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
