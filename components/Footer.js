"use client";
import React from "react";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Shield,
  Award,
  ArrowUp,
  ExternalLink,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { IN } from "country-flag-icons/react/3x2";
import Newsletter from "@/components/Newsletter";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

import Link from "next/link";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const links = [
    { label: "About Us", href: "/about_us" },
    { label: "Live Campaigns", href: "/campaigns/id" },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 border-t border-gray-200">
      {/* Main Footer Content */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:pxm-8 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-3 shadow-lg"
              >
                <Heart className="h-6 w-6" fill="currentColor" />
              </motion.div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Relief Fund
              </h3>
            </div>

            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              Empowering communities to rebuild and recover from natural
              disasters. Every donation creates lasting impact and brings hope
              to families in need.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  Certified
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <Award className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Trusted
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <IN className="w-4 h-4 " />
                <span className="text-sm font-medium text-gray-700">India</span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">
                Subscribe to our Platform for campaigns updates!
              </h4>
              <Newsletter />
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-gray-800 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {links.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span>{label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-gray-800 mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-lg p-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a
                    href="mailto:reliefsfund@gmail.com"
                    className="text-gray-700 font-medium hover:text-blue-500"
                  >
                    reliefsfund@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-100 rounded-lg p-2">
                  <Phone className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">24/7 Helpline</p>
                  <a
                    href="tel:+919589773525"
                    className="text-gray-700 font-medium hover:text-blue-500"
                  >
                    +91 9589773525
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-100 rounded-lg p-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-700 font-medium">
                    Mahoba Road Chhatarpur Madhya Pradesh 471001, India
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Social Media & Statistics */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">Follow us:</span>
              <div className="flex gap-3">
                {[
                  { icon: FaFacebook, color: "hover:text-blue-600" },
                  { icon: FaTwitter, color: "hover:text-blue-400" },
                  { icon: FaInstagram, color: "hover:text-pink-600" },
                  { icon: FaWhatsapp, color: "hover:text-green-600" },
                  { icon: FaLinkedin, color: "hover:text-blue-700" },
                ].map(({ icon: Icon, color }, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    className={`bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm border border-gray-200 text-gray-600 ${color} transition-all duration-200`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="font-bold text-blue-600">50K+</div>
                <div className="text-gray-600">Donors</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600">15+</div>
                <div className="text-gray-600">States</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600">99.5%</div>
                <div className="text-gray-600">Impact Rate</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright & Features */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm text-gray-600">
              <span className="font-medium">&copy; 2025 Relief Fund</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>Verified Campaigns</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>Secure Donations</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>Transparent Impact</span>
            </div>

            {/* Legal Links & Back to Top */}
            <div className="flex items-center gap-6">
              <div className="flex gap-4 text-sm text-gray-600">
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Terms of Service
                </a>
              </div>

              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-2 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <ArrowUp className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
