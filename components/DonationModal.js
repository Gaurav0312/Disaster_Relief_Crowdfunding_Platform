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
    className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-start justify-center p-0 sm:p-4 overflow-y-auto"
    onClick={handleClose}
  >
    <div
      className="bg-white w-full min-h-screen sm:min-h-0 sm:rounded-2xl sm:shadow-2xl sm:max-w-md sm:mx-auto sm:my-10 sm:max-h-[90vh] overflow-y-auto transform transition-all duration-300"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header - Sticky on mobile */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 z-10 shadow-sm sm:shadow-none">
        <button
          onClick={handleClose}
          className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-cyan-500 hover:bg-gray-100 rounded-full p-2 transition-colors"
          aria-label="Close"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 ml-10 truncate text-center sm:text-left">
          Support: {project?.title}
        </h2>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6">
        {/* Payment Status Messages */}
        {paymentStatus !== 'idle' && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
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
              <span className="font-medium">{paymentMessage}</span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Project Info */}
          {project && (
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                />
                <div className="overflow-hidden">
                  <h3 className="font-semibold text-gray-800 truncate">{project.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{project.location}</p>
                </div>
              </div>
            </div>
          )}

          {/* Contribution Info */}
          <div className="text-center text-gray-600 text-xs sm:text-sm">
            Most contributors donate approx{' '}
            <span className="text-cyan-500 font-semibold">₹1000</span>
          </div>

          {/* Amount Options - Improved mobile layout */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                disabled={paymentStatus === 'processing'}
                className={`min-w-[70px] sm:min-w-[80px] px-3 py-2 sm:px-4 sm:py-2 rounded-full font-medium text-sm sm:text-base transition-all duration-200 ${
                  selectedAmount === amount && !isCustomMode
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-cyan-500'
                } ${paymentStatus === 'processing' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                ₹{amount}
              </button>
            ))}
          </div>

          {/* Other Amount - Mobile optimized */}
          <div className="text-center mb-4">
            <button
              onClick={handleCustomAmount}
              disabled={paymentStatus === 'processing'}
              className={`w-full max-w-xs mx-auto px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-600 hover:border-cyan-500 transition-colors text-sm sm:text-base ${
                paymentStatus === 'processing' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Other Amount
            </button>
            {isCustomMode && (
              <div className="mt-3">
                <input
                  type="number"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter amount"
                  disabled={paymentStatus === 'processing'}
                  className="w-full text-base px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50"
                  inputMode="decimal"
                />
              </div>
            )}
          </div>

          {/* Platform Fee Info */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 sm:p-4 mb-4">
            <div className="flex items-start gap-2">
              <Info size={18} className="text-cyan-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs sm:text-sm">
                <div className="font-bold text-cyan-700">
                  Platform is charging 0% platform fee* for this fundraiser, relying solely on the generosity of contributors like you.
                </div>
              </div>
            </div>
          </div>

          {/* Tip Section - Stacked on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <span className="text-gray-700 text-sm">Support us with a tip:</span>
            <select
              value={tipPercent}
              onChange={(e) => setTipPercent(parseInt(e.target.value))}
              disabled={paymentStatus === 'processing'}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            >
              <option value={15}>
                15% (₹{Math.round(((isCustomMode ? parseFloat(customAmount) || 0 : selectedAmount) * 15) / 100)})
              </option>
              <option value={10}>
                10% (₹{Math.round(((isCustomMode ? parseFloat(customAmount) || 0 : selectedAmount) * 10) / 100)})
              </option>
              <option value={5}>
                5% (₹{Math.round(((isCustomMode ? parseFloat(customAmount) || 0 : selectedAmount) * 5) / 100)})
              </option>
              <option value={0}>No tip</option>
            </select>
          </div>

          {/* Total Amount - More prominent */}
          <div className="text-center font-bold text-gray-800 mb-5 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Total Amount</div>
            <div className="text-xl text-cyan-600">₹ {calculateTotal()}</div>
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
                disabled={paymentStatus === 'processing'}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="anonymous"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleInputChange}
                disabled={paymentStatus === 'processing'}
                className="mt-1 w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500 disabled:opacity-50"
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
                placeholder="Email Address *"
                disabled={paymentStatus === 'processing'}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50"
                inputMode="email"
              />
            </div>

            <div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 px-3 py-3 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="w-4 h-3 bg-gradient-to-b from-orange-400 via-white to-green-500 rounded-sm"></div>
                  <span className="text-sm font-medium">+91</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Mobile Number *"
                  disabled={paymentStatus === 'processing'}
                  className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50"
                  inputMode="tel"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Payment updates will be sent to this number
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={paymentStatus === 'processing'}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold py-4 rounded-lg transition-all duration-300 mt-4 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
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
);
};

export default DonationModal;