import { supabase } from './supabase'

/* ========== AUTH ========== */
export async function signUp(email, password, fullName, role = 'donor') {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error

  // kullanıcı profili oluştur
  await supabase.from('profiles').insert([
    { id: data.user.id, full_name: fullName, role },
  ])
  return data.user
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}

export async function signOut() {
  await supabase.auth.signOut()
}

/* ========== PROFİLLER ========== */
export async function getProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data
}

export async function updateProfile(userId, updates) {
  const { error } = await supabase.from('profiles').update(updates).eq('id', userId)
  if (error) throw error
}

/* ========== İLANLAR ========== */
export async function getListings() {
  const { data, error } = await supabase
    .from('listings')
    .select('*, profiles(full_name, phone)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createListing(listing, userId) {
  const { data, error } = await supabase.from('listings').insert([
    {
      owner_id: userId,
      title: listing.title,
      description: listing.description,
      category: listing.category,
      item_condition: listing.item_condition,
      quantity: listing.quantity,
      city: listing.city,
      district: listing.district,
      neighborhood: listing.neighborhood,
      photos: listing.photos || [],
    },
  ]).select()
  if (error) throw error
  return data[0]
}

export async function updateListing(id, updates) {
  const { error } = await supabase.from('listings').update(updates).eq('id', id)
  if (error) throw error
}

export async function deleteListing(id) {
  const { error } = await supabase.from('listings').delete().eq('id', id)
  if (error) throw error
}

/* ========== FOTOĞRAF YÜKLEME ========== */
export async function uploadPhoto(file, userId) {
  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`

  const { error } = await supabase.storage
    .from('listing-photos')
    .upload(filePath, file)

  if (error) throw error

  const { data } = supabase.storage.from('listing-photos').getPublicUrl(filePath)
  return data.publicUrl
}

/* ========== TALEPLER (CLAIMS) ========== */
export async function createClaim(listingId, userId) {
  const { error } = await supabase.from('claims').insert([
    { listing_id: listingId, claimer_id: userId },
  ])
  if (error) throw error
}

export async function updateClaimStatus(claimId, status) {
  const { error } = await supabase.from('claims').update({ status }).eq('id', claimId)
  if (error) throw error
}

/* ========== BAĞIŞLAR ========== */
export async function markDonationDone(donationId) {
  const { error } = await supabase
    .from('donations')
    .update({ donor_marked_done: true })
    .eq('id', donationId)
  if (error) throw error
}

export async function adminApproveDonation(donationId) {
  const { error } = await supabase
    .from('donations')
    .update({ admin_approved: true })
    .eq('id', donationId)
  if (error) throw error
}
export async function getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  }
  // === AUTH DEĞİŞİKLİKLERİNİ DİNLEME ===
export function subscribeToAuth(callback) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session)
    })
  }
  