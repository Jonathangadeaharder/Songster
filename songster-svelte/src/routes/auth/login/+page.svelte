<script lang="ts">
	import { supabase } from '$lib/supabase';
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');
	let message = $state('');

	async function handleLogin() {
		loading = true; error = ''; message = '';
		const { error: err } = await supabase.auth.signInWithPassword({ email, password });
		if (err) { error = err.message; loading = false; return; }
		window.location.replace('/');
	}

	async function handleSignup() {
		loading = true; error = ''; message = '';
		const { data, error: err } = await supabase.auth.signUp({ email, password });
		if (err) { error = err.message; loading = false; return; }
		if (data.session) {
			window.location.replace('/');
		} else {
			message = 'Check your email to confirm your account before signing in.';
			loading = false;
		}
	}
</script>

<div class="login-page">
	<h1>Songster</h1>
	<form onsubmit={(e) => { e.preventDefault(); handleLogin(); }}>
		<input type="email" bind:value={email} placeholder="Email" required />
		<input type="password" bind:value={password} placeholder="Password" required />
		{#if error}<p class="error">{error}</p>{/if}
		{#if message}<p class="message">{message}</p>{/if}
		<div class="btns">
			<button type="submit" disabled={loading}>Sign In</button>
			<button type="button" onclick={handleSignup} disabled={loading}>Sign Up</button>
		</div>
	</form>
</div>

<style>
	.login-page {
		min-height: 100vh; display: flex; flex-direction: column;
		align-items: center; justify-content: center; gap: 24px;
		background: #f4efe4; color: #0a0a0a;
	}
	h1 { font-family: 'Playfair Display', serif; font-size: 32px; }
	form { display: flex; flex-direction: column; gap: 12px; width: 280px; }
	input {
		padding: 10px 12px; border: 1.5px solid rgba(0,0,0,0.2);
		border-radius: 4px; font-size: 14px; background: transparent;
	}
	.btns { display: flex; gap: 8px; }
	button {
		flex: 1; padding: 10px; border: none; border-radius: 4px;
		background: #0a0a0a; color: #f4efe4; cursor: pointer;
		font-family: 'IBM Plex Mono', monospace; font-size: 11px;
		letter-spacing: 1px; text-transform: uppercase;
	}
	.error { color: #ff3b30; font-size: 13px; }
	.message { color: #34c759; font-size: 13px; }
</style>
