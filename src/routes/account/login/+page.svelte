<script lang="ts">
	import { page } from '$app/stores';
</script>

<div style="width: 100vw; height: 100vh; display: flex;">
	<div style="width: 141px; height: 100%; background-color: grey;"></div>
	<form
		method="get"
		style="display: flex; flex-direction: column; justify-content: center; padding: 16px;"
	>
		<h1 style="font-size: 18px; font-weight: 500; line-height: 22px;">Log in</h1>
		<p style="font-size: 12px; margin-top: 8px; margin-bottom: 48px;">
			By continuing, you agree to our User Agreement and the Privacy Policy.
		</p>
		<button
			type="submit"
			formaction="/auth/google/signin"
			style="margin: 8px 0; max-width: 280px; height: 50px;">Continue with Google</button
		>
	</form>
</div>
