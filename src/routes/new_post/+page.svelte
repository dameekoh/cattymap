<!-- NewPost.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';
  
    let videoElement;
  
    onMount(() => {
      // Request access to the user's camera
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          // Set the video stream as the source for the video element
          videoElement.srcObject = stream;
          videoElement.play();
        })
        .catch(error => {
          console.error('Error accessing camera:', error);
        });
    });
  
    onDestroy(() => {
      // Stop the video stream when the component is destroyed
      if (videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
      }
    });
  
    function takePicture() {
      if (!videoElement.srcObject) return;
  
      // Create a new canvas element
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
  
      // Set the canvas dimensions to match the video stream
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
  
      // Draw the current frame of the video onto the canvas
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
      // Convert the canvas image to a Data URL
      const imageDataURL = canvas.toDataURL();
  
      // Do something with the captured picture (e.g., upload it)
  
      // Clean up
      canvas.remove();
    }
  </script>
  
  <video bind:this="{videoElement}" muted autoplay></video>
  <button on:click="{takePicture}">Take Picture</button>
  