
<style>
  * { 
    -moz-box-sizing: border-box; 
    -webkit-box-sizing: border-box; 
     box-sizing: border-box; 
  }
</style>
  
  <div class="card w-3/4 h-max bg-white shadow-xl">
    <figure>
        {#if $selectedFile}
        console.log(fileUrl);
        <img src="{fileUrl}" alt="Selected image" />
        {/if}
    </figure>
    <div class="card-body">
      <h2 class="card-title">
        Filters
      </h2>
    </div>
    <div>
        <h2>filter1</h2>
        <h2>filter2</h2>
        <h2>filter3</h2>
        <textarea class="textarea textarea-secondary" placeholder="Description"></textarea>
        <button class="btn btn-secondary"> Publish </button>
        <select class="select select-secondary w-full max-w-xs">
          <option disabled selected>Select the cat</option>
          <option>Damir</option>
          <option>Zhi Lin</option>
          <option>Punn</option>
        </select>
    </div>
  </div>

  <script>
    import { selectedFile } from '../../stores/image';
     let fileUrl;

  $selectedFile && (fileUrl = URL.createObjectURL($selectedFile));
</script>

  