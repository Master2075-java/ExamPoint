import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Crown, Sparkles, CreditCard, Calendar, AlertCircle } from 'lucide-react';
import { useSubscription, type SubscriptionTier } from '@/contexts/SubscriptionContext';
import { SUBSCRIPTION_TIERS } from '@/lib/constants';
import { StripeCheckout } from './StripeCheckout';

export function SubscriptionManager() {
  const { currentTier, user } = useSubscription();
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);

  const handleUpgrade = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    setShowCheckout(true);
  };

  const currentTierConfig = SUBSCRIPTION_TIERS[currentTier];

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-zinc-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Current Subscription
          </CardTitle>
          <CardDescription>Your active plan and billing information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-bold text-zinc-900">{currentTierConfig.name}</h3>
                {currentTier === 'ELITE' && <Crown className="h-5 w-5 text-yellow-600" />}
                {currentTier === 'BASIC' && <Sparkles className="h-5 w-5 text-green-600" />}
              </div>
              <p className="text-zinc-600">
                {currentTier === 'FREE' ? (
                  'Free forever'
                ) : (
                  <>
                    ${currentTierConfig.price}/{currentTierConfig.interval}
                  </>
                )}
              </p>
            </div>
            <Badge
              className={
                currentTier === 'ELITE'
                  ? 'bg-yellow-500'
                  : currentTier === 'BASIC'
                  ? 'bg-green-600'
                  : 'bg-zinc-600'
              }
            >
              Active
            </Badge>
          </div>

          {currentTier !== 'FREE' && (
            <div className="rounded-lg bg-white p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">Next billing date</span>
                <span className="font-medium">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">Payment method</span>
                <span className="font-medium">•••• 4242</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-zinc-700">Your plan includes:</h4>
            <ul className="space-y-2">
              {currentTierConfig.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-zinc-600">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      {currentTier !== 'ELITE' && (
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">Upgrade Your Plan</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Tier */}
            {currentTier === 'FREE' && (
              <Card className="border-2 border-green-300 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-green-600" />
                        {SUBSCRIPTION_TIERS.BASIC.name}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Perfect for regular studying
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-600">Popular</Badge>
                  </div>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-zinc-900">
                      ${SUBSCRIPTION_TIERS.BASIC.price}
                    </span>
                    <span className="text-zinc-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {SUBSCRIPTION_TIERS.BASIC.features.slice(0, 5).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleUpgrade('BASIC')}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Upgrade to Basic
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Elite Tier */}
            <Card className="border-2 border-yellow-400 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-600" />
                      {SUBSCRIPTION_TIERS.ELITE.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Unlimited everything for serious students
                    </CardDescription>
                  </div>
                  <Badge className="bg-yellow-500">Best Value</Badge>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-zinc-900">
                    ${SUBSCRIPTION_TIERS.ELITE.price}
                  </span>
                  <span className="text-zinc-600">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {SUBSCRIPTION_TIERS.ELITE.features.slice(0, 5).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-yellow-600 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleUpgrade('ELITE')}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  Upgrade to Elite
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {currentTier === 'ELITE' && (
        <Alert className="border-green-300 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            You're on the Elite plan with unlimited access to all features!
          </AlertDescription>
        </Alert>
      )}

      {/* Checkout Modal */}
      {showCheckout && selectedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-w-2xl w-full">
            <StripeCheckout
              tier={selectedTier}
              onSuccess={() => {
                setShowCheckout(false);
                setSelectedTier(null);
              }}
              onCancel={() => {
                setShowCheckout(false);
                setSelectedTier(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
