// components/AboutUs.js
import { Heart, CheckCircle, TrendingUp, Users, Shield, Globe, X } from 'lucide-react';

const AboutUs = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full mx-auto overflow-hidden">
          <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">About DisasterRelief</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-6 sm:p-8 overflow-y-auto max-h-[80vh]">
            <div className="text-center mb-8">
              <p className="text-xl text-gray-600">
                Connecting communities in need with people who care
              </p>
            </div>

            <div className="prose prose-lg">
              <p className="text-gray-700 mb-6">
                DisasterRelief is a crowdfunding platform dedicated to helping communities recover from natural disasters.
                We believe that when disaster strikes, communities around the world should come together to support those in need.
              </p>
  
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-6">
                To provide a transparent, efficient, and secure platform for disaster relief fundraising that connects 
                donors directly with verified relief efforts in affected communities.
              </p>
  
              <div className="grid md:grid-cols-3 gap-8 my-12">
                {/* Compassion Card */}
                <div className="text-center">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Compassion</h3>
                  <p className="text-gray-600">Every donation is driven by genuine care for those affected by disasters.</p>
                </div>
                
                {/* Transparency Card */}
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparency</h3>
                  <p className="text-gray-600">All campaigns are verified and funds are tracked transparently.</p>
                </div>
                
                {/* Impact Card */}
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Impact</h3>
                  <p className="text-gray-600">We ensure maximum impact by connecting funds directly to those who need them most.</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Work</h2>
              <p className="text-gray-700 mb-6">
                Our platform operates on three core principles: verification, transparency, and direct impact. 
                We work with local organizations and communities to verify the authenticity of relief campaigns, 
                ensuring that every rupee donated reaches those who need it most.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 my-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Process</h3>
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="flex items-start">
                    <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Disaster Assessment</h4>
                      <p className="text-gray-600">We identify affected areas and assess immediate needs.</p>
                    </div>
                  </div>
                  
                  {/* Step 2 */}
                  <div className="flex items-start">
                    <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Campaign Verification</h4>
                      <p className="text-gray-600">Verify relief campaigns through local partnerships.</p>
                    </div>
                  </div>
                  
                  {/* Step 3 */}
                  <div className="flex items-start">
                    <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Direct Distribution</h4>
                      <p className="text-gray-600">Funds distributed directly to verified efforts.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 my-12">
                {/* For Communities */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Users className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">For Communities</h3>
                  </div>
                  <p className="text-gray-600">
                    Create verified campaigns to receive global support for disaster-affected communities.
                  </p>
                </div>
                
                {/* For Donors */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Globe className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">For Donors</h3>
                  </div>
                  <p className="text-gray-600">
                    Support verified campaigns and make direct impact in communities' time of need.
                  </p>
                </div>
              </div>

              <div className="text-center bg-blue-50 rounded-lg p-8 my-12">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Security & Trust</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Industry-standard security protects donations and personal information. 
                  All transactions encrypted with rigorous campaign verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;