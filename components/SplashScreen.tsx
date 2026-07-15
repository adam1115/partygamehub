"use client";

import { motion, AnimatePresence } from "framer-motion";

type SplashScreenProps = {
  show: boolean;
};

export default function SplashScreen({ show }: SplashScreenProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-white">
              🎭 Party Game Hub
            </h1>

            <p className="text-gray-400 mt-4">
              Let's Start the Party!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}