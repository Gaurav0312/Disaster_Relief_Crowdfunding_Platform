import { NextResponse } from 'next/server';
import { DatabaseHelper } from '@/lib/mongodb';

export async function POST(req) {
  try {
    const data = await req.json();

    // Basic validation
    const requiredFields = ['title', 'category', 'location', 'goal', 'description'];
    const missing = requiredFields.find(field => !data[field]);
    if (missing) {
      return NextResponse.json({ message: `${missing} is required` }, { status: 400 });
    }

    const db = await DatabaseHelper.getDatabase();
    const collection = db.collection('campaigns');

    const newCampaign = {
      ...data,
      raised: 0,
      donors: 0,
      urgent: false,
      status: 'pending', // For admin approval
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newCampaign);

    return NextResponse.json({
      message: 'Campaign submitted successfully',
      campaignId: result.insertedId
    }, { status: 201 });

  } catch (error) {
    console.error('Error saving campaign:', error);
    return NextResponse.json({ message: 'Failed to save campaign' }, { status: 500 });
  }
}
