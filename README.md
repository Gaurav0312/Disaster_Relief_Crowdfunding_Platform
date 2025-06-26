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



🌐 Deployment
Hosted on Vercel

Database hosted on MongoDB Atlas
