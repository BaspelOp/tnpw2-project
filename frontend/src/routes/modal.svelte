<script>
	let { showModal = $bindable(), header, children } = $props();

	let dialog = $state(); // HTMLDialogElement

	$effect(() => {
		if (showModal) dialog.showModal();
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
		<form method="POST">
            <div class="form-group">
                <input type="text" id="nazev" class="form-control" placeholder="Název inzerátu" required>
                <input type="email" id="email" class="form-control" aria-describedby="emailHelp" placeholder="adresa@seznam.cz" required>
                <input type="tel" id="telefon" class="form-control" placeholder="Telefon" required>
                <input type="n" id="cena" class="form-control" placeholder="Cena" required>
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

    form > .form-group{
        width: 100%;
        padding-top: 2vh;
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
</style>