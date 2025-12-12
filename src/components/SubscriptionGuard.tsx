import { type ReactNode, useState } from 'react';
import { useSubscription, type SubscriptionTier } from '@/contexts/SubscriptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Sparkles, ArrowRight, Crown } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { StripeCheckout } from './StripeCheckout';
import { SUBSCRIPTION_TIERS } from '@/lib/constants';

interface SubscriptionGuardProps {
  children: ReactNode;
  requiredTier: SubscriptionTier;
  featureName?: string;
  showUpgradeUI?: boolean;
}

export function SubscriptionGuard({
  children,
  requiredTier,
  featureName,
  showUpgradeUI = true,
}: SubscriptionGuardProps) {
  const { hasAccess, isAuthenticated, currentTier } = useSubscription();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // User has access - render children
  if (hasAccess(requiredTier)) {
    return <>{children}</>;
  }

  // User doesn't have access and we don't want to show upgrade UI
  if (!showUpgradeUI) {
    return null;
  }

  // User is not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-zinc-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-600" />
              {featureName ? `${featureName} - Sign Up Required` : 'Sign Up Required'}
            </CardTitle>
            <CardDescription>
              Create a free account to access this feature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Sign Up Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultTab="signup"
        />
      </>
    );
  }

  // User is authenticated but needs to upgrade
  const tierConfig = SUBSCRIPTION_TIERS[requiredTier];

  return (
    <>
      <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-blue-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {requiredTier === 'ELITE' ? (
                  <Crown className="h-5 w-5 text-yellow-600" />
                ) : (
                  <Sparkles className="h-5 w-5 text-green-600" />
                )}
                {featureName ? `${featureName} - Upgrade Required` : 'Upgrade Required'}
              </CardTitle>
              <CardDescription className="mt-2">
                This feature requires the {tierConfig.name} plan
              </CardDescription>
            </div>
            <Badge className={requiredTier === 'ELITE' ? 'bg-yellow-500' : 'bg-green-600'}>
              {tierConfig.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-white p-4">
            <p className="mb-3 text-sm font-semibold text-zinc-700">
              Upgrade to {tierConfig.name} to unlock:
            </p>
            <ul className="space-y-2">
              {tierConfig.features.slice(0, 4).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-zinc-600">
                  <Sparkles className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-green-600 to-blue-600 p-4 text-white">
            <div>
              <p className="text-sm font-medium">Current Plan: {SUBSCRIPTION_TIERS[currentTier].name}</p>
              <p className="text-2xl font-bold">
                ${tierConfig.price}
                <span className="text-sm font-normal opacity-90">/{tierConfig.interval}</span>
              </p>
            </div>
            <Button
              onClick={() => setShowCheckout(true)}
              className="bg-white text-green-600 hover:bg-zinc-100"
            >
              Upgrade Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <p className="text-xs text-center text-zinc-500">
            Cancel anytime • 14-day money-back guarantee
          </p>
        </CardContent>
      </Card>

      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-w-2xl w-full">
            <StripeCheckout
              tier={requiredTier}
              onSuccess={() => setShowCheckout(false)}
              onCancel={() => setShowCheckout(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
