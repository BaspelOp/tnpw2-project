<script>
    import { base } from '$app/paths';
    import Starrating from '../routes/starrating.svelte';
</script>

<main>
    <div class="container">
        <div class="cardholder">
            <Starrating></Starrating> <!--zde odstranit-->
            <div class="card">
                <p>Motory</p>
                <img src="{base}/media/engine.svg" alt="Motor">
            </div>
            <div class="card">
                <p>Převodovky</p>
                <img src="{base}/media/transmission.svg" alt="Převodovka">
            </div>
            <div class="card">
                <p>Budíky</p>
                <img src="{base}/media/dashboard.svg" alt="Tachometr">
            </div>
            <div class="card">
                <p>Elektronika</p>
                <img src="{base}/media/battery.svg" alt="Akumulátor">
            </div>
        </div>
    </div>
</main>

<style>
    .cardholder {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
        gap: 2rem;
    }

    .card {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #fff;
        color: var(--textcolor2);
        height: 200px;
        width: 200px;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        transition: box-shadow 200ms ease-in-out, transform 200ms;
        cursor: pointer;
    }

    .card:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.16);
        transform: translateY(-4px) scale(1.04);
    }

    img{
        padding: 1rem;
        overflow: hidden;
        width: 75%;
        height: 75%;
    }

    @media (max-width: 600px) {
        .cardholder {
            flex-direction: column;
            align-items: center;
            padding: 1rem 0.5rem;
        }
        .card {
            width: 90vw;
            height: 120px;
        }
    }
</style>