"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Calendar, 
  Users, 
  Target,
  CheckCircle,
  AlertTriangle,
  Camera,
  FileText,
  TrendingUp
} from 'lucide-react';
import DonationModal from '@/components/DonationModal';

const CampaignDetailPage = ({ campaignId, onBack }) => {
  const [campaign, setCampaign] = useState(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

const campaignData = {
    1: {
        id: 1,
        title: "Delhi Earthquake Relief",
        category: "earthquake",
        location: "Delhi, India",
        shortDescription: "Emergency aid for families affected by the devastating 7.2 magnitude earthquake.",
        description: `On June 15, 2025, a devastating 7.2 magnitude earthquake struck Delhi...`,
        goal: 50000,
        raised: 32320,
        donors: 202,
        daysLeft: 2,
        urgent: true,
        imageUrl: "/Delhiearthquake1.jpg",
        gallery: ["/Delhiearthquake1.jpg", "/Delhiearthquake2.jpg", "/Delhiearthquake3.jpg", "/Delhiearthquake4.jpg"],
        updates: [{ date: "June 20, 2025", title: "Update", content: "Content" }],
        impactStats: [{ label: "Families Helped", value: "800+", icon: Users }],
        organizer: {
            name: "Delhi Disaster Relief",
            verified: true,
            description: "A registered NGO",
            contact: "contact@example.com"
        }
    },
    2: {
        id: 2,
        title: "Assam Flood Recovery",
        category: "flood",
        location: "Assam, India",
        shortDescription: "Rebuilding homes after catastrophic floods.",
        description: `The devastating floods in Assam have submerged vast areas...`,
        goal: 100000,
        raised: 78250,
        donors: 1560,
        daysLeft: 25,
        urgent: true,
        imageUrl: "/Assamphoto1.jpg",
        gallery: [
            "/Assamphoto1.jpg", "/Assamphoto2.jpg", "/Assamphoto3.jpg","/Assamphoto4.jpg"],
        updates: [{ date: "June 19, 2025", title: "Update", content: "Content" }],
        impactStats: [{ label: "People Helped", value: "50,000+", icon: Users }],
        organizer: {
            name: "Assam Relief Consortium",
            verified: true,
            description: "Coalition of NGOs",
            contact: "help@example.org"
        }
    },
    3: {
    id: 3,
    title: "Uttarakhand Wildfire Victims",
    category: "wildfire",
    location: "Uttarakhand, India",
    shortDescription: "Support for families who lost homes in the recent wildfires. Funds will help rebuild communities.",
    description: `The recent wildfires in Uttarakhand have destroyed homes and forests, leaving many families without shelter or resources. Your support will help provide emergency relief and rebuild affected communities.`,
    goal: 75000,
    raised: 52100,
    donors: 932,
    daysLeft: 42,
    urgent: false,
    imageUrl: "/UttarakhandWildfire1.jpg",
    gallery: [
        "/UttarakhandWildfire1.jpg",
        "/UttarakhandWildfire2.jpg",
        "/UttarakhandWildfire3.jpg", "/UttarakhandWildfire4.jpg"],
    updates: [{ date: "June 21, 2025", title: "Update", content: "Relief materials distributed to affected families." }],
    impactStats: [{ label: "Families Helped", value: "300+", icon: Users }],
    organizer: {
        name: "Uttarakhand Relief Group",
        verified: true,
        description: "Local NGO supporting wildfire victims",
        contact: "uttarakhandrelief@example.com"
    }
   },
   4: {
    id: 4,
    title: "Kerala Flood Relief",
    category: "flood",
    location: "Kerala, India",
    shortDescription: "Providing urgent relief to families affected by severe flooding in Kerala.",
    description: `Kerala received 310mm of heavy rainfall in the first 48 hours, leading to the overflowing of dams and widespread flooding. Thousands of families have been displaced, homes and infrastructure have been damaged, and immediate support is needed for food, shelter, and medical care. Your contribution will help provide emergency relief and support long-term recovery efforts.`,
    goal: 60000,
    raised: 28500,
    donors: 487,
    daysLeft: 8,
    urgent: true,
    imageUrl: "/KeralaFlood1.jpg",
    gallery: [
        "/KeralaFlood1.jpg",
        "/KeralaFlood2.jpg",
        "/KeralaFlood3.jpg",
        "/KeralaFlood4.jpg"
    ],
    updates: [
        { date: "June 22, 2025", title: "Initial Relief Distributed", content: "Essential supplies and food packets have been distributed to over 1,000 families in the most affected areas." }
    ],
    impactStats: [
        { label: "Families Helped", value: "1,000+", icon: Users }
    ],
    organizer: {
        name: "Kerala Relief Foundation",
        verified: true,
        description: "A coalition of local NGOs and volunteers providing flood relief in Kerala.",
        contact: "keralarelief@example.com"
    }
    },
    5: {
    id: 5,
    title: "Himachal Landslide Relief",
    category: "landslide",
    location: "Himachal Pradesh, India",
    shortDescription: "Emergency relief for families affected by the devastating landslide in Sirmaur district.",
    description: `A terrifying landslide was witnessed in a remote part of Himachal Pradesh's Sirmaur district. Triggered by heavy rainfall, the landslide caused significant damage to homes, infrastructure, and livelihoods. Immediate support is needed to provide shelter, food, and medical assistance to the affected families. Your contribution will help rebuild lives and restore hope in the community.`,
    goal: 90000,
    raised: 67300,
    donors: 1245,
    daysLeft: 21,
    urgent: true,
    imageUrl: "/HimachalPhoto1.jpg",
    gallery: [
        "/HimachalPhoto1.jpg",
        "/HimachalPhoto2.jpg",
        "/HimachalPhoto3.jpg",
        "/HimachalPhoto4.jpg"
    ],
    updates: [
        { date: "June 23, 2025", title: "Relief Operations Started", content: "Rescue teams have reached the affected area and distributed essential supplies to families in need." }
    ],
    impactStats: [
        { label: "Families Assisted", value: "500+", icon: Users }
    ],
    organizer: {
        name: "Himachal Relief Network",
        verified: true,
        description: "A coalition of local NGOs and volunteers providing landslide relief in Himachal Pradesh.",
        contact: "himachalrelief@example.com"
    }
    }        
   
};

  useEffect(() => {
    const campaignInfo = campaignData[campaignId];
    if (campaignInfo) {
      setCampaign(campaignInfo);
    }
  }, [campaignId]);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = (campaign.raised / campaign.goal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Campaigns</span>
            </button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="relative h-96">
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
                {campaign.urgent && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    URGENT
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {campaign.category}
                  </span>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {campaign.location}
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.title}</h1>
                <p className="text-gray-600 text-lg">{campaign.shortDescription}</p>
              </div>
            </motion.div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: FileText },
                    { id: 'updates', label: 'Updates', icon: TrendingUp },
                    { id: 'gallery', label: 'Gallery', icon: Camera }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">About This Campaign</h3>
                        <div className="prose prose-gray max-w-none">
                          {campaign.description.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="text-gray-600 mb-4 leading-relaxed">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Impact So Far</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {campaign.impactStats.map((stat, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl text-center"
                            >
                              <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                              <div className="text-sm text-gray-600">{stat.label}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Campaign Organizer</h3>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <div className="flex items-center mb-2">
                            <h4 className="font-bold text-gray-900">{campaign.organizer.name}</h4>
                            {campaign.organizer.verified && (
                              <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{campaign.organizer.description}</p>
                          <p className="text-sm text-blue-600">{campaign.organizer.contact}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'updates' && (
                    <motion.div
                      key="updates"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-bold text-gray-900">Campaign Updates</h3>
                      {campaign.updates.map((update, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-l-4 border-blue-500 pl-6 pb-6"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-gray-900">{update.title}</h4>
                            <span className="text-sm text-gray-500">{update.date}</span>
                          </div>
                          <p className="text-gray-600 mb-4">{update.content}</p>
                          {update.image && (
                            <img
                              src={update.image}
                              alt={update.title}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'gallery' && (
                    <motion.div
                      key="gallery"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-bold text-gray-900">Photo Gallery</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {campaign.gallery.map((image, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="aspect-video bg-gray-200 rounded-lg overflow-hidden"
                          >
                            <img
                              src={image}
                              alt={`Gallery image ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg sticky top-28"
            >
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{campaign.raised.toLocaleString()}
                  </span>
                  <span className="text-gray-600">
                    of ₹{campaign.goal.toLocaleString()}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full"
                  />
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{progressPercentage.toFixed(1)}% funded</span>
                  <span>{campaign.daysLeft} days left</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Donors</span>
                  <span className="font-medium">{campaign.donors}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium capitalize">{campaign.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{campaign.location}</span>
                </div>
              </div>

              <button
                onClick={() => setIsDonationModalOpen(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Donate Now
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        project={campaign}
      />
    </div>
  );
};

export default CampaignDetailPage;