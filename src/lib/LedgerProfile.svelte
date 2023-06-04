<script>
    export let profilePic = "https://cdn.iconscout.com/icon/premium/png-512-thumb/american-shorthair-1975261-1664591.png?f=avif&w=256";
    export let name = "no name cat";
    export let checked = true; 
</script>

<style>
    .ledgerSection {
        display: grid;
        gap: 2px;
        grid-template-columns: repeat(3, 45px);
        justify-items: start;
        padding-bottom: 5%;
        height: 33.33%;
    }

    .profile-pic-container {
        width: 40px;
        border-radius: 9999px;
        position: relative;
        background-color: #fce4e3;
        box-shadow: 0px 0px 3.5px #e5b4b3;
        margin-left: 5%;
        margin-top: 5%;
        height: 100%;
    }

    .profile-pic {
        width: 70.7%;
        height: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .name {
        align-self: center;
        justify-self: start;
    }

</style>

<div class="ledgerSection">
    <div class="profile-pic-container">
        <img class="profile-pic" src={profilePic} />
    </div>

    <div class="name"> {name} </div>
    <div class="form-control justify-self-end">
        <label class="cursor-pointer label">
            {#if checked}
                <input type="checkbox" checked class="checkbox checkbox-secondary" />
            {:else}
                <input type="checkbox" class="checkbox checkbox-secondary" />
            {/if}
        </label>
    </div>
</div>


