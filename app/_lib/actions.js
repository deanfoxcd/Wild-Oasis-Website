'use server';

import { revalidatePath } from 'next/cache';

import { auth, signIn, signOut } from './auth';
import { supabase } from './supabase';

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

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
