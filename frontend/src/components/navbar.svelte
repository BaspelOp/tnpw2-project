<script>
    import { onMount } from 'svelte';
    import { base } from '$app/paths';
    import { auth, logout } from '$stores/auth';
    import Modal from '../routes/modal.svelte';
    import { goto } from '$app/navigation';
    import { dataStore } from '$stores/dataStore';
    import { searchQuery } from '$stores/searchStore';
    import { page } from '$app/state';

    let showModal = $state(false);
    let isMenuOpen = $state(false);

    function toggleMenu(){
        isMenuOpen = !isMenuOpen;
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_consider_explicit_label -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="navbar">
    <a href="/" class="logo"><img src="{base}/media/logo_main.svg" alt="AUTODILY.CZ"></a>

    {#if page.url.pathname == '/inzeraty'}
        <div class="searchbar">
            <input bind:value={$searchQuery} type="text" class="searchbar-text" placeholder="Vyhledat">
            <button type="button" class="searchbutton">
                <img class="searchbuttonimg" src="{base}/media/searchbutton.svg" alt="Vyhledat">
            </button>
        </div>
    {/if}

    <nav class:open={isMenuOpen}>
        <ul>
            <li onclick={() => (isMenuOpen = false)}>
                <a href="{base}/kontakt">Kontakt</a>
            </li>
            <li onclick={() => (isMenuOpen = false)}>
                <a href="{base}/inzeraty">Inzeráty</a>
            </li>
            <li onclick={() => (isMenuOpen = false)}>
                <button class="btn" onclick={() => (showModal = true)}>Přidat inzerát</button>
            </li>
            {#if $auth.user}
                <li onclick={() => (isMenuOpen = false)} class="profile">
                    <a href="{base}/profil/{$auth.user.id}">Profil</a>
                </li>
                <li onclick={() => { isMenuOpen = false; logout(); }} class="btn">
                    <a href="/">Odhlásit se</a>
                </li>                  
            {:else}
                <li onclick={() => (isMenuOpen = false)} class="btn">
                    <a href="{base}/login">Přihlášení</a>
                </li>
            {/if}
        </ul>
    </nav>
    <button class="burger" onclick={toggleMenu} class:open={isMenuOpen}>
        <div class="bar-1"></div>
        <div class="bar-2"></div>
        <div class="bar-3"></div>
    </button>
</div>

<Modal bind:showModal />

<style>
    .searchbar{
        max-width: 33%;
        margin: 10px;
        padding: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: var(--white);
        border-radius: 1000px;
    }
    .searchbutton{
        background-color: transparent;
        width: 10%;
        border: none;
        cursor: pointer;
    }
    .searchbuttonimg{
        width: 50%;
        height: 50%;
    }
    .searchbar-text{
        padding: 2px;
        width: 100%;
        border: none;
        &:focus-visible{
            outline: none;
        }
        min-width: 25%;
    }
    .navbar{
        width: 100%;
        background-color: var(--lightcolor);
        border: 0;
        border-bottom: 0.5vh;
        border-style: solid;
        border-color: var(--mediumcolor);
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        padding-top: 1vw;
        padding-bottom: 1vw;
    }

    .logo{
        margin-left: 5vw;
        min-width: 200px;
    }

    @media only screen and (max-width: 767px){
        nav{
            opacity: 0;
            display: block;
            position: absolute;
            top:100%;
            left: 100%;
            background-color: var(--lightcolor);
            width: 100%;
            transition: all 300ms ease-in-out;
        }
        .logo{
            scale: 0.50;
            margin: 0;
        }
        .searchbar{
            max-width: 100%;
        }
    }

    nav.open{
        opacity: 1;
        left: 0;
        overflow: visible;
    }

    ul{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 5vh;
        margin-top: 2vh;
        margin-bottom: 4vh;
        list-style-type: none;
    }

    li {
        display: inline-block;
        transition: all 200ms ease-in-out;
    }

    li:hover {
        transform: scale(1.1);
    }

    li:active{
        transform: scale(0.9);
    }

    a {
        color: var(--textcolor);
    }

    .btn{
        font-size: 14pt;
        border: none;
        background-color: var(--mediumcolor);
        color: var(--white);
        padding: 0.5rem;
        padding-right: 1rem;
        padding-left: 1rem;
        border-radius: 50px;
    }

    .btn:hover{
        transition: all 200ms ease-in-out;
        cursor: pointer;
    }

    .burger{
        height: 28px;
        aspect-ratio: 1;
        border: 2px solid var(--burgercolor);
        background-color: transparent;
        border-radius: 5px;
        margin-right: 6vw;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .burger > div {
        height: 2px;
        width: 14px;
        background-color: var(--burgercolor);
        position: absolute;
        transition: all 300ms ease-in-out;
    }
    .bar-1{
        transform: translateY(-5px);
    }
    .bar-3{
        transform: translateY(5px);
    }

    .burger.open .bar-1{
        transform: rotateZ(45deg);
    }

    .burger.open .bar-2{
        opacity: 0;
    }

    .burger.open .bar-3{
        transform: rotateZ(-45deg);
    }

    @media only screen and (min-width: 768px) {
        .logo{
            margin-left: 3vw;
        }
        .burger{
            display: none;
        }
        nav{
            display: block;
            position: relative;
        }
        ul{
            margin: 0;
            flex-direction: row;
            gap: 2vw;
        }

        .btn {
            margin-right: 2vw;
        }
    }

</style>
