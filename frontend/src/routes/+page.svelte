<script>
    import { base } from '$app/paths';
</script>

<main>
    <div class="container">
        <div class="cardholder">
            <div class="card">
                <h2>Motory</h2>
                <img src="{base}/media/engine.svg" alt="Motor">
            </div>
            <div class="card">
                <h2>Převodovky</h2>
                <img src="{base}/media/transmission.svg" alt="Převodovka">
            </div>
            <div class="card">
                <h2>Budíky</h2>
                <img src="{base}/media/dashboard.svg" alt="Tachometr">
            </div>
            <div class="card">
                <h2>Elektronika</h2>
                <img src="{base}/media/battery.svg" alt="Akumulátor">
            </div>
        </div>
    </div>
</main>

<style>
    .cardholder{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        width: 100%;
    }

    .card{
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #ffffff;
        color: var(--textcolor2);
        height: 25vh;
        width: 25vh;
        border-radius: 10px;
        margin: 2vw;
    }

    .card:hover{
        box-shadow: 0 0 10px gray;
        transition: 200ms ease-in-out;
    }

    img{
        padding: 1rem;
        overflow: hidden;
        width: 100%;
        height: 100%;
    }
</style>