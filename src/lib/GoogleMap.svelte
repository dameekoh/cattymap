<script>
  import { onMount } from 'svelte';

  let map;
  let mapElement;
  let legendElement;

  onMount(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBEQ0yl78oVx87pxPJd8Jrt-LOp7wPmTLA`;
    script.async = true;
    script.onload = () => {
      map = new google.maps.Map(mapElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });

      // Add the legend to the map
      map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legendElement);
    };
    document.head.appendChild(script);
    return () => script.remove();
  });
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

<div bind:this="{mapElement}" class="map-container">
  <div bind:this="{legendElement}" class="legend">
    <div class="legend-item">
      <div class="legend-color bg-red-500"></div> Cat1
    </div>
    <div class="legend-item">
      <div class="legend-color bg-yellow-500"></div> Cat2
    </div>
    <div class="legend-item">
      <div class="legend-color bg-green-500"></div> Cat3
    </div>
  </div>
</div>