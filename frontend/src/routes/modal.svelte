<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { auth } from '$stores/auth';

    let { showModal = $bindable(), header, children } = $props();
	let dialog = $state();
    let userId = $state(null);
    let categories = $state([]);

    if ($auth.user) {
        userId = $auth.user.id;
    }

	$effect(() => {
		if (showModal) dialog.showModal();
	});

    let title = $state('');
    let description = $state('');
    let price = $state('');
    let email = $state('');
    let phone = $state('');
    let imagesFile = $state([]);
    let location = $state('');
    let category = $state('');
    let errorMessage = $state('');

    function handleFileChange(e) {
        imagesFile = Array.from(e.target.files);
    }

    async function fetchCategories() {
        try {
            const response = await fetch('http://localhost:3000/api/categories/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const data = await response.json();
            categories = [...data];

            console.log("Fetched categories:", categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } 
    }

    async function createAdvertisement(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('category_id', category);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('location', location);

        for (let i = 0; i < imagesFile.length; i++) {
            formData.append('images', imagesFile[i]);
        }

        if (!userId) {
            formData.append('email', email);
            formData.append('phone', phone);
        }

        try {
            const response = await fetch('http://localhost:3000/api/advertisements/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${$auth.token}`
                },
                body: formData
            });

            const data = await response.json();
            if (!response.ok) {
                errorMessage = data.error || data.errors[0].msg || 'Něco se pokazilo, zkuste to znovu!';
                return;
            }

            dialog.close();
        } catch (error) {
            errorMessage = 'Chyba serveru';
            console.error('Error creating advertisement:', error);
        }
    }

    onMount(() => {
        fetchCategories();
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => { if (e.target === dialog) dialog.close(); }}
>
    <button class="closebtn" autofocus onclick={() => dialog.close()}>Zavřít</button>
    <div class="login-card">
        <h1>Přidat inzerát</h1>
        {#if errorMessage}
            <div class="alert">
                {errorMessage}
            </div>
        {/if}
		<form onsubmit={createAdvertisement}>
            <div class="form-group">
                <input type="text" bind:value={title} id="nazev" class="form-control" placeholder="Název inzerátu" required>
                {#if !userId}
                    <input type="email" bind:value={email} id="email" class="form-control" aria-describedby="emailHelp" placeholder="adresa@seznam.cz" required>
                    <input type="tel" bind:value={phone} id="telefon" class="form-control" placeholder="Telefon" required>
                {/if}
                <input type="number" bind:value={price} id="cena" class="form-control" placeholder="Cena" required>
                
                <select id="category" class="form-control" bind:value={category}>
                    <option value="" disabled selected>Vyberte kategorii</option>
                    {#each categories as category}
                        <option value={category.id}>{category.name}</option>
                    {/each}
                </select>

                <input type="text" bind:value={location} class="form-control" placeholder="Lokace" required>

                <textarea id="description" bind:value={description} class="form-control" placeholder="Popis" required></textarea>

                <label for="fotky">Fotky:</label>
                <input type="file" id="fotky" class="form-control" accept="image/*" onchange={handleFileChange} multiple required>
            </div>
            <div class="btn-group">
                <button class="btn" type="submit">Vytvořit inzerát</button>
            </div>
            <div class="divisor"></div>
        </form>
		<!-- svelte-ignore a11y_autofocus -->
	</div>
</dialog>

<style>
    h1{
        color: var(--white);
    }
    dialog{
        background-color: transparent;
        border: none;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        position: absolute;
        max-width: 50vw;
    }
    dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
    dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
    dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
    .login-card{
        background-color: var(--lightcolor);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        border-radius: 10px;
        max-width: 80vw;
        padding: 1rem;
    }
    form{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    form .form-control{
        width: 100%;
        min-width: 20vw;
        border: 0;
        border-radius: 0.5rem;
        outline: 0;
        line-height: 1.5;
        padding: 5px;
        margin: 5px;
        min-height: 6vh;
    }

    form > .form-group{
        width: 100%;
        padding-top: 2vh;
        color: var(--textcolor);
    }

    .form-group > input{
        width: 100%;
        min-width: 20vw;
        border: 0;
        border-radius: 0.5rem;
        outline: 0;
        line-height: 1.5;
        padding: 5px;
        margin: 5px;
        min-height: 6vh;
    }

    form > .btn-group{
        padding-top:2vh;
        padding-bottom: 4vh;
    }
    .btn-group > .btn{
        border: none;
        background-color: var(--mediumcolor);
        color: var(--white);
        padding: 0.5rem;
        padding-right: 1rem;
        padding-left: 1rem;
        border-radius: 50px;
        cursor: pointer;
    }
    .btn-group > .btn:active{
        scale: 0.95;
    }
    .divisor{
        background-color: var(--white);
        height: 1px;
        width: 100%;
    }
    .closebtn{
        color: var(--white);
        position: absolute;
        right: 0;
        background-color: transparent;
        border: none;
        cursor: pointer;
        padding: 10px;
    }
    .alert{
        background-color: var(--darkcolor);
        color: var(--errorcolor);
        border-radius: 10px;
        padding: 1vh;
    }
</style>