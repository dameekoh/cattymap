<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { selectedFile } from '../../stores/image';
  import {
    getStorage,
    ref as sref,
    getDownloadURL,
    uploadBytes,
  } from "firebase/storage";
  import {
    ref,
    get,
    set,
    getDatabase,
    onValue,
    update,
    query,
    orderByChild,
    equalTo
  } from "firebase/database";
  import { v4 as uuidv4 } from "uuid";

  let fileUrl;
  let selectedFilter = '';
  let currentPosition;

  // const firebaseConfig = {
  //   apiKey: "AIzaSyBEQ0yl78oVx87pxPJd8Jrt-LOp7wPmTLA",
  //   authDomain: "cattymap-1b9a3.firebaseapp.com",
  //   projectId: "cattymap-1b9a3",
  //   storageBucket: "cattymap-1b9a3.appspot.com",
  //   messagingSenderId: "368074086145",
  //   appId: "1:368074086145:web:393f103f6ca32a06bbad00",
  //   measurementId: "G-442J384EW1",
  //   databaseURL: 'https://cattymap-1b9a3-default-rtdb.asia-southeast1.firebasedatabase.app/',
  // };


  // const app = initializeApp(firebaseConfig);

  const storage = getStorage();
  const database = getDatabase();

  //reference root
  const dataRef = ref(database, "/");

  // reference CatProfile table
  const catProfileRef = ref(database, "CatProfile");
  // reference CatProfile count
  const catProfileCountRef = ref(database, "CatProfileCount");

  // reference Cat table (postNumber, name, latitude, longitude, avatar, image, likeCount)
  const catPostRef = ref(database, "Cat");
  // reference Cat post count
  const catPostCountRef = ref(database, "CatCount");
  let catPostCount;

  let selectedCatName = ''; 
  let catAvatar;
  let caption = '';

  const loadImage = (src) => {
    fileUrl = src;
    selectedFile.set(fileUrl);
  };

  onMount(async () => {
    $selectedFile && loadImage(URL.createObjectURL($selectedFile));
    navigator.geolocation.getCurrentPosition((position) => {
      currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    });
  });

  /**
   * function to send data to database
   * @param {Object} catDataObj
   */
   function sendToCatDB(catDataObj) {
    get(catPostCountRef)
      .then((snapshot) => {
        catPostCount = snapshot.val();
        set(catPostCountRef, catPostCount + 1);
        const uniqueKey = catPostCount;
        const dataToUpdate = {
          [uniqueKey]: {
            name: catDataObj.name,
            latitude: catDataObj.lat,
            longitude: catDataObj.lng,
            avatar: catDataObj.avatar,
            image: catDataObj.image,
            likeCount: catDataObj.likeCount,
            caption: catDataObj.caption,
            filter: selectedFilter 
          },
        };
        update(catPostRef, dataToUpdate)
          .then(() => {
          })
          .catch((error) => {
            console.error("Error updating database:", error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function savePicture(data, blobURL) {
    try {
      const response = await fetch(blobURL);
      const blob = await response.blob();
      console.log(blob);
      const fileName = uuidv4();
      const fileRef = sref(storage, `images/${fileName}.jpeg`);
      await uploadBytes(fileRef, blob);
      console.log("Uploaded a blob!")

      data.image = await getImageURL(fileRef);
      sendToCatDB(data);
    } catch (error) {
      console.error("Error saving picture: ", error);
    }
  }

  // get image url from Firebase storage
  function getImageURL(fileRef) {
    return new Promise((resolve, reject) => {
      getDownloadURL(fileRef)
        .then((url) => {
          resolve(url);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }


  function handlePublish() {
    const nameQuery = query(catProfileRef, orderByChild('name'), equalTo(selectedCatName))

    get(nameQuery).then((snapshot) => {
      if (snapshot.exists()) {
       const catData = snapshot.val();
       const catKey = Object.keys(catData)[0];
       const cat = catData[catKey];
       if (cat && cat.avatar) {
        catAvatar = cat.avatar;
        const catDataObj = {
          name: selectedCatName,
          lat: currentPosition.lat,
          lng: currentPosition.lng,
          avatar: catAvatar,
          likeCount: 0,
          caption 
        }
        savePicture(catDataObj, fileUrl)
    .then(() => {
      goto('/'); 
    })
    .catch((error) => {
      console.error('Error saving picture: ', error);
    });
       }
      }else {
        console.log('No such cat');
      }
    }).catch((error) => {
      console.error('Error querying data: ', error);
    })
  }


</script>
<!-- <GoogleMap bind:this={gmap} bind:currentPosition />; -->


<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cssgram/0.1.10/cssgram.min.css">
<div class="selected-image">
  {#if $selectedFile}
  <img src="{fileUrl}" alt="Selected image" class="image {selectedFilter}" />
  {/if}
</div>

<div class="filters-container">
  <div class="filter-card">
    <img src="{fileUrl}" alt="1977" class="image _1977" on:click={() => selectedFilter = '_1977'} />
    <h2>1977</h2>
  </div>
  <div class="filter-card">
    <img src="{fileUrl}" alt="gingham" class="image gingham" on:click={() => selectedFilter = 'gingham'} />
    <h2>Gingham</h2>
  </div>
  <div class="filter-card">
    <img src="{fileUrl}" alt="Lo-Fi" class="image lofi" on:click={() => selectedFilter = 'lofi'} />
    <h2>Lo-Fi</h2>
  </div>
  <div class="filter-card">
    <img src="{fileUrl}" alt="hudson" class="image hudson" on:click={() => selectedFilter = 'hudson'} />
    <h2>Hudson</h2>
  </div>
  <div class="filter-card">
    <img src="{fileUrl}" alt="kelvin" class="image kelvin" on:click={() => selectedFilter = 'kelvin'} />
    <h2>Kelvin</h2>
  </div>
  <div class="filter-card">
    <img src="{fileUrl}" alt="xpro2" class="image xpro2" on:click={() => selectedFilter = 'xpro2'} />
    <h2>X-Pro II</h2>
  </div>
  <div class="filter-card">
    <img src="{fileUrl}" alt="rise" class="image rise" on:click={() => selectedFilter = 'rise'} />
    <h2>Rise</h2>
  </div>
  <div class="filter-card">
    <img src="{fileUrl}" alt="perpetua" class="image perpetua" on:click={() => selectedFilter = 'perpetua'} />
    <h2>Perpetua</h2>
  </div>
  <div class="filter-card">
    <img src="{fileUrl}" alt="toaster" class="image toaster" on:click={() => selectedFilter = 'toaster'} />
    <h2>Toaster</h2>
  </div>
  <div class="filter-card">
    <img src="{fileUrl}" alt="earlybird" class="image earlybird" on:click={() => selectedFilter = 'earlybird'} />
    <h2>Early Bird</h2>
  </div>
  <div class="filter-card">
    <img src="{fileUrl}" alt="brooklyn" class="image brooklyn" on:click={() => selectedFilter = 'brooklyn'} />
    <h2>Brooklyn</h2>
  </div>
  <div class="filter-card">
    <img src="{fileUrl}" alt="willow" class="image willow" on:click={() => selectedFilter = 'willow'} />
    <h2>Willow</h2>
  </div>
</div>

<div class="form-container">
  <select class="select select-secondary w-60"  bind:value={selectedCatName}>
    <option disabled selected>Select the cat</option>
    <option>Damir</option>
    <option>Zhi Lin</option>
    <option>Punn</option>
  </select>
  
  <textarea class="textarea textarea-secondary w-60" placeholder="Description" bind:value={caption}></textarea>
  <button class="btn btn-secondary w-60" on:click={handlePublish}>Publish</button>
  
  </div>


  <style>

    .selected-image, .filter-card {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  
    .selected-image {
      width: 100%;
      height: 35vh;
    }
  
    .filter-card {
      flex: 0 0 auto;
      width: 25vw; /* Adjust the width as needed */
      height: 25vh; /* Adjust the height as needed */
      margin-right: 1em;
    }
  
    .filter-card h2 {
      margin-top: 0.5em; /* Add spacing between image and h2 tag */
    }
  
    .filters-container {
      display: flex;
      overflow-x: auto;
      white-space: nowrap;
      width: 100%;
      -webkit-overflow-scrolling: touch; /* Smooth scrolling for touch devices */
    }
  
    .image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain; /* Adjust the object-fit property as needed */
    }
  
    .select,
    .textarea,
    .btn {
      margin-top: 1em; /* Add spacing between elements */
    }
  
    .form-container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  
    @media screen and (min-width: 768px) and (max-width: 1024px) {
      .form-container {
        flex-direction: column;
      }
    }
  </style>