"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  Heart,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  IndianRupee,
  ArrowRight,
  Globe,
  Shield,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DonationModal from "@/components/DonationModal";
import SignInModal from "@/components/SignInModal";
import DonorDashboard from "@/components/DonorDashboard";
import ProjectCard from "@/components/ProjectCard";
import AboutUs from "@/components/AboutUs";
import CreateCampaignModal from "@/components/CreateCampaignModal";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const scaleOnHover = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
};

const scaleUp = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const UserMenu = ({ user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Mobile: Always show name next to avatar */}
      <button
        onClick={toggleMenu}
        className="flex items-center max-w-xs transition-opacity hover:opacity-90 focus:outline-none rounded-full p-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <img
          src={
            user.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name
            )}&background=random`
          }
          alt={user.name}
          className="w-10 h-10 sm:w-9 sm:h-9 rounded-full border-2 border-white shadow-sm"
          width={40}
          height={40}
          loading="lazy"
        />
        <span className="ml-2 font-medium text-gray-800 truncate max-w-[100px] sm:max-w-[120px]">
          {user.name}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ml-1 text-gray-500 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed sm:absolute bottom-0 left-0 right-0 sm:right-auto sm:left-auto sm:top-full sm:mt-2 w-full sm:w-56 bg-white border-t border-gray-200 sm:border sm:rounded-lg shadow-lg z-50 divide-y divide-gray-100 flex flex-col max-h-[80vh] sm:max-h-none"
          >
            {/* Mobile header (only shows on mobile) */}
            <div className="sm:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center">
                <img
                  src={
                    user.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}&background=random`
                  }
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-white mr-3"
                />
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* User info (desktop only) */}
            <div className="hidden sm:block px-4 py-3">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-700 truncate mt-0.5">
                {user.email}
              </p>
            </div>

            <div className="py-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onSignOut();
                }}
                className="block w-full text-left px-4 py-3 sm:py-2.5 text-base sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:bg-gray-50"
                aria-label="Sign out"
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-4 sm:w-4 mr-3 sm:mr-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DisasterReliefCrowdfunding = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [modalTab, setModalTab] = useState("login");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [projects, setProjects] = useState([]);
  const [categories] = useState([
    { id: "all", name: "All Categories" },
    { id: "earthquake", name: "Earthquake" },
    { id: "flood", name: "Flood" },
    { id: "wildfire", name: "Wildfire" },
    { id: "hurricane", name: "Hurricane" },
    { id: "landslide", name: "Landslide" },
    { id: "other", name: "Other Disasters" },
  ]);

  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("browse");

  // Sample projects data with image URLs
  const sampleProjects = [
    {
      id: 1,
      title: "Surat Monsoon Flood Relief",
      category: "flood",
      location: "Surat, Gujarat",
      description:
        "Urgent relief for families affected by severe monsoon flooding in Surat city. Over 280mm rainfall in 48 hours caused widespread inundation.",
      goal: 85000,
      raised: 42800,
      donors: 876,
      daysLeft: 12,
      urgent: true,
      imageUrl: "/SuratFlood1.jpg",
    },
    {
      id: 2,
      title: "Ahmedabad Plane Crash Relief",
      category: "aviation",
      location: "Ahmedabad, Gujarat",
      description:
        "Emergency support for families affected by the catastrophic Air India Flight 171 crash. Providing immediate financial assistance, medical care, and psychological counseling.",
      goal: 150000,
      raised: 98750,
      donors: 2340,
      daysLeft: 45,
      urgent: true,
      imageUrl: "/AhmedabadCrash1.webp",
    },
    {
      id: 3,
      title: "Delhi Earthquake Relief",
      category: "earthquake",
      location: "Delhi, India",
      description:
        "Emergency aid for families affected by the devastating 7.2 magnitude earthquake. Providing shelter, clean water and medical supplies.",
      goal: 50000,
      raised: 32320,
      donors: 202,
      daysLeft: 2,
      urgent: true,
      imageUrl: "/Delhiearthquake1.jpg",
    },
    {
      id: 4,
      title: "Assam Flood Recovery",
      category: "flood",
      location: "Assam, India",
      description:
        "Rebuilding homes and restoring livelihoods after catastrophic floods displaced millions of people.",
      goal: 100000,
      raised: 78250,
      donors: 1560,
      daysLeft: 25,
      urgent: true,
      imageUrl: "/Assamphoto1.jpg",
    },
    {
      id: 5,
      title: "Uttarakhand Wildfire Victims",
      category: "wildfire",
      location: "Uttarakhand, India",
      description:
        "Support for families who lost homes in the recent wildfires. Funds will help rebuild communities.",
      goal: 75000,
      raised: 52100,
      donors: 932,
      daysLeft: 42,
      urgent: false,
      imageUrl: "/UttarakhandWildfire1.jpg",
    },
    {
      id: 6,
      title: "Kerala Flood Relief",
      category: "flood",
      location: "Kerala, India",
      description:
        "Kerala received 310mm of heavy rainfall in the first 48 hours. This led to the overflowing of dams.",
      goal: 60000,
      raised: 28500,
      donors: 487,
      daysLeft: 8,
      urgent: true,
      imageUrl: "/KeralaFlood1.jpg",
    },
    {
      id: 7,
      title: "Himanchal Land Slide",
      category: "landslide",
      location: "Himachal Pradesh, India",
      description:
        "A terrifying landslide was witnessed in a remote part of Himachal Pradesh's Sirmaur district. It was triggered by heavy rainfall and caused significant damage to homes and infrastructure.",
      goal: 90000,
      raised: 67300,
      donors: 1245,
      daysLeft: 21,
      urgent: true,
      imageUrl: "/HimachalPhoto1.jpg",
    },
  ];

  useEffect(() => {
    setProjects(sampleProjects);
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Filter projects based on search and category
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDonateClick = (project) => {
    setSelectedProject(project);
    setIsDonationModalOpen(true);
  };

  const handleViewClick = (projectId) => {
    router.push(`/campaigns/${projectId}`);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Background Pattern with animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 to-purple-100/20" />
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-10 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-32 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 25, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-10 left-1/3 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl"
        />
      </motion.div>

      <div className="relative z-10">
        {/* Animated Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <div className="flex items-center">
                <a href="/" className="flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-2"
                  >
                    <Heart className="h-7 w-7" fill="currentColor" />
                  </motion.div>
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="ml-3 text-2xl font-bold text-gray-900"
                  >
                    Relief Fund
                  </motion.span>
                </a>
              </div>

              {/* Desktop Menu */}
              <nav className="hidden md:flex space-x-8">
                <button
                  onClick={() => handleTabChange("browse")}
                  className="px-3 py-3 rounded-md text-sm font-medium capitalize bg-gradient-to-br from-blue-600 to-purple-600 box-shadow text-white"
                >
                  Browse
                </button>
                <button
                  onClick={() => handleTabChange("emergency")}
                  className="px-3 py-3 rounded-md text-sm font-medium capitalize bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                >
                  Emergency
                </button>
                <button
                  onClick={() => handleTabChange("about")}
                  className="px-3 py-3 rounded-md text-sm font-medium capitalize bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                >
                  About Us
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-3 py-3 rounded-md text-sm font-medium capitalize bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                >
                  Create Campaign
                </button>
                {status === "authenticated" && (
                  <button
                    onClick={() => handleTabChange("dashboard")}
                    className="px-3 py-3 rounded-md text-sm font-medium capitalize bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                  >
                    Dashboard
                  </button>
                )}
              </nav>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-expanded={isMobileMenuOpen}
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  <svg
                    className="w-7 h-7 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>

              {/* User Actions */}
              <div className="hidden md:flex items-center space-x-2">
                {status === "authenticated" ? (
                  <UserMenu
                    user={session.user}
                    onSignOut={() => signOut({ callbackUrl: "/" })}
                  />
                ) : status === "loading" ? (
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setModalTab("login");
                        setShowSignInModal(true);
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setModalTab("register");
                        setShowSignInModal(true);
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Items */}
            {isMobileMenuOpen && (
              <div className="flex flex-col space-y-4 mt-4 md:hidden">
                <button
                  onClick={() => {
                    handleTabChange("browse");
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg"
                >
                  Browse
                </button>
                <button
                  onClick={() => {
                    handleTabChange("emergency");
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg"
                >
                  Emergency
                </button>
                <button
                  onClick={() => {
                    setActiveTab("about");
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg"
                >
                  About Us
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg"
                >
                  Create Campaign
                </button>
                {status === "authenticated" && (
                  <button
                    onClick={() => {
                      handleTabChange("dashboard");
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg"
                  >
                    Dashboard
                  </button>
                )}

                {/* Mobile User Buttons */}
                {status === "authenticated" && (
                  <div className="flex flex-col space-y-2 mt-2">
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: window.location.origin });
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 box-shadow text-white py-2 rounded-lg"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
                {status !== "authenticated" && status !== "loading" && (
                  <div className="flex flex-col space-y-2 mt-2">
                    <button
                      onClick={() => {
                        setModalTab("login");
                        setShowSignInModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setModalTab("register");
                        setShowSignInModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.header>

        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          initialTab={modalTab}
        />
        <CreateCampaignModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCampaignCreated={() => {
            setShowCreateModal(false);
            setShowLaunchModal(true);
          }}
        />
        {/* Hero Section with animations */}
        {activeTab !== "about" && activeTab !== "emergency" && (
          <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
              <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
              <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            <div className="relative z-10 flex items-center justify-center min-h-screen py-20 px-4">
              <div className="max-w-6xl mx-auto text-center">
                {/* Trust Badge */}
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg border border-gray-200">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Trusted by 50,000+ donors worldwide
                  </span>
                </div>

                {/* Main Headline */}
                <div className="mb-8">
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-4 leading-tight">
                    Help Communities
                    <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                      Rebuild & Recover
                    </span>
                  </h1>

                  <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-8"></div>
                </div>

                {/* Enhanced Description */}
                <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                  Every donation creates ripples of hope. Join our mission to
                  support families and communities rebuilding their lives after
                  natural disasters.
                </p>

                {/* 
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <span className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Donate Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button className="group bg-white/80 backdrop-blur-sm text-gray-800 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-200 hover:border-blue-300">
              <span className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                View Impact Stories
              </span>
            </button>
          </div> */}

                {/* Enhanced Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200">
                    <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-3">
                      ₹3.5M+
                    </div>
                    <div className="text-gray-700 font-semibold text-lg mb-2">
                      Funds Raised
                    </div>
                    <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                      <IndianRupee className="w-4 h-4" />
                      <span>Total Fund Raised</span>
                    </div>
                  </div>

                  <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200">
                    <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-3">
                      12K+
                    </div>
                    <div className="text-gray-700 font-semibold text-lg mb-2">
                      Lives Impacted
                    </div>
                    <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                      <Users className="w-4 h-4" />
                      <span>Across Indian states</span>
                    </div>
                  </div>

                  <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200">
                    <div className="text-5xl font-black bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent mb-3">
                      5+
                    </div>
                    <div className="text-gray-700 font-semibold text-lg mb-2">
                      Active Campaigns
                    </div>
                    <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                      <Globe className="w-4 h-4" />
                      <span>Real-time updates</span>
                    </div>
                  </div>
                </div>

                {/* Impact Indicators */}
                <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>24/7 Emergency Response</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
                    <span>100% Transparency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-600"></div>
                    <span>Direct Community Impact</span>
                  </div>
                </div>
              </div>
            </div>

            <style jsx>{`
              @keyframes gradient {
                0% {
                  background-position: 0% 50%;
                }
                50% {
                  background-position: 100% 50%;
                }
                100% {
                  background-position: 0% 50%;
                }
              }

              .animate-gradient {
                background-size: 200% 200%;
                animation: gradient 3s ease infinite;
              }

              .bg-grid-pattern {
                background-image:
                  linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                  linear-gradient(
                    90deg,
                    rgba(0, 0, 0, 0.1) 1px,
                    transparent 1px
                  );
                background-size: 20px 20px;
              }
            `}</style>
          </section>
        )}

        {/* Main Content with animated transitions between tabs */}
        <main className="max-w mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <AnimatePresence mode="wait">
            {activeTab === "browse" && (
              <motion.div
                key="browse"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Search and Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search projects by name, location or keywords..."
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Filter className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="appearance-none block pl-10 pr-10 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl">
                        Search
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Projects Grid */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onDonateClick={handleDonateClick}
                      onViewClick={() =>
                        router.push(`/campaigns/${project.id}`)
                      }
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {activeTab === "emergency" && (
              <motion.div
                key="emergency"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-center px-4 py-6 sm:px-6"
              >
                <motion.div
                  variants={scaleUp}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-12 border border-white/20 max-w-3xl mx-auto"
                >
                  <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-4 rounded-full">
                      <AlertCircle size={40} className="text-red-600" />
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                    Emergency Relief Needed
                  </h2>
                  <p className="text-base sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Immediate support for communities facing active disasters.
                    Your donation today provides life-saving aid.
                  </p>

                  <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 sm:p-8 mb-10 text-white text-left">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">
                      Current Emergency Campaigns
                    </h3>

                    <div className="space-y-4">
                      {projects
                        .filter((p) => p.urgent)
                        .map((project) => (
                          <div
                            key={project.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/20 p-4 rounded-xl space-y-4 sm:space-y-0"
                          >
                            <div>
                              <h4 className="font-bold text-base sm:text-lg">
                                {project.title}
                              </h4>
                              <p className="text-sm opacity-90">
                                {project.location}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDonateClick(project)}
                              className="bg-white text-red-600 hover:bg-red-50 font-medium py-2 px-4 sm:px-6 rounded-lg"
                            >
                              Donate
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="max-w-2xl mx-auto">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                      How Emergency Funding Helps
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-left">
                      {[
                        {
                          title: "Medical Supplies",
                          desc: "First aid kits, medicines and emergency care",
                        },
                        {
                          title: "Shelter",
                          desc: "Tents, blankets and temporary housing",
                        },
                        {
                          title: "Clean Water & Food",
                          desc: "Essential supplies for survival",
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="bg-blue-50 p-4 sm:p-6 rounded-2xl"
                        >
                          <div className="text-blue-600 font-bold mb-2">
                            {item.title}
                          </div>
                          <p className="text-gray-600 text-sm sm:text-base">
                            {item.desc}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
            {activeTab === "about" && <AboutUs />}

            {/* Add Dashboard tab */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <DonorDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {showLaunchModal && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLaunchModal(false)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 w-full max-w-md text-center shadow-xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <CheckCircle
                  size={48}
                  className="text-green-500 mx-auto mb-4"
                />
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Details Submitted
                </h3>
                <p className="text-gray-600 mb-4">
                  Your campaign details are saved with us. Once our team
                  verifies them, your campaign will be launched.
                </p>
                <button
                  onClick={() => setShowLaunchModal(false)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-lg"
                >
                  OK
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        project={selectedProject}
      />
    </div>
  );
};

export default DisasterReliefCrowdfunding;
