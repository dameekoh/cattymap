<script>
    export let name = "not cat punn";
    export let picture = "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2022-08/220805-domestic-cat-mjf-1540-382ba2.jpg";
    export let caption = "Hi this is cat";
    let liked = false;
    let likes = 0;
    let newComment = "";
    let comments = [
        {name: "PUNN", text: "I'm Punn"},
        {name: "ZHI LIN", text: "I'm Zhi Lin"},
        {name: "Damir", text: "I'm Damir"},
    ];
    let userComments = [
    ];
    let showComments = false;
    let recognition;
    let speechRecognitionAvailable = false;
    let isListening = false;

    const like = () => {
        liked = true;
        likes++;
        setTimeout(() => {
            liked = false;
        }, 1200);
    };

    // Share to Social Media
    const shareToWhatsApp = () => {
        const text = `Check out this awesome cat named ${name}: ${window.location.href}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const shareToInstagram = () => {
        const url = `instagram://camera`;
        window.open(url, '_blank');
    };

    const shareToTwitter = () => {
        const text = `Check out this awesome cat named ${name}: ${window.location.href}`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const toggleComments = () => {
        showComments = !showComments;
    };

    const addComment = () => {
        if (newComment) {
            userComments = [...userComments, {name: "User", text: newComment}];
            newComment = "";
            showComments = true; 
        }
    };

    // Check if SpeechRecognition is available
    if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
        speechRecognitionAvailable = true;
    } else if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        speechRecognitionAvailable = true;
    }

    if (speechRecognitionAvailable) {
        recognition.continuous = true; 
        recognition.interimResults = false; 
        recognition.lang = 'en-US';

        recognition.onresult = function(event) {
            const lastResultIndex = event.results.length - 1;
            const text = event.results[lastResultIndex][0].transcript;
            console.log(text);
            if (text.toUpperCase().includes('MEOW')) {
                like();
            }
        };
    }

    const toggleListen = () => {
        if (!isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }
        isListening = !isListening;
    }

    
</script>

<svg
    aria-hidden="true"
    style="position: absolute; width: 0; height: 0; overflow: hidden;"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
>
    <defs>
        <symbol id="icon-heart" viewBox="0 0 32 32">
            <path
                d="M23.6 2c-3.363 0-6.258 2.736-7.599 5.594-1.342-2.858-4.237-5.594-7.601-5.594-4.637 0-8.4 3.764-8.4 8.401 0 9.433 9.516 11.906 16.001 21.232 6.13-9.268 15.999-12.1 15.999-21.232 0-4.637-3.763-8.401-8.4-8.401z"
            ></path>
        </symbol>
    </defs>
</svg>

<div class="card bordered flex flex-col items-center shadow-md overflow-hidden mb-2" on:dblclick={like}>
    <div class="picture-container">
        <div class="picture" style="background-image: url({ picture });">
            <svg class="icon icon-heart {liked ? 'like' : ''}  inline-block w-32 opacity-0 fill-current text-white">
                <use xlink:href="#icon-heart"></use>
            </svg>
        </div>
    </div>
    <div class="card-body w-full py-2 bg-gray-100 flex items-center">
        <h4 class="text-lg font-bold"> <strong>{likes} likes</strong> </h4>
        <h4 class="text-lg font-bold"> <strong> { name } </strong> { caption } </h4>
        <button class="btn btn-secondary" on:click={toggleListen}>{isListening ? 'Stop Listening' : 'Start Listening'}</button>
        <div class="social-media-buttonsg">
            <button class='btn btn-secondary' on:click={shareToWhatsApp}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16"> <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/> </svg>
            </button>
            <button class='btn btn-secondary' on:click={shareToTwitter}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-twitter" viewBox="0 0 16 16"> <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/> </svg>
            </button>
            <button class='btn btn-secondary' on:click={shareToInstagram}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </button>
            <h4 class="text-lg font-bold"> <strong>Comments</strong> </h4>
            <div class="comment-box">
                <button on:click={toggleComments}>View all {comments.length} comments</button>
                {#if showComments}
                    <div class="comments">
                        {#each comments as comment (comment.name)}
                            <div class="chat chat-start">
                                <p>{comment.name}</p>
                                <div class="chat-bubble chat-bubble-secondary">{comment.text}</div>
                            </div>
                        {/each}
                        {#each userComments as userComment (userComment.name)}
                            <div class="chat chat-end">
                                <p>{userComment.name}</p>
                                <div class="chat-bubble chat-bubble-primary">{userComment.text}</div>
                            </div>
                        {/each}
                    </div>
                {/if}
                <div>
                    <textarea bind:value={newComment} placeholder="Write a comment..."></textarea>
                    <button class="btn btn-secondary" on:click={addComment}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16"> <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/> </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.card {
    width: 100%;
    position: relative;
}

.picture-container {
    width: 100%;
    padding-bottom: 75%;  /* Maintain 4:3 aspect ratio */
    position: relative;
}

.picture {
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}

.icon {
    position: absolute;
    top: 25%;
    left: 35%;
    /* transform: translate(-50%, -50%); */
}

.icon.like {
    animation: 2s like-heart-animation ease-in-out forwards;
}

@keyframes like-heart-animation {
    0%,
    to {
        opacity: 0;
        transform: scale(0);
    }
    15% {
        opacity: 0.9;
        transform: scale(1.2);
    }
    30% {
        transform: scale(0.95);
    }
    45%,
    80% {
        opacity: 0.9;
        transform: scale(1);
    }
    100% {
        opacity: 0;
        transform: scale(0);
    }
}

@media (max-width: 400px){
    .card {
        padding-left: 0;
        padding-right: 0;
    }
}


</style>
