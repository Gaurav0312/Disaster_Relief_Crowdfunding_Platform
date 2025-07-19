"use client";

import { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Share2,
  MapPin,
  Clock,
  Users,
  Heart, // Added for a potential 'like' feature
} from "lucide-react";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import Image from "next/image";

// Reusable utility functions
const getProgressPercentage = (raised, goal) =>
  Math.min((raised / goal) * 100, 100);

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

// --- Main ProjectCard Component ---
const ProjectCard = ({ project, onDonateClick, onViewClick }) => {
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const shareContainerRef = useRef(null);
  const { ref, inView } = useInView({
    threshold: 0.2, // Trigger animation when 20% of the card is visible
    triggerOnce: true,
  });

  const projectUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/campaigns/${project.id}`
      : "";

  // --- Animation Variants ---
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const contentContainerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  };

  const contentItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const shareDropdownVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    exit: { opacity: 0, scale: 0.8, y: 10 },
  };

  // --- Event Handlers ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shareContainerRef.current &&
        !shareContainerRef.current.contains(event.target)
      ) {
        setShowShareDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Centralize action handlers to call parent functions
  const handleAction = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover="hover"
      onClick={() => onViewClick(project.id)}
      className="group relative flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer border border-transparent hover:border-blue-200"
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>

      <div className="relative flex flex-col h-full bg-white rounded-2xl z-10">
        <motion.div
          variants={contentItemVariants}
          className="relative h-48 sm:h-56 overflow-hidden"
        >
          <motion.div
            className="w-full h-full"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Image
              src={project.imageUrl.replace(
                "/upload/",
                "/upload/w_500,h_300,c_fill,g_auto,f_auto,q_auto/"
              )}
              alt={project.title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-400 ease-in-out"
            />
          </motion.div>
          {project.urgent && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-md">
              <AlertCircle size={14} className="mr-1" /> URGENT
            </div>
          )}
        </motion.div>

        <motion.div
          variants={contentContainerVariants}
          className="p-5 sm:p-6 flex flex-col flex-grow"
        >
          <motion.div variants={contentItemVariants} className="flex-grow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 line-clamp-2">
                {project.title}
              </h3>
              <span className="flex-shrink-0 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full ml-2">
                {project.category}
              </span>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
              {project.description}
            </p>
          </motion.div>

          <motion.div variants={contentItemVariants}>
            <div className="flex items-center text-gray-500 mb-4 text-sm">
              <MapPin size={16} className="mr-2 text-blue-500 flex-shrink-0" />
              <span>{project.location}</span>
            </div>
          </motion.div>
          
          <motion.div variants={contentItemVariants} className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={inView ? { width: `${getProgressPercentage(project.raised, project.goal)}%` } : {}}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="font-semibold text-gray-800">
                {formatCurrency(project.raised)} raised
              </span>
              <span className="text-gray-500">
                Goal: {formatCurrency(project.goal)}
              </span>
            </div>
          </motion.div>

          <motion.div
            variants={contentItemVariants}
            className="flex justify-between items-center text-sm text-gray-600 mb-5"
          >
            <div className="flex items-center">
              <Clock size={16} className="mr-1.5 text-purple-500" />
              <span>{project.daysLeft} days left</span>
            </div>
            <div className="flex items-center">
              <Users size={16} className="mr-1.5 text-green-500" />
              <span>{project.donors} donors</span>
            </div>
          </motion.div>

          <motion.div
            variants={contentItemVariants}
            className="flex justify-between gap-3"
          >
            <motion.button
              onClick={(e) => handleAction(e, () => onDonateClick(project))}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Donate Now
            </motion.button>
            <div className="relative" ref={shareContainerRef}>
              <motion.button
                onClick={(e) => handleAction(e, () => setShowShareDropdown(!showShareDropdown))}
                whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                whileTap={{ scale: 0.95 }}
                className="bg-white border border-gray-300 rounded-xl p-3"
              >
                <Share2 size={18} className="text-gray-600" />
              </motion.button>
              <AnimatePresence>
                {showShareDropdown && (
                  <motion.div
                    variants={shareDropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 p-2 z-20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-around p-2">
                      {[FacebookShareButton, TwitterShareButton, WhatsappShareButton].map((Button, index) => (
                        <motion.div key={index} whileHover={{ scale: 1.15, y: -3 }}>
                          <Button
                            url={projectUrl}
                            title={`Support: ${project.title}`}
                            quote={`Check out this project: ${project.title}`}
                            hashtags={["DisasterRelief", "Crowdfunding"]}
                            separator=" "
                          >
                            {index === 0 && <FacebookIcon size={36} round />}
                            {index === 1 && <TwitterIcon size={36} round />}
                            {index === 2 && <WhatsappIcon size={36} round />}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
