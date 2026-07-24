'use client';

import { motion } from 'framer-motion';

/**
 * Splash Screen
 * - Kurir naik motor bergerak dari kiri ke kanan
 * - Logo muncul perlahan
 * - Durasi ~3 detik, lalu parent menyembunyikan
 */
export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-brand-50 via-white to-brand-50">
      {/* Logo fade-in */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mb-10 flex flex-col items-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-500 shadow-glow">
          <svg viewBox="0 0 100 100" className="h-12 w-12" fill="none">
            <path
              d="M28 64 L28 38 Q28 30 36 30 L52 30 Q64 30 64 40 Q64 50 52 50 L40 50"
              stroke="white"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="68" cy="64" r="9" fill="white" />
            <circle cx="36" cy="64" r="6" fill="white" opacity="0.85" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-gray-900">
          Rekber<span className="text-brand-500">Market</span>
        </h1>
        <p className="mt-1 text-xs font-medium text-gray-400">
          Belanja Aman & Terpercaya
        </p>
      </motion.div>

      {/* Courier on motorcycle L→R */}
      <div className="relative h-32 w-full max-w-md overflow-hidden px-6">
        {/* ground line */}
        <div className="absolute bottom-10 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-brand-200 to-transparent" />

        <motion.div
          initial={{ x: '-120%' }}
          animate={{ x: '120%' }}
          transition={{ duration: 2.6, ease: 'easeInOut', repeat: 0 }}
          className="absolute bottom-8 left-0"
        >
          <CourierBike />
        </motion.div>

        {/* dust particles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0], x: -10 - i * 6 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: 0.4 + i * 0.15,
            }}
            className="absolute bottom-9 h-1.5 w-1.5 rounded-full bg-brand-300"
            style={{ left: 40 - i * 8 }}
          />
        ))}
      </div>

      {/* Loading bar */}
      <div className="mt-8 h-1.5 w-40 overflow-hidden rounded-full bg-gray-100">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.9, ease: 'easeInOut' }}
          className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
        />
      </div>
      <p className="mt-3 text-xs font-medium text-gray-400">Memuat…</p>
    </div>
  );
}

function CourierBike() {
  return (
    <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* back wheel */}
      <motion.circle
        cx="22" cy="46" r="11" stroke="#9A3412" strokeWidth="3"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
        style={{ originX: '22px', originY: '46px' }}
      />
      <circle cx="22" cy="46" r="3" fill="#9A3412" />

      {/* front wheel */}
      <motion.circle
        cx="92" cy="46" r="11" stroke="#9A3412" strokeWidth="3"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
        style={{ originX: '92px', originY: '46px' }}
      />
      <circle cx="92" cy="46" r="3" fill="#9A3412" />

      {/* body */}
      <path d="M22 46 L40 30 L70 30 L92 46" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
      <path d="M40 30 L55 30" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />

      {/* rider body */}
      <path d="M55 30 Q58 20 64 18" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
      <circle cx="66" cy="14" r="6" fill="#1f2937" />
      <path d="M64 18 L72 30" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />

      {/* delivery box */}
      <rect x="42" y="22" width="14" height="12" rx="2" fill="#F97316" stroke="#9A3412" strokeWidth="1.5" />
    </svg>
  );
}
