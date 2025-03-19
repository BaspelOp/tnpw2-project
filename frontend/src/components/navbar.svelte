<script>
    import { onMount } from 'svelte';
    import { base } from '$app/paths';

    onMount(() => {
        console.log('Navbar component mounted');
    });
</script>

<div class="container">
    <nav class="navbar">
        <a href="{base}/login">Login</a>
    </nav>
</div>

<style>
    
</style>