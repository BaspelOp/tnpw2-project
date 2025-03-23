<script>
    import { base } from '$app/paths';
    import Navbar from '$components/navbar.svelte';
    import Footer from '$components/footer.svelte';
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Funnel+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">

<svelte:head>
    <title>Home | Bazar</title>
</svelte:head>

<main>
    <Navbar />
        <div class="container">
            <slot></slot>
        </div>
    <Footer />
</main>

<style global>
    :global(*){
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        text-decoration: none;
        font-family: "Funnel Sans", sans-serif;
    }

    :global(html){
        height: 100%;
        max-width: 100%;
        overflow-x: hidden;
        font-family: "Funnel Sans", sans-serif;
        font-size: 14pt;
        font-weight: 300;
        font-style: normal;
    }
    :global(body){
        color: var(--textcolor);
        background: var(--bgcolor);
        max-width: 100%;
        overflow-x: hidden;
    }

    :global(:root){
        --bgcolor: #EEEEEE;
        --lightcolor: #0e21b4;
        --mediumcolor: #FFA400;
        --darkcolor: #000033;
        --white: #FFFFFF;
        --textcolor: #FFFFFF;
        --textcolor2: #000000;
        --burgercolor: #FFFFFF;
    }

    .container{
        width: 100%;
        min-height: 20vh;
        margin-top: 10vh;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--textcolor);
    }
</style>