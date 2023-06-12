<script>
  import { goto } from '$app/navigation';

  // TO DO: send cat image to DataBase.
  function chooseFile() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
  }
  //Post
  async function handleFileChange(event) {
    const file = event.target.files[0];
    alert('Your File is Uploaded. Our team will review the content and update the cat list');
    await goto('/');
  }
</script>

<div class="app__container">
  <div class="send__propose__container">
    <div class="card w-3/4 h-max bg-white shadow-xl" style="margin: auto;">
        <div class="card-body">
          <h2 class="card-title">
            Propose Image
          </h2>
          <div>
            <div class="pads"></div>
    
            <textarea class="textarea textarea-secondary w-60" placeholder="Description"></textarea>
            <div>
              <button class="btn btn-active btn-secondary" on:click={chooseFile}>Choose file</button>
              <input type="file" id="fileInput" name="image" accept="image/*" style="display: none;" on:change={handleFileChange}>
            </div>
          </div>
        </div>
      </div>
  </div>
</div>

  
<style>
  .pads{
   height:5%;
  }
 
  .button__container{
   display: grid;
 
  }

  .app__container{
  display: flex;
  height: 100vh;
  width: 100%;
}

  .send__propose__container{
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
 </style>