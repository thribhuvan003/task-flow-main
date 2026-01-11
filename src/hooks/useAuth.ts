import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
}

interface UserRole {
  role: 'admin' | 'manager' | 'member';
}

export function useAuth() {
  const { user, setUser, isLoading, setIsLoading } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<'admin' | 'manager' | 'member'>('member');
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user as any);
          // Fetch profile and role
          setTimeout(async () => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .maybeSingle();
            
            if (profileData) {
              setProfile(profileData as Profile);
            }

            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .maybeSingle();
            
            if (roleData) {
              setRole((roleData as UserRole).role);
            }
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
          setRole('member');
        }
        setIsLoading(false);
      }
    );

    // THEN check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user as any);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setIsLoading]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return { user, profile, role, isLoading, signOut };
}

export function useRequireAuth() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      navigate('/auth');
    }
  }, [auth.isLoading, auth.user, navigate]);

  return auth;
}
