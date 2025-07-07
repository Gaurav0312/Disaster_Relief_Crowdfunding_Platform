// app/api/campaigns/route.js
import { NextResponse } from 'next/server';
import { DatabaseHelper } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const campaignData = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'category', 'location', 'goal', 'description'];
    for (const field of requiredFields) {
      if (!campaignData[field]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Add additional campaign fields
    const campaign = {
      ...campaignData,
      raisedAmount: 0,
      donationCount: 0,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await DatabaseHelper.saveCampaign(campaign);
    
    return NextResponse.json({ 
      message: 'Campaign created successfully', 
      id: result.id 
    });
    
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { message: 'Failed to create campaign', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = parseInt(searchParams.get('skip')) || 0;
    
    const db = await DatabaseHelper.getDatabase();
    const campaigns = await db.collection('campaigns')
      .find({ status: 'active' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    return NextResponse.json({ campaigns });
    
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { message: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}