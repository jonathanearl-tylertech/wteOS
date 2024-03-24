<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import Avatar from '$lib/components/avatar.svelte';
    import Logo from '$lib/components/logo.svelte';
	import '../app.css';
</script>

<header
	style="display: flex; width: 100%; padding: 0 20px; background-color: #fff; border-bottom: 1px solid #ddd; align-items: center;"
>
	<Logo/>
	{#if $page.data.user}
		<div class="ml-auto">
			<Avatar />
		</div>
		<!-- <img
			style="height: 32px; width: 32px; border-radius: 100%; margin-left: auto;"
			src={`data:image/jpeg;base64, ${$page.data.user.picture}`}
			alt=""
		/> -->
	{:else}
		<a
			href={`${base}/auth/google/signin`}
			style="background-color: rgb(217, 58, 0); margin-left: auto; border: none; height: 40px; text-decoration: none; display: flex; align-items: center;"
		>
			<span style=" padding: 0 12px; color: white; font-weight: 600; font-size: 14px;">Log In</span>
		</a>
	{/if}
</header>

<slot />
