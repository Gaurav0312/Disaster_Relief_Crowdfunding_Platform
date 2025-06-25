"use client"
import { useEffect, useState, useRef, useCallback } from 'react';
import { Heart, Search, Filter, AlertCircle,CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DonationModal from '@/components/DonationModal';
import SignInModal from '@/components/SignInModal';
import DonorDashboard from '@/components/DonorDashboard';
import ProjectCard from '@/components/ProjectCard';
import AboutUs from '@/components/AboutUs';
import CreateCampaignModal from '@/components/CreateCampaignModal';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const scaleUp = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
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
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center max-w-xs transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <img 
          src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
          alt={user.name}
          className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
          width={36}
          height={36}
          loading="lazy"
        />
        <span className="ml-2 hidden md:inline font-medium text-gray-800 truncate max-w-[120px]">
          {user.name}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 divide-y divide-gray-100"
          >
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-700 truncate mt-0.5">{user.email}</p>
            </div>
            
            <div className="py-1">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onSignOut();
                }}
                className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:bg-gray-50"
                aria-label="Sign out"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [projects, setProjects] = useState([]);
  const [categories] = useState([
    { id: 'all', name: 'All Categories' },
    { id: 'earthquake', name: 'Earthquake' },
    { id: 'flood', name: 'Flood' },
    { id: 'wildfire', name: 'Wildfire' },
    { id: 'hurricane', name: 'Hurricane' },
    { id: 'landslide', name: 'Landslide' },
    { id: 'other', name: 'Other Disasters' },
  ]);

  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('browse');

  // Sample projects data with image URLs
  const sampleProjects = [
    {
      id: 1,
      title: "Surat Monsoon Flood Relief",
      category: "flood",
      location: "Surat, Gujarat",
      description: "Urgent relief for families affected by severe monsoon flooding in Surat city. Over 280mm rainfall in 48 hours caused widespread inundation.",
      goal: 85000,
      raised: 42800,
      donors: 876,
      daysLeft: 12,
      urgent: true,
      imageUrl: "/SuratFlood1.jpg"
    },
    {
      id: 2,
      title: "Ahmedabad Air India Crash Relief",
      category: "aviation",
      location: "Ahmedabad, Gujarat",
      description: "Emergency support for families affected by the catastrophic Air India Flight 171 crash. Providing immediate financial assistance, medical care, and psychological counseling.",
      goal: 150000,
      raised: 98750,
      donors: 2340,
      daysLeft: 45,
      urgent: true,
      imageUrl: "/AhmedabadCrash1.webp"
    },
    {
      id: 3,
      title: "Delhi Earthquake Relief",
      category: "earthquake",
      location: "Delhi, India",
      description: "Emergency aid for families affected by the devastating 7.2 magnitude earthquake. Providing shelter, clean water and medical supplies.",
      goal: 50000,
      raised: 32320,
      donors: 202,
      daysLeft: 2,
      urgent: true,
      imageUrl: "/DelhiEarthquake1.jpg"
    },
    {
      id: 4,
      title: "Assam Flood Recovery",
      category: "flood",
      location: "Assam, India",
      description: "Rebuilding homes and restoring livelihoods after catastrophic floods displaced millions of people.",
      goal: 100000,
      raised: 78250,
      donors: 1560,
      daysLeft: 25,
      urgent: true,
      imageUrl: "/Assamphoto1.jpg"
    },
    {
      id: 5,
      title: "Uttarakhand Wildfire Victims",
      category: "wildfire",
      location: "Uttarakhand, India",
      description: "Support for families who lost homes in the recent wildfires. Funds will help rebuild communities.",
      goal: 75000,
      raised: 52100,
      donors: 932,
      daysLeft: 42,
      urgent: false,
      imageUrl: "/UttarakhandWildfire1.jpg"
    },
    {
      id: 6,
      title: "Kerala Flood Relief",
      category: "flood",
      location: "Kerala, India",
      description: "Kerala received 310mm of heavy rainfall in the first 48 hours. This led to the overflowing of dams.",
      goal: 60000,
      raised: 28500,
      donors: 487,
      daysLeft: 8,
      urgent: true,
      imageUrl: "/KeralaFlood1.jpg"
    },
    {
      id: 7,
      title: "Himanchal Land Slide",
      category: "landslide",
      location: "Himachal Pradesh, India",
      description: "A terrifying landslide was witnessed in a remote part of Himachal Pradesh's Sirmaur district. It was triggered by heavy rainfall and caused significant damage to homes and infrastructure.",
      goal: 90000,
      raised: 67300,
      donors: 1245,
      daysLeft: 21,
      urgent: true,
      imageUrl: "/HimachalPhoto1.jpg"
    },
  ];

  useEffect(() => {
    setProjects(sampleProjects);
  }, []);

  useEffect(() => {
  const tabParam = searchParams.get('tab');
  if (tabParam && tabParam !== activeTab) {
    setActiveTab(tabParam);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [searchParams]);

  // Filter projects based on search and category
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
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
  params.set('tab', tab);
  router.replace(`?${params.toString()}`);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
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
            y: [0, 15, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-32 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{
            x: [0, 25, 0],
            y: [0, -15, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
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
                <Link href="/" className="flex items-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-2"
                >
                  <Heart className="h-7 w-7" fill="currentColor" />
                </motion.div>
                <h1 className="ml-3 text-2xl font-bold text-gray-900">Relief Fund</h1></Link>
              </div>

              {/* Desktop Menu */}
             <nav className="hidden md:flex space-x-8">
              <button onClick={() => handleTabChange('browse')} className="px-3 py-3 rounded-md text-sm font-medium capitalize bg-gradient-to-br from-blue-600 to-purple-600 text-white">Browse</button>
              <button onClick={() => handleTabChange('emergency')} className="px-3 py-3 rounded-md text-sm font-medium capitalize bg-gradient-to-br from-blue-600 to-purple-600 text-white">Emergency</button>
              <button onClick={() => setShowAboutModal(true)} className="px-3 py-3 rounded-md text-sm font-medium capitalize bg-gradient-to-br from-blue-600 to-purple-600 text-white">About Us</button>
              <button onClick={() => setShowCreateModal(true)} className="px-3 py-3 rounded-md text-sm font-medium capitalize bg-gradient-to-br from-blue-600 to-purple-600 text-white">Create Campaign</button>
              {status === 'authenticated' && (
              <button onClick={() => handleTabChange('dashboard')} className="px-3 py-3 rounded-md text-sm font-medium capitalize bg-gradient-to-br from-blue-600 to-purple-600 text-white">Dashboard</button>
              )}
             </nav>

             {/* Mobile Menu Button */}
              <div className="md:hidden">
               <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
               <svg className="w-7 h-7 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
               </svg>
               </button>
              </div>
            
              {/* User Actions */}
              <div className="hidden md:flex items-center space-x-2">
               {status === 'authenticated' ? (
               <UserMenu user={session.user} onSignOut={() => signOut({ callbackUrl: '/' })} />
                ) : status === 'loading' ? (
               <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                ) : (
                <>
               <button onClick={() => setShowSignInModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium">Sign In</button>
               <button onClick={() => setShowSignInModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium">Register</button>
                </>
                )}
               </div>
             </div>

             {/* Mobile Menu Items */}
    {isMobileMenuOpen && (
      <div className="flex flex-col space-y-4 mt-4 md:hidden">
        <button onClick={() => { handleTabChange('browse'); setIsMobileMenuOpen(false); }} className="text-gray-900 bg-gray-100 py-2 rounded-lg">Browse</button>
        <button onClick={() => { handleTabChange('emergency'); setIsMobileMenuOpen(false); }} className="text-gray-900 bg-gray-100 py-2 rounded-lg">Emergency</button>
        <button onClick={() => { setShowAboutModal(true); setIsMobileMenuOpen(false); }} className="text-gray-900 bg-gray-100 py-2 rounded-lg">About Us</button>
        <button onClick={() => { setShowCreateModal(true); setIsMobileMenuOpen(false); }} className="text-gray-900 bg-gray-100 py-2 rounded-lg">Create Campaign</button>
        {status === 'authenticated' && (
          <button onClick={() => { handleTabChange('dashboard'); setIsMobileMenuOpen(false); }} className="text-gray-900 bg-gray-100 py-2 rounded-lg">Dashboard</button>
        )}

        {/* Mobile User Buttons */}
        {status !== 'authenticated' && status !== 'loading' && (
          <div className="flex flex-col space-y-2 mt-2">
            <button onClick={() => { setShowSignInModal(true); setIsMobileMenuOpen(false); }} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg">Sign In</button>
            <button onClick={() => { setShowSignInModal(true); setIsMobileMenuOpen(false); }} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg">Register</button>
          </div>
        )}
      </div>
    )}
          </div>
        </motion.header>

        <SignInModal 
          isOpen={showSignInModal} 
          onClose={() => setShowSignInModal(false)} 
        />

        {showAboutModal && (
         <AboutUs onClose={() => setShowAboutModal(false)} />
        )}

        <CreateCampaignModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onLaunch={() => {
            setShowCreateModal(false);
            setShowLaunchModal(true);
          }}
        />

        {/* Hero Section with animations */}
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="py-20 text-center"
        >
          <motion.div variants={fadeIn} className="max-w-4xl mx-auto px-4">
            <motion.h2 
              variants={slideUp}
              className="text-5xl md:text-6xl font-bold text-gray-800 mb-6"
            >
              Help Communities
              <motion.span 
                variants={slideUp}
                className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                Rebuild After Disasters
              </motion.span>
            </motion.h2>
            
            <motion.p 
              variants={fadeIn}
              className="text-xl text-gray-900 mb-8 max-w-2xl mx-auto"
            >
              Every donation makes a difference. Support families and communities recovering from natural disasters worldwide.
            </motion.p>
            
            <motion.div 
              variants={containerVariants}
              className="flex flex-wrap justify-center gap-8 mt-12"
            >
              <motion.div variants={itemVariants} className="text-center">
                <div className="text-4xl font-bold text-blue-600">₹3.5M+</div>
                <div className="text-gray-800">Funds Raised</div>
              </motion.div>
              <motion.div variants={itemVariants} className="text-center">
                <div className="text-4xl font-bold text-purple-600">12K+</div>
                <div className="text-gray-800">People Helped</div>
              </motion.div>
              <motion.div variants={itemVariants} className="text-center">
                <div className="text-4xl font-bold text-pink-600">5+</div>
                <div className="text-gray-800">Active Campaigns</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Main Content with animated transitions between tabs */}
        <main className="max-w mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <AnimatePresence mode="wait">
            {activeTab === 'browse' && (
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
                  {filteredProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project}
                      onDonateClick={handleDonateClick}
                      onViewClick={() => router.push(`/campaigns/${project.id}`)}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'emergency' && (
              <motion.div
                key="emergency"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <motion.div 
                  variants={scaleUp}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 border border-white/20 max-w-3xl mx-auto"
                >
                  <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-4 rounded-full">
                      <AlertCircle size={48} className="text-red-600" />
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Emergency Relief Needed</h2>
                  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Immediate support for communities facing active disasters. Your donation today provides life-saving aid.
                  </p>
                  
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 mb-10 text-white text-left">
                    <h3 className="text-2xl font-bold mb-4">Current Emergency Campaigns</h3>
                    
                    <div className="space-y-4">
                      {projects.filter(p => p.urgent).map(project => (
                        <div key={project.id} className="flex items-center justify-between bg-white/20 p-4 rounded-xl">
                          <div>
                            <h4 className="font-bold">{project.title}</h4>
                            <p className="text-sm opacity-90">{project.location}</p>
                          </div>
                          <button 
                           onClick={() => handleDonateClick(project)}
                           className="bg-white text-red-600 hover:bg-red-50 font-medium py-2 px-6 rounded-lg"
                           >
                            Donate
                         </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">How Emergency Funding Helps</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                      {[
                        { title: "Medical Supplies", desc: "First aid kits, medicines and emergency care" },
                        { title: "Shelter", desc: "Tents, blankets and temporary housing" },
                        { title: "Clean Water & Food", desc: "Essential supplies for survival" }
                      ].map((item, index) => (
                        <motion.div 
                          key={index}
                          variants={itemVariants}
                          className="bg-blue-50 p-6 rounded-2xl"
                        >
                          <div className="text-blue-600 font-bold mb-2">{item.title}</div>
                          <p className="text-gray-600">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

          {/* Add Dashboard tab */}
          {activeTab === 'dashboard' && (
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
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-800">Details Submitted</h3>
                <p className="text-gray-600 mb-4">
                  Your campaign details are saved with us. Once our team verifies them,
                  your campaign will be launched.
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