<script>
  import { onMount } from 'svelte';
  import RangeSlider from "svelte-range-slider-pips";

// fire base

  import { initializeApp } from "firebase/app";
  import { ref, push, child, get, set, getDatabase, onValue, update } from 'firebase/database';
  import LedgerProfile from './LedgerProfile.svelte';
  import markerIcon from "../images/marker.png";
  import { goto } from '$app/navigation';
  import { selectedFile } from '../stores/image';


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

  let radius = 1000;
  let catProfiles = [];


function onRadiusChange(event){
  displayCatMarkers();
  range.setRadius(radius)
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
      currentPosition, 
      catWindow, 
      userMarker,
      range,
      directionsService,
      directionsRenderer;
  

  onMount(async () => {
    catProfiles = await fetchCatProfileFromDB();
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

    //get Lat-Long based on mouse click 
    //and input name (for testing)
    map.addListener("click", (mapsMouseEvent) => {
      const position = mapsMouseEvent.latLng.toJSON();

      //close existing window
      catWindow?.close();
      inputName?.close();

      //add input field
      var contentString = '<div id="content">'+
                          '<select name="catName" id="catName" class="select bg-white">'+
                          '<option value=0>- select cat -</option>'+
                          '<option value="Cat Damir">Damir</option>'+
                          '<option value="Cat Zhi Lin">Zhi Lin</option>'+
                          '<option value="Cat Punn">Punn</option>'+
                          '</select>'+
                          '</div>';
      
      inputName = new google.maps.InfoWindow({
                        position: mapsMouseEvent.latLng,
                        content: contentString
                      });
      
      inputName.open(map);

      //listen to the input
      google.maps.event.addListener(inputName, 'domready', function () {
          const catName = document.getElementById('catName');

          catName.oninput = function() {
            const name = catName.value; 
            const avatar = (name == 'Cat Zhi Lin') ? ("https://cdn.iconscout.com/icon/premium/png-512-thumb/abyssinnian-cat-1975262-1664592.png?f=avif&w=256")
                          :(name == 'Cat Damir') ? ("https://cdn.iconscout.com/icon/premium/png-512-thumb/american-shorthair-1975261-1664591.png?f=avif&w=256")
                          :(name == 'Cat Punn') ? ("https://cdn.iconscout.com/icon/premium/png-512-thumb/nebelung-1975276-1664606.png?f=avif&w=256")
                          : (null);
            
            sendToDB({postID: new Date(), name: name, ...position, avatar: avatar, image: "None", likeCount: 0});
            inputName.close();
            // addCatMarkers();
          }
      });
    });

    // Add the legend to the map
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legendElement);
    // Add map
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(newPostElement);

    
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(slider);
    addUserMarker();
    setMapCenter();
    setCurrentPosition();
    addCatMarkers();
    };

    setInterval(() => {
      setCurrentPosition();
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
        
        catWindow = new google.maps.InfoWindow({
          content: `<h3>${cat.name}</h3>` +
                   '<div class="flex content-center item-center p-4">' +
                   '<button class="btn bg-white" id="catRoute">go</button>' +
                   '</div>'
        });

        //listen to the input
        google.maps.event.addListener(catWindow, 'domready', function () {
            const catRoute = document.getElementById('catRoute');

            catRoute.onclick = function() {
              const L2 = marker.getPosition();
              console.log(L2);
              displayRoute(currentPosition, L2);
              catWindow.close();
            }
        });

        marker.addListener('click', () => {
          inputName?.close();
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
  for (const [key, marker] of Object.entries(markers)){
    const currentLatLng = new google.maps.LatLng(currentPosition.lat, currentPosition.lng);
    const catLatLng = marker.getPosition();
    const distance = google.maps.geometry.spherical.computeDistanceBetween(currentLatLng, catLatLng);
    if (distance <= radius) {
      marker.setMap(map);
    }else {
      marker.setMap(null);
    }
  }
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
      await navigator.geolocation.getCurrentPosition(
        (position) => {
          currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          userMarker.setMap(map);
          userMarker.setPosition(currentPosition);
          range.setCenter(currentPosition);
        }
      );
     
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

function displayRoute(L1, L2) {

  const request = {
  origin: L1,
  destination: L2,
  travelMode: 'BICYCLING',
  unitSystem: google.maps.UnitSystem.IMPERIAL
  }

  directionsService.route(request, function(result, status) {
    console.log(status);
    if (status == 'OK') {
      directionsRenderer.setDirections(result);
    }
  });

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
  await goto('filter');
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
  .file-label {
      /* Style the label to resemble a button */
      display: inline-block;
      padding: 6px 12px;
      background-color: #f0f0f0;
      color: #333;
      border: 1px solid #ccc;
      cursor: pointer;
    }
  
    .file-label input[type="file"] {
      /* Hide the default file input */
      display: none;
    }

  /* Legend styles */
  /* .legend {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px;
    border-radius: 14px;
    font-size: 14px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
  }

  .legend-color {
    width: 16px;
    height: 16px;
    margin-right: 15px;
  }

  .label-text {
    width: 120px;
    margin-left: 10%;
  } */

  .file-input {
    display: block;
    width: 100%;
    max-width: 300px; /* Adjust the maximum width as needed */
    margin: 0 auto;
  }

</style>

<div bind:this="{mapElement}" class="map-container">
  <div bind:this="{newPostElement}" class="mr-3 mb-5">
    <button class="btn btn-active btn-secondary" on:click={chooseFile}>Post</button>
    <input type="file" id="fileInput" name="image" accept="image/*" style="display: none;" on:change={handleFileChange}>
  </div>


  <div bind:this="{slider}" class="slider">
    <input type="range" min="0" max="2000" step="25" bind:value={radius} on:input={onRadiusChange} class="range range-secondary" />
  </div>

  <div bind:this="{legendElement}" class="card fixed left-1 shadow-xl p-3 ml-7 space-y-2 bg-white items-left overflow-x-visible">
    <h2 class="card-title text-sm text-slate-500">Cats</h2>
    <div class="container">
      <div class="ledger__scroll">
        {#each catProfiles as { name, avatar }}
          <LedgerProfile avatar = { avatar } name = { name }/>
        {/each}
      </div>
    </div>
  </div>
</div>