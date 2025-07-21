"use client";
import { useEffect, useState, useRef } from "react";
import { Heart, Search, Filter, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  sampleProjects,
  categories as initialCategories,
} from "@/data/sampleData";
import dynamic from "next/dynamic";

import Navbar from "@/components/Navbar";

import HeroSection from "@/components/HeroSection";

const DonationModal = dynamic(() => import("@/components/DonationModal"), {
  ssr: false,
});
const SignInModal = dynamic(() => import("@/components/SignInModal"), {
  ssr: false,
});
const CreateCampaignModal = dynamic(
  () => import("@/components/CreateCampaignModal"),
  { ssr: false }
);
const AboutUs = dynamic(() => import("@/components/AboutUs"), { ssr: false });
const DonorDashboard = dynamic(() => import("@/components/DonorDashboard"), {
  ssr: false,
});

const EmergencyTab = dynamic(() => import("@/components/EmergencyTab"), {
  ssr: false,
});

import {
  containerVariants,
  itemVariants,
  fadeIn,
  slideUp,
  scaleUp,
} from "../lib/animationVariants";

// Animation variants

const DisasterReliefCrowdfunding = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [modalTab, setModalTab] = useState("login");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [projects, setProjects] = useState([]);
  const [categories] = useState(initialCategories);

  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("browse");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    // This list now correctly includes 'about' as a valid tab
    if (
      tabFromUrl &&
      ["browse", "emergency", "dashboard", "about"].includes(tabFromUrl)
    ) {
      if (tabFromUrl !== activeTab) {
        setActiveTab(tabFromUrl);
      }
    } else {
      // Default to 'browse' if the tab is invalid or not present
      setActiveTab("browse");
    }
  }, [searchParams, activeTab]);

  const handleShowCreateModal = (show) => {
    setShowCreateModal(show);
  };

  const handleShowSignInModal = (show) => {
    setShowSignInModal(show);
  };

  const handleSetModalTab = (tab) => {
    setModalTab(tab);
  };

  useEffect(() => {
    // Save scroll position before unload
    const handleBeforeUnload = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    };

    // Restore scroll position on mount
    const restoreScrollPosition = () => {
      const scrollY = sessionStorage.getItem("scrollPosition");

      if (scrollY) {
        // Correctly checks only for the scroll position
        const position = parseInt(scrollY);
        const minPosition = window.innerHeight;
        const finalPosition = Math.max(position, minPosition);

        setTimeout(() => {
          window.scrollTo(0, finalPosition);
        }, 300);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Restore position when component mounts
    restoreScrollPosition();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
    // Save the current scroll position more precisely
    const scrollPosition = window.scrollY;
    console.log("Saving scroll position:", scrollPosition); // Debug log
    sessionStorage.setItem("scrollPosition", scrollPosition.toString());
    router.push(`/campaigns/${projectId}`);
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
        <Navbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onShowCreateModal={handleShowCreateModal}
          onShowSignInModal={handleShowSignInModal}
          onSetModalTab={handleSetModalTab}
        />

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
        {activeTab !== "about" &&
          activeTab !== "emergency" &&
          activeTab !== "dashboard" && (
            <HeroSection
              projects={projects}
              handleDonateClick={handleDonateClick}
            />
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
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
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
                      onViewClick={() => handleViewClick(project.id)}
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
                <EmergencyTab
                  projects={projects}
                  handleDonateClick={handleDonateClick}
                />
              </motion.div>
            )}
            {activeTab === "about" && (
              <AboutUs
                key="about"
                isOpen={activeTab === "about"}
                onClose={() => setActiveTab("browse")}
                handleCreateCampaignClick={handleShowCreateModal}
                projects={projects}
                handleDonateClick={handleDonateClick}
              />
            )}

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
