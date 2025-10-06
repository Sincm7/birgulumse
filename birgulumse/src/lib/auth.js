import { supabase, TABLES } from '../supabaseClient';
import { ROLES } from './constants';

export async function signUp({ email, password, fullName, role, isAnonymous }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role ?? ROLES.RECEIVER,
        is_anonymous: isAnonymous ?? false
      }
    }
  });

  if (error) throw error;

  if (data.user) {
    const profileInsert = await supabase.from(TABLES.PROFILES).insert({
      id: data.user.id,
      email,
      role,
      full_name: fullName,
      is_anonymous: isAnonymous,
      donation_count: 0
    });

    if (profileInsert.error) {
      throw profileInsert.error;
    }
  }

  return data;
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function fetchProfile() {
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;
  if (!session?.user) return null;

  const { data, error } = await supabase
    .from(TABLES.PROFILES)
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function incrementDonationCount(userId) {
  const rpcResponse = await supabase.rpc('increment_donation_count', { profile_id: userId });
  if (rpcResponse.error && !rpcResponse.error.message?.includes('function increment_donation_count')) {
    throw rpcResponse.error;
  }

  if (rpcResponse.data !== null) {
    return rpcResponse.data;
  }

  const { data: profile, error: profileError } = await supabase
    .from(TABLES.PROFILES)
    .select('donation_count')
    .eq('id', userId)
    .single();

  if (profileError) throw profileError;

  const { data, error } = await supabase
    .from(TABLES.PROFILES)
    .update({ donation_count: (profile?.donation_count ?? 0) + 1 })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProfilesCount() {
  const { count, error } = await supabase
    .from(TABLES.PROFILES)
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count ?? 0;
}
