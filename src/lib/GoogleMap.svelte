<svelte:options accessors={true} />
<meta name="viewport" content="width=device-width, initial-scale=1">

<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { currentPosts, logInState } from './store';
  import { initializeApp } from "firebase/app";
  import { ref, get, set, getDatabase, onValue, update } from 'firebase/database';
  import LedgerProfile from './LedgerProfile.svelte';
  import markerIcon from "../images/marker.png";
  import { goto } from '$app/navigation';
  import { selectedFile } from '../stores/image';
  import { filter } from './store';


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

  const KAIST = { lat: 36.368865, lng: 127.362103 };

  const dispatch = createEventDispatcher();

  //reference root 
  const dataRef = ref(database, "/");
  // reference Cat table (postNumber, name, latitude, longitude, avatar, image, likeCount)
  const catPostRef = ref(database, "Cat");
  // reference Comment table 
  const commentRef = ref(database, "Comment");
  // reference Cat post count 
  const catPostCountRef = ref(database, "CatCount");
  let catPostCount;
  // reference Comment count 
  const commentCountRef = ref(database, "CommentCount");
  let commentCount;
  const catProfileRef = ref(database, "CatProfile");
  // reference CatProfile count 
  const catProfileCountRef = ref(database, "CatProfileCount");
  let catProfileCount;

  let radius = 300;
  let catProfiles = [];
  let catProfilesWithinRange = new Set();
  let catProfilesonLegend = [];

function onRadiusChange(event){
  displayCatMarkers();
  range.setRadius(radius);
}

  /**
   * function to send data to database  
   * @param {Object} catDataObj
   */
  function sendToDB(catDataObj) {
    get(catPostCountRef).then((snapshot) => {
      catPostCount = snapshot.val();
      set(catPostCountRef, catPostCount + 1);
      const uniqueKey = catPostCount;
      const dataToUpdate = { [uniqueKey]: {name: catDataObj.name, 
                                         latitude: catDataObj.lat, 
                                         longitude: catDataObj.lng,  
                                         avatar: catDataObj.avatar, 
                                         image: catDataObj.image, 
                                         likeCount: catDataObj.likeCount}};
    update(catPostRef, dataToUpdate)
        .then(() => {
          addCatMarkers(); // Add cat markers immediately after updating the database
        })
        .catch((error) => {
          console.error('Error updating database:', error);
        });
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
   * function to get data from database 
   * @returns {any}
   */
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

  function fetchCatProfileFromDB() {
    return new Promise((resolve, reject) => {
      onValue(catProfileRef, (snapshot) => {
        const data = snapshot.val();
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }
  let map, 
      mapElement, 
      legendElement, 
      newPostElement, 
      slider, 
      boundary, 
      inputName, 
      catWindow, 
      userMarker,
      range,
      directionsService,
      directionsRenderer;

   let currentPosition;
  
  onMount(async () => {
    catProfiles = await fetchCatProfileFromDB();
    catProfilesonLegend = catProfiles;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBEQ0yl78oVx87pxPJd8Jrt-LOp7wPmTLA&libraries=geometry`;
    script.async = true;
    script.onload = () => {
      map = new google.maps.Map(mapElement, {
        center: KAIST,
        zoom: 16,
        minZoom: 15,
        maxZoom: 20,
        disableDefaultUI: true,
        options: {
          styles: [
            {
              "featureType": "poi.attraction",
              "elementType": "labels",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "featureType": "poi.business",
              "elementType": "labels",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "featureType": "poi.place_of_worship",
              "elementType": "labels",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "featureType": "poi.medical",
              "elementType": "labels",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "featureType": "road",
              "elementType": "labels",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "featureType": "transit",
              "elementType": "labels",
              "stylers": [{ "visibility": "off" }]
            }
          ]
        }
      });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    
    catWindow = new google.maps.InfoWindow();
   
    //set boundaries for KAIST
    boundary = new google.maps.LatLngBounds(
    new google.maps.LatLng(36.362357, 127.355266), 
    new google.maps.LatLng(36.377535, 127.368785)
   );

    //prevent dragging outside those boundaries
    google.maps.event.addListener(map, 'dragend', function() {
      if (boundary.contains(map.getCenter())) return;

      let c = map.getCenter(),
          x = c.lng(),
          y = c.lat(),
          maxX = boundary.getNorthEast().lng(),
          maxY = boundary.getNorthEast().lat(),
          minX = boundary.getSouthWest().lng(),
          minY = boundary.getSouthWest().lat();

      if (x < minX) x = minX;
      if (x > maxX) x = maxX;
      if (y < minY) y = minY;
      if (y > maxY) y = maxY;

      map.setCenter(new google.maps.LatLng(y, x));
    });

    // Add the legend to the map
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legendElement);
    // Add map
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(newPostElement);

    
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(slider);
    addUserMarker();
    setMapCenter();
    (async () => {
      await setCurrentPosition();
      addCatMarkers();
    })();
    };

    setInterval(() => {
      setCurrentPosition();
      for (const [key, marker] of Object.entries(markers)){
        const currentLatLng = new google.maps.LatLng(currentPosition.lat, currentPosition.lng);
        const catLatLng = marker.getPosition();
        const distance = google.maps.geometry.spherical.computeDistanceBetween(currentLatLng, catLatLng);
        if (distance > radius) {
          marker.setMap(null);
        }
      }
     
    }, 500);

    document.head.appendChild(script);
    return () => script.remove();
  });


  /**
   * Adding cat markers according to the data from database
   */
  let markers = [];
  async function addCatMarkers() {
    try {
      const catData = await fetchCatPostFromDB();
    
      for (const [key, cat] of Object.entries(catData)){
        const marker = new google.maps.Marker({
          position: { lat: cat.latitude, lng: cat.longitude },
          map: map,
          icon: {
            url: cat.avatar,
            scaledSize: new google.maps.Size(48, 48) // Adjust the size of the icon if needed
          },
          title: cat.name
        });


        //listen to the input
        google.maps.event.addListener(catWindow, 'domready', function () {
            const seePost = document.getElementById('seePost');

            seePost.onclick = function() {
              dispatch("seePost", true);
              catWindow.close();
            }
        });

        marker.addListener('click', () => {
          inputName?.close();
          catWindow?.close();
          $currentPosts = marker.getTitle();
          catWindow.setContent(`<h3 id="catName">${marker.getTitle()}</h3>` +
                   '<div class="flex content-center item-center justify-self-center align-self-center p-4">' +
                   '<button class="btn bg-white" id="seePost"> See posts </button>' +
                   '</div>');
          catWindow.open(map, marker);
        });
        markers.push(marker);
      }
      displayCatMarkers();
    } catch (error) {
      console.error('Error fetching cat data:', error);
    }
}

function displayCatMarkers(){
  catProfilesWithinRange = new Set();
  for (const [key, marker] of Object.entries(markers)){
    // console.log(currentPosition);
    const currentLatLng = new google.maps.LatLng(currentPosition.lat, currentPosition.lng);
    const catLatLng = marker.getPosition();
    const distance = google.maps.geometry.spherical.computeDistanceBetween(currentLatLng, catLatLng);
    if (distance <= radius){
      catProfilesWithinRange.add(marker.getTitle());
    };
    if (distance <= radius && $filter[marker.getTitle()]) {
      marker.setMap(map);
    }else {
      marker.setMap(null);
    }
  }
  catProfilesonLegend = catProfiles.filter((profile) => {
    if(catProfilesWithinRange.has(profile.name)){
      return profile;
    }
  });
  console.log(catProfilesonLegend);
}


/**
 * Add user marker based on the current location
 */
function addUserMarker(){
  userMarker = new google.maps.Marker({
    icon:{
          url: markerIcon,
          scaledSize: new google.maps.Size(36, 36)
        }
  })

  range = new google.maps.Circle({
    strokeColor: "#8380f9",
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: "#8380f9",
    fillOpacity: 0.20,
    map,
    radius: radius,
  })
}

/**
 * Set the use current position
 */

async function setCurrentPosition(){
  if (navigator.geolocation) {
      // await navigator.geolocation.getCurrentPosition(
      //   (position) => {
      //     currentPosition = {
      //       lat: position.coords.latitude,
      //       lng: position.coords.longitude,
      //     };
      //     userMarker.setMap(map);
      //     userMarker.setPosition(currentPosition);
      //     range.setCenter(currentPosition);
      //   }
      // );
      try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      userMarker.setMap(map);
      userMarker.setPosition(currentPosition);
      range.setCenter(currentPosition);
    } catch (error) {
      console.error('Error getting current position:', error);
    }
     
  } else {
    return null
  }
}

async function setMapCenter(){
  if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition(
        (position) => {
          currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(currentPosition);
        }
      );
     
  } else {
    map.setCenter(KAIST);
  }
}

function newPost() {
  goto('new_post')
}

function chooseFile() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
  }

//Post
async function handleFileChange(event) {
  const file = event.target.files[0];
  selectedFile.set(file);
  await goto('postPic');
}

async function proposeCat() {
  await goto('propose');
}
</script>

<style>
  * { 
    -moz-box-sizing: border-box; 
    -webkit-box-sizing: border-box; 
     box-sizing: border-box; 
  }
  
  .map-container {
    width: 100%;
    height: 100%;
    margin: 0%;
    padding: 0%;
  }

  .slider{
    padding: 5%;
    width: 70%;
  }

  .ledger__scroll{
    overflow-x: visible;
    overflow-y: auto;
    height: 20vh;
  }

  .ledger__container {
    height: fit-content;
    display: flex;
    flex-direction: column;
  }

  .button__container {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    margin-top: 5%;
  }
</style>

<div bind:this="{mapElement}" class="map-container">
  <div bind:this="{newPostElement}" class="mr-3 mb-14">
    <button class="btn btn-active btn-secondary" on:click={chooseFile}>Post</button>
    <input type="file" id="fileInput" name="image" accept="image/*" style="display: none;" on:change={handleFileChange}>
  </div>


  <div bind:this="{slider}" class="slider">
    <input type="range" min="30" max="1000" step="10" bind:value={radius} on:input={onRadiusChange} class="range range-secondary" />
  </div>

  <div bind:this="{legendElement}" class="card fixed left-1 shadow-xl p-3 ml-7 space-y-2 bg-white items-left overflow-x-visible mb-7">
    <h2 class="card-title text-sm text-slate-500">Cats</h2>
    <div class="ledger__container">
      <div class="ledger__scroll">
        {#each catProfilesonLegend as { name, avatar }}
          <LedgerProfile avatar = { avatar } name = { name } on:filterChange = {displayCatMarkers}/>
        {/each}
      </div>
      <div class="button__container">
        <button class="btn btn-xs btn-block btn-active btn-secondary" style="line-height: auto;" on:click={proposeCat}>
          <svg style="color: white" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16"> <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" fill="white"></path> </svg>
        </button>
      </div>
    </div>
  </div>
</div>