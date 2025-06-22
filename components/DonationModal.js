import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Info,CheckCircle } from 'lucide-react';

const DonationModal = ({ isOpen, onClose, project }) => {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, error
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [tipPercent, setTipPercent] = useState(18);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    isAnonymous: false
  });

  const presetAmounts = [300, 500, 1000];

  const calculateTip = () => {
    const amount = isCustomMode ? (parseFloat(customAmount) || 0) : selectedAmount;
    return Math.round((amount * tipPercent) / 100);
  };

  const calculateTotal = () => {
    const amount = isCustomMode ? (parseFloat(customAmount) || 0) : selectedAmount;
    return amount + calculateTip();
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setIsCustomMode(false);
    setCustomAmount('');
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

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = async (amount) => {
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency: 'INR',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const savePaymentToDatabase = async (paymentData, status) => {
    try {
      const response = await fetch('/api/save-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentData,
          status,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save payment data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving payment:', error);
      throw error;
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      setPaymentStatus('processing');
      setPaymentMessage('Initializing payment...');

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Create order
      const order = await createRazorpayOrder(calculateTotal());

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        name: 'Donation Platform',
        description: `Donation for ${project?.title}`,
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: `+91${formData.phone}`,
        },
        theme: {
          color: '#06b6d4', // Cyan color to match your theme
        },
        handler: async (response) => {
          try {
            // Payment successful
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

            // Save to database
            await savePaymentToDatabase(paymentData, 'success');

            setPaymentStatus('success');
            setPaymentMessage('Thank you for your donation! Your contribution will help those in need.');

            setShowSuccessPopup(true);
          } catch (error) {
            console.error('Error processing successful payment:', error);
            setPaymentStatus('error');
            setPaymentMessage('Payment was successful, but there was an error saving your data. Please contact support.');
          }
        },
        modal: {
          ondismiss: async () => {
            try {
              // Payment cancelled/failed
              const paymentData = {
                projectId: project?.id,
                projectTitle: project?.title,
                amount: isCustomMode ? parseFloat(customAmount) : selectedAmount,
                tip: calculateTip(),
                total: calculateTotal(),
                ...formData,
                razorpay_order_id: order.id,
              };

              await savePaymentToDatabase(paymentData, 'cancelled');
              
              setPaymentStatus('error');
              setPaymentMessage('Payment was cancelled. Please try again.');
              
              setTimeout(() => {
                setPaymentStatus('idle');
                setPaymentMessage('');
              }, 3000);
            } catch (error) {
              console.error('Error handling payment cancellation:', error);
            }
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      setPaymentMessage('Failed to initialize payment. Please try again.');
      
      setTimeout(() => {
        setPaymentStatus('idle');
        setPaymentMessage('');
      }, 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    const amount = isCustomMode ? parseFloat(customAmount) : selectedAmount;
    if (!amount || amount <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    // Proceed with Razorpay payment
    handleRazorpayPayment();
  };

  const handleClose = () => {
    onClose();
    // Reset form data when closing
    setFormData({
      name: '',
      email: '',
      phone: '',
      isAnonymous: false
    });
    setSelectedAmount(500);
    setCustomAmount('');
    setIsCustomMode(false);
    setTipPercent(18);
    setPaymentStatus('idle');
    setPaymentMessage('');
    setShowSuccessPopup(false);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

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
          className="bg-white rounded-2xl p-6 w-full max-w-md text-center shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-gray-800">Thank You!</h3>
          <p className="text-gray-600 mb-4">
            Thank you for your donation! Your contribution will help those in need.
          </p>
          <button
            onClick={handleClose}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            OK
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 overflow-y-auto p-6"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto mt-10 mb-10 max-h-[95vh] overflow-y-auto transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-6 relative shrink-0">
          <button
            onClick={handleClose}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 text-cyan-500 hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 ml-10 truncate">
            Support: {project?.title}
          </h2>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Payment Status Messages */}
          {paymentStatus !== 'idle' && (
            <div className={`mb-4 p-4 rounded-lg ${
              paymentStatus === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : paymentStatus === 'processing'
                ? 'bg-blue-50 border border-blue-200 text-blue-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-2">
                {paymentStatus === 'processing' && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                )}
                <span className="text-sm font-medium">{paymentMessage}</span>
              </div>
            </div>
          )}

          {/* Scrollable Content Area */}
          <div className="overflow-y-auto flex-grow">
            <div className="p-6">
              {/* Project Info */}
              {project && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.location}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contribution Info */}
              <div className="text-center text-gray-600 text-sm mb-6">
                Most Contributors contribute approx{' '}
                <span className="text-cyan-500 font-semibold">₹1000</span> to this Fundraiser
              </div>

              {/* Amount Options */}
              <div className="flex gap-3 justify-center mb-5">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    disabled={paymentStatus === 'processing'}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                      selectedAmount === amount && !isCustomMode
                        ? 'bg-cyan-500 text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-cyan-500'
                    } ${paymentStatus === 'processing' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>

              {/* Other Amount */}
              <div className="text-center mb-5">
                <button
                  onClick={handleCustomAmount}
                  disabled={paymentStatus === 'processing'}
                  className={`px-6 py-3 rounded-full bg-white border-2 border-gray-200 text-gray-600 hover:border-cyan-500 transition-colors ${
                    paymentStatus === 'processing' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Other Amount
                </button>
                {isCustomMode && (
                  <input
                    type="number"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter amount"
                    disabled={paymentStatus === 'processing'}
                    className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50"
                  />
                )}
              </div>

              {/* Platform Fee Info */}
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-5">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-cyan-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-bold text-cyan-700 mb-1">
                      Platform is charging 0% platform fee* for this fundraiser, relying solely on the generosity of contributors like you.
                    </div>
                  </div>
                </div>
              </div>

              {/* Tip Section */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700 text-sm">Support us by adding a tip of:</span>
                <select
                  value={tipPercent}
                  onChange={(e) => setTipPercent(parseInt(e.target.value))}
                  disabled={paymentStatus === 'processing'}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                >
                  <option value={15}>
                    15% (INR {Math.round(((isCustomMode ? parseFloat(customAmount) || 0 : selectedAmount) * 15) / 100)})
                  </option>
                  <option value={10}>
                    10% (INR {Math.round(((isCustomMode ? parseFloat(customAmount) || 0 : selectedAmount) * 10) / 100)})
                  </option>
                  <option value={5}>
                    5% (INR {Math.round(((isCustomMode ? parseFloat(customAmount) || 0 : selectedAmount) * 5) / 100)})
                  </option>
                  <option value={0}>No tip</option>
                </select>
              </div>

              {/* Total Amount */}
              <div className="text-right font-semibold text-gray-800 mb-6">
                Total Amount: INR {calculateTotal()}
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name *"
                    disabled={paymentStatus === 'processing'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="anonymous"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleInputChange}
                    disabled={paymentStatus === 'processing'}
                    className="w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500 disabled:opacity-50"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700">
                    Make my contribution anonymous
                  </label>
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email ID *"
                    disabled={paymentStatus === 'processing'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>

                <div>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                      <div className="w-5 h-4 bg-gradient-to-b from-orange-400 via-white to-green-500 rounded-sm"></div>
                      <span className="text-sm font-medium">+91</span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your Mobile Number *"
                      disabled={paymentStatus === 'processing'}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    All Payment updates will be sent on this number.
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={paymentStatus === 'processing'}
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {paymentStatus === 'processing' ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </div>
                  ) : (
                    'Proceed to Payment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;