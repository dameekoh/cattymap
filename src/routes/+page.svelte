<script>
      import GoogleMap from '$lib/GoogleMap.svelte';
      import LogIn from '$lib/LogIn.svelte';

      let login = false;

      function updateLogInStatus(event){
        login = event.detail;
      }
</script>

{#if login}

  <div class="app__header">
    <h1 class="header__text">
      CattyMap
    </h1>
  </div>
  <div class="app__container">
    <GoogleMap />
  </div>

{:else}

  <div class="login__container">
    <LogIn on:login = {updateLogInStatus}/>
  </div>

{/if}

<style>
  .app__header{
    height: 7vh;
    display: flex;
    justify-items: start;
    align-items: center;
    padding: 5%;
    background-color: white;
    box-shadow: 0px 0px 10px grey;
  }

  .login__container{
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .app__container{
    display: flex;
    height: 93vh;
    width: 100%;
  }

  .header__text{
    color: grey;
    font-family: Arial, Helvetica, sans-serif;
  }
</style>
    