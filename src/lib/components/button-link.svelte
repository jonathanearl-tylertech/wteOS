<script lang="ts">
	import { base } from '$app/paths';
	export let href: string = '/';
</script>

<a href={`${base}${href}`}>
	<span><slot /></span>
</a>

<style>
	a:hover {
		background-color: #e2e7e9;
		color: black;
	}

	a {
		height: 40px;
		padding: 0 10px 0 10px;
		text-decoration: none;
		display: flex;
		align-items: center;
	}

	span {
		padding: 0 12px;
		color: #0f1a1c;
		font-weight: 600;
		line-height: 38px;
		font-size: 14px;
	}
</style>
