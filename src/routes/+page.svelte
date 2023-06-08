<script>
    import GoogleMap from '$lib/GoogleMap.svelte';
    import LogIn from '$lib/LogIn.svelte';
    import { trusted } from 'svelte/internal';
    import PostPic from '../lib/PostStorageandDB.svelte';
    import Posts from '../lib/Posts.svelte';
    import { onMount } from 'svelte';
    import { filter } from "../lib/store"
    import { currentPosts } from '../lib/store';

    let login = true;
    let isLoading = true;
    let post = false;
    const dummyPosts = [
      {name:"Punn", 
      picture: "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2022-08/220805-domestic-cat-mjf-1540-382ba2.jpg", 
      caption : "Hi this is cat" },
      {name:"Damir", 
      picture: "https://images.unsplash.com/photo-1615789591457-74a63395c990?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9tZXN0aWMlMjBjYXR8ZW58MHx8MHx8fDA%3D&w=1000&q=80", 
      caption : "who dat" },
      {name:"Zhi Lin", 
      picture: "https://media.istockphoto.com/id/1322123064/photo/portrait-of-an-adorable-white-cat-in-sunglasses-and-an-shirt-lies-on-a-fabric-hammock.jpg?s=612x612&w=0&k=20&c=-G6l2c4jNI0y4cenh-t3qxvIQzVCOqOYZNvrRA7ZU5o%3D", 
      caption : "what da dog doin" },
      {name:"Damir", 
      picture: "https://media.istockphoto.com/id/1322123064/photo/portrait-of-an-adorable-white-cat-in-sunglasses-and-an-shirt-lies-on-a-fabric-hammock.jpg?s=612x612&w=0&k=20&c=-G6l2c4jNI0y4cenh-t3qxvIQzVCOqOYZNvrRA7ZU5o%3D", 
      caption : "what da dog doin" },
      {name:"Punn", 
      picture: "https://media.istockphoto.com/id/1322123064/photo/portrait-of-an-adorable-white-cat-in-sunglasses-and-an-shirt-lies-on-a-fabric-hammock.jpg?s=612x612&w=0&k=20&c=-G6l2c4jNI0y4cenh-t3qxvIQzVCOqOYZNvrRA7ZU5o%3D", 
      caption : "what da dog doin" },
      {name:"Zhi Lin", 
      picture: "https://media.istockphoto.com/id/1322123064/photo/portrait-of-an-adorable-white-cat-in-sunglasses-and-an-shirt-lies-on-a-fabric-hammock.jpg?s=612x612&w=0&k=20&c=-G6l2c4jNI0y4cenh-t3qxvIQzVCOqOYZNvrRA7ZU5o%3D", 
      caption : "what da dog doin" },
      {name:"Damir", 
      picture: "https://media.istockphoto.com/id/1322123064/photo/portrait-of-an-adorable-white-cat-in-sunglasses-and-an-shirt-lies-on-a-fabric-hammock.jpg?s=612x612&w=0&k=20&c=-G6l2c4jNI0y4cenh-t3qxvIQzVCOqOYZNvrRA7ZU5o%3D", 
      caption : "what da dog doin" },
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

  function updateSeePosts(event) {
    post = event.detail;
  }
</script>

{#if login}

  <div class="app__container">
    <GoogleMap on:seePost = { updateSeePosts }/>

    {#if post}
    <div id="slideIn" class="post__card">
      <div class="post__card__header" on:click={ ()=>{ post = false; } }>
        <img style="height: 100%; width: auto; margin-left: auto; margin-right: auto;" src="https://cdn0.iconfinder.com/data/icons/kuvio-basic-ui/32/more-512.png" alt="">
      </div>
      <div class="posts__container"> 
        {#each dummyPosts.filter((post) => {
          if (post.name == $currentPosts) {return post;}
        }) as {name, picture, caption}}
        <Posts name = {name} picture = {picture} caption = {caption} />
        {/each}
      </div>
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
    border-radius: 2%;
    flex-wrap: wrap;
    width: 50%;
    height: 100%;
    top: 0;
    left: 50%;
    position: absolute;
    background-color: white;
    padding: 0%;
    box-shadow: 0px 0px 20px #999999;
    overflow: hidden;
  }

  .posts__container{
    padding-left: 2%;
    padding-right: 2%;
    overflow-y: auto;
    height: 100%;
    padding-top: 5%;
  }

  .post__card__header{
    height: 5%;
    width: 100%;
    background-color: white;
    box-shadow: 0px 0px 10px #999999;
    justify-content: center;
    align-content: center;
  }

  #slideIn {
    position: absolute;
    left: 100%;
    -webkit-animation: slideIn 0.5s forwards;
    -webkit-animation-delay: 0s;
    animation: slideIn 0.5s forwards;
    animation-delay: 0s;
  }

  @-webkit-keyframes slideIn {
      100% { left: 50%; }
  }

  @keyframes slideIn {
      100% { left: 50%; }
  }

  @media (max-width: 400px){
    .post__card{
      width: 100%;
      left: 0%;
    }

    #slideIn {
      position: absolute;
      left: 0%;
      top: 100%;
      -webkit-animation: slideIn 0.5s forwards;
      -webkit-animation-delay: 0s;
      animation: slideIn 0.5s forwards;
      animation-delay: 0s;
    }
  
    @-webkit-keyframes slideIn {
        100% { top: 0%; }
    }
  
    @keyframes slideIn {
        100% { top: 0%; }
    }
  }

</style>
    