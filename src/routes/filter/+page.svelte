<style>

  .selected-image, .filter-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .selected-image {
    width: 100%;
    height: 40vh;
  }

  .filter-card {
    flex: 0 0 auto;
    width: 30vw; /* Adjust the width as needed */
    height: 30vh; /* Adjust the height as needed */
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
  let fileUrl;
  let selectedFilter = '';

  const loadImage = (src) => {
    fileUrl = src;
    selectedFile.set(fileUrl);
  };

  onMount(() => {
    $selectedFile && loadImage(URL.createObjectURL($selectedFile));
  });
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cssgram/0.1.10/cssgram.min.css">
<div class="selected-image">
  {#if $selectedFile}
  <img src="{fileUrl}" alt="Selected image" class="image {selectedFilter}" />
  {/if}
</div>

<div class="filters-container">
  <div class="filter-card">
    <img src="{fileUrl}" alt="Filter 1977" class="image _1977" on:click={() => selectedFilter = '_1977'} />
    <h2>1977</h2>
  </div>
  <div class="filter-card">
    <img src="{fileUrl}" alt="Filter Gingham" class="image gingham" on:click={() => selectedFilter = 'gingham'} />
    <h2>Gingham</h2>
  </div>
  <div class="filter-card">
    <img src="{fileUrl}" alt="Filter Lo-Fi" class="image lofi" on:click={() => selectedFilter = 'lofi'} />
    <h2>Lo-Fi</h2>
  </div>
  <div class="filter-card">
    <img src="{fileUrl}" alt="Rise" class="image rise" on:click={() => selectedFilter = 'rise'} />
    <h2>Rise</h2>
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
