"use client";
import { useState } from "react";
import { Heart, User, LogOut, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import UserMenu from "@/components/UserMenu";
import HamburgerIcon from "@/components/HamburgerIcon";

const Navbar = ({
  activeTab,
  onTabChange,
  onShowCreateModal,
  onShowSignInModal,
  onSetModalTab,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleTabChange = (tab) => {
    onTabChange(tab);
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const navItems = [
    { id: "browse", label: "Browse" },
    { id: "emergency", label: "Emergency" },
    { id: "about", label: "About Us" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
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
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`px-3 py-3 rounded-md text-sm font-medium capitalize transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-gradient-to-br from-blue-600 to-purple-600 text-white hover:shadow-md"
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => onShowCreateModal(true)}
              className="px-3 py-3 rounded-md text-sm font-medium capitalize bg-gradient-to-br from-blue-600 to-purple-600 text-white hover:shadow-md transition-all duration-200"
            >
              Create Campaign
            </button>

            {status === "authenticated" && (
              <button
                onClick={() => handleTabChange("dashboard")}
                className={`px-3 py-3 rounded-md text-sm font-medium capitalize transition-all duration-200 ${
                  activeTab === "dashboard"
                    ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-gradient-to-br from-blue-600 to-purple-600 text-white hover:shadow-md"
                }`}
              >
                Dashboard
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <HamburgerIcon
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            />
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
                    onSetModalTab("login");
                    onShowSignInModal(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onSetModalTab("register");
                    onShowSignInModal(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>

        {/* Enhanced Mobile Menu Items */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pb-6 pt-4"
          >
            {/* Navigation Items */}
            <div className="space-y-2 mb-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleTabChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full py-3 px-4 text-left font-medium text-base rounded-xl 
                    transition-all duration-200 active:scale-[0.98] touch-manipulation
                    ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-700 border border-gray-200"
                    }
                  `}
                >
                  {item.label}
                </button>
              ))}

              {/* Dashboard for authenticated users */}
              {status === "authenticated" && (
                <button
                  onClick={() => {
                    handleTabChange("dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full py-3 px-4 text-left font-medium text-base rounded-xl 
                    transition-all duration-200 active:scale-[0.98] touch-manipulation
                    ${
                      activeTab === "dashboard"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-700 border border-gray-200"
                    }
                  `}
                >
                  Dashboard
                </button>
              )}
            </div>

            {/* Primary Action Button */}
            <div className="mb-6">
              <button
                onClick={() => {
                  onShowCreateModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className="
                  w-full py-4 px-4 font-semibold text-base rounded-xl
                  bg-gradient-to-r from-blue-600 to-purple-600 text-white
                  hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800
                  shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]
                  touch-manipulation flex items-center justify-center gap-2
                "
              >
                <Plus className="h-5 w-5" />
                Create Campaign
              </button>
            </div>

            {/* User Authentication Actions */}
            <div className="border-t border-gray-200 pt-4">
              {status === "authenticated" ? (
                <div className="space-y-3">
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-4 py-2 text-gray-600">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium truncate">
                      {session?.user?.email || session?.user?.name || "User"}
                    </span>
                  </div>

                  {/* Sign Out Button */}
                  <button
                    onClick={async () => {
                      await signOut({ redirect: false });
                      setIsMobileMenuOpen(false);
                      onTabChange("browse");
                    }}
                    className="
                      w-full py-3 px-4 font-medium text-base rounded-xl
                      bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600
                      border border-red-200 transition-all duration-200 active:scale-[0.98]
                      touch-manipulation flex items-center justify-center gap-2
                    "
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                status !== "loading" && (
                  <div className="space-y-3">
                    {/* Sign In Button */}
                    <button
                      onClick={() => {
                        onSetModalTab("login");
                        onShowSignInModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="
                      w-full py-3 px-4 font-medium text-base rounded-xl
                      bg-white hover:bg-gray-50 active:bg-gray-100 text-blue-600
                      border-2 border-blue-600 transition-all duration-200 active:scale-[0.98]
                      touch-manipulation
                    "
                    >
                      Sign In
                    </button>

                    {/* Register Button */}
                    <button
                      onClick={() => {
                        onSetModalTab("register");
                        onShowSignInModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="
                      w-full py-3 px-4 font-medium text-base rounded-xl
                      bg-gradient-to-r from-blue-600 to-purple-600 text-white
                      hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800
                      transition-all duration-200 active:scale-[0.98] touch-manipulation
                    "
                    >
                      Register
                    </button>
                  </div>
                )
              )}

              {/* Loading State */}
              {status === "loading" && (
                <div className="flex items-center justify-center py-4">
                  <div className="h-6 w-24 rounded bg-gray-200 animate-pulse" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;
