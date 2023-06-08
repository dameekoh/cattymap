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

<script>
  import { onMount } from 'svelte';
  import { selectedFile } from '../../stores/image';
  // import GoogleMap from '../../lib/GoogleMap.svelte';
  let fileUrl;
  let selectedFilter = '';
  let gmap;
  let currentPosition;

  

  const loadImage = (src) => {
    fileUrl = src;
    selectedFile.set(fileUrl);
  };

  onMount(() => {
    $selectedFile && loadImage(URL.createObjectURL($selectedFile));
    // console.log(gmap.currentPosition);

    navigator.geolocation.getCurrentPosition((position) => {
      currentPosition = position;
      console.log(currentPosition);
    });


  });
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
  <select class="select select-secondary w-60">
    <option disabled selected>Select the cat</option>
    <option>Damir</option>
    <option>Zhi Lin</option>
    <option>Punn</option>
  </select>
  
    <textarea class="textarea textarea-secondary w-60" placeholder="Description"></textarea>
  <button class="btn btn-secondary w-60">Publish</button>
  
  </div>
