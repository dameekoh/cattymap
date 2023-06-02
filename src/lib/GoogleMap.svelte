<h1>
  CattyMap
</h1>
<script>
  import { onMount } from 'svelte';

  let map;
  let mapElement;

  onMount(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBEQ0yl78oVx87pxPJd8Jrt-LOp7wPmTLA`;
    script.async = true;
    script.onload = () => {
      map = new google.maps.Map(mapElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    };
    document.head.appendChild(script);
    return () => script.remove();
  });
</script>

<style>
  .map-container {
    width: 100%;
    height: 400px;
  }

  @media (min-width: 768px) {
    .map-container {
      height: 600px;
    }
  }

  @media (min-width: 1024px) {
    .map-container {
      height: 800px;
    }
  }
</style>

<div bind:this="{mapElement}" class="map-container"></div>