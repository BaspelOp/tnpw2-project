<script>
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { onMount } from 'svelte';
    import { dataStore } from '$stores/dataStore';
    import { auth } from '$stores/auth';
    import { searchQuery } from '$stores/searchStore';

    $: advertisements = $dataStore;
    $: filteredAds = advertisements.filter(ad => {
        return (
            !$searchQuery ||
            ad.title.toLowerCase().includes($searchQuery.toLowerCase()) ||
            ad.description.toLowerCase().includes($searchQuery.toLowerCase()) ||
            ad.category_name.toLowerCase().includes($searchQuery.toLowerCase()) ||
            ad.location.toLowerCase().includes($searchQuery.toLowerCase())
        );
    });

    let showModal = false;
    let selectedAd = null;
    let mainImageIndex = 0;

    function openModal(ad) {
        selectedAd = ad;
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        selectedAd = null;
    }

    function selectImage(index) {
        mainImageIndex = index;
    }

    function goToProfile(userId) {
        goto(`/profil/${userId}`);
        closeModal();
    }

    async function toggleFavorite(advertisement_id) {
        try {
            const response = await fetch('http://localhost:3000/api/favorites/add', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${$auth.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ advertisement_id })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to toggle favorite');
            }

            dataStore.update((ads) => ads.map(ad => ad.id === advertisement_id ? { ...ad, is_favorite: !ad.is_favorite } : ad));
        } catch (error) {
            console.error('Error toggling favorite:', error);
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
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
{#if showModal && selectedAd}
    <div class="modal-backdrop" on:click={closeModal}>
        <div class="modal" on:click|stopPropagation>
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
                {#if $auth.user && $auth.user.id != selectedAd.user_id || $auth.user == null}
                    <button class="profile-btn" on:click={() => goToProfile(selectedAd.user_id)}>
                        Přejít na profil uživatele
                    </button>
                {:else}
                    <button class="profile-btn" on:click={() => deleteAd(selectedAd.id)}>
                        Smazat inzerát
                    </button>
                {/if}
            </div>
        </div>
    </div>
{/if}

<main>
    <div class="container">
        <div class="cardholder">
            {#each filteredAds as advertisement}
                <div class="card" id="card">
                    <div class="image-wrapper">
                        <img src="http://localhost:3000/{advertisement.images[mainImageIndex]}" alt="placehodlertext" />
                    </div>
                    <div class="content">
                        <h1 class="nazev">{advertisement.title}</h1>
                        <p class="cena">{advertisement.price} Kč</p>
                        <p class="popis">{advertisement.description}</p>
                    </div>
                    <button on:click={() => openModal(advertisement)} class="detail">Detail</button>
                </div>
            {/each}
        </div>
    </div>
</main>

<style>
    .container {
        width: 100%;
        padding: 2rem 0;
        overflow-y: auto;
    }

    .cardholder {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 2rem;
        width: 100%;
        justify-items: center;
    }

    .card {
        display: flex;
        flex-direction: column;
        background-color: var(--lightcolor);
        color: var(--textcolor);
        width: 100%;
        max-width: 320px;
        height: 420px;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(60,60,60,0.12);
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
        text-align: center;
        overflow: hidden;
        position: relative;
    }

    .card:hover {
        transform: scale(1.04);
        box-shadow: 0 8px 32px rgba(60,60,60,0.18);
    }

    .image-wrapper {
        width: 100%;
        height: 170px;
        overflow: hidden;
        flex-shrink: 0;
        background: #eee;
    }

    .card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }

    .content {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding: 1rem 0.5rem 0.5rem 0.5rem;
        min-height: 0;
    }

    .content .cena {
        font-size: 1.2rem;
        font-weight: bold;
        color: var(--mediumcolor);
        margin: 0.5rem 0;
        width: 100%;
    }

    .content .popis {
        font-size: 0.9rem;
        margin: 0.5rem 0;
        width: 100%;
    }

    .card h1 {
        font-size: 1.2rem;
        margin: 0.5rem 0 0.2rem 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
    }

    .card p {
        margin: 0.2rem 0;
        font-size: 1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
    }

    .card .detail {
        background-color: var(--mediumcolor);
        color: var(--textcolor);
        border: none;
        padding: 0.6rem 1.2rem;
        border-radius: 50px;
        cursor: pointer;
        font-size: 1rem;
        width: 50%;
        margin: 1rem auto;
        text-align: center;
        transition: background-color 0.3s;
    }

    .card .detail:hover {
        background-color: var(--darkcolor);
    }

    /* Modal */
    .modal-backdrop {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.4);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .modal {
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
</style>