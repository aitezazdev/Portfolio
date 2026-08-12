'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Dot } from 'lucide-react';

export const preloaderWords = [
  'Hello',
  'Bonjour',
  'Ciao',
  'Olà',
  'سلام',
  'やあ',
  'Hallå',
  'Guten tag',
  'Hallo',
];

export const slideUp = {
  initial: {
    top: 0,
  },
  exit: {
    top: '-100vh',
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const, delay: 0.2 },
  },
};

export const fade = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 0.75,
    transition: { duration: 1, delay: 0.2 },
  },
};

export default function GlobalPreloader() {
  const [index, setIndex] = useState(0);
  const dimensions = useRef({ width: 0, height: 0 });
  const [isMeasured, setIsMeasured] = useState(false);

  useEffect(() => {
    dimensions.current.width = window.innerWidth;
    dimensions.current.height = window.innerHeight;
    setIsMeasured(true);

    const handleResize = () => {
      dimensions.current.width = window.innerWidth;
      dimensions.current.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (index === preloaderWords.length - 1) return;
    const timeout = setTimeout(
      () => {
        setIndex((prevIndex) => prevIndex + 1);
      },
      index === 0 ? 500 : 220
    );
    return () => clearTimeout(timeout);
  }, [index]);

  const { width, height } = dimensions.current;

  const initialPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${
    height + 300
  } 0 ${height}  L0 0`;
  const targetPath = `M0 0 L${width} 0 L${width} ${height} Q${
    width / 2
  } ${height} 0 ${height}  L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const, delay: 0.3 },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#141516] cursor-wait"
      variants={slideUp}
      initial="initial"
      exit="exit"
    >
      {isMeasured && width > 0 ? (
        <>
          <motion.div
            className="flex items-center text-3xl sm:text-4xl text-white font-medium select-none z-10"
            variants={fade}
            initial="initial"
            animate="enter"
          >
            <Dot size={48} className="me-2 text-white" />
            <p>{preloaderWords[index]}</p>
          </motion.div>
          <motion.svg className="absolute top-0 left-0 -z-10 h-[calc(100%+300px)] w-full pointer-events-none">
            <motion.path
              className="fill-[#141516]"
              variants={curve}
              initial="initial"
              exit="exit"
            />
          </motion.svg>
        </>
      ) : null}
    </motion.div>
  );
}
