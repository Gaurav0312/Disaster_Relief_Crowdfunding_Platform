🌍 Disaster Relief Crowdfunding Platform
Live Demo: https://disaster-relief-crowdfunding-platfo.vercel.app/


📚 Project Overview
The Disaster Relief Crowdfunding Platform is a fully responsive, real-time donation website built to support communities affected by natural disasters. It allows users to browse active campaigns, donate securely via Razorpay, and access personalized dashboards.


🚀 Key Features
🔹 Next.js 15 (App Router) with tab-based navigation (Browse, Emergency, About Us, Dashboard)

🔹 Secure authentication using NextAuth

🔹 Razorpay payment integration with confirmation modals

🔹 MongoDB Atlas database for storing users, campaigns, and donations

🔹 Real-time search and category filtering

🔹 Emergency campaign prioritization

🔹 Mobile-friendly design with framer-motion animations

🔹 Safe back navigation to prevent accidental app closure



🛠 Tech Stack
Frontend: Next.js 15, Tailwind CSS, Framer Motion

Backend: Next.js API routes, MongoDB Atlas

Authentication: NextAuth

Payments: Razorpay

Deployment: Vercel



📱 Mobile Responsiveness
The platform is fully optimized for mobile with:

Tab-based navigation

Mobile-friendly modals and menus

Safe mobile back button behavior



💳 Payment Workflow
Donors select a campaign and click Donate

Razorpay checkout is triggered securely

Post-payment confirmation modal is displayed

Donation records are stored in MongoDB



🔐 Security
CORS protection

Environment variables handled via .env files

Session management using NextAuth

🔐 Environment Variables Setup
Make sure to configure:

MongoDB connection URI from MongoDB Atlas

Razorpay API keys from your Razorpay Dashboard

NextAuth secret key (you can generate one using: openssl rand -base64 32)


🌐 Deployment
Hosted on Vercel

Database hosted on MongoDB Atlas

🚀 Steps to Run the Project Locally

# 1. Clone the repository
git clone <your-repo-link>

# 2. Navigate to the project directory
cd disaster-relief-crowdfunding-platform

# 3. Install dependencies
npm install

# 4. Create a .env.local file in the root directory and add the following:
# Example .env.local
MONGODB_URI=your-mongodb-connection-string
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=http://localhost:3000
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# 5. Run the development server
npm run dev

