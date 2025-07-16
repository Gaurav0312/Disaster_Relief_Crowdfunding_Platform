import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, IndianRupee, Image as ImageIcon, Loader2 } from "lucide-react";
import LocationSelect from "./LocationSelect";

const CreateCampaignModal = ({ isOpen, onClose, onCampaignCreated }) => {
  const [isDragging, setIsDragging] = useState(false);
  const pushedState = useRef(false);

  useEffect(() => {
    const handlePopState = (event) => {
      // Check if this popstate event is for our modal
      if (pushedState.current && isOpen) {
        // Prevent default browser navigation
        event.preventDefault();

        // Close the modal
        onClose();
        pushedState.current = false;

        // Push the current state back to prevent navigation
        window.history.pushState({ modalOpen: false }, "");
      }
    };

    if (isOpen && !pushedState.current) {
      // Push a new state when modal opens
      window.history.pushState({ modalOpen: true }, "");
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

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    state: "",
    city: "",
    pincode: "",
    goal: "",
    description: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadError("Only image files are allowed");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadError("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const scaleUp = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  };

  const handleLaunchCampaign = async () => {
    try {
      setIsUploading(true);
      setUploadError("");

      // Validate form data
      if (
        !formData.title ||
        !formData.category ||
        !formData.state ||
        !formData.city ||
        !formData.pincode ||
        !formData.goal ||
        !formData.description
      ) {
        setUploadError("Please fill in all required fields");
        setIsUploading(false);
        return;
      }

      let imageUrl = "";
      if (selectedFile) {
        console.log("Starting image upload...");

        const imageFormData = new FormData();
        imageFormData.append("file", selectedFile);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        });

        console.log("Upload response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Upload error response:", errorData);
          throw new Error(errorData.message || "Image upload failed");
        }

        const data = await response.json();
        imageUrl = data.url;
        console.log("Image uploaded successfully:", imageUrl);
      }

      const campaignData = {
        ...formData,
        goal: Number(formData.goal),
        coverImage: imageUrl,
      };

      console.log("Saving campaign data:", campaignData);

      console.log("Making request to /api/campaigns");
      const saveResponse = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      });

      console.log("Save response status:", saveResponse.status);
      console.log("Save response headers:", saveResponse.headers);

      if (saveResponse.ok) {
        console.log("Campaign saved successfully");
        onCampaignCreated();
        onClose();

        // Reset form
        setFormData({
          title: "",
          category: "",
          location: "",
          goal: "",
          description: "",
        });
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        // Check if response is actually JSON
        const contentType = saveResponse.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await saveResponse.json();
          console.error("Failed to save campaign", errorData);
          throw new Error(errorData.message || "Failed to save campaign");
        } else {
          // If not JSON, log the HTML response
          const htmlResponse = await saveResponse.text();
          console.error(
            "Received HTML response instead of JSON:",
            htmlResponse
          );
          throw new Error(
            "Server returned an error page instead of JSON response"
          );
        }
      }
    } catch (error) {
      console.error("Error launching campaign:", error);
      setUploadError(error.message || "Failed to launch campaign");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Create a Relief Campaign
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={isUploading}
                >
                  <X size={24} />
                </button>
              </div>

              {uploadError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {uploadError}
                </div>
              )}

              <motion.div variants={scaleUp} className="bg-white rounded-2xl">
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Campaign Title *
                    </label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="e.g. Flood Relief for Assam"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isUploading}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Disaster Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isUploading}
                    >
                      <option value="">Select disaster type</option>
                      <option value="Earthquake">Earthquake</option>
                      <option value="Flood">Flood</option>
                      <option value="Wildfire">Wildfire</option>
                      <option value="Hurricane/Typhoon">
                        Hurricane/Typhoon
                      </option>
                      <option value="Tsunami">Tsunami</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <LocationSelect
                      formData={formData}
                      setFormData={setFormData}
                      isUploading={isUploading}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Funding Goal (INR) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IndianRupee size={18} className="text-gray-500" />
                      </div>
                      <input
                        name="goal"
                        value={formData.goal}
                        onChange={handleInputChange}
                        type="number"
                        placeholder="Enter amount"
                        className="no-spinner w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isUploading}
                        onWheel={(e) => e.target.blur()}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Campaign Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Tell the story of who you're helping and how the funds will be used..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isUploading}
                    />
                  </div>

                  <motion.div
                    variants={scaleUp}
                    className="bg-white rounded-2xl"
                  >
                    <div className="space-y-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Cover Image
                        </label>
                        <div
                          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                            isDragging
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300"
                          } ${isUploading ? "pointer-events-none opacity-50" : "hover:border-blue-400"}`}
                          onClick={handleImageClick}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (!isUploading) setIsDragging(true);
                          }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            if (isUploading) return;

                            const file = e.dataTransfer.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                setUploadError(
                                  "File size must be less than 5MB"
                                );
                                return;
                              }
                              if (!file.type.startsWith("image/")) {
                                setUploadError("Only image files are allowed");
                                return;
                              }
                              setSelectedFile(file);
                              setPreviewUrl(URL.createObjectURL(file));
                              setUploadError("");
                            }
                          }}
                        >
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt="Selected"
                              className="w-full h-48 object-cover rounded-xl"
                            />
                          ) : (
                            <div className="text-gray-500">
                              <div className="flex justify-center mb-2">
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                                  <ImageIcon
                                    className="text-gray-500"
                                    size={32}
                                  />
                                </div>
                              </div>
                              <p>Drag & drop your image here</p>
                              <p className="text-sm mt-1">or click to browse</p>
                              <p className="text-xs mt-1 text-gray-400">
                                Max size: 5MB
                              </p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={isUploading}
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={handleLaunchCampaign}
                          disabled={isUploading}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 px-6 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isUploading ? (
                            <>
                              <Loader2
                                className="animate-spin mr-2"
                                size={20}
                              />
                              Launching Campaign...
                            </>
                          ) : (
                            "Launch Campaign"
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateCampaignModal;
