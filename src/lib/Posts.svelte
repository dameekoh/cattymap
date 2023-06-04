<script>
    export let name = "";
    export let avatar = "https://cdn.iconscout.com/icon/premium/png-512-thumb/american-shorthair-1975261-1664591.png?f=avif&w=256";
    export let picture = "https://www.pexels.com/photo/1170986/download/";
    export let caption = "";
    export let taggedCats = [];
</script>

<div class="post">
    <img class="post__pic" src={ picture } alt="">
    <div class="post__header">
        <h4 class="post__text"> <strong> { name } </strong> { caption } </h4>
    </div>
</div>