import { supabase } from './supabase';

/* =========================
   Yardımcı eşleştirmeler
   ========================= */

// UI ↔ DB status map
// UI: 'draft' | 'active' | 'pending' | 'completed'
// DB(listings.status): 'available' | 'reserved' | 'donated' | 'deleted'
// DB(donations.status): 'pending' | 'accepted' | 'rejected' | 'cancelled' ... (biz UI için 'pending'/'completed' kullanacağız)
const toDbListingStatus = (ui) => {
  switch (ui) {
    case 'active': return 'available';
    case 'pending': return 'reserved';
    case 'completed': return 'donated';
    case 'draft': default: return 'available';
  }
};
const fromDbListingStatus = (db) => {
  switch (db) {
    case 'available': return 'active';
    case 'reserved': return 'pending';
    case 'donated': return 'completed';
    case 'deleted': return 'draft';
    default: return 'active';
  }
};

// UI ↔ DB role map
// UI: donor | receiver | admin
// DB: donor | seeker | admin
const toDbRole = (uiRole) => (uiRole === 'receiver' ? 'seeker' : uiRole);
const fromDbRole = (dbRole) => (dbRole === 'seeker' ? 'receiver' : dbRole);

// Lokasyon alanları (UI: location_city/district/neighborhood ↔ DB: city/district/neighborhood)
const toDbLocation = (obj) => ({
  city: obj.location_city ?? obj.city ?? null,
  district: obj.location_district ?? obj.district ?? null,
  neighborhood: obj.location_neighborhood ?? obj.neighborhood ?? null
});
const fromDbLocation = (row) => ({
  location_city: row.city ?? null,
  location_district: row.district ?? null,
  location_neighborhood: row.neighborhood ?? null
});

/* =========================
   AUTH / SESSION
   ========================= */

   export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session ?? null;
  }
  

export function subscribeToAuth(callback) {
  // callback(session)
  const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => callback(session));
  return () => sub.subscription.unsubscribe();
}

// Local-store uyumluluğu için no-op
export function setSession(_user) {
  // Supabase kendi session’ını yönetiyor; burada bir şey yapmıyoruz.
}

/* =========================
   KULLANICI & PROFİL
   ========================= */

// Eski koda uyum için: duplicate kontrolünü supabase.auth.signUp zaten yapar.
export async function findUserByEmail(_email) {
  // Anon key ile auth.users direkt sorgulanamaz; profillerden bakmak istersen email kolonunu ekleyip burada sorgulayabilirsin.
  return null;
}

export async function createUser({ email, password, role, full_name }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, role } },
    });
    if (error) throw error;
    return data.user;
  }
  

export async function upsertProfile(profile) {
  const payload = {
    id: profile.id,
    full_name: profile.full_name ?? null,
    role: profile.role ? toDbRole(profile.role) : undefined,
    phone: profile.phone ?? null,
    city: profile.location_city ?? profile.city ?? null,
    district: profile.location_district ?? profile.district ?? null,
    neighborhood: profile.location_neighborhood ?? profile.neighborhood ?? null,
    donations_count: profile.donation_count ?? undefined,
    // email kolonu eklediysen:
    email: profile.email ?? undefined
  };

  // undefined alanları at
  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

  const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
  if (error) throw error;
  return payload;
}

export async function getProfileById(id) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    full_name: data.full_name,
    role: fromDbRole(data.role),
    phone: data.phone,
    donation_count: data.donations_count ?? 0,
    is_anonymous: data.is_anonymous ?? false,
    ...fromDbLocation(data),
    // email kolonu eklediysen:
    email: data.email ?? undefined
  };
}

export async function getProfilesCount() {
  const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count ?? 0;
}

export async function incrementProfileDonationCount(userId) {
    const { data: profile, error: fetchErr } = await supabase
      .from('profiles')
      .select('donations_count')
      .eq('id', userId)
      .maybeSingle();
    if (fetchErr) throw fetchErr;
  
    const newCount = (profile?.donations_count ?? 0) + 1;
  
    const { error: updateErr } = await supabase
      .from('profiles')
      .update({ donations_count: newCount })
      .eq('id', userId);
    if (updateErr) throw updateErr;
  
    return newCount;
  }

/* =========================
   LİSTİNGS (İLANLAR)
   ========================= */

export async function getListings({ status, category, ownerId } = {}) {
  let query = supabase.from('listings').select('*, profiles:owner_id(full_name, phone, role, is_anonymous, id)');

  if (status) query = query.eq('status', toDbListingStatus(status));
  if (category) query = query.eq('category', category);
  if (ownerId) query = query.eq('owner_id', ownerId);

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    owner_id: row.owner_id,
    status: fromDbListingStatus(row.status),
    photos: row.photos ?? [],
    created_at: row.created_at,
    ...fromDbLocation(row),
    profiles: row.profiles
      ? {
          full_name: row.profiles.full_name,
          phone: row.profiles.phone,
          role: fromDbRole(row.profiles.role),
          is_anonymous: row.profiles.is_anonymous ?? false
        }
      : null
  }));
}

export async function addListing(listing) {
  const payload = {
    owner_id: listing.owner_id,
    title: listing.title,
    description: listing.description ?? null,
    category: listing.category ?? null,
    item_condition: listing.item_condition ?? null,
    quantity: listing.quantity ?? 1,
    photos: listing.photos ?? [],
    status: toDbListingStatus(listing.status ?? 'active'),
    ...toDbLocation(listing)
  };

  const { data, error } = await supabase.from('listings').insert(payload).select().maybeSingle();
  if (error) throw error;

  return {
    id: data.id,
    created_at: data.created_at,
    ...listing,
    status: fromDbListingStatus(data.status),
    ...fromDbLocation(data)
  };
}

export async function updateListingById(id, updates) {
  const payload = {
    title: updates.title ?? undefined,
    description: updates.description ?? undefined,
    category: updates.category ?? undefined,
    item_condition: updates.item_condition ?? undefined,
    quantity: updates.quantity ?? undefined,
    photos: updates.photos ?? undefined,
    status: updates.status ? toDbListingStatus(updates.status) : undefined,
    ...toDbLocation(updates)
  };
  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

  const { data, error } = await supabase.from('listings').update(payload).eq('id', id).select().maybeSingle();
  if (error) throw error;
  return data ? { ...data, status: fromDbListingStatus(data.status), ...fromDbLocation(data) } : null;
}

export async function deleteListingById(id) {
  const { error } = await supabase.from('listings').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function getListingById(id) {
  const { data, error } = await supabase
    .from('listings')
    .select('*, profiles:owner_id(full_name, phone, role, is_anonymous, id)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    owner_id: data.owner_id,
    status: fromDbListingStatus(data.status),
    photos: data.photos ?? [],
    created_at: data.created_at,
    ...fromDbLocation(data),
    profiles: data.profiles
      ? {
          full_name: data.profiles.full_name,
          phone: data.profiles.phone,
          role: fromDbRole(data.profiles.role),
          is_anonymous: data.profiles.is_anonymous ?? false
        }
      : null
  };
}

/* =========================
   DONATIONS (BAĞIŞ AKIŞI)
   ========================= */

// UI tarafı 'status' alanını bekliyor (pending/accepted/rejected/completed vb.)
export async function addDonation(donation) {
  const payload = {
    listing_id: donation.listing_id,
    donor_id: donation.donor_id ?? null,
    recipient_id: donation.recipient_id ?? null,
    donor_marked_done: donation.donor_marked_done ?? false,
    admin_approved: donation.admin_approved ?? false,
    status: donation.status ?? 'pending' // <-- ALTER TABLE ile ekledik
  };
  const { data, error } = await supabase.from('donations').insert(payload).select().maybeSingle();
  if (error) throw error;
  return data;
}

// "predicate" mantığı localStore içindi; Supabase'te basit bir filtre ve update uygulayalım.
// Kullanım: updateDonations((d) => d.id === someId, { status: 'completed' })
export async function updateDonations(predicate, updates) {
  // En basit yaklaşım: donations'ı çek → predicate ile filtrele → id listesi → toplu update
  const all = await getDonations();
  const ids = (all ?? []).filter(predicate).map((d) => d.id);
  if (!ids.length) return;

  const payload = {
    donor_marked_done: updates.donor_marked_done ?? undefined,
    admin_approved: updates.admin_approved ?? undefined,
    status: updates.status ?? undefined
  };
  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

  const { error } = await supabase.from('donations').update(payload).in('id', ids);
  if (error) throw error;
}

export async function getDonations(filter) {
  const { data, error } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  const items = data ?? [];
  return typeof filter === 'function' ? items.filter(filter) : items;
}

/* =========================
   UPLOADS (GÖRSELLER)
   ========================= */

// Beklenen API: saveUpload(path, dataUrl) → { publicUrl }
export async function saveUpload(path, dataUrl) {
  if (!path || !dataUrl) throw new Error('Geçersiz dosya');

  // dataURL → Blob
  const res = await fetch(dataUrl);
  const blob = await res.blob();

  const { error } = await supabase.storage.from('listing-photos').upload(path, blob, {
    upsert: true,
    contentType: blob.type || 'image/jpeg'
  });
  if (error) throw error;

  const { data } = supabase.storage.from('listing-photos').getPublicUrl(path);
  return { publicUrl: data.publicUrl };
}

/* =========================
   EKSTRA (local-store uyumluluk)
   ========================= */

export async function getSessionAsObject() {
  // projede kullanılmıyor ama ihtiyaç olursa
  return getSession();
}
