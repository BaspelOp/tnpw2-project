<script>
    import { page } from '$app/state';
    import { base } from '$app/paths';
</script>

<svelte:head>
    <title>Stránka nenalezena | Bazar</title>
</svelte:head>

<div class="container">
    <h1>Error {page.status}</h1>
    <img src="{base}/src/media/notfound.gif" alt="notfound">
    <p>Požadovaná stránka nebyla nalezena.</p>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 24pt;
        color: var(--textcolor2)
    }
    .container > img{
        border-radius: 20px;
        margin: 5vh;
    }
</style>