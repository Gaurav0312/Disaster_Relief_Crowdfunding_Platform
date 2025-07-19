"use client";
import React, { useEffect, useRef } from "react";
import {
  Heart,
  CheckCircle,
  TrendingUp,
  Users,
  Shield,
  Globe,
} from "lucide-react";

const AboutUs = ({ onClose, isOpen = true }) => {
  const pushedState = useRef(false);

  useEffect(() => {
    const handlePopState = (event) => {
      if (pushedState.current && isOpen) {
        event.preventDefault();

        onClose();
        pushedState.current = false;

        window.history.pushState({ aboutOpen: false }, "");
      }
    };

    if (isOpen && !pushedState.current) {
      window.history.pushState({ aboutOpen: true }, "");
      pushedState.current = true;
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, onClose]);

  // Clean up when modal closes normally (not via back button)
  useEffect(() => {
    if (!isOpen && pushedState.current) {
      // Modal was closed normally, remove the pushed state
      pushedState.current = false;
      // Go back to remove the pushed state from history
      if (window.history.length > 1) {
        window.history.back();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="text-center px-4 py-6 sm:px-6">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-12 border border-white/20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          About DisasterRelief
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Connecting communities in need with people who care.
        </p>

        <p className="text-gray-700 mb-6">
          DisasterRelief is a crowdfunding platform dedicated to helping
          communities recover from natural disasters. We believe that when
          disaster strikes, communities around the world should come together to
          support those in need.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-6">
          To provide a transparent, efficient, and secure platform for disaster
          relief fundraising that connects donors directly with verified relief
          efforts in affected communities.
        </p>

        <div className="grid md:grid-cols-3 gap-8 my-12">
          {/* Compassion Card */}
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Compassion
            </h3>
            <p className="text-gray-600">
              Every donation is driven by genuine care for those affected by
              disasters.
            </p>
          </div>

          {/* Transparency Card */}
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Transparency
            </h3>
            <p className="text-gray-600">
              All campaigns are verified and funds are tracked transparently.
            </p>
          </div>

          {/* Impact Card */}
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Impact</h3>
            <p className="text-gray-600">
              We ensure maximum impact by connecting funds directly to those who
              need them most.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Work</h2>
        <p className="text-gray-700 mb-6">
          Our platform operates on three core principles: verification,
          transparency, and direct impact. We work with local organizations and
          communities to verify the authenticity of relief campaigns, ensuring
          that every rupee donated reaches those who need it most.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 my-8 text-left">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Our Process
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Disaster Assessment
                </h4>
                <p className="text-gray-600">
                  We identify affected areas and assess immediate needs.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1">
                <span className="text-blue-600 font-semibold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Campaign Verification
                </h4>
                <p className="text-gray-600">
                  Verify relief campaigns through local partnerships.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1">
                <span className="text-blue-600 font-semibold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Direct Distribution
                </h4>
                <p className="text-gray-600">
                  Funds distributed directly to verified efforts.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 my-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-left">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                For Communities
              </h3>
            </div>
            <p className="text-gray-600">
              Create verified campaigns to receive global support for
              disaster-affected communities.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-left">
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                For Donors
              </h3>
            </div>
            <p className="text-gray-600">
              Support verified campaigns and make direct impact in communities'
              time of need.
            </p>
          </div>
        </div>

        <div className="text-center bg-blue-50 rounded-lg p-8 my-12">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Security & Trust
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Industry-standard security protects donations and personal
            information. All transactions encrypted with rigorous campaign
            verification.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
