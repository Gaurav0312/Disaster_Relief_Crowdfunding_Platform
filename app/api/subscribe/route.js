import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/lib/email';

export async function POST(request) {
  const { email } = await request.json();

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: 'Invalid email address' },
      { status: 400 }
    );
  }

  try {
    const { db } = await connectToDatabase();
    
    // Check for existing subscriber
    const existing = await db.collection('subscribers').findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 409 }
      );
    }

    // Insert new subscriber
    const result = await db.collection('subscribers').insertOne({
      email,
      createdAt: new Date(),
      source: 'website',
      status: 'pending' // For double opt-in
    });

    // Send confirmation email (optional)
    await sendConfirmationEmail(email);

    return NextResponse.json(
      { message: 'Subscription successful! Check your email to confirm.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}