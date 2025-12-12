import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '@/lib/constants';
import { useSubscription, type SubscriptionTier } from '@/contexts/SubscriptionContext';

interface StripeCheckoutProps {
  tier: SubscriptionTier;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StripeCheckout({ tier, onSuccess, onCancel }: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { upgradeTier } = useSubscription();

  const handleCheckout = async () => {
    if (tier === 'FREE') {
      // No payment needed for free tier
      upgradeTier('FREE');
      onSuccess?.();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Redirect to Stripe billing portal for payment
      const STRIPE_BILLING_URL = 'https://billing.stripe.com/p/login/test_cNi4gB3Bl3ea1Ai2UW7bW00';
      window.location.href = STRIPE_BILLING_URL;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const tierConfig = SUBSCRIPTION_TIERS[tier];

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {tier === 'FREE' ? 'Start Free Account' : `Upgrade to ${tierConfig.name}`}
        </CardTitle>
        <CardDescription>
          {tier === 'FREE'
            ? 'Get started with a free account - no credit card required'
            : `${tierConfig.currency}${tierConfig.price}/${tierConfig.interval}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-zinc-700">What you'll get:</h4>
          <ul className="space-y-2">
            {tierConfig.features.slice(0, 5).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : tier === 'FREE' ? (
              'Start Free'
            ) : (
              `Pay ${tierConfig.currency}${tierConfig.price}/month`
            )}
          </Button>
          {onCancel && (
            <Button onClick={onCancel} variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          )}
        </div>

        {tier !== 'FREE' && (
          <p className="text-xs text-zinc-500 text-center">
            Secure payment powered by Stripe. Cancel anytime.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
