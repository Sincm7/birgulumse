const STORAGE_KEY = 'birgulumse-store-v1';

const defaultProfiles = [
  {
    id: 'user-donor',
    email: 'donor@example.com',
    role: 'donor',
    full_name: 'Ayşe Bağışçı',
    is_anonymous: false,
    donation_count: 3,
    phone: '+90 555 000 0001'
  },
  {
    id: 'user-admin',
    email: 'admin@example.com',
    role: 'admin',
    full_name: 'Admin Kullanıcı',
    is_anonymous: false,
    donation_count: 0,
    phone: '+90 555 000 0002'
  },
  {
    id: 'user-receiver',
    email: 'receiver@example.com',
    role: 'receiver',
    full_name: 'İhtiyaç Sahibi',
    is_anonymous: true,
    donation_count: 0,
    phone: '+90 555 000 0003'
  }
];

const defaultUsers = defaultProfiles.map((profile) => ({
  id: profile.id,
  email: profile.email,
  password: 'Password123',
  role: profile.role,
  full_name: profile.full_name,
  is_anonymous: profile.is_anonymous
}));

const now = Date.now();

const defaultListings = [
  {
    id: 'listing-1',
    title: 'Ahşap Beşik',
    description: 'Sadece 6 ay kullanıldı, tertemiz durumda.',
    category: 'Bebek Mobilyaları ve Odası Eşyaları',
    owner_id: 'user-donor',
    status: 'active',
    location_city: 'İstanbul',
    location_district: 'Kadıköy',
    location_neighborhood: 'Moda',
    photo_url:
      'https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
    profiles: {
      full_name: 'Ayşe Bağışçı',
      is_anonymous: false,
      role: 'donor'
    }
  },
  {
    id: 'listing-2',
    title: 'Bebek Arabası',
    description: 'Katlanabilir, yağmurluklu, çok rahat bir model.',
    category: 'Bebek Arabaları ve Pusetler',
    owner_id: 'user-donor',
    status: 'pending',
    location_city: 'İzmir',
    location_district: 'Karşıyaka',
    location_neighborhood: 'Bostanlı',
    photo_url:
      'https://images.unsplash.com/photo-1581578017424-3c36c04f7073?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
    profiles: {
      full_name: 'Ayşe Bağışçı',
      is_anonymous: false,
      role: 'donor'
    }
  }
];

const defaultDonations = [];

function loadState() {
  if (typeof window === 'undefined') {
    return {
      users: [...defaultUsers],
      profiles: [...defaultProfiles],
      listings: [...defaultListings],
      donations: [...defaultDonations],
      session: null,
      uploads: {}
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        users: [...defaultUsers],
        profiles: [...defaultProfiles],
        listings: [...defaultListings],
        donations: [...defaultDonations],
        session: null,
        uploads: {}
      };
    }

    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [...defaultUsers],
      profiles: Array.isArray(parsed.profiles) ? parsed.profiles : [...defaultProfiles],
      listings: Array.isArray(parsed.listings) ? parsed.listings : [...defaultListings],
      donations: Array.isArray(parsed.donations) ? parsed.donations : [...defaultDonations],
      session: parsed.session ?? null,
      uploads: parsed.uploads ?? {}
    };
  } catch (error) {
    console.warn('Store load failed, using defaults', error);
    return {
      users: [...defaultUsers],
      profiles: [...defaultProfiles],
      listings: [...defaultListings],
      donations: [...defaultDonations],
      session: null,
      uploads: {}
    };
  }
}

let state = loadState();
const authListeners = new Set();

function persist() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        // avoid persisting computed profile data nested inside listings
        listings: state.listings.map(({ profiles: profile, ...rest }) => rest)
      })
    );
  } catch (error) {
    console.warn('Store persist failed', error);
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function notifyAuth() {
  const session = state.session ? clone(state.session) : null;
  authListeners.forEach((listener) => listener(session));
}

function generateId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function subscribeToAuth(listener) {
  authListeners.add(listener);
  return () => authListeners.delete(listener);
}

export function getSession() {
  return state.session ? clone(state.session) : null;
}

export function setSession(user) {
  state.session = user ? { user: { id: user.id, email: user.email } } : null;
  persist();
  notifyAuth();
}

export function findUserByEmail(email) {
  return state.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function createUser({ email, password, role, full_name, is_anonymous }) {
  if (findUserByEmail(email)) {
    const error = new Error('Bu e-posta adresiyle bir hesap zaten mevcut');
    error.status = 409;
    throw error;
  }

  const newUser = {
    id: generateId('user'),
    email,
    password,
    role,
    full_name,
    is_anonymous: !!is_anonymous
  };

  state.users.push(newUser);
  persist();
  return clone(newUser);
}

export function upsertProfile(profile) {
  const index = state.profiles.findIndex((item) => item.id === profile.id);
  if (index >= 0) {
    state.profiles[index] = { ...state.profiles[index], ...profile };
  } else {
    state.profiles.push({ donation_count: 0, ...profile });
  }
  persist();
  return clone(profile);
}

export function getProfileById(id) {
  const profile = state.profiles.find((item) => item.id === id);
  return profile ? clone(profile) : null;
}

export function getProfilesCount() {
  return state.profiles.length;
}

export function incrementProfileDonationCount(id) {
  const profile = state.profiles.find((item) => item.id === id);
  if (!profile) {
    return null;
  }

  profile.donation_count = (profile.donation_count ?? 0) + 1;
  persist();
  return clone(profile);
}

export function getListings({ status, category, ownerId } = {}) {
  let listings = [...state.listings];

  if (status) {
    listings = listings.filter((listing) => listing.status === status);
  }

  if (category) {
    listings = listings.filter((listing) => listing.category === category);
  }

  if (ownerId) {
    listings = listings.filter((listing) => listing.owner_id === ownerId);
  }

  return listings.map((listing) => ({
    ...clone(listing),
    profiles: listing.profiles ?? clone(state.profiles.find((profile) => profile.id === listing.owner_id))
  }));
}

export function addListing(listing) {
  const created = {
    id: generateId('listing'),
    created_at: new Date().toISOString(),
    ...listing
  };

  state.listings.unshift(created);
  persist();
  return clone(created);
}

export function updateListingById(id, updates) {
  const listing = state.listings.find((item) => item.id === id);
  if (!listing) return null;

  Object.assign(listing, updates);
  persist();
  return clone(listing);
}

export function deleteListingById(id) {
  const initialLength = state.listings.length;
  state.listings = state.listings.filter((item) => item.id !== id);
  persist();
  return state.listings.length !== initialLength;
}

export function getListingById(id) {
  const listing = state.listings.find((item) => item.id === id);
  if (!listing) return null;

  const profile = state.profiles.find((item) => item.id === listing.owner_id);
  return {
    ...clone(listing),
    profiles: profile
      ? clone({ full_name: profile.full_name, is_anonymous: profile.is_anonymous, phone: profile.phone, role: profile.role })
      : null
  };
}

export function addDonation(donation) {
  const entry = { id: generateId('donation'), created_at: new Date().toISOString(), ...donation };
  state.donations.push(entry);
  persist();
  return clone(entry);
}

export function updateDonations(predicate, updates) {
  state.donations = state.donations.map((donation) =>
    predicate(donation) ? { ...donation, ...updates } : donation
  );
  persist();
}

export function getDonations(filter) {
  const items = filter ? state.donations.filter(filter) : state.donations;
  return items.map((item) => clone(item));
}

export function saveUpload(path, dataUrl) {
  state.uploads[path] = dataUrl;
  persist();
  return { publicUrl: dataUrl };
}

export function getUpload(path) {
  const url = state.uploads[path];
  return url ? { publicUrl: url } : null;
}

export function resetStore() {
  state = loadState();
}
