import {
  addDonation,
  addListing,
  deleteListingById,
  getDonations,
  getListingById,
  getListings,
  saveUpload,
  updateDonations,
  updateListingById
} from './dataStore.supabase';
import { incrementDonationCount } from './auth';
import { STATUS } from './constants';

const generateFilePath = (originalName) => {
  const ext = originalName?.split('.').pop() ?? 'jpg';
  return `listing-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    if (typeof FileReader === 'undefined') {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error('Dosya okunamadı'));
    reader.readAsDataURL(file);
  });

export async function uploadListingPhoto(file) {
  if (!file) return null;

  const dataUrl = await readFileAsDataUrl(file);
  if (!dataUrl) return null;

  const path = generateFilePath(file.name);
  const { publicUrl } = saveUpload(path, dataUrl);
  return publicUrl;
}

export async function createListing(payload) {
  const created = addListing({ ...payload, status: STATUS.PENDING });
  return getListingById(created.id);
}

export async function fetchListings({ category, status = STATUS.ACTIVE } = {}) {
  return getListings({ category, status });
}

export async function fetchListingById(id) {
  return getListingById(id);
}

export async function fetchListingsByOwner(ownerId) {
  return getListings({ ownerId });
}

export async function updateListingStatus(id, status) {
  const updated = updateListingById(id, { status });
  if (!updated) {
    throw new Error('İlan bulunamadı');
  }
  return updated;
}

export async function updateListing(id, payload) {
  const updated = updateListingById(id, payload);
  if (!updated) {
    throw new Error('İlan bulunamadı');
  }
  return updated;
}

export async function deleteListing(id) {
  const removed = deleteListingById(id);
  if (!removed) {
    throw new Error('İlan silinemedi');
  }
}

export async function requestDonationApproval(listingId) {
  const donation = addDonation({ listing_id: listingId, status: 'pending' });
  return donation;
}

export async function fetchDonationStats() {
  const activeCount = getListings({ status: STATUS.ACTIVE }).length;
  const completedCount = getListings({ status: STATUS.COMPLETED }).length;
  return { activeCount, completedCount };
}

export async function approveDonation(listingId, approverId) {
  const listing = updateListingById(listingId, {
    status: STATUS.COMPLETED,
    approved_by: approverId,
    approved_at: new Date().toISOString()
  });

  if (!listing) {
    throw new Error('İlan bulunamadı');
  }

  updateDonations(
    (donation) => donation.listing_id === listingId && donation.status === 'pending',
    { status: 'approved', approved_by: approverId, approved_at: new Date().toISOString() }
  );

  if (listing.owner_id) {
    try {
      await incrementDonationCount(listing.owner_id);
    } catch (error) {
      console.warn('Bağış sayısı güncellenemedi', error);
    }
  }

  return getListingById(listingId);
}

export async function fetchPendingDonationRequests() {
  const pending = getDonations((donation) => donation.status === 'pending');
  return pending.map((entry) => ({
    ...entry,
    listings: getListingById(entry.listing_id)
  }));
}
