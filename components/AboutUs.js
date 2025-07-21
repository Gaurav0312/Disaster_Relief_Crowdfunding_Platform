"use client";
import React, { useEffect, useRef } from "react";
import {
  Heart,
  CheckCircle,
  TrendingUp,
  Users,
  Shield,
  Globe,
  Clock,
  Award,
  Target,
  Zap,
} from "lucide-react";
import { IN } from "country-flag-icons/react/3x2";

const AboutUs = ({ onClose, isOpen = true, projects, handleDonateClick, handleCreateCampaignClick, }) => {
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

  useEffect(() => {
    if (!isOpen && pushedState.current) {
      pushedState.current = false;
      if (window.history.length > 1) {
        window.history.back();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;


  return (
    <div className="text-center px-4 py-6 sm:px-6">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-12 border border-white/20 max-w-6xl mx-auto">
        {/* Hero Section */}
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          About Relief Fund
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Connecting communities in need with people who care - because
          together, we rebuild stronger.
        </p> 

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
          <p className="text-gray-700 text-lg leading-relaxed">
            Relief Fund is India's most trusted crowdfunding platform
            dedicated to disaster recovery and emergency relief. We harness the
            power of community solidarity to provide immediate, transparent, and
            impactful support to those affected by natural calamities.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Target className="h-6 w-6 text-blue-600 mr-3" />
              Our Mission
            </h3>
            <p className="text-gray-700">
              To democratize disaster relief by creating a transparent,
              efficient, and secure platform that connects donors directly with
              verified relief efforts, ensuring maximum impact and
              accountability in times of crisis.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8 text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Award className="h-6 w-6 text-green-600 mr-3" />
              Our Vision
            </h3>
            <p className="text-gray-700">
              A world where no community faces disaster alone - where technology
              bridges the gap between those who need help and those ready to
              provide it, creating a global network of compassion and
              resilience.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          What Makes Us Different
        </h2>
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* Compassion Card */}
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Compassion First
            </h3>
            <p className="text-gray-600">
              Every campaign is rooted in genuine empathy, ensuring authentic
              support for disaster survivors and their families.
            </p>
          </div>

          {/* Transparency Card */}
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Radical Transparency
            </h3>
            <p className="text-gray-600">
              Real-time fund tracking, verified campaigns, and detailed impact
              reports ensure donors see exactly where their money goes.
            </p>
          </div>

          {/* Speed Card */}
          <div className="text-center">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Rapid Response
            </h3>
            <p className="text-gray-600">
              Quick campaign approval and instant fund disbursement ensure help
              reaches disaster areas within hours, not days.
            </p>
          </div>

          {/* Impact Card */}
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Proven Impact
            </h3>
            <p className="text-gray-600">
              Direct fund distribution to verified recipients with photo and
              video updates showing real-world impact on the ground.
            </p>
          </div>
        </div>

        {/* How We Work - Enhanced Process */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          How DisasterRelief Works
        </h2>
        <p className="text-gray-700 mb-8 text-lg">
          Our platform operates on four pillars: rapid assessment, rigorous
          verification, transparent distribution, and continuous impact
          tracking.
        </p>

        <div className="bg-gray-50 rounded-lg p-8 my-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Crisis Detection
              </h4>
              <p className="text-gray-600 text-sm">
                AI-powered monitoring and ground reports identify disaster zones
                and urgent needs within hours.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-lg">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Verification Process
              </h4>
              <p className="text-gray-600 text-sm">
                Multi-tier verification through local partners, government
                agencies, and on-ground validation.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Instant Mobilization
              </h4>
              <p className="text-gray-600 text-sm">
                Campaigns go live immediately with social media amplification
                and targeted donor outreach.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 font-bold text-lg">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Direct Impact
              </h4>
              <p className="text-gray-600 text-sm">
                Funds flow directly to verified recipients with real-time
                tracking and impact documentation.
              </p>
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Platform Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-left">
            <Clock className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              24/7 Emergency Response
            </h3>
            <ul className="text-gray-600 space-y-2 text-sm">
              <li>• Instant campaign creation and approval</li>
              <li>• Real-time disaster monitoring alerts</li>
              <li>• Emergency fund disbursement within 2 hours</li>
              <li>• Multi-language support for affected regions</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-left">
            <Shield className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Advanced Security
            </h3>
            <ul className="text-gray-600 space-y-2 text-sm">
              <li>• End-to-end encryption for all transactions</li>
              <li>• Biometric verification for fund recipients</li>
              <li>• Blockchain-based transparent fund tracking</li>
              <li>• Fraud detection and prevention systems</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-left">
            <IN className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Indian Reach
            </h3>
            <ul className="text-gray-600 space-y-2 text-sm">
              <li>• Support for India across all states</li>
              <li>• Currently integration with Razorpay</li>
              <li>• Mobile-first design for on-the-go giving</li>
              <li>• Social media integration for viral campaigns</li>
            </ul>
          </div>
        </div>

        {/* Who We Serve */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Who We Serve</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-left">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Disaster-Affected Communities
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Villages, towns, and cities impacted by floods, earthquakes,
              cyclones, wildfires, and other natural disasters across India and
              globally.
            </p>
            <div className="text-sm text-gray-500">
              <strong>Services:</strong> Emergency relief, medical aid, shelter,
              food distribution, rebuilding support
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-left">
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Compassionate Donors
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Individuals, families, corporations, and organizations worldwide
              who want to make a verified, transparent impact in disaster relief
              efforts.
            </p>
            <div className="text-sm text-gray-500">
              <strong>Benefits:</strong> Tax deductions, impact reports, donor
              recognition, transparent fund tracking
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-left">
            <div className="flex items-center mb-4">
              <Award className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                NGOs & Relief Organizations
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Registered nonprofits, grassroots organizations, and relief
              agencies seeking to expand their reach and accelerate fundraising
              for disaster response.
            </p>
            <div className="text-sm text-gray-500">
              <strong>Support:</strong> Campaign management, donor outreach,
              compliance assistance, impact measurement
            </div>
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Our Impact So Far
          </h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">₹4M+</div>
              <div className="text-sm opacity-90">Funds Raised</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">12.0K+</div>
              <div className="text-sm opacity-90">Lives Impacted</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">10+</div>
              <div className="text-sm opacity-90">Disaster Zones Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-sm opacity-90">
                Funds Directly Distributed
              </div>
            </div>
          </div>
        </div>

        {/* Security & Trust */}
        <div className="text-center bg-gray-50 rounded-lg p-8 mb-12">
          <Shield className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Security & Trust You Can Rely On
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            Bank-grade security protects every donation and personal detail. Our
            multi-layered verification process, real-time monitoring, and
            compliance with international standards ensure your contributions
            reach genuine recipients safely.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4">
              <strong className="text-gray-900">SSL Encryption</strong>
              <p className="text-gray-600 mt-1">
                256-bit encryption for all data
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <strong className="text-gray-900">PCI Compliance</strong>
              <p className="text-gray-600 mt-1">Secure payment processing</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <strong className="text-gray-900">Regular Audits</strong>
              <p className="text-gray-600 mt-1">
                Third-party security verification
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Make a Difference?
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Whether you're seeking support for your community or looking to help
            others in their time of need, DisasterRelief provides the tools,
            security, and transparency to create meaningful impact. Join
            thousands who are already rebuilding lives together.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
              onClick={() =>
                handleCreateCampaignClick && handleCreateCampaignClick(true)
              }
            >
              Create a Campaign
            </button>

            <button
              onClick={() => {
                const projectToFeature =
                  projects?.find((p) => p.urgent) || projects?.[0];
                if (projectToFeature && handleDonateClick) {
                  handleDonateClick(projectToFeature);
                } else if (!projects || projects.length === 0) {
                  alert(
                    "No active campaigns available at the moment. Please try again later."
                  );
                }
              }}
              disabled={!projects || projects.length === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                !projects || projects.length === 0
                  ? "bg-gray-100 text-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
              }`}
            >
              Donate Now
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600 italic">
          "In the face of disaster, hope is not lost when communities unite.
          DisasterRelief is that bridge between despair and recovery, between
          isolation and solidarity."
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
