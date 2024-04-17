<script>
  import { goto, invalidateAll } from "$app/navigation";
  import { onMount } from "svelte";
  onMount(async () => {
    await invalidateAll();
    goto('/');
  })
</script>
