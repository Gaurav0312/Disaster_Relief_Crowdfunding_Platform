"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const UserMenu = ({ user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center">
        <img
          src={
            user.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`
          }
          alt={user.name}
          className="w-8 h-8 rounded-full"
        />
        <span className="ml-2 hidden md:inline">{user.name}</span>
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
        >
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            <div className="font-medium">{user.name}</div>
            <div className="text-gray-500 truncate">{user.email}</div>
          </div>
          <button
            onClick={onSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default UserMenu;
