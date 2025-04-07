<script>
    import { base } from '$app/paths';
    import { login } from '$stores/auth';

    let username = '';
    let phone = '';
    let email = '';
    let password = '';
    let errorMessage = '';

    async function handleRegister() {
        try {
            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, phone, email, password })
            })

            const data = await response.json();
            if (!response.ok) {
                errorMessage = data.error || 'Něco se pokazilo, zkuste to znovu';
                return;
            }

            alert("Registrace proběhla úspěšně, nyní se můžete přihlásit");
            window.location.href = '/login';
        } catch (err) {
            errorMessage = "Chyba serveru";
            console.error(err);
        }
    }
</script>

<div class="container">
    <div class="register-card">
        {#if errorMessage}
            <div class="alert">
                {errorMessage}
            </div>
        {/if}
        <h1>Registrace</h1>
        <form onsubmit={handleRegister}>
            <div class="form-group">
                <input type="text" bind:value={username} class="form-control" aria-describedby="emailHelp" placeholder="Jméno" required>
            </div>
            <div class="form-group">
                <input type="tel" bind:value={phone} class="form-control" aria-describedby="emailHelp" placeholder="Telefon" required>
            </div>
            <div class="form-group">
                <input type="email" bind:value={email} class="form-control" aria-describedby="emailHelp" placeholder="adresa@seznam.cz" required>
            </div>
            <div class="form-group">
                <input type="password" bind:value={password} class="form-control" placeholder="Heslo" required>
            </div>
            <div class="btn-group">
                <button class="btn" type="submit">Registrovat se</button>
            </div>
            <div class="divisor"></div>
            <a class="login-btn" href="{base}/login">Už jste se zaregistrovali? Přihlašte se</a>
        </form>
    </div>
</div>

<style>
        .register-card{
        background-color: var(--lightcolor);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 8vh;
        border-radius: 10px;
        min-width: 25vw;
    }

    @media only screen and (max-width:768px){
        .container{
            width: 100%;
        }
        .register-card{
            border-radius: 0;
        }
        form{
            min-width: 100%;
        }
    }

    form{
        width: 50vw;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    form > .form-group{
        width: 100%;
        padding-top: 2vh
    }

    .form-group > input{
        width: 100%;
        min-width: 20vw;
        border: 0;
        border-radius: 0.5rem;
        outline: 0;
        line-height: 1.5;
        padding: 5px;
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
    }
    .btn-group > .btn:active{
        scale: 0.95;
    }

    .alert{
        background-color: var(--darkcolor);
        color: var(--errorcolor);
        border-radius: 10px;
        padding: 1vh;
    }

    .alert{
        background-color: var(--darkcolor);
        color: var(--errorcolor);
        border-radius: 10px;
        padding: 1vh;
    }
    .login-btn{
        color: var(--white);
        text-decoration: underline;
        margin-top: 5vh;
    }
    .divisor{
        background-color: var(--white);
        height: 1px;
        width: 100%;
    }
</style>