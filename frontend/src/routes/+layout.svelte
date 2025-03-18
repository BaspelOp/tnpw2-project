<script>
    import { base } from '$app/paths';
    import Navbar from '../components/navbar.svelte';
    import Footer from '../components/footer.svelte';
</script>

<main>
    <Navbar />
    <div class="container">
        <slot></slot>
    </div>
    <Footer />
</main>

<style>
    
</style>