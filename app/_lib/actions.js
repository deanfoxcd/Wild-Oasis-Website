'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth, signIn, signOut } from './auth';
import { supabase } from './supabase';
import { getBookings } from './data-service';

export async function updateGuestProfile(formData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const nationalID = formData.get('nationalID');
  const [nationality, countryFlag] = formData.get('nationality').split('%');

  const nationalIDRegex = /^[a-zA-Z0-9]{6,12}$/;

  if (!nationalIDRegex.test(nationalID)) throw new Error('Invalid national ID');

  const updateData = { nationality, nationalID, countryFlag };

  const { data, error } = await supabase
    .from('guests')
    .update(updateData)
    .eq('id', session.user.guestId)
    .select()
    .single();

  if (error) throw new Error('Guest could not be updated');

  revalidatePath('/account/profile');
}

export async function updateReservation(formData) {
  const session = await auth();

  if (!session) throw new Error('You must be logged in');

  const bookingId = Number(formData.get('bookingId'));

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error('You cannot update bookings that are not yours');

  const numGuests = Number(formData.get('numGuests'));
  const observations = formData.get('observations').slice(0, 1000);
  const hasBreakfast = formData.get('hasBreakfast');

  const updateData = { numGuests, observations, hasBreakfast };

  const { error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw new Error('Booking could not be updated');

  revalidatePath(`/account/reservations/edit/${bookingId}`);

  redirect('/account/reservations');
}

export async function createReservation(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations').slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    status: 'unconfirmed',
    hasBreakfast: formData.get('hasBreakfast'),
    isPaid: false,
  };

  const { error } = await supabase
    .from('bookings')
    .insert([newBooking])
    .select()
    .single();

  if (error) throw new Error('Booking could not be created');

  revalidatePath(`/account/cabins/${bookingData.cabinId}`);

  redirect('/cabins/thankyou');
}

export async function deleteReservation(bookingId) {
  // FOR TESTING
  // await new Promise((res) => setTimeout(res, 2000));
  // throw new Error();

  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const guestBookings = await getBookings(session.user.guestId);

  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error('You cannot delete bookings that are not yours');

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) throw new Error('Booking could not be deleted');

  revalidatePath('/account/reservations');
}

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
