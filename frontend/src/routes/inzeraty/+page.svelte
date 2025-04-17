<script>
    import { base } from '$app/paths';
</script>

<main>
    <div class="container">
        <div class="cardholder">
            <div class="card" id="card">
                <img src="{base}/media/placeholder.webp" alt="placehodlertext" style="width:100%">
                <h1 class="nazev">Nadpis</h1>
                <p class="cena">Cena</p>
                <p class="popis">Popis</p>
                <button class="detail">Detail</button>
            </div>
            <div class="card" id="card">
                <img src="{base}/media/placeholder.webp" alt="placehodlertext" style="width:100%">
                <h1 class="nazev">Nadpis</h1>
                <p class="cena">Cena</p>
                <p class="popis">Popis</p>
                <button class="detail">Detail</button>
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
        margin-top: 50px;
    }
    .card{
        display: flex;
        flex-direction: column;
        background-color: var(--white);
        color: var(--textcolor2);
        max-width: 40vh;
        border-radius: 10px;
        margin: 5px;
        text-align: center;
    }
    .card:hover{
        box-shadow: 0 0 10px gray;
        transition: 200ms ease-in-out;
    }
    .card > button {
        border: none;
        outline: 0;
        padding: 12px;
        color: white;
        background-color: #000;
        text-align: center;
        cursor: pointer;
        width: 100%;
        font-size: 18px;
    }

</style>