'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SubscriptionPlan } from '@/lib/types';

const PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Core features for individual learners',
    pricePerMonth: 0,
    currency: 'USD',
    billingCycleOptions: ['monthly'],
    features: ['Basic lessons', 'Community access', 'Limited AI simplification'],
  },
  {
    id: 'freemium',
    name: 'Freemium',
    description: 'Free tier with optional upgrades',
    pricePerMonth: 0,
    currency: 'USD',
    billingCycleOptions: ['monthly'],
    features: ['Everything in Free', 'Extra lesson exports', 'Priority support (queue)'],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For teachers and small schools',
    pricePerMonth: 1499,
    currency: 'USD',
    billingCycleOptions: ['monthly', 'yearly'],
    features: ['Unlimited simplification', 'Advanced assessments', 'Higher quality TTS', 'Teacher analytics'],
    recommended: true,
  },
  {
    id: 'pro_plus',
    name: 'Pro+',
    description: 'Enterprise features and priority support',
    pricePerMonth: 4999,
    currency: 'USD',
    billingCycleOptions: ['monthly', 'yearly'],
    features: ['Everything in Pro', 'Dedicated onboarding', 'SLA & priority support'],
  },
];

function formatPrice(cents: number, currency = 'USD') {
  if (!cents) return 'Free';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}

export default function SubscriptionPlans() {
  return (
    <section id="plans" className="w-full py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold">Choose a plan</h2>
          <p className="mt-2 text-muted-foreground">Flexible plans for individuals, teachers, and institutions.</p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <Card key={plan.id} className="text-center">
              <CardHeader className="pt-6">
                <div className="flex items-center justify-center gap-2">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.recommended && <Badge className="ml-2">Recommended</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <div className="mt-4 mb-4">
                  <div className="text-2xl font-bold">{formatPrice(plan.pricePerMonth, plan.currency)}</div>
                  <div className="text-xs text-muted-foreground">per month</div>
                </div>
                <ul className="space-y-2 text-sm text-left mb-4">
                  {plan.features.map((f, i) => (
                    <li key={i} className="before:content-['•'] before:mr-2 before:text-primary">{f}</li>
                  ))}
                </ul>
                <div className="mt-4">
                  <Button asChild>
                    <Link href={`/auth/signup?plan=${plan.id}`}>Get {plan.name}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
