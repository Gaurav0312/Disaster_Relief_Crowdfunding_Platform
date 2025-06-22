// app/api/donate/route.js
import { NextResponse } from 'next/server';
import { DatabaseHelper } from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { 
      amount, 
      email, 
      projectId, 
      paymentMethod, 
      transactionId,
      donorName 
    } = await req.json();

    // Validation
    if (!amount || !email || !projectId) {
      return NextResponse.json(
        { message: 'Amount, email, and project ID are required' },
        { status: 400 }
      );
    }

    // Prepare donation data
    const donationData = {
      amount: parseFloat(amount),
      email,
      projectId,
      paymentMethod: paymentMethod || 'card',
      transactionId: transactionId || `txn_${Date.now()}`,
      donorName: donorName || 'Anonymous',
      status: 'success',
    };

    // Save donation
    const result = await DatabaseHelper.saveDonation(donationData);

    // Update project amount
    if (result.success) {
      await DatabaseHelper.updateProjectAmount(projectId, donationData.amount);
    }

    return NextResponse.json(
      { 
        message: 'Payment processed successfully',
        donationId: result.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { message: 'Payment processing failed' },
      { status: 500 }
    );
  }
}