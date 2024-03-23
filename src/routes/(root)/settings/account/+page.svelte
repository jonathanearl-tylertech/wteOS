<script lang="ts">
	import { page } from '$app/stores';
</script>

<main style="max-width: 1200px; width: 100%; margin: 0 auto;">
	<div class="display: flex; flex-direction: column;">
		<h2
			style="margin: 40px 0; padding: 0 16px; font-weight: 500; font-size: 20px; color: rgb(28, 28, 28); line-height: 24px;"
		>
			Account settings
		</h2>

		<form method="POST" class="setting-row">
			<div>
				<h3 class="setting-name">Display name</h3>
				<p class="setting-value">Set a display name.</p>
			</div>
			<div style="display: flex; align-items: center; margin-left: auto;">
				<input
					type="text"
					name="username"
					placeholder={$page.data.user.username ?? 'Display name'}
					style="width: 35ch; height: 38px;"
					bind:value={$page.data.user.username}
				/>
				<button
					class="setting-anchor"
					style="height: 40px; width: 78px; display: flex; justify-content: center; background-color: white;"
					type="submit"
				>
					<span>{'Update'}</span>
				</button>
			</div>
		</form>

		<div class="setting-row">
			<div>
				<h3 class="setting-name">Email address</h3>
				<p class="setting-value">{$page.data.user.email}</p>
			</div>
		</div>
	</div>
</main>

<style>
	.setting-row {
		display: flex;
		padding: 0 16px;
		max-width: 700px;
		margin-bottom: 32px;
	}

	.setting-name {
		font-size: 16px;
		font-weight: 500;
		line-height: 16px;
		color: rgb(28, 28, 28);
	}

	.setting-value {
		font-size: 12px;
		line-height: 16px;
		color: rgb(124, 124, 124);
	}

	.setting-anchor {
		border: 1px solid rgb(0, 121, 211);
		margin-left: auto;
		height: 40px;
		text-decoration: none;
		display: flex;
		align-items: center;
	}

	.setting-anchor > span {
		padding: 0 12px;
		color: rgb(0, 121, 211);
		font-weight: 600;
		font-size: 14px;
	}
</style>
