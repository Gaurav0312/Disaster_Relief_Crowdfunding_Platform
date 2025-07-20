// data/sampleData.js

export const categories = [
  { id: "all", name: "All Categories" },
  { id: "earthquake", name: "Earthquake" },
  { id: "flood", name: "Flood" },
  { id: "wildfire", name: "Wildfire" },
  { id: "hurricane", name: "Hurricane" },
  { id: "landslide", name: "Landslide" },
  { id: "other", name: "Other Disasters" },
];

export const sampleProjects = [
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
    imageUrl:
      "/SuratFlood1.webp",
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
    imageUrl:
      "/AhmedabadCrash1.webp",
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
    imageUrl:
      "/DelhiEarthquake1.webp",
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
    imageUrl:
      "/Assamphoto1.webp",
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
    imageUrl:
      "/UttarakhandWildfire1.webp",
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
    imageUrl:
      "/KeralaFlood1.webp",
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
    imageUrl:
      "/HimachalPhoto1.webp",
  },
];
