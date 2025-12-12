import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const plans = {
  starter: {
    name: 'Starter',
    price: 0,
    features: ['Basic courses', '5 learning tools', 'Monthly progress reports'],
    stripe_price_id: null
  },
  pro: {
    name: 'Professional',
    price: 29.99,
    features: ['All courses', 'All learning tools', 'Weekly progress reports', 'AI recommendations', 'Priority support'],
    stripe_price_id: 'price_1QaB2vF4BuCTKeE3Kh0yjgha'
  },
  premium: {
    name: 'Premium',
    price: 49.99,
    features: ['Everything in Pro', '1-on-1 sessions', 'Custom learning paths', 'Family accounts', 'Advanced analytics'],
    stripe_price_id: 'price_1QaB2vF4BuCTKeE3Kh0yjghb'
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planId, userId } = body;

    if (!planId || !userId) {
      return NextResponse.json(
        { error: 'Plan ID and User ID are required' },
        { status: 400 }
      );
    }

    const plan = plans[planId as keyof typeof plans];
    
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // For free plan, create subscription directly
    if (plan.price === 0) {
      // Save free subscription to database
      // This would integrate with your user management system
      return NextResponse.json({
        success: true,
        subscription: {
          planId,
          planName: plan.name,
          price: 0,
          status: 'active',
          features: plan.features
        },
        message: 'Free subscription activated successfully'
      });
    }

    // For paid plans, create Stripe checkout session
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const session = await stripe.checkout.sessions.create({
      customer_email: body.email,
      billing_address_collection: 'required',
      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?cancelled=true`,
      metadata: {
        userId,
        planId,
        planName: plan.name
      },
      subscription_data: {
        metadata: {
          userId,
          planId,
          planName: plan.name
        }
      }
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      plan: {
        name: plan.name,
        price: plan.price,
        features: plan.features
      }
    });

  } catch (error) {
    console.error('Stripe subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}