import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(email) {
  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Subscription Confirmed',
      html: `<p>Thank you for subscribing to our platform! </p>`
    });
  } catch (error) {
    console.error('Email send error:', error);
  }
}