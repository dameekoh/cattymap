<script>
    import { onMount } from 'svelte';
    let map;
    let mapElement;
  
    onMount(() => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
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
  
  <div bind:this="{mapElement}" style="width: 100%; height: 400px;"></div>