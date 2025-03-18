<script>
    import { base } from '$app/paths';
    import Navbar from '../components/navbar.svelte';
</script>

<main>
    <Navbar />
    <div class="container">
        <slot></slot>
    </div>
</main>

<style>
    
</style>