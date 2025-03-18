<script>
    import { page } from '$app/stores';
</script>

<svelte:head>
    <title>Error | Bazar</title>
</svelte:head>

<div class="container">
    <h1>{$page.error.message}</h1>
</div>

<style>
    .container {
        font-family: 'Poppins', sans-serif;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: black;
        font-weight: bold;
        font-size: 2rem;
    }
</style>