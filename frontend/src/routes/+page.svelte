<script>
    import { base } from '$app/paths';
</script>

<main>
    <div class="container">
        <div class="cardholder">
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
    .cardholder{
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        width: 100%;
        margin: 50px;
    }

    .card{
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #ffffff;
        color: var(--textcolor2);
        height: 20vh;
        width: 20vh;
        border-radius: 10px;
        margin: 5px;
    }

    .card:hover{
        box-shadow: 0 0 10px gray;
        transition: 200ms ease-in-out;
    }

    img{
        padding: 1rem;
        overflow: hidden;
        width: 75%;
        height: 75%;
    }
</style>