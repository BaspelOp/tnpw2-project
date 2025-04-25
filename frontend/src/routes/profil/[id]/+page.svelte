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

    let showModal = false;
    let rating = 0;
    let hoverRating = 0;
    let comment = '';
    let activeTab = 'advertisements';

    function setRating(value) {
        rating = value;
    }

    function setHover(value) {
        hoverRating = value;
    }

    function resetHover() {
        hoverRating = 0;
    }

    let showModalAd = false;
    let selectedAd = null;
    let mainImageIndex = 0;

    function openModal(ad) {
        selectedAd = ad;
        showModalAd = true;
    }

    function closeModal() {
        showModalAd = false;
        selectedAd = null;
    }

    function selectImage(index) {
        mainImageIndex = index;
    }

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
                reviews: data.reviews,
                average_rating: data.average_rating
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

    async function fetchUserFavorites() {
        try {
            const response = await fetch('http://localhost:3000/api/favorites/getById', {
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

            console.log("User favorites", data);

            userData.update((prevData) => ({
                ...prevData,
                favorites: data
            }));
        } catch (err) {
            console.error(err);
        }
    }

    function writeReview(userId, reviewerId) {
        showModal = true;
    }

    async function sendReview() {
        try {
            const response = await fetch('http://localhost:3000/api/reviews/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${$auth.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    reviewed_id: userId,
                    rating,
                    comment
                })
            });

            if (!response.ok) {
                return;
            }

            const data = await response.json();

            console.log("Review sent", data);

            showModal = false;
            fetchUserReviews();
        } catch (err) {
            console.error(err);
        }
    }

    async function deleteAd(advertisement_id) {
        try {
            const response = await fetch('http://localhost:3000/api/advertisements/delete', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${$auth.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ advertisement_id })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete advertisement');
            }

            dataStore.update((ads) => ads.filter(ad => ad.id !== advertisement_id));
            closeModal();
        } catch (error) {
            console.error('Error deleting ad:', error);
        }
    }

    onMount(() => {
        if (userId) {
            fetchUserData();
            fetchUserReviews();
            fetchUserAdvertisements();
            fetchUserFavorites();

            onDestroy(() => {
                unsubscribe();
            });
        }
        
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
{#if showModalAd && selectedAd}
    <div class="modal-backdrop" on:click={closeModal}>
        <div class="modal-ad" on:click|stopPropagation>
            <button class="modal-close" on:click={closeModal}>&times;</button>
            <div class="modal-gallery">
                <img
                    class="modal-main-image"
                    src="http://localhost:3000/{selectedAd.images[mainImageIndex]}"
                    alt="detail obrázek"
                />
                <div class="modal-thumbnails">
                    {#each selectedAd.images as img, idx}
                        <img
                            class:active-thumb={mainImageIndex === idx}
                            src="http://localhost:3000/{img}"
                            alt="náhled"
                            on:click={() => selectImage(idx)}
                        />
                    {/each}
                </div>
            </div>
            <div class="modal-body">
                <h2>{selectedAd.title}</h2>
                <p class="cena">{selectedAd.price} Kč</p>
                <p class="popis">{selectedAd.description}</p>
                <div class="modal-info">
                    <span><b>Lokalita:</b> {selectedAd.location}</span>
                    <span><b>Kategorie:</b> {selectedAd.category_name}</span>
                    <span><b>Přidáno:</b> {(new Date(selectedAd.created_at)).toLocaleDateString("cs-CZ")}</span>
                </div>
                <!-- <button class="favorite-btn" on:click={() => toggleFavorite(selectedAd.id)}>
                    {#if isFavorite(selectedAd.id)}
                        <span title="Odebrat z oblíbených">★</span>
                    {:else}
                        <span title="Přidat do oblíbených">☆</span>
                    {/if}
                </button> -->
                {#if $auth.user && $auth.user.id}
                    <button class="profile-btn" on:click={() => deleteAd(selectedAd.id)}>
                        Smazat inzerát
                    </button>
                {/if}
            </div>
        </div>
    </div>
{/if}


<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_mouse_events_have_key_events -->
{#if showModal}
    <div class="modal-background" on:click={showModal = false}>
        <div class="modal-review" on:click|stopPropagation>
            <button class="modal-close" on:click={() => showModal = false}>&times;</button>
            <h2>Napsat hodnocení</h2>
            <div class="stars">
                {#each [1, 2, 3, 4, 5] as num (num)}
                  <span
                    class="star {hoverRating >= num || (!hoverRating && rating >= num) ? 'filled' : ''}"
                    on:click={() => setRating(num)}
                    on:mouseover={() => setHover(num)}
                    on:mouseout={resetHover}
                  >&#9733;</span> 
                {/each}
            </div>      
            <form on:submit={sendReview}>
                <textarea bind:value={comment} placeholder="Popis hodnocení" required></textarea>
                <button type="submit">Odeslat</button>
            </form>
        </div>
    </div>
{/if}

{#await $userData}
    <p>Načítání profilu...</p>
{:then}
    <div class="container">
        <div class="profilecardholder">
            <div class="profilecard">
                <img class="profilepicture" src="{base}/media/placeholder.webp" alt="Profilová fotka">
                {#if $auth.user && $auth.user.id != userId}
                    <button on:click={() => writeReview(userId, $auth.user.id)} class="message">Napsat hodnocení</button>
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
                {#each $userData.reviews as review}
                    <div class="reviewcard">
                        <p>
                            {#each Array(review.rating) as _, i}
                                <span>⭐</span>
                            {/each}
                            <span>({review.rating})</span>
                        </p>
                        <p>{review.comment}</p>
                        <p><small>{review.reviewer_username}</small></p>
                    </div>
                {/each}
            </div>
        </div>

        <div class="advertisements">
            <h1>
                <button
                    class:active={activeTab === 'advertisements'}
                    on:click={() => activeTab = 'advertisements'}>
                    Inzeráty
                </button>
                <button
                    class:active={activeTab === 'favorites'}
                    on:click={() => activeTab = 'favorites'}>
                    Oblíbené
                </button>
            </h1>
            <div class="advertisementholder">
                {#if activeTab === 'advertisements'}
                    {#if Array.isArray($userData.advertisements) && $userData.advertisements.length === 0}
                        <p>Žádné inzeráty</p>
                    {:else}
                        {#each $userData.advertisements as advertisement}
                            <div class="advertisementcard">
                                <img src="http://localhost:3000/{advertisement.images[0]}" alt="placehodlertext" style="width:100%">
                                <h1>{advertisement.title}</h1>
                                <p class="price">{advertisement.price} Kč</p>
                                <p>{advertisement.description}</p>
                                <button class="detail" on:click={() => openModal(advertisement)}>Detail</button>
                            </div>
                        {/each}
                    {/if}
                {:else if activeTab === 'favorites'}
                    {#if Array.isArray($userData.favorites) && $userData.favorites.length === 0}
                        <p>Žádné oblíbené inzeráty</p>
                    {:else}
                        {#each $userData.favorites as favorite}
                            <div class="advertisementcard">
                                <img src="http://localhost:3000/{advertisement.images[0]}" alt="placehodlertext" style="width:100%">
                                <h1>{advertisement.title}</h1>
                                <p class="price">{advertisement.price} Kč</p>
                                <p>{advertisement.description}</p>
                                <button class="detail">Detail</button>
                            </div>
                        {/each}
                    {/if}
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

    .advertisements h1 {
        color: var(--textcolor);
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }

    .advertisements h1 button {
        background-color: var(--mediumcolor);
        color: var(--white);
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        margin-left: 1rem;
    }

    .advertisements h1 button:hover {
        background-color: var(--darkcolor);
    }

    .advertisements h1 button.active {
        background-color: var(--darkcolor);
    }

    .advertisements h1 button.active:hover {
        background-color: var(--mediumcolor);
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

    .advertisementcard {
        display: flex;
        flex-direction: column;
        background-color: var(--textcolor);
        color: var(--textcolor2);
        width: 100%;
        min-width: 200px;
        max-width: 260px;
        height: 420px;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(60,60,60,0.12);
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
        text-align: center;
        position: relative;
    }

    .reviewcard {
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

    .advertisementcard > h1 {
        color: var(--textcolor2);
    }

    .advertisementcard:hover, .reviewcard:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.16);
        transform: translateY(-4px) scale(1.04);
    }

    .reviewcard span {
        color: gold;
        font-size: 1.2em;
    }

    .advertisementcard img {
        width: 100%;
        height: 120px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 0.5rem;
    }

    .advertisementcard > button {
        position: absolute;
        bottom: 10px;
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

    .modal-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-review {
        background-color: var(--lightcolor);
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        position: relative;
        width: 90%;
        max-width: 500px;
    }

    .modal-close {
        position: absolute;
        top: 0;
        right: 0.5rem;
        background: transparent;
        border: none;
        font-size: 2rem;
        color: #888;
        cursor: pointer;
        transition: color 0.2s;
    }
    .modal-close:hover {
        color: red;
    }

    .modal-review h2 {
        margin-bottom: 1rem;
        color: var(--textcolor);
    }

    .modal-review textarea {
        width: 100%;
        height: 100px;
        padding: 0.5rem;
        border-radius: 8px;
        border: 1px solid var(--mediumcolor);
        margin-bottom: 1rem;
        resize: none;
    }

    .modal-review button[type="submit"] {
        background-color: var(--mediumcolor);
        color: var(--white);
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
    }

    .modal-review button[type="submit"]:hover {
        background-color: var(--darkcolor);
    }

    .modal-backdrop {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.4);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .modal-ad {
        background: var(--lightcolor, #fff);
        border-radius: 16px;
        padding: 2rem 1.2rem 1.2rem 1.2rem;
        max-width: 800px;
        width: 95vw;
        box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        animation: modalIn 0.2s;
    }
    @keyframes modalIn {
        from { transform: scale(0.9); opacity: 0; }
        to   { transform: scale(1); opacity: 1; }
    }
    .modal-close {
        position: absolute;
        top: 0;
        right: 0.5rem;
        background: transparent;
        border: none;
        font-size: 2rem;
        color: #888;
        cursor: pointer;
        transition: color 0.2s;
    }
    .modal-close:hover {
        color: red;
    }

    .modal-gallery {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 1rem;
    }
    .modal-main-image {
        width: 100%;
        max-height: 400px;
        object-fit: cover;
        border-radius: 10px;
        margin-bottom: 0.5rem;
        background: #eee;
    }
    .modal-thumbnails {
        display: flex;
        gap: 0.4rem;
        margin-bottom: 0.5rem;
        justify-content: center;
        width: 100%;
    }
    .modal-thumbnails img {
        width: 48px;
        height: 48px;
        object-fit: cover;
        border-radius: 6px;
        border: 2px solid transparent;
        cursor: pointer;
        transition: border 0.2s;
        background: #eee;
    }
    .modal-thumbnails img.active-thumb {
        border: 2px solid var(--mediumcolor);
    }

    .modal-body {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .modal-body h2 {
        font-size: 1.3rem;
        margin: 0 0 0.5rem 0;
        width: 100%;
    }
    .modal-body .cena {
        font-size: 1.2rem;
        font-weight: bold;
        color: var(--mediumcolor);
        margin-bottom: 0.5rem;
    }
    .modal-body .popis {
        font-size: 1rem;
        margin-bottom: 0.7rem;
        color: var(--fontcolor);
        white-space: pre-line;
    }
    .modal-info {
        font-size: 0.95rem;
        color: var(--fontcolor);
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }
    .profile-btn {
        background: var(--mediumcolor);
        color: #fff;
        border: none;
        padding: 0.6rem 1.2rem;
        border-radius: 50px;
        cursor: pointer;
        font-size: 1rem;
        align-self: stretch;
        margin-top: 0.3rem;
    }
    .profile-btn:hover {
        background: var(--darkcolor);
    }

    .star {
      font-size: 2em;
      color: lightgray;
      cursor: pointer;
    }
  
    .star.filled {
      color: gold;
    }
  
    .stars {
      display: inline-flex;
    }

    .review-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 1rem;
        color: var(--textcolor2);
    }

    .review-info p {
        margin: 0.2rem 0;
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