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

<div class="app__header">
  <h1 class="header__text">
    CattyMap
  </h1>
</div>

<div class="app__container">
    <GoogleMap />
</div>

<style>
  .app__header{
    height: 7%;
    display: flex;
    justify-items: start;
    align-items: center;
    padding: 5%;
    background-color: white;
    box-shadow: 0px 0px 10px grey;
  }

  .app__container{
    height: 93%;
    width: 100%;
  }

  .header__text{
    color: grey;
    font-family: Arial, Helvetica, sans-serif;
  }
</style>
    