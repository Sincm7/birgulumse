import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchProfile } from './auth';
import { getSession, subscribeToAuth } from './dataStore.supabase';

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true
});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const initialSession = getSession();
        setSession(initialSession);
        if (initialSession?.user) {
          const profileData = await fetchProfile();
          setProfile(profileData);
        }
      } catch (err) {
        console.error('Auth load error', err);
      } finally {
        setLoading(false);
      }
    };

    load();

    const unsubscribe = subscribeToAuth(async (newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        try {
          const profileData = await fetchProfile();
          setProfile(profileData);
        } catch (error) {
          console.error('Profile fetch error', error);
        }
      } else {
        setProfile(null);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      profile,
      loading
    }),
    [session, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
