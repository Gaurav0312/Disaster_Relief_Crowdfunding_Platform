"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DonorDashboard() {
  const { data: session, status } = useSession();
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserDonations(session.user.email);
    }
  }, [session]);

  const fetchUserDonations = async (email) => {
    try {
      const response = await fetch(
        `/api/donations?email=${encodeURIComponent(email)}`
      );
      const data = await response.json();
      if (response.ok) {
        setDonations(data);
      } else {
        console.error("Failed to fetch donations:", data.error);
        setDonations([]);
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
      setDonations([]);
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Please sign in to view your dashboard.</p>;

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
      <h1 className="text-2xl font-bold mb-4">Your Donor Dashboard</h1>
      <p className="text-gray-600 mb-6">Hello, {session.user.name} 👋</p>

      <div className="mb-4">
        <h2 className="font-semibold text-lg mb-2">Total Donated</h2>
        <p className="text-blue-600 text-xl font-bold">
          ₹{totalDonated.toLocaleString()}
        </p>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Donation History</h2>
        <ul className="divide-y divide-gray-200">
          {donations.map((don) => (
            <li key={don._id} className="py-2 flex justify-between">
              <span>{don.projectTitle}</span>
              <span className="text-sm text-gray-500">
                ₹{don.amount} • {new Date(don.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
