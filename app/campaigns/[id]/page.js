"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CampaignDetailPage from "@/components/CampaignDetailPage";

export default function CampaignDetail({ params }) {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);


    const handleBack = () => {
    if (typeof window !== "undefined") {
      // Check if there's history to go back to
      if (window.history.length > 1) {
        // Use router.back() to maintain scroll position
        router.back();
      } else {
        // If no history, redirect to home with scroll restoration
        router.push("/", { scroll: false });
      }
    }
  };

  return (
    <CampaignDetailPage
      campaignId={parseInt(params.id)}
      onBack={handleBack} // Pass safe back function
    />
  );
}
