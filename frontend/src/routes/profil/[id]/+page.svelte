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
            <img class="profilepicture" src="{base}/media/placeholder.webp" alt="Profilová fotka">
            {#if userId != $auth.user.id}
                <button class="message">Napsat hodnocení</button>
            {/if}
            {#if $userData.reviews && $userData.reviews.length > 0}
                <div class="review-info">
                    <p class="review-count">Počet hodnocení: {($userData.reviews || []).length}</p>
                    <p class="review-rating">Průměrné hodnocení: {($userData.reviews || []).reduce((acc, review) => acc + review.rating, 0) / ($userData.reviews || []).length} ⭐</p>
                </div>
            {/if}
        </div>
        <div class="profileinfocard">
            <table>
                <thead>
                    <tr>
                        <th scope="row">Jmeno:</th>
                        <td>{$userData.username}</td>
                    </tr>
                    <tr>
                        <th scope="row">E-mail:</th>
                        <td>{$userData.email}</td>
                    </tr>
                    <tr>
                        <th scope="row">Tel. Číslo:</th>
                        <td>{$userData.phone ? formatPhoneNumber($userData.phone) : '-'}</td>
                    </tr>
                    <tr>
                        <th scope="row">Datum založení:</th>
                        <td>{(new Date($userData.created_at)).toLocaleDateString("cs-CZ")}</td>
                    </tr>
                </thead>
            </table>
        </div>
    </div>

    <div class="reviews">
        <h1>Hodnocení</h1>
        <div class="reviewsholder">
            {#if Array.isArray($userData.reviews) && $userData.reviews.length === 0}
                <p>Žádná hodnocení</p>
            {:else}
                {#each $userData.reviews as review}
                    <div class="reviewcard">
                        <h1>{review.title}</h1>
                        <p>{review.rating} ⭐</p>
                        <p>{review.description}</p>
                    </div>
                {/each}
            {/if}
        </div>
    </div>

    <div class="advertisements">
        <h1>Inzeráty</h1>
        <div class="advertisementholder">
            {#if Array.isArray($userData.advertisements) && $userData.advertisements.length === 0}
                <p>Žádné inzeráty</p>
            {:else}
                {#each $userData.advertisements as advertisement}
                    <div class="advertisementcard">
                        <img src="http://localhost:3000/{advertisement.images[0]}" alt="placehodlertext" style="width:100%">
                        <h1>{advertisement.title}</h1>
                        <p class="price">{advertisement.price} Kč</p>
                        <p>{advertisement.description}</p>
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
    .container {
        width: 70%;
        margin: 2rem auto;
        padding: 1rem;
        display: grid;
        grid-template-columns: 2fr 1fr; 
        grid-template-rows: auto auto;
        gap: 2rem;
    }

    .profilecardholder {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
        display: flex;
        gap: 2rem;
        align-items: flex-start;
        flex-wrap: wrap;
    }

    .profilecard {
        min-width: 220px;
        max-width: 300px;
        margin: 0;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--white);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    }

    .profilepicture {
        width: 120px;
        height: 120px;
        object-fit: cover;
        border-radius: 50%;
        margin-bottom: 1rem;
        border: 2px solid var(--mediumcolor);
    }

    .profilecard > button {
        margin-top: 1rem;
        border: none;
        outline: 0;
        padding: 10px 0;
        color: var(--white);
        background-color: var(--mediumcolor);
        text-align: center;
        cursor: pointer;
        width: 100%;
        font-size: 1rem;
        border-radius: 8px;
    }
    .profilecard > button:hover {
        background-color: var(--darkcolor);
    }

    .profileinfocard {
        flex: 1 1 300px;
        margin: 0;
        padding: 1.5rem;
        background-color: var(--white);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    }

    .profileinfocard table {
        width: 100%;
        border-collapse: collapse;
    }
    .profileinfocard th {
        text-align: left;
        padding-right: 1rem;
        color: var(--mediumcolor);
        font-weight: bold;
        width: 150px;
    }
    .profileinfocard td {
        padding-bottom: 0.5rem;
        color: var(--textcolor2);
    }

    .advertisements {
        grid-column: 1 / 2;
        grid-row: 2 / 3;
        background-color: var(--lightcolor);
        border-radius: 12px;
        padding: 2rem 1.5rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        min-width: 350px;
        max-width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        overflow: hidden;
    }

    .reviews {
        grid-column: 2 / 3;
        grid-row: 1 / 3;
        background-color: var(--mediumcolor);
        border-radius: 12px;
        padding: 2rem 1.5rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        color: var(--textcolor2);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        order: 1; 
    }

    .advertisements h1, .reviews h1 {
        color: var(--textcolor);
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }

    .advertisementholder {
        display: flex;
        gap: 1.5rem;
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        padding-bottom: 1rem;
    }

    .reviewsholder {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
        width: 100%;
        margin-top: 1rem;
        justify-content: center;
    }

    .advertisementcard, .reviewcard {
        background-color: var(--white);
        color: var(--textcolor2);
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        padding: 1rem;
        min-width: 200px;
        max-width: 260px;
        flex: 1 1 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: box-shadow 0.2s, transform 0.2s;
        text-align: center;
    }

    .price {
        font-size: 1.1rem;
        font-weight: bold;
        color: var(--mediumcolor);
    }

    .advertisementcard > h1, .reviewcard > h1 {
        color: var(--textcolor2);
    }

    .advertisementcard:hover, .reviewcard:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.16);
        transform: translateY(-4px) scale(1.04);
    }

    .advertisementcard img {
        width: 100%;
        height: 120px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 0.5rem;
    }

    .advertisementcard > button {
        margin-top: 0.5rem;
        border: none;
        outline: 0;
        padding: 10px 0;
        color: var(--white);
        background-color: var(--mediumcolor);
        text-align: center;
        cursor: pointer;
        width: 100%;
        font-size: 1rem;
        border-radius: 8px;
    }
    .advertisementcard > button:hover {
        background-color: var(--darkcolor);
    }

    @media (max-width: 900px) {
        .container {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
        }
        .profilecardholder {
            flex-direction: column;
            align-items: stretch;
            grid-column: 1 / 2;
            grid-row: 1 / 2;
        }
        .profilecard, .profileinfocard {
            max-width: 100%;
        }
        .advertisementholder, .reviewsholder {
            flex-direction: column;
            align-items: stretch;
        }
        .reviews {
            grid-column: 1 / 2;
            grid-row: 3 / 4;
            order: 0; 
        }
        .advertisements {
            grid-column: 1 / 2;
            grid-row: 2 / 3;
            max-width: 100%;
        }
    }

    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-track {
        background: #e0e0e0;
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
        background: var(--mediumcolor);
        border-radius: 4px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--darkcolor);
    }
</style>