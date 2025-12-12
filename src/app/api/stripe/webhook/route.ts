import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    );
  }

  let event;

  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;
      const planName = session.metadata?.planName;

      console.log(`✅ Subscription created for user ${userId}: ${planName}`);
      
      // Here you would:
      // 1. Update user's subscription in your database
      // 2. Grant access to premium features
      // 3. Send confirmation email
      // 4. Notify administrators

      // Update user subscription in your database
      // await updateUserSubscription(userId, {
      //   status: 'active',
      //   planId,
      //   planName,
      //   stripeSubscriptionId: session.subscription,
      //   customerId: session.customer
      // });

      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log(`💳 Payment succeeded for subscription ${invoice.subscription}`);
      
      // Handle successful recurring payment
      // - Extend subscription period
      // - Send receipt
      // - Update payment records

      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      console.log(`❌ Payment failed for subscription ${failedInvoice.subscription}`);
      
      // Handle failed payment
      // - Notify user
      // - Update subscription status
      // - Offer retry option

      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      console.log(`🗑️ Subscription cancelled: ${subscription.id}`);
      
      // Handle subscription cancellation
      // - Revoke premium access
      // - Downgrade to free plan
      // - Send cancellation confirmation

      break;

    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object;
      console.log(`📝 Subscription updated: ${updatedSubscription.id}`);
      
      // Handle subscription updates
      // - Apply new plan features
      // - Update billing information

      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}