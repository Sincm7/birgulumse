import { supabase, STORAGE_BUCKETS, TABLES } from '../supabaseClient';
import { incrementDonationCount } from './auth';
import { STATUS } from './constants';

const randomFileName = (originalName) => {
  const ext = originalName.split('.').pop();
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${unique}.${ext}`;
};

export async function uploadListingPhoto(file) {
  if (!file) return null;
  const filePath = randomFileName(file.name);

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.LISTING_PHOTOS)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from(STORAGE_BUCKETS.LISTING_PHOTOS)
    .getPublicUrl(filePath);

  return publicUrlData?.publicUrl ?? null;
}

export async function createListing(payload) {
  const { data, error } = await supabase
    .from(TABLES.LISTINGS)
    .insert([{ ...payload, status: STATUS.PENDING }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchListings({ category, status = STATUS.ACTIVE } = {}) {
  let query = supabase
    .from(TABLES.LISTINGS)
    .select(`*, profiles(full_name, is_anonymous, role)`)
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchListingById(id) {
  const { data, error } = await supabase
    .from(TABLES.LISTINGS)
    .select(`*, profiles(full_name, is_anonymous, phone, role)`)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchListingsByOwner(ownerId) {
  const { data, error } = await supabase
    .from(TABLES.LISTINGS)
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateListingStatus(id, status) {
  const { data, error } = await supabase
    .from(TABLES.LISTINGS)
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateListing(id, payload) {
  const { data, error } = await supabase
    .from(TABLES.LISTINGS)
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteListing(id) {
  const { error } = await supabase
    .from(TABLES.LISTINGS)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function requestDonationApproval(listingId) {
  const { data, error } = await supabase
    .from(TABLES.DONATIONS)
    .insert([{ listing_id: listingId, status: 'pending' }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchDonationStats() {
  const [{ count: activeCount, error: activeError }, { count: completedCount, error: completedError }] = await Promise.all([
    supabase.from(TABLES.LISTINGS).select('*', { count: 'exact', head: true }).eq('status', STATUS.ACTIVE),
    supabase.from(TABLES.LISTINGS).select('*', { count: 'exact', head: true }).eq('status', STATUS.COMPLETED)
  ]);

  if (activeError) throw activeError;
  if (completedError) throw completedError;

  return { activeCount: activeCount ?? 0, completedCount: completedCount ?? 0 };
}

export async function approveDonation(listingId, approverId) {
  const { data, error } = await supabase
    .from(TABLES.LISTINGS)
    .update({ status: STATUS.COMPLETED, approved_by: approverId, approved_at: new Date().toISOString() })
    .eq('id', listingId)
    .select()
    .single();

  if (error) throw error;

  await supabase
    .from(TABLES.DONATIONS)
    .update({ status: 'approved', approved_by: approverId, approved_at: new Date().toISOString() })
    .eq('listing_id', listingId)
    .eq('status', 'pending');

  if (data?.owner_id) {
    try {
      await incrementDonationCount(data.owner_id);
    } catch (incrementError) {
      console.warn('Donation count increment failed', incrementError);
    }
  }

  return data;
}

export async function fetchPendingDonationRequests() {
  const { data, error } = await supabase
    .from(TABLES.DONATIONS)
    .select('id, created_at, status, listing_id, listings:listing_id(id, title, owner_id, status)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}
