<script>
    import GoogleMap from '$lib/GoogleMap.svelte';
    import LogIn from '$lib/LogIn.svelte';
    import PostPic from '../lib/PostStorageandDB.svelte';
    import Posts from '../lib/Posts.svelte';
    import { onMount } from 'svelte';

    let login = true;
    let isLoading = true;
    let post = true;
    const dummyPosts = [
      {name:"not cat punn", 
      picture: "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2022-08/220805-domestic-cat-mjf-1540-382ba2.jpg", 
      caption : "Hi this is cat" },
      {name:"not cat punn", 
      picture: "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2022-08/220805-domestic-cat-mjf-1540-382ba2.jpg", 
      caption : "Hi this is cat" },
      {name:"not cat punn", 
      picture: "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2022-08/220805-domestic-cat-mjf-1540-382ba2.jpg", 
      caption : "Hi this is cat" },
    ]

  onMount(async () => {
    // Simulate an asynchronous login check
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if the user is logged in in the browser storage
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    login = isLoggedIn === 'true';
    isLoading = false;
  });

  function updateLogInStatus(event) {
    login = event.detail;
    // Update the login status in the browser storage
    localStorage.setItem('isLoggedIn', login.toString());
  }
</script>

{#if login}

  <div class="app__container">
    <GoogleMap />
    {#if post}
    <div class="post__card">
      {#each dummyPosts as { name, picture, caption }}
        <Posts name = { name }, picture = { picture }, caption = { caption }/>
      {/each}
    </div>
    {/if}
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
    height: 100vh;
    width: 100%;
  }

  .header__text{
    color: grey;
    font-family: Arial, Helvetica, sans-serif;
  }

  .post__card{
    display: flex;
    width: 50%;
    height: 100%;
    top: 0;
    margin-left: 25%;
    position: absolute;
    background-color: white;
    padding: 2%;
    box-shadow: 0px 0px 20px #999999;
  }

</style>
    