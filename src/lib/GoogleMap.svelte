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

  .label-text {
    width: 120px;
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
  <div
    bind:this="{legendElement}"
    class="card fixed bottom-4 left-4 shadow-lg p-4 space-y-4 bg-white items-center"
  >
    <h2 class="card-title">Legend</h2>
    <div class="flex items-center">
      <div class="avatar">
        <div class="w-16 rounded-full">
          <img src="https://cdn.iconscout.com/icon/premium/png-512-thumb/american-shorthair-1975261-1664591.png?f=avif&w=256" />
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
        <div class="w-16 rounded-full">
          <img src="https://cdn.iconscout.com/icon/premium/png-512-thumb/abyssinnian-cat-1975262-1664592.png?f=avif&w=256"/>
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
        <div class="w-16 rounded-full">
          <img src="https://cdn.iconscout.com/icon/premium/png-512-thumb/nebelung-1975276-1664606.png?f=avif&w=256" />
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