import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export const user = writable<User | null>(null);
export const session = writable<Session | null>(null);
export const loading = writable(true);

supabase.auth.getSession().then(({ data }) => {
	session.set(data.session);
	user.set(data.session?.user ?? null);
	loading.set(false);
});

supabase.auth.onAuthStateChange((_event, sess) => {
	session.set(sess);
	user.set(sess?.user ?? null);
	loading.set(false);
});

export async function signIn(email: string, password: string) {
	const { error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) throw error;
}

export async function signUp(email: string, password: string) {
	const { error } = await supabase.auth.signUp({ email, password });
	if (error) throw error;
}

export async function signInAsGuest() {
	const { error } = await supabase.auth.signInAnonymously();
	if (error) throw error;
}

export async function signOut() {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
}
