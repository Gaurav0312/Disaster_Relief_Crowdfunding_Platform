"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Share2, MapPin, Calendar, Users, CheckCircle, AlertTriangle, Camera, FileText, TrendingUp, Clock, Leaf, Anchor,GraduationCap, Phone, Mail, Shield, Home, Zap, Droplets, Mountain, Flame, Activity, Package, Truck, ExternalLink,} from 'lucide-react';
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
        description: `On June 15, 2025, at 3:47 AM IST, a catastrophic 7.2 magnitude earthquake struck the National Capital Region of Delhi, causing widespread destruction and displacement. The earthquake, centered 15 km northeast of Connaught Place, was felt across North India and is considered the most severe seismic event in the region's recorded history.

        The disaster has affected over 2.5 million people across Delhi and neighboring areas. More than 180,000 families have been displaced from their homes, with thousands of buildings suffering structural damage or complete collapse. Critical infrastructure including hospitals, schools, and transportation networks have been severely impacted.

        Our emergency response focuses on providing immediate relief through temporary shelters, medical aid, clean water, and food supplies. We're working with local authorities and international relief organizations to ensure swift and effective distribution of aid to the most vulnerable populations.

        Your donation will directly support families who have lost everything - providing them with emergency shelter materials, medical care, clean water, nutritious food, and psychological support during this traumatic time.`,
        goal: 50000,
        raised: 32320,
        donors: 202,
        daysLeft: 2,
        urgent: true,
        verified: true,
        dateCreated: "June 16, 2025",
        lastUpdate: "2 hours ago",
        imageUrl: "/DelhiEarthquake1.jpg",
        gallery: [
          "/DelhiEarthquake1.jpg",
          "/DelhiEarthquake2.jpg", 
          "/DelhiEarthquake3.jpg", 
          "/DelhiEarthquake4.jpg"
        ],
        updates: [
          { 
            date: "June 24, 2025", 
            time: "10:30 AM",
            title: "Mobile Medical Units Deployed", 
            content: "We've successfully deployed 12 mobile medical units across the most affected areas. These units have already treated over 800 patients and continue to provide critical healthcare services.",
            
          },
          { 
            date: "June 23, 2025", 
            time: "6:45 PM",
            title: "Temporary Shelters Established", 
            content: "Thanks to your generous donations, we've established 25 temporary shelter camps housing over 3,000 displaced families. Each shelter is equipped with basic amenities and security.",
            
          },
          { 
            date: "June 22, 2025", 
            time: "2:15 PM",
            title: "Food Distribution Reaches 10,000 Families", 
            content: "Our food distribution network has successfully reached 10,000 affected families. We're providing 3 meals per day along with clean drinking water and essential supplies.",
            
          },
          { 
            date: "June 20, 2025", 
            time: "8:00 AM",
            title: "Emergency Response Activated", 
            content: "Immediate emergency response teams have been deployed. Search and rescue operations are ongoing, with priority given to locating survivors and providing medical aid.",
            
          }
        ],
        impactStats: [
          { label: "Families Helped", value: "800+", icon: Users, color: "blue" },
          { label: "Meals Distributed", value: "45,000+", icon: Package, color: "green" },
          { label: "Medical Treatments", value: "1,200+", icon: Activity, color: "red" },
          { label: "Shelter Beds", value: "3,000+", icon: Home, color: "purple" }
        ],
        emergencyDetails: {
          magnitude: "7.2",
          depth: "12 km",
          epicenter: "15 km NE of Connaught Place",
          timeOfEvent: "June 15, 2025, 3:47 AM IST",
          affectedPopulation: "0.3 million",
          displacedFamilies: "800+",
          casualties: "Under assessment",
          buildingsDamaged: "250+"
        },
        reliefEfforts: [
          { item: "Emergency Shelter Kits", distributed: "2,500", target: "5,000" },
          { item: "Food Packages (7-day)", distributed: "8,200", target: "15,000" },
          { item: "Medical Aid Kits", distributed: "1,800", target: "3,000" },
          { item: "Clean Water (liters)", distributed: "450,000", target: "1,000,000" },
          { item: "Blankets & Clothing", distributed: "6,700", target: "12,000" }
        ],
        organizer: {
            name: "Delhi Disaster Relief Foundation",
            verified: true,
            description: "A registered NGO with 15+ years of experience in disaster relief operations across India. Certified by the Government of India and partnered with international humanitarian organizations.",
            contact: "emergency@delhirelief.org",
            phone: "+91-11-2345-6789",
            registration: "NGO/2010/DEL/12345",
            website: "www.delhirelief.org",
            socialMedia: {
              twitter: "@DelhiRelief",
              facebook: "DelhiReliefFoundation",
              instagram: "@delhirelieforg"
            }
        }
    },
    2: {
        id: 2,
        title: "Assam Flood Recovery",
        category: "flood",
        location: "Assam, India",
        shortDescription: "Rebuilding homes and lives after catastrophic floods submerged vast areas of Assam.",
        description: `The devastating monsoon floods in Assam have submerged over 4,000 villages across 28 districts, affecting more than 5.5 million people. This is one of the worst flood disasters in the region's history, with water levels reaching unprecedented heights.

        The Brahmaputra and its tributaries have breached their banks at multiple points, inundating agricultural lands, destroying crops, and washing away thousands of homes. Critical infrastructure including roads, bridges, schools, and health centers have been severely damaged or completely destroyed.

        Wildlife sanctuaries including Kaziranga National Park have been severely affected, with animals seeking refuge on higher grounds. The flood has also disrupted the livelihood of millions who depend on agriculture and fishing.

        Our comprehensive relief program focuses on immediate humanitarian aid, rehabilitation of displaced families, restoration of basic services, and long-term recovery support. We're working closely with state authorities, local communities, and national disaster response teams.

        Your contribution will help provide emergency shelter, food security, medical care, clean water, sanitation facilities, and support for rebuilding homes and restoring livelihoods.`,
        goal: 100000,
        raised: 78250,
        donors: 1560,
        daysLeft: 25,
        urgent: true,
        verified: true,
        dateCreated: "June 10, 2025",
        lastUpdate: "4 hours ago",
        imageUrl: "/Assamphoto1.jpg",
        gallery: [
          "/Assamphoto1.jpg",
          "/Assamphoto2.jpg",
          "/Assamphoto3.jpg",
          "/Assamphoto4.jpg"
        ],
        updates: [
          { 
            date: "June 24, 2025", 
            time: "2:15 PM",
            title: "Helicopter Rescue Operations Continue", 
            content: "Our helicopter rescue teams have evacuated 1,200 people from marooned villages today. Priority is being given to pregnant women, children, elderly, and those requiring immediate medical attention.",
          },
          { 
            date: "June 23, 2025", 
            time: "9:30 AM",
            title: "Relief Camps Expanded", 
            content: "We've expanded our relief camps to accommodate 15,000 displaced families. Each camp now has improved sanitation facilities, separate spaces for women and children, and 24/7 medical support.",
          },
          { 
            date: "June 21, 2025", 
            time: "5:45 PM",
            title: "Boat Distribution for Rescue Operations", 
            content: "100 motorboats have been distributed to local rescue teams for evacuation and relief distribution in flood-affected areas. These boats are helping reach remote villages cut off by floodwaters.",
          }
        ],
        impactStats: [
          { label: "People Helped", value: "12,000+", icon: Users, color: "blue" },
          { label: "Villages Reached", value: "35+", icon: MapPin, color: "green" },
          { label: "Rescue Boats", value: "100+", icon: Truck, color: "orange" },
          { label: "Relief Camps", value: "45", icon: Home, color: "purple" }
        ],
        emergencyDetails: {
          affectedDistricts: "28 out of 33",
          submergedVillages: "50+",
          affectedPopulation: "0.5 million",
          displacedFamilies: "200+",
          cropLandAffected: "0.8 million hectares",
          livestockAffected: "15,000+",
          roadsDamaged: "500 km",
          bridgesWashed: "30+"
        },
        reliefEfforts: [
          { item: "Emergency Ration Kits", distributed: "25,000", target: "50,000" },
          { item: "Rescue Boats", distributed: "100", target: "200" },
          { item: "Water Purification Tablets", distributed: "500,000", target: "1,000,000" },
          { item: "Tarpaulin Sheets", distributed: "12,000", target: "25,000" },
          { item: "Livestock Feed (tons)", distributed: "450", target: "1,200" }
        ],
        organizer: {
            name: "Assam Relief Consortium",
            verified: true,
            description: "A coalition of 15 NGOs and community organizations with extensive experience in flood relief operations in Northeast India. Recognized by the Assam State Government and UNICEF India.",
            contact: "help@assamrelief.org",
            phone: "+91-361-234-5678",
            registration: "NGO/2008/ASM/67890",
            website: "www.assamreliefconsortium.org",
            socialMedia: {
              twitter: "@AssamRelief",
              facebook: "AssamReliefConsortium",
              instagram: "@assamrelieforg"
            }
        }
    },
    3: {
    id: 3,
    title: "Uttarakhand Wildfire Victims",
    category: "wildfire",
    location: "Uttarakhand, India",
    shortDescription: "Support for families who lost homes in the recent wildfires. Funds will help rebuild communities.",
    description: `The devastating wildfires that erupted across Uttarakhand's hill districts have consumed over 15,000 hectares of pristine forests and agricultural land, affecting more than 80,000 people across 12 districts. Starting on May 28, 2025, the fires spread rapidly due to unprecedented dry conditions and strong winds, making this one of the worst wildfire disasters in the state's history.

    The fires have destroyed over 2,500 homes, 150 schools, and numerous healthcare facilities across the affected regions. Famous tourist destinations including areas around Nainital, Almora, and Pauri have been severely impacted, with entire villages evacuated and thousands of families displaced from their ancestral homes.

    Beyond human casualties, the ecological damage is catastrophic. Ancient oak and pine forests that took decades to grow have been reduced to ash, threatening the region's biodiversity and water sources. The fires have also disrupted the livelihoods of thousands who depend on tourism, agriculture, and forest products.

    Our comprehensive relief program focuses on immediate humanitarian support, temporary rehabilitation, forest restoration, and sustainable community rebuilding. We're collaborating with forest departments, local administrations, and environmental organizations to ensure both immediate relief and long-term ecological recovery.

    Your donation will provide emergency shelter, medical care, food security, clean water, and support for rebuilding fire-resistant homes and restoring forest cover for future generations.`,
    goal: 75000,
    raised: 52100,
    donors: 932,
    daysLeft: 42,
    urgent: false,
    verified: true,
    dateCreated: "May 30, 2025",
    lastUpdate: "6 hours ago",
    imageUrl: "/UttarakhandWildfire1.jpg",
    gallery: [
        "/UttarakhandWildfire1.jpg",
        "/UttarakhandWildfire2.jpg",
        "/UttarakhandWildfire3.jpg", 
        "/UttarakhandWildfire4.jpg"
    ],
    updates: [
        { 
            date: "June 22, 2025", 
            time: "11:00 AM",
            title: "Fire-Resistant Housing Construction Begins", 
            content: "Construction of 200 fire-resistant homes using eco-friendly materials has begun in the worst-affected villages. Each home incorporates traditional hill architecture with modern fire safety features.",
        },
        { 
            date: "June 20, 2025", 
            time: "4:30 PM",
            title: "Reforestation Drive Launched", 
            content: "We've launched a massive reforestation drive with local communities. 50,000 native saplings have been planted across 500 hectares of burned forestland, focusing on fire-resistant species.",
        },
        { 
            date: "June 19, 2025", 
            time: "8:15 AM",
            title: "Relief Materials Distributed", 
            content: "Relief materials including blankets, cooking utensils, and emergency supplies have been distributed to 1,200 affected families across 8 districts. Priority given to elderly and children.",
        },
        { 
            date: "June 17, 2025", 
            time: "2:00 PM",
            title: "Mobile Health Units Deployed", 
            content: "12 mobile health units are now operational in fire-affected areas, providing medical care for smoke inhalation, burns, and respiratory issues. Over 800 patients treated so far.",
        }
    ],
    impactStats: [
        { label: "Families Helped", value: "1,200+", icon: Users, color: "blue" },
        { label: "Saplings Planted", value: "50,000+", icon: Leaf, color: "green" },
        { label: "Medical Treatments", value: "800+", icon: Activity, color: "red" },
        { label: "Homes Rebuilt", value: "200+", icon: Home, color: "purple" }
    ],
    emergencyDetails: {
        firesStarted: "May 28, 2025",
        areaAffected: "150 hectares",
        districtsAffected: "9 out of 13",
        affectedPopulation: "5,000+",
        displacedFamilies: "2,50+",
        homesDestroyed: "2,50+",
        schoolsDamaged: "150+",
        forestCover: "12,000 hectares",
        wildlifeReserves: "3 sanctuaries affected"
    },
    reliefEfforts: [
        { item: "Emergency Shelter Kits", distributed: "1,800", target: "3,000" },
        { item: "Fire Safety Equipment", distributed: "500", target: "1,000" },
        { item: "Native Saplings", distributed: "50,000", target: "150,000" },
        { item: "Rebuild Material Kits", distributed: "200", target: "800" },
        { item: "Livelihood Support Packages", distributed: "600", target: "1,500" }
    ],
    organizer: {
        name: "Uttarakhand Relief & Restoration Alliance",
        verified: true,
        description: "A consortium of environmental NGOs and community organizations with 20+ years of experience in disaster relief and forest conservation in the Himalayan region. Certified by the Forest Department of Uttarakhand and partnered with WWF India.",
        contact: "help@uttarakhandrelief.org",
        phone: "+91-1234-567-890",
        registration: "NGO/2005/UTK/34567",
        website: "www.uttarakhandreliefalliance.org",
        socialMedia: {
            twitter: "@UttarakhandRelief",
            facebook: "UttarakhandReliefAlliance",
            instagram: "@uttarakhandrelieforg"
        }
    }
},
   4: {
    id: 4,
    title: "Kerala Flood Relief",
    category: "flood",
    location: "Kerala, India",
    shortDescription: "Providing urgent relief to families affected by severe flooding in Kerala.",
    description: `Kerala is battling one of its most severe monsoon crises in recent years, with 310mm of rainfall recorded in just 48 hours across multiple districts. The unprecedented downpour has caused 12 major dams to reach dangerous levels, forcing authorities to open shutters and leading to widespread flooding across the state.

    Over 2.2 million people across 14 districts have been affected by the floods, with more than 180,000 people evacuated to 1,200+ relief camps. The districts of Idukki, Wayanad, Malappuram, and Kozhikode are among the worst hit, with entire communities cut off from the mainland due to damaged roads and bridges.

    The floods have devastated the state's agricultural sector, destroying 85,000 hectares of crops including rubber, spices, and rice paddies. The fishing industry has also been severely impacted, with hundreds of boats damaged and fishing harbors inundated. Critical infrastructure including hospitals, schools, and transportation networks have suffered extensive damage.

    Our emergency response program provides immediate relief through rescue operations, temporary shelters, medical care, food distribution, and clean water supply. We're working closely with the Kerala State Disaster Management Authority, local self-governments, and international aid organizations for coordinated relief efforts.

    Your contribution will help provide life-saving emergency aid, rehabilitation support, and assistance for rebuilding homes and restoring livelihoods in flood-affected communities across Kerala.`,
    goal: 60000,
    raised: 28500,
    donors: 487,
    daysLeft: 8,
    urgent: true,
    verified: true,
    dateCreated: "June 15, 2025",
    lastUpdate: "3 hours ago",
    imageUrl: "/KeralaFlood1.jpg",
    gallery: [
        "/KeralaFlood1.jpg",
        "/KeralaFlood2.jpg",
        "/KeralaFlood3.jpg",
        "/KeralaFlood4.jpg"
    ],
    updates: [
        { 
            date: "June 20, 2025", 
            time: "1:45 PM",
            title: "Fishing Boat Restoration Program", 
            content: "Launched a fishing boat restoration program for coastal communities. 150 damaged boats are being repaired and 50 new boats distributed to fishermen who lost their primary source of livelihood.",
        },
        { 
            date: "June 19, 2025", 
            time: "7:20 AM",
            title: "School Rehabilitation Begins", 
            content: "Rehabilitation work has started in 45 flood-damaged schools. Temporary classrooms set up to ensure children can continue their education while permanent structures are being repaired.",
        },
        { 
            date: "June 17, 2025", 
            time: "3:15 PM",
            title: "Initial Relief Distributed", 
            content: "Essential supplies and food packets have been distributed to over 2,000 families in the most affected areas. Special focus on pregnant women, elderly, and children with specific nutritional needs.",
        },
        { 
            date: "June 16, 2025", 
            time: "9:30 AM",
            title: "Emergency Rescue Operations", 
            content: "Coordinated rescue operations using Navy helicopters and local fishing boats have evacuated 3,500 people from marooned areas. Medical teams providing immediate care to rescued individuals.",
        }
    ],
    impactStats: [
        { label: "People Evacuated", value: "3,500+", icon: Users, color: "blue" },
        { label: "Relief Camps", value: "85", icon: Home, color: "purple" },
        { label: "Boats Restored", value: "150+", icon: Anchor, color: "orange" },
        { label: "Schools Helped", value: "45", icon: GraduationCap, color: "green" }
    ],
    emergencyDetails: {
        rainfall: "310mm in 48 hours",
        districtsAffected: "14 out of 14",
        affectedPopulation: "1.2 million",
        evacuatedPeople: "25,000+",
        reliefCamps: "1,200+",
        damsAtCapacity: "12",
        croplandDestroyed: "8,500 hectares",
        roadsDamaged: "400 km",
        bridgesDamaged: "15+"
    },
    reliefEfforts: [
        { item: "Emergency Food Packets", distributed: "15,000", target: "30,000" },
        { item: "Water Purification Units", distributed: "200", target: "500" },
        { item: "Fishing Boats (repaired/new)", distributed: "200", target: "400" },
        { item: "School Repair Kits", distributed: "45", target: "120" },
        { item: "Household Essential Kits", distributed: "8,500", target: "20,000" }
    ],
    organizer: {
        name: "Kerala Flood Response Coalition",
        verified: true,
        description: "A unified coalition of 25+ NGOs, community organizations, and volunteer groups with extensive experience in Kerala's flood relief operations. Officially recognized by Kerala State Disaster Management Authority and partnered with Caritas India.",
        contact: "emergency@keralafloodrelief.org",
        phone: "+91-1234-567-890",
        registration: "NGO/2018/KER/78901",
        website: "www.keralafloodresponse.org",
        socialMedia: {
            twitter: "@KeralaFloodRelief",
            facebook: "KeralaFloodResponseCoalition",
            instagram: "@keralafloodrelieforg"
        }
    }
},
    5: {
    id: 5,
    title: "Himachal Landslide Relief",
    category: "landslide",
    location: "Himachal Pradesh, India",
    shortDescription: "Emergency relief for families affected by the devastating landslide in Sirmaur district.",
    description: `A catastrophic landslide struck the remote villages of Sirmaur district in Himachal Pradesh on June 12, 2025, following three days of intense rainfall that dumped over 200mm of rain in the region. The massive landslide, triggered by saturated soil conditions, buried homes and blocked crucial transportation routes, isolating several mountain communities.

    The disaster has directly affected over 45,000 people across 15 villages in the district, with 8 villages completely cut off from road connectivity. More than 1,800 families have been displaced from their homes, with many losing everything they owned. The landslide has also damaged critical infrastructure including the primary health center, 12 schools, and the main connecting road to the district headquarters.

    The geological impact extends beyond immediate damage, with ongoing risks of secondary landslides threatening rescue and relief operations. Agricultural terraces built over generations have been destroyed, affecting the primary livelihood source for most families in this mountainous region.

    Our comprehensive response includes immediate search and rescue operations, emergency medical care, temporary shelter establishment, food and water distribution, and restoration of basic communication links. We're working with the Indian Army, State Disaster Response Force, and local administration for coordinated relief efforts.

    Your support will provide life-saving emergency aid, temporary accommodation, medical care, and long-term rehabilitation assistance to help these mountain communities rebuild their lives and restore connectivity to the outside world.`,
    goal: 90000,
    raised: 67300,
    donors: 1245,
    daysLeft: 21,
    urgent: true,
    verified: true,
    dateCreated: "June 13, 2025",
    lastUpdate: "5 hours ago",
    imageUrl: "/HimachalPhoto1.jpg",
    gallery: [
        "/HimachalPhoto1.jpg",
        "/HimachalPhoto2.jpg",
        "/HimachalPhoto3.jpg",
        "/HimachalPhoto4.jpg"
    ],
    updates: [
        { 
            date: "June 20, 2025", 
            time: "12:30 PM",
            title: "Alternative Road Construction", 
            content: "Construction of an alternative mountain road has begun to reconnect isolated villages. Engineering teams are working on a 15km bypass route expected to be completed within 3 weeks.",
        },
        { 
            date: "June 19, 2025", 
            time: "3:45 PM",
            title: "Satellite Communication Restored", 
            content: "Satellite communication systems have been installed in all 8 cut-off villages, enabling families to contact relatives and coordinate rescue efforts. Emergency communication center operational 24/7.",
        },
        { 
            date: "June 18, 2025", 
            time: "9:00 AM",
            title: "Relief Operations Expanded", 
            content: "Rescue teams have reached all affected areas using helicopters and mountain paths. Distributed essential supplies to 1,200 families and established 6 relief camps with medical facilities.",
        },
        { 
            date: "June 17, 2025", 
            time: "6:15 PM",
            title: "Helicopter Rescue Missions", 
            content: "Army helicopters have evacuated 45 critically injured individuals and 120 elderly residents to safer locations. Medical airlift operations continue for those requiring specialized treatment.",
        },
        { 
            date: "June 16, 2025", 
            time: "7:30 AM",
            title: "Search and Rescue Deployed", 
            content: "Specialized search and rescue teams with trained dogs have been deployed to locate missing persons. Rescue operations are being conducted despite challenging terrain and weather conditions.",
        }
    ],
    impactStats: [
        { label: "People Helped", value: "1,800+", icon: Users, color: "blue" },
        { label: "Villages Reached", value: "15", icon: MapPin, color: "green" },
        { label: "Helicopter Rescues", value: "165+", icon: Helicopter, color: "orange" },
        { label: "Relief Camps", value: "6", icon: Home, color: "purple" }
    ],
    emergencyDetails: {
        dateOfLandslide: "June 12, 2025",
        triggeringRainfall: "200mm in 72 hours",
        affectedVillages: "15",
        isolatedVillages: "8",
        affectedPopulation: "45,000+",
        displacedFamilies: "800+",
        roadBlocked: "6 km stretch",
        homesDestroyed: "200+",
        agriculturalLoss: "800 hectares",
        livestockAffected: "2,500+"
    },
    reliefEfforts: [
        { item: "Emergency Shelter Tents", distributed: "900", target: "2,000" },
        { item: "Helicopter Food Drops", distributed: "25,000 kg", target: "50,000 kg" },
        { item: "Medical Emergency Kits", distributed: "300", target: "600" },
        { item: "Communication Devices", distributed: "50", target: "100" },
        { item: "Mountain Rescue Equipment", distributed: "15 sets", target: "30 sets" }
    ],
    organizer: {
        name: "Himachal Mountain Rescue & Relief Network",
        verified: true,
        description: "A specialized organization with 18+ years of experience in mountain rescue and disaster relief operations in the Himalayan states. Certified by the National Disaster Management Authority and partnered with the Indian Mountaineering Foundation.",
        contact: "emergency@himachalrelief.org",
        phone: "+91-177-234-5678",
        registration: "NGO/2007/HP/45678",
        website: "www.himachalmountainrelief.org",
        socialMedia: {
            twitter: "@HimachalRelief",
            facebook: "HimachalMountainRelief",
            instagram: "@himachalrelieforg"
        }
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

  const progressPercentage = (campaign.raised / campaign.goal) * 100;const categoryIcons = {
    earthquake: Zap,
    flood: Droplets,
    wildfire: Flame,
    landslide: Mountain
  };
  const CategoryIcon = categoryIcons[campaign.category] || AlertTriangle;

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
              <span className="sm:hidden">Back</span>
            </button>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="relative h-64 sm:h-80 lg:h-96">
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {campaign.urgent && (
                    <div className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center">
                      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      URGENT
                    </div>
                  )}
                  {campaign.verified && (
                    <div className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      VERIFIED
                    </div>
                  )}
                </div>

                {/* Category and Location */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium capitalize flex items-center">
                        <CategoryIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {campaign.category}
                      </div>
                    </div>
                    <div className="flex items-center text-white text-xs sm:text-sm">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {campaign.location}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg">{campaign.shortDescription}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {campaign.dateCreated}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {campaign.lastUpdate}
                    </div>
                  </div>
                </div>

                {/* Emergency Details - Mobile */}
                <div className="lg:hidden bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <h3 className="font-bold text-red-800 mb-3 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Emergency Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {Object.entries(campaign.emergencyDetails).slice(0, 4).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-red-600 font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <div className="text-red-800 font-semibold">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tabs Section */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 min-w-max">
                  {[
                    { id: 'overview', label: 'Overview', icon: FileText },
                    { id: 'updates', label: 'Updates', icon: TrendingUp },
                    { id: 'gallery', label: 'Gallery', icon: Camera }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
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

              {/* Tab Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6 sm:space-y-8"
                    >
                      {/* Description */}
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">About This Campaign</h3>
                        <div className="prose prose-gray max-w-none">
                          {campaign.description.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Emergency Details - Desktop */}
                      <div className="hidden lg:block bg-red-50 border border-red-200 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-red-800 mb-6 flex items-center">
                          <AlertTriangle className="h-6 w-6 mr-3" />
                          Emergency Situation Details
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                          {Object.entries(campaign.emergencyDetails).map(([key, value]) => (
                            <div key={key} className="bg-white p-4 rounded-lg">
                              <span className="text-red-600 font-medium text-sm capitalize block">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <div className="text-red-800 font-bold text-lg mt-1">{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Relief Efforts Progress */}
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Relief Distribution Progress</h3>
                        <div className="space-y-4">
                          {campaign.reliefEfforts.map((effort, index) => {
                            const progress = (parseInt(effort.distributed.replace(/,/g, '')) / parseInt(effort.target.replace(/,/g, ''))) * 100;
                            return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-50 p-4 rounded-xl"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium text-gray-900 text-sm sm:text-base">{effort.item}</span>
                                  <span className="text-sm text-gray-600">{effort.distributed} / {effort.target}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(progress, 100)}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                                  />
                                </div>
                                <div className="text-right text-xs text-gray-500 mt-1">
                                  {progress.toFixed(1)}% completed
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Organizer Details */}
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Campaign Organizer</h3>
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center mb-2">
                                <h4 className="font-bold text-gray-900 text-lg">{campaign.organizer.name}</h4>
                                {campaign.organizer.verified && (
                                  <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                                )}
                              </div>
                              <p className="text-gray-600 mb-3 text-sm sm:text-base">{campaign.organizer.description}</p>
                              <div className="text-sm text-gray-500">
                                Registration: {campaign.organizer.registration}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center text-blue-600">
                              <Mail className="h-4 w-4 mr-2" />
                              {campaign.organizer.contact}
                            </div>
                            <div className="flex items-center text-blue-600">
                              <Phone className="h-4 w-4 mr-2" />
                              {campaign.organizer.phone}
                            </div>
                            <div className="flex items-center text-blue-600">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              {campaign.organizer.website}
                            </div>
                            <div className="flex items-center text-blue-600">
                              <Users className="h-4 w-4 mr-2" />
                              {campaign.organizer.socialMedia.twitter}
                            </div>
                          </div>
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
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">Latest Updates</h3>
                      {campaign.updates.map((update, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-l-4 border-blue-500 pl-4 sm:pl-6 pb-6"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                            <h4 className="font-bold text-gray-900 text-base sm:text-lg">{update.title}</h4>
                            <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
                              {update.date} • {update.time}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed">{update.content}</p>
                          {update.image && (
                            <div className="rounded-lg overflow-hidden">
                              <img
                                src={update.image}
                                alt={update.title}
                                className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
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