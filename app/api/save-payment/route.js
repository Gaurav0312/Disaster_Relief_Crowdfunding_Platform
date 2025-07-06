import { DatabaseHelper } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const paymentData = await request.json();

    // Validate required fields
    if (!paymentData.projectId || !paymentData.email || !paymentData.amount) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields"
        },
        { status: 400 }
      );
    }

    // Save donation to database
    const saveResult = await DatabaseHelper.saveDonation(paymentData);

    // If payment is successful, update the project's raised amount
    if (paymentData.status === 'success') {
      await DatabaseHelper.updateProjectAmount(
        paymentData.projectId, 
        paymentData.amount
      );

      // You can add additional success logic here:
      // - Send confirmation email
      // - Update user donation history
      // - Trigger notifications
    }

    // Log for monitoring
    console.log(`${paymentData.status} payment processed:`, {
      id: saveResult && saveResult.id ? saveResult.id : null,
      projectId: paymentData.projectId,
      amount: paymentData.amount,
      email: paymentData.email
    });

    return NextResponse.json(
      { 
        success: true, 
        id: saveResult && saveResult.id ? saveResult.id : null,
        message: 'Payment data saved successfully' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error saving payment:', error);
    
    // Return different error messages based on error type
    const isValidationError = error && error.message && error.message.includes('validation');
    const statusCode = isValidationError ? 400 : 500;
    
    return NextResponse.json(
      { 
        success: false, 
        error: isValidationError && error.message ? error.message : 'Failed to save payment data',
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}