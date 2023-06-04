<script>
    export let name = "not cat punn";
    // export let avatar = "https://cdn.iconscout.com/icon/premium/png-512-thumb/american-shorthair-1975261-1664591.png?f=avif&w=256";
    export let picture = "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2022-08/220805-domestic-cat-mjf-1540-382ba2.jpg";
    export let caption = "Hi this is cat";
    // export let taggedCats = [];
</script>

<div class="post">
    <div class="post__pic__container">
        <img class="post__pic" src={ picture } alt="">
    </div>
    <div class="post__header">
        <h4 class="post__text"> <strong> { name } </strong> { caption } </h4>
    </div>
</div>

<style>
    .post{
        position: relative;
        width: 100%;
        height: max-content;
        align-items: center;
        border-radius: 2%;
        box-shadow: 0px 0px 5px #999999;
        overflow: hidden;
    }

    .post__pic{
        width: 100%;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

    .post__header{
        width: 100%;
        height: 10%;
        display: flex;
        background-color: whitesmoke;
        padding-left: 2.5%;
        padding-bottom: 2.5%;
        padding-top: 2.5%;
        
    }

    .post__pic__container{
        width: 100%;
        height: 50%;
        overflow-y: hidden;
    }

</style>