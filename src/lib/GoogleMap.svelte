<script>
  import { onMount } from 'svelte';
  import RangeSlider from "svelte-range-slider-pips";
  // import catData from './catData.json';

// fire base
  import { initializeApp } from "firebase/app";
  import { get, set, ref, getDatabase, onValue, update } from 'firebase/database';
  import markerIcon from "../images/marker.png";


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

let radius = 1000; 

function onRadiusChange(event){
  console.log(radius);
  addCatMarkers();
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

  let map, mapElement, legendElement, boundary, inputName, currentPosition;

  onMount(async () => {
    await setCurrentPosition();
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBEQ0yl78oVx87pxPJd8Jrt-LOp7wPmTLA&libraries=geometry`;
    script.async = true;
    script.onload = () => {
      map = new google.maps.Map(mapElement, {
        center: (currentPosition) ? (currentPosition) : KAIST,
        zoom: 16,
        minZoom: 16,
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
      inputName?.close();

      //add input field
      var contentString = '<div id="content">'+
                          '<select name="catName" id="catName">'+
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
    addCatMarkers();
    addUserMarker();
    };
    document.head.appendChild(script);
    return () => script.remove();
  });



  /**
   * Adding cat markers according to the data from database
   */
  async function addCatMarkers() {
    try {
      const catData = await fetchCatPostFromDB();
      const currentLatLng = new google.maps.LatLng(currentPosition.lat, currentPosition.lng);
    
      for (const [key, cat] of Object.entries(catData)){
        const catLatLng = new google.maps.LatLng(cat.latitude, cat.longitude);
        const distance = google.maps.geometry.spherical.computeDistanceBetween(currentLatLng, catLatLng);

        if (distance <= radius){
          const marker = new google.maps.Marker({
            position: { lat: cat.latitude, lng: cat.longitude },
            map: map,
            icon: {
              url: cat.avatar,
              scaledSize: new google.maps.Size(48, 48) // Adjust the size of the icon if needed
            },
            title: cat.name
          });
        }
      }
        const infoWindow = new google.maps.InfoWindow({
          content: `<h3>${cat.name}</h3>`
        });
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
    } catch (error) {
      console.error('Error fetching cat data:', error);
    }
}


/**
 * Add user marker based on the current location
 */
function addUserMarker(){
  const marker = new google.maps.Marker({
    position: currentPosition,
    map: map,
    icon:{
          url: markerIcon,
          scaledSize: new google.maps.Size(36, 36)
        }
  })
}


/**
 * Set the use current position
 */
function setCurrentPosition(){
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        }
      );
    } else {
      return null
    }
}
</script>

<style>
  .map-container {
    width: 100%;
    height: 100%;
  }

  /* Legend styles */
  .legend {
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
  }

  .profile-pic-container {
    width: 3rem;
    border-radius: 9999px;
    position: relative;
    background-color: #fce4e3;
    box-shadow: 0px 0px 3.5px #e5b4b3;
  }

  .profile-pic {
    width: 70.7%;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @media (min-width: 768px) {
    .map-container {
      width: 100%;
      height: 600px;
    }
  }

  @media (min-width: 1024px) {
    .map-container {
      width: 100%;
      height: 800px;
    }
  }
</style>

<input type="range" min="0" max="2000" step="1" bind:value={radius} on:input={onRadiusChange} />
<!-- Legend -->
<div bind:this="{mapElement}" class="map-container">
  <div bind:this="{legendElement}" class="card fixed bottom-4 left-4 shadow-xl p-4 ml-7 space-y-4 bg-white items-left">
    <h2 class="card-title text-neutral-500">Cats</h2>
    <div class="flex items-center">
      <div class="avatar">
        <div class="profile-pic-container">
          <img class="profile-pic" src="https://cdn.iconscout.com/icon/premium/png-512-thumb/american-shorthair-1975261-1664591.png?f=avif&w=256" />
        </div>
      </div>
      <div class="form-control">
        <label class="cursor-pointer label">
          <span class="label-text text-neutral-400 text-base">Cat Damir</span>
          <input type="checkbox" checked="checked" class="checkbox checkbox-secondary" />
        </label>
      </div>
    </div>
    <div class="flex items-center">
      <div class="avatar">
        <div class="profile-pic-container">
          <img class="profile-pic" src="https://cdn.iconscout.com/icon/premium/png-512-thumb/abyssinnian-cat-1975262-1664592.png?f=avif&w=256"/>
        </div>
      </div>
      <div class="form-control">
        <label class="cursor-pointer label">
          <span class="label-text text-neutral-400 text-base">Cat Zhi Lin</span>
          <input type="checkbox" checked="checked" class="checkbox checkbox-secondary" />
        </label>
      </div>
    </div>
    <div class="flex items-center">
      <div class="avatar">
        <div class="profile-pic-container">
          <img class='profile-pic' src="https://cdn.iconscout.com/icon/premium/png-512-thumb/nebelung-1975276-1664606.png?f=avif&w=256" />
        </div>
      </div>
      <div class="form-control">
        <label class="cursor-pointer label">
          <span class="label-text text-neutral-400 text-base">Cat Punn</span>
          <input type="checkbox" checked="checked" class="checkbox checkbox-secondary" />
        </label>
      </div>
    </div>
  </div>
</div>
