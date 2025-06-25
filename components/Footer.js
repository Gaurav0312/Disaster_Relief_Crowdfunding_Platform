"use client"
import React from 'react'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'


const Footer = () => {
  return (
    <footer className="bg-slate-50 text-black py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-2"
                >
                  <Heart className="h-4 w-4" fill="currentColor" />
                </motion.div>
            <h3 className="text-2xl font-bold">Relief Fund</h3>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-bold text-gray-800">
            <span>&copy; 2025 Relief Fund</span>
            <span>•</span>
            <span>Verified Campaigns</span>
            <span>•</span>
            <span>Secure Donations</span>
            <span>•</span>
            <span>Transparent Impact</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
