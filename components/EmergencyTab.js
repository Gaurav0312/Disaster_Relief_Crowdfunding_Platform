// components/EmergencyTab.js
"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

// You can import your animation variants directly here

import { itemVariants, scaleUp } from "../lib/animationVariants";
// For example, from "@/lib/animations.js" if you have it

const EmergencyTab = ({ projects, handleDonateClick }) => {
  const emergencyProjects = projects.filter((p) => p.urgent);
  const helpItems = [
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
  ];

  return (
    <motion.div
      variants={scaleUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-12 border border-white/20 max-w-3xl mx-auto"
    >
      <div className="flex justify-center mb-6">
        <div className="bg-red-100 p-4 rounded-full">
          <AlertCircle size={40} className="text-red-600" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center">
        Emergency Relief Needed
      </h2>
      <p className="text-base sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-center">
        Immediate support for communities facing active disasters. Your donation
        today provides life-saving aid.
      </p>

      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 sm:p-8 mb-10 text-white text-left">
        <h3 className="text-xl sm:text-2xl font-bold mb-4">
          Current Emergency Campaigns
        </h3>
        <div className="space-y-4">
          {emergencyProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/20 p-4 rounded-xl space-y-4 sm:space-y-0"
            >
              <div>
                <h4 className="font-bold text-base sm:text-lg">
                  {project.title}
                </h4>
                <p className="text-sm opacity-90">{project.location}</p>
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
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">
          How Emergency Funding Helps
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-left">
          {helpItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-blue-50 p-4 sm:p-6 rounded-2xl"
            >
              <div className="text-blue-600 font-bold mb-2">{item.title}</div>
              <p className="text-gray-600 text-sm sm:text-base">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default EmergencyTab;
