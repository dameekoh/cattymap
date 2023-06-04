<style>
  .file-label {
    /* Style the label to resemble a button */
    display: inline-block;
    padding: 6px 12px;
    background-color: #f0f0f0;
    color: #333;
    border: 1px solid #ccc;
    cursor: pointer;
  }

  .file-label input[type="file"] {
    /* Hide the default file input */
    display: none;
  }
</style>

<div class="card w-3/4 h-max bg-white shadow-xl">
  <figure><img src="https://media.npr.org/assets/img/2021/08/11/gettyimages-1279899488_wide-f3860ceb0ef19643c335cb34df3fa1de166e2761-s1100-c50.jpg" alt="Image" /></figure>
  <div class="card-body">
    <h2 class="card-title">
      New Post
    </h2>
    <div>
      <button class="btn btn-active btn-secondary" on:click={chooseFile}>Choose File</button>
      <input type="file" id="fileInput" name="image" accept="image/*" style="display: none;">
    </div>
  </div>
</div>

<script>
  function chooseFile() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
  }
</script>

