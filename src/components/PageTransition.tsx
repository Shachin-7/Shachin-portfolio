'use client';

import { motion } from 'framer-motion';
import React from 'react';

/**
 * Route transition component adding smooth fade and blur effects across pages.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: '100%', willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
}
