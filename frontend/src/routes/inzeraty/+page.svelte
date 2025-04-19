<script>
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { onMount } from 'svelte';

    let advertisements = [];

    async function fetchAdvertisements() {
        try {
            const response = await fetch('http://localhost:3000/api/advertisements/getAll', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch advertisements');
            }

            const data = await response.json();
            console.log("Fetched advertisements:", data);
            advertisements = data;
        } catch (error) {
            console.error('Error fetching advertisements:', error);
        }
    }

    onMount(() => {
        fetchAdvertisements();
    });

</script>

<main>
    <div class="container">
        <div class="cardholder">
            {#each advertisements as advertisement}
                <div class="card" id="card">
                    <img src="http://localhost:3000/{advertisement.images[0]}" alt="placehodlertext" style="width:100%">
                    <h1 class="nazev">{advertisement.title}</h1>
                    <p class="cena">{advertisement.price} Kč</p>
                    <p class="popis">{advertisement.description}</p>
                    <!-- TODO: Tohle je zatím click na detail jen pro debug, jinak to bude odkazovat na nějaký ten modal, aby byl vidět celý inzerát i s images apod... -->
                    <button onclick={() => goto(`/profil/${advertisement.user_id}`)} class="detail">Detail</button>
                </div>
                
            {/each}
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