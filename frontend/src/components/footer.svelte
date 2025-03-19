<script>
    import { onMount } from 'svelte';

    onMount(() => {
        console.log('Footer component mounted');
    });
</script>

<footer>
    ©2025 | Široký Vojtěch & Hlušička Šimon - Studentský zápočtový projekt | sirokvo1@uhk.cz & hlusisi1@uhk.cz
</footer>    

<style>
    footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        color: black;
        text-align: center;
    }
</style>