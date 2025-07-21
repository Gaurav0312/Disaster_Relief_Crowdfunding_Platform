import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Info, CheckCircle, Heart, Shield } from "lucide-react";
import { IN } from "country-flag-icons/react/3x2";

const DonationModal = ({ isOpen, onClose, project }) => {
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [tipPercent, setTipPercent] = useState(18);
  const [currentStep, setCurrentStep] = useState(1); // 1: amount, 2: details
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    isAnonymous: false,
  });

  const modalRef = useRef(null);
  const presetAmounts = [500, 1000, 2000, 5000];

  const calculateTip = () => {
    const amount = isCustomMode
      ? parseFloat(customAmount) || 0
      : selectedAmount;
    return Math.round((amount * tipPercent) / 100);
  };

  const calculateTotal = () => {
    const amount = isCustomMode
      ? parseFloat(customAmount) || 0
      : selectedAmount;
    return amount + calculateTip();
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setIsCustomMode(false);
    setCustomAmount("");
  };

  const handleCustomAmount = () => {
    setIsCustomMode(true);
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setIsCustomMode(true);
    setSelectedAmount(parseInt(value) || 0);
  };

  const handleNextStep = () => {
    const amount = isCustomMode ? parseFloat(customAmount) : selectedAmount;
    if (!amount || amount <= 0) {
      alert("Please select or enter a valid donation amount");
      return;
    }
    if (amount < 100) {
      alert("Minimum donation amount is ₹100");
      return;
    }
    setCurrentStep(2);
  };

  const handleBackStep = () => {
    setCurrentStep(1);
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = async (amount) => {
    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100,
          currency: "INR",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();
      return order;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const savePaymentToDatabase = async (paymentData, status) => {
    try {
      const response = await fetch("/api/save-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...paymentData,
          status,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save payment data");
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving payment:", error);
      throw error;
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      setPaymentStatus("processing");
      setPaymentMessage("Initializing payment...");

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay script");
      }

      const order = await createRazorpayOrder(calculateTotal());

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Donation Platform",
        description: `Donation for ${project?.title}`,
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: `+91${formData.phone}`,
        },
        theme: {
          color: "#06b6d4",
        },
        handler: async (response) => {
          try {
            const paymentData = {
              projectId: project?.id,
              projectTitle: project?.title,
              amount: isCustomMode ? parseFloat(customAmount) : selectedAmount,
              tip: calculateTip(),
              total: calculateTotal(),
              ...formData,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            await savePaymentToDatabase(paymentData, "success");

            setPaymentStatus("success");
            setPaymentMessage(
              "Thank you for your donation! Your contribution will help those in need."
            );

            setShowSuccessPopup(true);
          } catch (error) {
            console.error("Error processing successful payment:", error);
            setPaymentStatus("error");
            setPaymentMessage(
              "Payment was successful, but there was an error saving your data. Please contact support."
            );
          }
        },
        modal: {
          ondismiss: async () => {
            try {
              const paymentData = {
                projectId: project?.id,
                projectTitle: project?.title,
                amount: isCustomMode
                  ? parseFloat(customAmount)
                  : selectedAmount,
                tip: calculateTip(),
                total: calculateTotal(),
                ...formData,
                razorpay_order_id: order.id,
              };

              await savePaymentToDatabase(paymentData, "cancelled");

              setPaymentStatus("error");
              setPaymentMessage("Payment was cancelled. Please try again.");

              setTimeout(() => {
                setPaymentStatus("idle");
                setPaymentMessage("");
              }, 3000);
            } catch (error) {
              console.error("Error handling payment cancellation:", error);
            }
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("error");
      setPaymentMessage("Failed to initialize payment. Please try again.");

      setTimeout(() => {
        setPaymentStatus("idle");
        setPaymentMessage("");
      }, 3000);
    }
  };

  const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;

  let newValue = value;

  // Only allow letters and spaces in "name" field
  if (name === "name") {
    newValue = newValue.replace(/[^a-zA-Z\s]/g, "");
  }

  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : newValue,
  }));
};


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    const amount = isCustomMode ? parseFloat(customAmount) : selectedAmount;
    if (!amount || amount <= 0) {
      alert("Please enter a valid donation amount");
      return;
    }

    handleRazorpayPayment();
  };

  const handleClose = () => {
    onClose();
    setFormData({
      name: "",
      email: "",
      phone: "",
      isAnonymous: false,
    });
    setSelectedAmount(1000);
    setCustomAmount("");
    setIsCustomMode(false);
    setTipPercent(18);
    setPaymentStatus("idle");
    setPaymentMessage("");
    setShowSuccessPopup(false);
    setCurrentStep(1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleBack = () => {
      if (isOpen) {
        if (currentStep === 2) {
          setCurrentStep(1);
        } else {
          handleClose();
        }
      }
    };

    if (isOpen) {
      if (!window.history.state || !window.history.state.modalOpen) {
        window.history.pushState({ modalOpen: true }, "");
      }
      window.addEventListener("popstate", handleBack);
    }

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [isOpen, currentStep]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (currentStep === 2) {
          setCurrentStep(1);
        } else {
          handleClose();
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  if (showSuccessPopup) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-xl"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Thank You!</h3>
            <p className="text-gray-600 mb-6">
              Your donation of <span className="font-semibold text-green-600">₹{calculateTotal()}</span> has been received successfully.
            </p>
            <button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 active:scale-95"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl max-h-[95vh] overflow-hidden sm:relative sm:inset-auto sm:rounded-2xl sm:max-w-md sm:mx-auto sm:my-8 sm:max-h-[90vh]"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Progress Indicator */}
          <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
            {/* Progress Bar */}
            <div className="h-1 bg-gray-100">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                initial={{ width: "50%" }}
                animate={{ width: currentStep === 1 ? "50%" : "100%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            <div className="flex items-center justify-between p-4">
              <button
                onClick={currentStep === 1 ? handleClose : handleBackStep}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors active:scale-95"
                aria-label={currentStep === 1 ? "Close" : "Back"}
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {currentStep === 1 ? "Choose Amount" : "Your Details"}
                </h2>
                <p className="text-xs text-gray-500">
                  Step {currentStep} of 2
                </p>
              </div>
              
              <div className="w-10" /> {/* Spacer */}
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto pb-6" style={{ maxHeight: 'calc(95vh - 120px)' }}>
            {/* Payment Status Messages */}
            {paymentStatus !== "idle" && (
              <motion.div
                className={`mx-4 mt-4 p-4 rounded-xl ${
                  paymentStatus === "success"
                    ? "bg-green-50 border border-green-200"
                    : paymentStatus === "processing"
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-red-50 border border-red-200"
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3">
                  {paymentStatus === "processing" && (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
                  )}
                  <span className={`font-medium ${
                    paymentStatus === "success"
                      ? "text-green-800"
                      : paymentStatus === "processing"
                      ? "text-blue-800"
                      : "text-red-800"
                  }`}>
                    {paymentMessage}
                  </span>
                </div>
              </motion.div>
            )}

            <div className="px-4">
              {/* Project Info */}
              {project && (
                <motion.div 
                  className="mt-6 mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {project.location}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Shield size={12} className="text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Verified Campaign</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 1 ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Contribution Info */}
                  <div className="text-center p-4 bg-cyan-50 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-1">Most contributors donate</p>
                    <p className="text-2xl font-bold text-cyan-600">₹1,000</p>
                  </div>

                  {/* Amount Grid - Better mobile layout */}
                  <div className="grid grid-cols-2 gap-3">
                    {presetAmounts.map((amount, index) => (
                      <motion.button
                        key={amount}
                        onClick={() => handleAmountSelect(amount)}
                        disabled={paymentStatus === "processing"}
                        className={`relative p-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${
                          selectedAmount === amount && !isCustomMode
                            ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg transform scale-105"
                            : "bg-white border-2 border-gray-200 text-gray-700 hover:border-cyan-300 active:scale-95"
                        } ${
                          paymentStatus === "processing"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        ₹{amount.toLocaleString()}
                        {selectedAmount === amount && !isCustomMode && (
                          <motion.div
                            className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <CheckCircle size={16} className="text-cyan-500" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <motion.button
                      onClick={handleCustomAmount}
                      disabled={paymentStatus === "processing"}
                      className={`w-full p-4 rounded-2xl border-2 border-dashed transition-all duration-200 ${
                        isCustomMode
                          ? "border-cyan-400 bg-cyan-50"
                          : "border-gray-300 bg-white hover:border-cyan-300"
                      } ${
                        paymentStatus === "processing"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-gray-600 font-medium">
                        {isCustomMode ? "Custom Amount Selected" : "Enter Custom Amount"}
                      </span>
                    </motion.button>
                    
                    <AnimatePresence>
                      {isCustomMode && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3"
                        >
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-bold text-gray-500">₹</span>
                            <input
                              type="number"
                              value={customAmount}
                              onChange={handleCustomAmountChange}
                              placeholder="0"
                              disabled={paymentStatus === "processing"}
                              className="w-full pl-10 pr-4 py-4 text-xl font-bold border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 disabled:opacity-50 text-center"
                              inputMode="decimal"
                              autoFocus
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            Minimum donation: ₹100
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Platform Fee Info */}
                  <motion.div 
                    className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Info size={16} className="text-emerald-600" />
                      </div>
                      <div className="text-sm">
                        <p className="font-semibold text-emerald-700 mb-1">
                          0% Platform Fee
                        </p>
                        <p className="text-emerald-600">
                          We're not charging any platform fee for this campaign. Your generosity keeps us running!
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Continue Button */}
                  <motion.button
                    onClick={handleNextStep}
                    disabled={paymentStatus === "processing"}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Continue
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 mt-6"
                >
                  {/* Amount Summary */}
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-4 border border-cyan-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600">Donation Amount</span>
                      <span className="font-bold text-gray-800">
                        ₹{(isCustomMode ? parseFloat(customAmount) || 0 : selectedAmount).toLocaleString()}
                      </span>
                    </div>
                    
                    {/* Tip Section */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600 text-sm">Support our platform</span>
                      <select
                        value={tipPercent}
                        onChange={(e) => setTipPercent(parseInt(e.target.value))}
                        disabled={paymentStatus === "processing"}
                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 bg-white"
                      >
                        <option value={18}>18% (₹{calculateTip()})</option>
                        <option value={15}>15% (₹{Math.round(((isCustomMode ? parseFloat(customAmount) || 0 : selectedAmount) * 15) / 100)})</option>
                        <option value={10}>10% (₹{Math.round(((isCustomMode ? parseFloat(customAmount) || 0 : selectedAmount) * 10) / 100)})</option>
                        <option value={5}>5% (₹{Math.round(((isCustomMode ? parseFloat(customAmount) || 0 : selectedAmount) * 5) / 100)})</option>
                        <option value={0}>No tip</option>
                      </select>
                    </div>
                    
                    <div className="border-t border-cyan-200 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800">Total Amount</span>
                        <span className="text-2xl font-bold text-cyan-600">
                          ₹{calculateTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full Name *"
                        disabled={paymentStatus === "processing"}
                        className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 disabled:opacity-50 transition-all"
                      />
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                      <input
                        type="checkbox"
                        id="anonymous"
                        name="isAnonymous"
                        checked={formData.isAnonymous}
                        onChange={handleInputChange}
                        disabled={paymentStatus === "processing"}
                        className="mt-1 w-5 h-5 text-cyan-500 border-2 border-gray-300 rounded focus:ring-cyan-500 disabled:opacity-50"
                      />
                      <label htmlFor="anonymous" className="text-sm text-gray-700 font-medium">
                        Keep my donation anonymous
                      </label>
                    </div>

                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email Address *"
                        disabled={paymentStatus === "processing"}
                        className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 disabled:opacity-50 transition-all"
                        inputMode="email"
                      />
                    </div>

                    <div>
                      <div className="flex gap-3">
                        <div className="flex items-center gap-2 px-4 py-4 border-2 border-gray-200 rounded-2xl bg-gray-50 min-w-[80px]">
                          <div className="w-5 h-4  rounded-sm">
                            <IN className="w-5 h-4" />
                          </div>
                          <span className="font-medium text-gray-700">+91</span>
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Mobile Number *"
                          disabled={paymentStatus === "processing"}
                          className="flex-1 px-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 disabled:opacity-50 transition-all"
                          inputMode="tel"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 px-1">
                        Payment updates will be sent to this number
                      </p>
                    </div>

                    {/* Payment Button */}
                    <motion.button
                      onClick={handleSubmit}
                      disabled={paymentStatus === "processing"}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-5 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-6"
                      whileTap={{ scale: 0.98 }}
                    >
                      {paymentStatus === "processing" ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                          <span>Processing Payment...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Shield size={20} />
                          <span>Secure Payment • ₹{calculateTotal().toLocaleString()}</span>
                        </div>
                      )}
                    </motion.button>

                    {/* Security Info */}
                    <div className="text-center pt-4">
                      <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                        <Shield size={12} className="text-green-500" />
                        Your payment is secured with Razorpay
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Bottom Safe Area for iOS */}
          <div className="h-safe-area-inset-bottom bg-white"></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DonationModal;