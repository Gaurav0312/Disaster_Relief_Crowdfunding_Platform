import { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { AlertCircle, Share2, Heart, MapPin, Clock, Users } from "lucide-react";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import DonationModal from "@/components/DonationModal";

const ProjectCard = ({ project, onDonateClick, onViewClick }) => {
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const shareContainerRef = useRef(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const projectUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/campaigns/${project.id}`
      : "";

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

  const handleDonate = (e) => {
    e.stopPropagation();
    setIsDonationModalOpen(true);
    onDonateClick(project);
  };

  const handleModalClose = () => {
    setIsDonationModalOpen(false);
  };

  const handleViewClick = (e) => {
    e.stopPropagation();
    onViewClick(project.id);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    setShowShareDropdown(!showShareDropdown);
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();
    console.log("Heart clicked for project:", project.id);
  };

  // Main card click handler
  const handleCardClick = () => {
    onViewClick(project.id);
  };

  const getProgressPercentage = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={itemVariants}
        whileHover={{ y: -5 }}
        onClick={handleCardClick}
        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 cursor-pointer"
      >
        <div className="relative">
          <div className="h-48 sm:h-56 md:h-48 relative overflow-hidden">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            {project.urgent && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                <AlertCircle size={14} className="mr-1" /> URGENT
              </div>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">
              {project.title}
            </h3>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {project.category}
            </span>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">
            {project.description}
          </p>

          <div className="flex items-center text-gray-600 mb-2 text-sm">
            <MapPin size={16} className="mr-1 text-blue-500" />
            <span className="text-sm">{project.location}</span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Clock size={16} className="mr-1 text-purple-500" />
              <span>{project.daysLeft} days left</span>
            </div>
            <div className="flex items-center">
              <Users size={16} className="mr-1 text-green-500" />
              <span>{project.donors} donors</span>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${getProgressPercentage(
                  project.raised,
                  project.goal
                )}%`,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>

          <div className="flex justify-between text-sm sm:text-sm mb-6">
            <div className="font-medium text-gray-700">
              {" "}
              {formatCurrency(project.raised)} raised
            </div>
            <div className="text-gray-500">
              {" "}
              of {formatCurrency(project.goal)}
            </div>
          </div>

          <div className="flex justify-between gap-3">
            <button
              onClick={handleDonate}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02]"
            >
              Donate Now
            </button>

            <div className="relative" ref={shareContainerRef}>
              <button
                className="bg-white border border-gray-300 hover:bg-gray-50 rounded-xl p-3"
                onClick={handleShareClick}
              >
                <Share2 size={18} className="text-gray-600" />
              </button>

              {showShareDropdown && (
                <div
                  className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 p-2 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between p-2">
                    <FacebookShareButton
                      url={projectUrl}
                      quote={`Check out this project: ${project.title}`}
                      hashtag="#DisasterRelief"
                      className="transition-transform hover:scale-110"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>

                    <TwitterShareButton
                      url={projectUrl}
                      title={`Support ${project.title}`}
                      hashtags={["DisasterRelief", "Crowdfunding"]}
                      className="transition-transform hover:scale-110"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>

                    <WhatsappShareButton
                      url={projectUrl}
                      title={`Help support ${project.title}`}
                      separator=" "
                      className="transition-transform hover:scale-110"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={handleModalClose}
        project={project}
      />
    </>
  );
};

export default ProjectCard;