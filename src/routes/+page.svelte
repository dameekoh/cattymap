<script>
  import GoogleMap from '$lib/GoogleMap.svelte';
  import LogIn from '$lib/LogIn.svelte';
  import { trusted } from 'svelte/internal';
  import PostPic from '../lib/PostStorageandDB.svelte';
  import Posts from '../lib/Posts.svelte';
  import { onMount } from 'svelte';
  import { filter } from "../lib/store"
  import { currentPosts } from '../lib/store';
  import { ref, getDatabase, onValue } from "firebase/database";
  import { initializeApp } from "firebase/app";

  const firebaseConfig = {
    apiKey: "AIzaSyBEQ0yl78oVx87pxPJd8Jrt-LOp7wPmTLA",
    authDomain: "cattymap-1b9a3.firebaseapp.com",
    projectId: "cattymap-1b9a3",
    storageBucket: "cattymap-1b9a3.appspot.com",
    messagingSenderId: "368074086145",
    appId: "1:368074086145:web:393f103f6ca32a06bbad00",
    measurementId: "G-442J384EW1",
    databaseURL: 'https://cattymap-1b9a3-default-rtdb.asia-southeast1.firebasedatabase.app/',
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  // reference Cat table (postNumber, name, latitude, longitude, avatar, image, likeCount)
  const catPostRef = ref(database, "Cat");

  function fetchCatPostFromDB() {
  return new Promise((resolve, reject) => {
    onValue(catPostRef, (snapshot) => {
      const data = snapshot.val();
      resolve(data);
    }, (error) => {
      reject(error);
    });
  });
}

  let login = true;
  let isLoading = true;
  let post = false;
  let catPostList; 
  
  onMount(async () => {
    // Simulate an asynchronous login check
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Check if the user is logged in in the browser storage
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    login = isLoggedIn === 'true';
    isLoading = false;

    // get cat posts 
    const catPosts = await fetchCatPostFromDB();

    // put cat posts in an array [{key: .., name: .. , ...}, {key:..,name: .., ...}, ...]
    catPostList = Object.entries(catPosts).map(([key, value]) => {
    return { key, ...value };})
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
      <img style="height: 80%; width: auto; margin-left: 2%; margin-right: auto; margin-top:auto; margin-bottom: auto" src="https://cdn-icons-png.flaticon.com/512/4225/4225690.png" alt="">
    </div>
    <div class="posts__container"> 
      {#each catPostList.filter((post) => {
        if (post.name == $currentPosts) {return post;}
      }) as {key, avatar, image, latitude, likeCount, longitude, name, caption}}
      <Posts key={key} name = {name} picture = {image} caption = {caption} />
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
  height: 110%;
  top: 0;
  left: 50%;
  position: absolute;
  background-color: white;
  box-shadow: 0px 0px 20px #999999;
  overflow: hidden;
}

.posts__container{
  padding-left: 2%;
  padding-right: 2%;
  overflow-y: auto;
  height: 100%;
  padding-bottom: 30%;
  padding-top: 5%;
}

.post__card__header{
  display: flex;
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

@media (max-width: 600px){
  .post__card{
    width: 100%;
    left: 0%;
    border-radius: 0%;
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
  