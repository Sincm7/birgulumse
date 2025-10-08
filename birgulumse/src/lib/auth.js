import {
  createUser,
  findUserByEmail,
  getProfileById,
  getProfilesCount as getStoredProfilesCount,
  getSession as getStoredSession,
  incrementProfileDonationCount,
  setSession,
  upsertProfile
} from './dataStore';
import { ROLES } from './constants';

export async function signUp({ email, password, fullName, role, isAnonymous }) {
  const assignedRole = role ?? ROLES.RECEIVER;
  const user = createUser({
    email,
    password,
    role: assignedRole,
    full_name: fullName,
    is_anonymous: isAnonymous
  });

  upsertProfile({
    id: user.id,
    email,
    role: assignedRole,
    full_name: fullName,
    is_anonymous: !!isAnonymous,
    donation_count: 0
  });

  setSession(user);
  return { user: { id: user.id, email: user.email } };
}

export async function signIn({ email, password }) {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    const error = new Error('E-posta veya şifre hatalı');
    error.status = 400;
    throw error;
  }

  setSession(user);
  return { user: { id: user.id, email: user.email } };
}

export async function signOut() {
  setSession(null);
}

export async function fetchProfile() {
  const session = getStoredSession();
  if (!session?.user) return null;
  return getProfileById(session.user.id);
}

export async function incrementDonationCount(userId) {
  const profile = incrementProfileDonationCount(userId);
  if (!profile) {
    throw new Error('Profil bulunamadı');
  }
  return profile;
}

export async function getProfilesCount() {
  return getStoredProfilesCount();
}
