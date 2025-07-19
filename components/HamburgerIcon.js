"use client";

import { motion } from "framer-motion";

const HamburgerIcon = ({ isOpen, ...props }) => {
  // Variants for the top line of the hamburger
  const topVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 45, y: 8 }, // Rotates and moves down to form the 'X'
  };

  // Variants for the middle line
  const centerVariants = {
    closed: { opacity: 1 },
    open: { opacity: 0 }, // Fades out to disappear
  };

  // Variants for the bottom line
  const bottomVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: -45, y: -8 }, // Rotates and moves up to form the 'X'
  };

  return (
    <motion.button
      {...props}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative w-10 h-10 flex flex-col justify-center items-center group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg hover:bg-gray-50"
    >
      <motion.svg
        width="32"
        height="32"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={isOpen ? "open" : "closed"} // Controls the animation state
        initial="closed"
        className="text-gray-900"
      >
        <motion.path
          d="M3 7H21"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={topVariants}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.path
          d="M3 12H21"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={centerVariants}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.path
          d="M3 17H21"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={bottomVariants}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </motion.svg>
    </motion.button>
  );
};

export default HamburgerIcon;