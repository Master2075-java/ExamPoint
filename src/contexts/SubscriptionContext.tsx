import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type SubscriptionTier = 'FREE' | 'BASIC' | 'ELITE';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface SignupEvent {
  id: string;
  user: User;
  timestamp: Date;
  tier: SubscriptionTier;
}

export interface SubscriptionContextType {
  user: User | null;
  currentTier: SubscriptionTier;
  isAuthenticated: boolean;
  signupEvents: SignupEvent[];
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  upgradeTier: (tier: SubscriptionTier) => void;
  hasAccess: (requiredTier: SubscriptionTier) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const tierHierarchy: Record<SubscriptionTier, number> = {
  FREE: 0,
  BASIC: 1,
  ELITE: 2,
};

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('FREE');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [signupEvents, setSignupEvents] = useState<SignupEvent[]>([]);

  const login = async (email: string, password: string) => {
    // Simulate API call - in production, this would call your backend
    // For demo purposes, we'll just set a mock user
    await new Promise(resolve => setTimeout(resolve, 1000));

    setUser({
      id: '1',
      email,
      name: email.split('@')[0],
    });
    setIsAuthenticated(true);
    // In production, retrieve the user's subscription tier from your backend
    setCurrentTier('FREE');
  };

  const signup = async (email: string, password: string, name: string) => {
    // Simulate API call - in production, this would call your backend
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser = {
      id: Math.random().toString(36).substring(7),
      email,
      name,
    };

    // Track signup event
    const signupEvent: SignupEvent = {
      id: Math.random().toString(36).substring(7),
      user: newUser,
      timestamp: new Date(),
      tier: 'FREE',
    };

    setSignupEvents(prev => [signupEvent, ...prev]);
    setUser(newUser);
    setIsAuthenticated(true);
    setCurrentTier('FREE'); // New signups start on FREE tier
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentTier('FREE');
  };

  const upgradeTier = (tier: SubscriptionTier) => {
    setCurrentTier(tier);
  };

  const hasAccess = (requiredTier: SubscriptionTier): boolean => {
    return tierHierarchy[currentTier] >= tierHierarchy[requiredTier];
  };

  return (
    <SubscriptionContext.Provider
      value={{
        user,
        currentTier,
        isAuthenticated,
        signupEvents,
        login,
        signup,
        logout,
        upgradeTier,
        hasAccess,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
