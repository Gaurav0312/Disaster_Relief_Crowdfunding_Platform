'use client';
import { useRouter } from 'next/navigation';
import CampaignDetailPage from '@/components/CampaignDetailPage';

export default function CampaignDetail({ params }) {
  const router = useRouter();

  // Safe Back Function
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back(); // If browser history exists, go back
    } else {
      router.push('/'); // If no history, redirect to home
    }
  };

  return (
    <CampaignDetailPage 
      campaignId={parseInt(params.id)} 
      onBack={handleBack} // Pass safe back function
    />
  );
}
