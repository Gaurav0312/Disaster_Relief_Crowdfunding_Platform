'use client';
import { useRouter } from 'next/navigation';
import CampaignDetailPage from '@/components/CampaignDetailPage';

export default function CampaignDetail({ params }) {
  const router = useRouter();
  
  return (
    <CampaignDetailPage 
      campaignId={parseInt(params.id)} 
      onBack={() => router.back()}
    />
  );
}