<script>
    import { base } from '$app/paths';
    import { onMount } from 'svelte';
    import { dataStore } from '$stores/dataStore';
    import { goto } from '$app/navigation';

    export let data;

    onMount(() => {
        dataStore.set(data.initialData);
        console.log("Data loaded:", data.initialData);
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<main>
    <div class="container">
        <div class="info">
            <h1>Vítejte na AUTODILY.CZ</h1>
            <p>Největší bazar autodílů v ČR</p>
            <p>Vyberte si kategorii autodílu, který hledáte.</p>
            <p>Pokud máte autodíl na prodej, přidejte inzerát.</p>
            <p>Pokud máte dotaz, neváhejte nás kontaktovat.</p>
        </div>
        <div class="cardholder">
            <div class="card" on:click={() => goto('/inzeraty')}>
                <p>Motory</p>
                <img src="{base}/media/engine.svg" alt="Motor">
            </div>
            <div class="card" on:click={() => goto('/inzeraty')}>
                <p>Převodovky</p>
                <img src="{base}/media/transmission.svg" alt="Převodovka">
            </div>
            <div class="card" on:click={() => goto('/inzeraty')}>
                <p>Budíky</p>
                <img src="{base}/media/dashboard.svg" alt="Tachometr">
            </div>
            <div class="card" on:click={() => goto('/inzeraty')}>
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
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        width: 100%;
        max-width: 1200px;
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

    .info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 2rem 1rem;
        color: var(--textcolor);
        background-color: var(--lightcolor);
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        width: 50%;
        margin: 0 auto;
    }
    .info h1 {
        font-size: 2rem;
        margin-bottom: 1rem;
    }
    .info p {
        font-size: 1.2rem;
        margin: 0.5rem 0;
    }

    @media (max-width: 1600px) {
        .info h1 {
            font-size: 2.2rem;
        }
        .info p {
            font-size: 1.3rem;
        }
        .cardholder {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            padding: 2rem 1rem;
        }
        .card {
            width: 30vw;
            height: 200px;
        }
    }

    @media (max-width: 1400px) {
        .info h1 {
            font-size: 2rem;
        }
        .info p {
            font-size: 1.2rem;
        }
        .cardholder {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            padding: 2rem 1rem;
        }
        .card {
            width: 35vw;
            height: 200px;
        }
    }

    @media (max-width: 1200px) {
        .info h1 {
            font-size: 1.8rem;
        }
        .info p {
            font-size: 1.1rem;
        }
        .cardholder {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            padding: 2rem 1rem;
        }
        .card {
            width: 45vw;
            height: 200px;
        }
    }

    @media (max-width: 768px) {
        .info h1 {
            font-size: 1.5rem;
        }
        .info p {
            font-size: 1rem;
        }
        .cardholder {
            flex-direction: column;
            align-items: center;
            padding: 1rem 0.5rem;
        }
        .card {
            width: 90vw;
            height: 150px;
        }
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