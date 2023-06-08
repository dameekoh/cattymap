<script>
    export let name = "not cat punn";
    export let picture = "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2022-08/220805-domestic-cat-mjf-1540-382ba2.jpg";
    export let caption = "Hi this is cat";
    let liked = false;
    let likes = 0;

    const like = () => {
        liked = true;
        likes++;
        setTimeout(() => {
            liked = false;
        }, 1200);
    };

    const shareToWhatsApp = () => {
        const text = `Check out this awesome cat named ${name}: ${window.location.href}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };
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
    <div class="picture relative" style="background-image: url({ picture });">
        <svg class="icon icon-heart {liked ? 'like' : ''} absolute inline-block w-32 opacity-0 fill-current text-white">
            <use xlink:href="#icon-heart"></use>
        </svg>
    </div>
    <div class="card-body w-full py-2 bg-gray-100 flex items-center">
        <h4 class="text-lg font-bold"> <strong>{likes} likes</strong> </h4>
        <h4 class="text-lg font-bold"> <strong> { name } </strong> { caption } </h4>
        <button class='btn btn-secondary' on:click={shareToWhatsApp}>Share on WhatsApp</button>
    </div>
</div>

<style>
.icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.picture {
    background-size: cover;
    background-position: center;
    padding-bottom: 75%;  /* to achieve 4:3 aspect ratio */
    width: 100%;
    position: relative;
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
