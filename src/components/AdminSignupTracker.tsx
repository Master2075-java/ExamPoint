import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Mail, Clock, TrendingUp } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { formatDistanceToNow } from 'date-fns';

export function AdminSignupTracker() {
  const { signupEvents } = useSubscription();

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'ELITE':
        return 'bg-yellow-500';
      case 'BASIC':
        return 'bg-green-600';
      default:
        return 'bg-zinc-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600">Total Signups</p>
                <p className="text-3xl font-bold text-blue-600">{signupEvents.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600">Last Hour</p>
                <p className="text-3xl font-bold text-green-600">
                  {
                    signupEvents.filter(
                      (event) =>
                        new Date().getTime() - new Date(event.timestamp).getTime() < 60 * 60 * 1000
                    ).length
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600">Growth Rate</p>
                <p className="text-3xl font-bold text-blue-600">+{signupEvents.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Signup List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent Signups
          </CardTitle>
          <CardDescription>Real-time signup tracking - see new users as they join</CardDescription>
        </CardHeader>
        <CardContent>
          {signupEvents.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-zinc-400" />
              <p className="text-lg font-semibold text-zinc-700">No signups yet</p>
              <p className="text-sm text-zinc-500">
                Waiting for users to sign up. They'll appear here in real-time!
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {signupEvents.map((event) => (
                  <Card key={event.id} className="border-2 border-zinc-200 bg-zinc-50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {event.user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                                .substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-zinc-900">{event.user.name}</p>
                            <div className="flex items-center gap-2 text-sm text-zinc-600">
                              <Mail className="h-3 w-3" />
                              {event.user.email}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                        <Badge className={getTierColor(event.tier)}>{event.tier}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
