export const processPayment = async (donationData) => {
  try {
    // Example integration with Razorpay
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: donationData.total * 100, // Amount in paise
      currency: 'INR',
      name: 'Your App Name',
      description: `Donation for ${donationData.projectTitle}`,
      order_id: donationData.orderId, // Get this from your backend
      handler: function (response) {
        // Handle successful payment
        console.log('Payment successful:', response);
        // Send to your backend to verify and record the donation
      },
      prefill: {
        name: donationData.name,
        email: donationData.email,
        contact: donationData.phone,
      },
      theme: {
        color: '#0891b2', // Cyan color matching your design
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
  }
};

// ========================================================
// 4. Installation and Setup Instructions

/*
SETUP INSTRUCTIONS:

1. Install required dependencies:
   npm install lucide-react framer-motion react-intersection-observer react-share

2. File Structure:
   src/
   ├── components/
   │   ├── DonationModal.js
   │   └── ProjectCard.js
   ├── services/
   │   └── paymentService.js (optional)
   └── App.js

3. Make sure Tailwind CSS is properly configured in your project

4. For payment integration:
   - Add Razorpay script to your public/index.html:
     <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   
   - Create environment variables:
     REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id

5. Usage in your main component:
   import ProjectCard from './components/ProjectCard';
   
   const projects = [
     {
       id: 1,
       title: "Help Flood Victims",
       description: "Supporting families affected by recent floods...",
       imageUrl: "/path/to/image.jpg",
       location: "Kerala, India",
       category: "Disaster Relief",
       raised: 50000,
       goal: 100000,
       donors: 123,
       daysLeft: 15,
       urgent: true
     }
   ];
   
   return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {projects.map(project => (
         <ProjectCard key={project.id} project={project} />
       ))}
     </div>
   );
*/