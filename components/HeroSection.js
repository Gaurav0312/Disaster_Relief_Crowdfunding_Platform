import { useEffect, useRef, useState } from "react";
import {
  Shield,
  Heart,
  ArrowRight,
  IndianRupee,
  Users,
  Globe,
  ChevronDown,
} from "lucide-react";
import { IN } from "country-flag-icons/react/3x2";

// Simplified animated counter for better mobile performance
function AnimatedCounter({ value, text, icon: Icon, colorClass }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);

          // Simple counter animation
          const node = ref.current;
          if (node) {
            const valueString = value.replace(/[^\d.]/g, "");
            const numericValue = parseFloat(valueString);
            let current = 0;
            const increment = numericValue / 60; // 60 frames for 1 second at 60fps

            const timer = setInterval(() => {
              current += increment;
              if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
              }

              node.textContent = `${
                value.startsWith("₹") ? "₹" : ""
              }${current.toFixed(current < 10 ? 0 : 1)}${
                value.includes("M") ? "M" : ""
              }${value.includes("K") ? "K" : ""}+`;
            }, 16); // ~60fps
          }
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, value]);

  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-md border border-white/20 text-center hover:shadow-lg transition-all duration-300 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-1" />
        <div
          ref={ref}
          className={`text-2xl sm:text-3xl md:text-4xl font-bold ${colorClass} bg-clip-text text-transparent`}
        >
          {value}
        </div>
        <div className="text-gray-700 font-medium text-sm sm:text-base">
          {text}
        </div>
      </div>
    </div>
  );
}

// Mobile-optimized Hero Section
export default function HeroSection({ projects = [], handleDonateClick }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleDonateNow = () => {
    const projectToFeature = projects.find((p) => p.urgent) || projects[0];
    if (projectToFeature && handleDonateClick) {
      handleDonateClick(projectToFeature);
    }
  };

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight * 0.9,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-4 w-32 h-32 sm:w-48 sm:h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float" />
        <div className="absolute top-1/2 right-4 w-40 h-40 sm:w-56 sm:h-56 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float-delayed" />
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 sm:w-40 sm:h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-slow" />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 safe-area-inset">
        <div className="max-w-4xl mx-auto text-center w-full">
          {/* Trust Badge */}
          <div
            className={`inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-2 mb-6 shadow-lg border border-gray-200/50 transition-all duration-700 ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-xs sm:text-sm font-semibold text-gray-700">
              Trusted by 50K+ donors across India
            </span>

            <IN className="w-4 h-4" />
          </div>

          {/* Main Headline */}
          <div
            className={`mb-6 transition-all duration-1000 delay-200 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-4">
              <span className="block mb-2">Help Communities</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Rebuild & Recover
              </span>
            </h1>
            <div
              className={`w-16 sm:w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full transition-all duration-800 delay-700 ${
                isLoaded ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </div>

          {/* Description */}
          <p
            className={`text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed px-2 transition-all duration-700 delay-500 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Every donation creates ripples of hope. Join our mission to support
            families rebuilding their lives after natural disasters.
          </p>

          {/* CTA Button */}
          <div
            className={`mb-12 transition-all duration-700 delay-700 ${
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <button
              onClick={handleDonateNow}
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 sm:px-10 sm:py-5 rounded-full font-semibold text-lg sm:text-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden active:scale-95"
              style={{ minHeight: "56px", touchAction: "manipulation" }}
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center gap-3">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" fill="white" />
                Donate Now
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>

          {/* Stats Grid */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8 transition-all duration-800 delay-900 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <AnimatedCounter
              value="₹3.5M+"
              text="Funds Raised"
              icon={IndianRupee}
              colorClass="bg-gradient-to-r from-blue-600 to-blue-700"
            />
            <AnimatedCounter
              value="12K+"
              text="Lives Impacted"
              icon={Users}
              colorClass="bg-gradient-to-r from-purple-600 to-purple-700"
            />
            <AnimatedCounter
              value="5+"
              text="Active Campaigns"
              icon={Globe}
              colorClass="bg-gradient-to-r from-pink-600 to-pink-700"
            />
          </div>

          {/* Impact Indicators */}
          <div
            className={`flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-sm text-gray-600 mb-8 transition-all duration-600 delay-1100 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            {[
              { text: "24/7 Emergency Response", color: "bg-green-500" },
              { text: "100% Transparency", color: "bg-blue-500" },
              { text: "Direct Community Impact", color: "bg-purple-500" },
            ].map((item, i) => (
              <div
                key={item.text}
                className={`flex items-center gap-2 transition-all duration-500 ${
                  isLoaded
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                }`}
                style={{ transitionDelay: `${1200 + i * 100}ms` }}
              >
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${item.color}`}
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
                <span className="text-center sm:text-left font-medium">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced CSS for mobile optimization */}
      <style jsx>{`
        .safe-area-inset {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }

        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(0.95);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        @keyframes bounce-gentle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient 4s ease infinite;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite 2s;
        }

        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite 4s;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }

        /* Mobile-specific optimizations */
        @media (max-width: 640px) {
          /* Better touch targets */
          button {
            min-height: 44px;
            touch-action: manipulation;
          }

          /* Optimize text rendering */
          h1 {
            line-height: 1.1;
            text-rendering: optimizeSpeed;
          }

          /* Reduce blur for better performance */
          .backdrop-blur-sm {
            backdrop-filter: blur(4px);
          }

          /* Prevent zoom on input focus */
          input,
          select,
          textarea {
            font-size: 16px;
          }
        }

        /* Fallback for older browsers */
        @supports not (backdrop-filter: blur()) {
          .backdrop-blur-sm {
            background-color: rgba(255, 255, 255, 0.9);
          }
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .animate-gradient,
          .animate-float,
          .animate-float-delayed,
          .animate-float-slow,
          .animate-bounce-gentle,
          .animate-pulse {
            animation: none;
          }

          * {
            transition-duration: 0.1s !important;
          }
        }

        /* Very small screens */
        @media (max-width: 375px) {
          .px-4 {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          h1 {
            font-size: 2.5rem;
          }
          .text-lg {
            font-size: 1rem;
          }
        }

        /* Landscape mobile optimization */
        @media (max-height: 500px) and (orientation: landscape) {
          .min-h-screen {
            min-height: 100vh;
          }
          .py-8 {
            padding-top: 2rem;
            padding-bottom: 2rem;
          }
          h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          .mb-8 {
            margin-bottom: 1.5rem;
          }
        }

        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .shadow-lg {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          .shadow-xl {
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>
    </section>
  );
}
