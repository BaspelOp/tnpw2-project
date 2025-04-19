<script>
    import { base } from '$app/paths';
    import { onMount } from 'svelte';
    import { auth } from '$stores/auth';
    import { writable } from 'svelte/store';
    import { page } from '$app/stores';
    import { onDestroy } from 'svelte';

    let userData = writable({});
    let userId;
    const unsubscribe = page.subscribe(($page) => {
        userId = $page.params.id;
    });

    console.log("User ID from URL:", userId);

    function formatPhoneNumber(phone) {
        const digits = phone.replace(/\D/g, '');
        const raw = digits.startsWith('420') && digits.length > 9 ? digits.slice(3) : digits;
        if (raw.length !== 9) return phone;
        return `+420 ${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
    }

    async function fetchUserData() {
        try {
            const response = await fetch('http://localhost:3000/api/users/getById', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: userId })
            });

            if (!response.ok) {
                return;
            }

            const data = await response.json();
            
            console.log("User data", data);

            userData.update((prevData) => ({
                ...prevData,
                username: data.username,
                email: data.email,
                phone: data.phone,
                created_at: data.created_at
            }));
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchUserReviews() {
        try {
            const response = await fetch('http://localhost:3000/api/reviews/getById', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: userId })
            });

            if (!response.ok) {
                return;
            }

            const data = await response.json();

            console.log("User reviews", data);

            userData.update((prevData) => ({
                ...prevData,
                reviews: data
            }));
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchUserAdvertisements() {
        try {
            const response = await fetch('http://localhost:3000/api/advertisements/getById', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: userId })
            });

            if (!response.ok) {
                return;
            }

            const data = await response.json();

            console.log("User advertisements", data);

            userData.update((prevData) => ({
                ...prevData,
                advertisements: data
            }));   
        } catch (err) {
            console.error(err);
        }
    }

    onMount(() => {
        if (userId) {
            fetchUserData();
            fetchUserReviews();
            fetchUserAdvertisements();

            onDestroy(() => {
                unsubscribe();
            });
        }
        
    });
</script>

{#await $userData}
    <p>Načítání profilu...</p>
{:then}
<div class="container">
    <div class="profilecardholder">
        <div class="profilecard">
            <img class="profilepicture" src="{base}/media/placeholder.webp">
            <button class="message">Napsat Zprávu</button>
        </div>
        <div class="profileinfocard">
            <table>
                <thead>
                    <tr>
                        <th scope="row">Jmeno</th>
                        <td>{$userData.username}</td>
                    </tr>
                    <tr>
                        <th scope="row">E-mail</th>
                        <td>{$userData.email}</td>
                    </tr>
                    <tr>
                        <th scope="row">Tel. Číslo</th>
                        <td>{$userData.phone ? formatPhoneNumber($userData.phone) : '-'}</td>
                    </tr>
                    <tr>
                        <th scope="row">Datum založení</th>
                        <td>{(new Date($userData.created_at)).toLocaleDateString("cs-CZ")}</td>
                    </tr>
                </thead>
            </table>
        </div>
    </div>

    <!-- TODO: Tady nějak vykreslit review, dal jsem tomu nějaké základni styles, ale není to optimalizované úplně pro stránku -->
    <div class="reviews">
        <h1>Hodnocení</h1>
        <div class="reviewsholder">
            {#if Array.isArray($userData.reviews) && $userData.reviews.length === 0}
                <p>Žádná hodnocení</p>
            {:else}
                {#each $userData.reviews as review}
                    <div class="reviewcard">
                        <h1 class="nazev">{review.title}</h1>
                        <p class="cena">{review.rating} ⭐</p>
                        <p class="popis">{review.description}</p>
                    </div>
                {/each}
            {/if}
        </div>
    </div>

    <!-- TODO: Tady nějak vykreslit inzeráty, dal jsem tomu nějaké základni styles, ale není to optimalizované úplně pro stránku -->
    <div class="advertisements">
        <h1>Inzeráty</h1>
        <div class="advertisementholder">
            {#if Array.isArray($userData.advertisements) && $userData.advertisements.length === 0}
                <p>Žádné inzeráty</p>
            {:else}
                {#each $userData.advertisements as advertisement}
                    <div class="advertisementcard">
                        <img src="http://localhost:3000/{advertisement.images[0]}" alt="placehodlertext" style="width:100%">
                        <h1 class="nazev">{advertisement.title}</h1>
                        <p class="cena">{advertisement.price} Kč</p>
                        <p class="popis">{advertisement.description}</p>
                        <button class="detail">Detail</button>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</div>
{:catch error}
    <p>Chyba při načítání profilu</p>
{/await}

<style>
    .container{
        
    }
    .profilecardholder{
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        align-items: flex-start;
    }
    .profilecard{
        max-width: 25%; 
        margin: 10px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        background-color: var(--white);
    }
    .profileinfocard{
        width: 100%; 
        margin: 10px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        background-color: var(--white);
    }
    .profilepicture{
        max-width: 25vh;
        max-height: 25vh;
        border-radius: 1000px;
    }

    .profilecard > button {
        border: none;
        outline: 0;
        padding: 12px;
        color: var(--white);
        background-color: var(--mediumcolor);
        text-align: center;
        cursor: pointer;
        width: 100%;
        font-size: 18px;
    }

    .profilecard > button:hover{
        background-color: var(--darkcolor);
        transition: all 200ms ease-in-out;
        cursor: pointer;
    }

    .profileinfocard > table{
        width: 100%;
        border-collapse: collapse;
    }

    .profileinfocard > table > thead{
        background-color: var(--mediumcolor);
        color: var(--white);
    }

    .profileinfocard > table > thead > tr{
        border-bottom: 1px solid var(--white);
    }

    .profileinfocard > table > thead > tr > th, td{
        padding: 10px;
        text-align: left;
    }
    
    .advertisements {
        margin: 50px;
        background-color: var(--lightcolor);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 8vh;
        border-radius: 10px;
    }

    .advertisementholder{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        width: 100%;
        margin-top: 50px;
    }

    .advertisementcard{
        display: flex;
        flex-direction: column;
        background-color: var(--white);
        color: var(--textcolor2);
        max-width: 40vh;
        border-radius: 10px;
        margin: 5px;
        text-align: center;
    }

    .advertisementcard:hover{
        box-shadow: 0 0 10px gray;
        transition: 200ms ease-in-out;
    }

    .advertisementcard > button {
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

    .reviews{
        margin: 50px;
        background-color: var(--lightcolor);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 8vh;
        border-radius: 10px;
    }

    .reviewsholder{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        width: 100%;
        margin-top: 50px;
    }

    .reviewcard{
        display: flex;
        flex-direction: column;
        background-color: var(--white);
        color: var(--textcolor2);
        max-width: 40vh;
        border-radius: 10px;
        margin: 5px;
        text-align: center;
    }

    .reviewcard:hover{
        box-shadow: 0 0 10px gray;
        transition: 200ms ease-in-out;
    }
</style>