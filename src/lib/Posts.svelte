<script>
    import { initializeApp } from "firebase/app";
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import {
    ref,
    get,
    set,
    getDatabase,
    onValue,
    update,
  } from "firebase/database";
    import { onMount } from 'svelte';


    export let name = "not cat punn";
    export let picture = "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2022-08/220805-domestic-cat-mjf-1540-382ba2.jpg";
    export let caption = "Hi this is cat";
    export let key;
    export let filter;
    let liked = false;
    let likes = 0;
    let newComment = "";
    let useruid;
    let username;
    let post;


    const firebaseConfig = {
    apiKey: "AIzaSyBEQ0yl78oVx87pxPJd8Jrt-LOp7wPmTLA",
    authDomain: "cattymap-1b9a3.firebaseapp.com",
    projectId: "cattymap-1b9a3",
    storageBucket: "cattymap-1b9a3.appspot.com",
    messagingSenderId: "368074086145",
    appId: "1:368074086145:web:393f103f6ca32a06bbad00",
    measurementId: "G-442J384EW1",
    databaseURL: 'https://cattymap-1b9a3-default-rtdb.asia-southeast1.firebasedatabase.app/',
  };

    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const commentRef = ref(database, "Comment");
    const commentCountRef = ref(database, "CommentCount");
    const likesRef = ref(database, `Cat/${key}/likeCount`);
    let commentCount;
    let comments = [];
    let userComments = [];
    let sortedComments = [];
    let showComments = false;
    let recognition;
    let speechRecognitionAvailable = false;
    let isListening = false;

    // get username of comment owner 
    function getUserUID() {
        return new Promise((resolve, reject) => {
            const auth = getAuth();
            const unsubscribe = onAuthStateChanged(auth, user => {
                unsubscribe();
                if (user) {
                    resolve(user.uid);
                }else {
                    reject(new Error('User not signed in.'));
                }
            })
        })
    }
    
    async function getUserName() {
        try {
            useruid =  await getUserUID();
            const usersRef = ref(database, `users/${useruid}`);
            const user = await fetchFromDB(usersRef);
            username = user.username;
        }catch (error) {
            console.error('Error: ', error);
        }
    }

    function fetchFromDB(ref) {
    return new Promise((resolve, reject) => {
      onValue(ref, (snapshot) => {
        const data = snapshot.val();
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  } 

    async function getLikes() {
        try {
            likes = await fetchFromDB(likesRef);
        }catch (error) {
            console.error('Error: ', error)
        }
    }

    // get comments of that post 
    function fetchCommentFromDB() {
        return new Promise((resolve, reject) => {
            onValue(commentRef, (snapshot) => {
                const data = snapshot.val();
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }

    async function fetchComment(){
        let commentDB = await fetchCommentFromDB();
        commentDB = Object.values(commentDB);
        return commentDB;
        
    }

    async function getOwnerComments() {
        const commentDB = await fetchComment();
        userComments = commentDB.filter(item => item.postNumber == key && item.username == username);
    }
    
    async function getOtherComments() {
        const commentDB = await fetchComment();
        comments = commentDB.filter(item => item.postNumber == key && item.username != username);
    }

    function arrangeComments() {
        const mergedArray = [...comments.map(item => ({ ...item, type: 'comment' })), ...userComments.map(item => ({ ...item, type: 'userComment' }))];
        sortedComments = mergedArray.sort((a, b) => a.timestamp - b.timestamp);
    } 

    function timeAgo(timestamp) {
        const now = Date.now();
        const secondsPast = (now - timestamp) / 1000;

        if(secondsPast < 60){
            return parseInt(secondsPast) + 's';
        }
        if(secondsPast < 3600){
            return parseInt(secondsPast/60) + 'm';
        }
        if(secondsPast <= 86400){
            return parseInt(secondsPast/3600) + 'h';
        }
        if(secondsPast > 86400){
            let day = parseInt(secondsPast/86400);
            if(day < 7){
                return day + 'd';
            }else{
                let week = parseInt(day/7);
                return week + 'w';
            }
        }
    }

    const like = async () => {
        liked = true;
        likes++;
        await set(likesRef, likes);
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

    async function addtoCommentDB() {
        if (newComment) {
            get(commentCountRef)
            .then((snapshot) => {
                commentCount = snapshot.val();
                set(commentCountRef, commentCount + 1);
                const uniqueKey = commentCount;
                const dataToUpdate = {
                    [uniqueKey]: {
                        timestamp: Date.now(),
                        username: username,
                        postNumber: key,
                        content: newComment
                    },
                };
                update(commentRef, dataToUpdate)
                .then(async () => {
                    newComment = "";
                    showComments = true; 
                    await getOwnerComments();
                    await getOtherComments();
                    arrangeComments();
                })
                .catch((error) => {
                    console.error("Error updating database:", error);
                });
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }

    onMount(async () => {
        await getUserName();
        await getLikes();
        await getOwnerComments();
        await getOtherComments();
        arrangeComments();
    })

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
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cssgram/0.1.10/cssgram.min.css">


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
        <div class="picture {filter}" style="background-image: url({ picture }); class: image {filter}">
            <svg class="icon icon-heart {liked ? 'like' : ''}  inline-block w-32 opacity-0 fill-current text-white">
                <use xlink:href="#icon-heart"></use>
            </svg>
        </div>
    </div>

    <div class="card-body w-full py-2 px-4 bg-gray-100 flex items-center">
        <div class="like__container">
            <h5 class="text-lg font-normal"> <strong>{likes} likes </strong> </h5>
            <button class="btn btn-secondary self-end" on:click={toggleListen}>
                {#if isListening}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mic" viewBox="0 0 16 16"> <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/> <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/> </svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mic-mute" viewBox="0 0 16 16"> <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879l-1-1V3a2 2 0 0 0-3.997-.118l-.845-.845A3.001 3.001 0 0 1 11 3z"/> <path d="m9.486 10.607-.748-.748A2 2 0 0 1 6 8v-.878l-1-1V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z"/> </svg>
                {/if}
            </button>
        </div>
        <div class="caption__container">
            <h5 class="text-lg font-normal"> <strong> { name } </strong> { caption } </h5>
        </div>
        <div class="comment__container comment-box">
            <button class="text-slate-400" on:click={toggleComments}>View all {comments.length + userComments.length} comments</button>
            {#if showComments}
            <div class="comments">
                {#each sortedComments as item}
                    {#if item.type === 'comment'}
                        <div class="chat chat-start">
                            <div class="chat-image avatar">
                                <div class="w-10 rounded-full">
                                  <!-- <img src="https://cutewallpaper.org/24/person-icon-png-transparent/person-icon-grey-grey-person-icon-png-transparent-png-vhv.png" /> -->
                                </div>
                              </div>
                            <div class="chat-header">
                                {item.username}
                                <time class="text-xs opacity-50">{timeAgo(item.timestamp)}</time>
                            </div>
                            <div class="chat-bubble chat-bubble-secondary">{item.content}</div>
                        </div>  
                    {:else if item.type === 'userComment'}
                        <div class="chat chat-end">
                            <div class="chat-image avatar">
                                <div class="w-10 rounded-full">
                                <!-- <img src="https://cutewallpaper.org/24/person-icon-png-transparent/person-icon-grey-grey-person-icon-png-transparent-png-vhv.png" /> -->
                                </div>
                            </div>
                            <div class="chat-header">
                                {item.username}
                                <time class="text-xs opacity-50">{timeAgo(item.timestamp)}</time>
                            </div>
                            <div class="chat-bubble chat-bubble-primary">{item.content}</div>
                        </div> 
                    {/if}
                {/each}
            </div>
            {/if}
        </div>
        
        <div class="w-full h-16 relative">
            <textarea class="w-full h-full rounded-md shadow-inner shadow-slate-200" bind:value={newComment} placeholder="Write a comment..."></textarea>
            <button class="btn btn-secondary absolute bottom-1 right-1" on:click={addtoCommentDB}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16"> <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/> </svg>
            </button>
        </div>
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

.username {
    display: block;
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

.like__container {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: row;
    justify-content: space-between;
}

.caption__container {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content:last baseline;
    flex-direction: column;

}

.comment__container {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content:last baseline;
    flex-direction: column;
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
