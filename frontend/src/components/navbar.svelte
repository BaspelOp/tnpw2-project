<script>
    import { onMount } from 'svelte';
    import { base } from '$app/paths';
    import { auth, logout } from '$stores/auth';

    let isMenuOpen = false;

    function toggleMenu(){
        isMenuOpen = !isMenuOpen;
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_consider_explicit_label -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="navbar">
    <a href="/" class="logo"><img src="{base}/media/logo_main.svg" alt="AUTODILY.CZ"></a>
    <nav class:open={isMenuOpen}>
        <ul>
            <li on:click={() => (isMenuOpen = false)}>
                <a href="/">Kategorie</a>
            </li>
            <li on:click={() => (isMenuOpen = false)}>
                <a href="{base}/kontakt">Kontakt</a>
            </li>
            {#if $auth.user}
                <li on:click={() => (isMenuOpen = false)} class="profile">
                    <a href="{base}/profil">Profil</a>
                </li> <!-- Tady by byla kdyžtak nějaká fotka toho obrázku či něčeho, zatím jsem sem dal jen profil -->
                <li on:click={() => { isMenuOpen = false; logout(); }} class="log-out-btn">
                    <a href="/">Odhlásit se</a>
                </li>                  
            {:else}
                <li on:click={() => (isMenuOpen = false)} class="sign-in-btn">
                    <a href="{base}/login">Přihlášení</a>
                </li>
            {/if}
        </ul>
    </nav>
    <button class="burger" on:click={toggleMenu} class:open={isMenuOpen}>
        <div class="bar-1"></div>
        <div class="bar-2"></div>
        <div class="bar-3"></div>
    </button>
</div>

<style>
    .navbar{
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
        font-size: 1.1rem;
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

    .sign-in-btn > a{
        background-color: var(--mediumcolor);
        color: var(--white);
        padding: 0.5rem;
        padding-right: 1rem;
        padding-left: 1rem;
        border-radius: 50px;
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

        .sign-in-btn {
            margin-right: 2vw;
        }
    }

</style>
