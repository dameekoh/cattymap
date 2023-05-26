<script>
  import { onMount } from 'svelte';

  let map;
  let mapElement;
  let legendElement;
  let boundary;

  onMount(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBEQ0yl78oVx87pxPJd8Jrt-LOp7wPmTLA`;
    script.async = true;
    script.onload = () => {
      map = new google.maps.Map(mapElement, {
        center: { lat: 36.368865, lng: 127.362103 },
        zoom: 18,
        disableDefaultUI: true,
        options: {
          styles: [
            {
              "featureType": "poi",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "on"
                }
              ]
            },
          ]
        }
      });

    boundary = new google.maps.LatLngBounds(
     new google.maps.LatLng(36.362357, 127.355266), 
     new google.maps.LatLng(36.377535, 127.368785)
   );

   google.maps.event.addListener(map, 'dragend', function() {
    if (boundary.contains(map.getCenter())) return;

    var c = map.getCenter(),
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
    };
    document.head.appendChild(script);
    return () => script.remove();
  });

  //try to set boundaries by event listener
  //failed, tho
  

</script>

<style>
  .map-container {
    width: 100%;
    height: 700px;
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

<!-- Legend -->
<div bind:this="{mapElement}" class="map-container">
  <div bind:this="{legendElement}" class="card fixed bottom-4 left-4 shadow-lg p-4 space-y-4 bg-white items-center">
    <h2 class="card-title">Legend</h2>
    <div class="flex items-center">
      <div class="avatar">
        <div class="profile-pic-container">
          <img class="profile-pic" src="https://cdn.iconscout.com/icon/premium/png-512-thumb/american-shorthair-1975261-1664591.png?f=avif&w=256" />
        </div>
      </div>
      <div class="form-control">
        <label class="cursor-pointer label">
          <span class="label-text">Cat Damir</span>
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
          <span class="label-text">Cat Zhi Lin</span>
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
          <span class="label-text">Cat Punn</span>
          <input type="checkbox" checked="checked" class="checkbox checkbox-secondary" />
        </label>
      </div>
    </div>
  </div>
</div>