<script>
      import GoogleMap from '$lib/GoogleMap.svelte';
      import LogIn from '$lib/LogIn.svelte';

      let login;


</script>

<!-- {#if login}

  <div class="flex flex-col items-center justify-center min-h-screen">
    <GoogleMap />
  </div>

{:else}

  <div class="flex flex-col items-center justify-center min-h-screen">
    <LogIn />
  </div>

{/if} -->

<div class="container">
  <div class="flex flex-col items-center justify-center min-h-screen">
    <GoogleMap />
  </div>
</div>
    