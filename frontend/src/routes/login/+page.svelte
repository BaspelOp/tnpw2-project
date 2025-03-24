<script>
    function logIn() {
        fetch('http://localhost:3000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: document.getElementById('exampleInputEmail1').value,
                password: document.getElementById('exampleInputPassword1').value
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.error){
                alert(data.error);
                return;
            }
            window.location.href = '/';
            alert(data.message);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Něco se pokazilo, zkuste to znovu');
        });
    }
</script>

<div class="container">
    <div class="login-card">
        <h1>Login</h1>
        <form onsubmit={logIn}>
            <div class="form-group">
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="adresa@seznam.cz" required>
            </div>
            <div class="form-group">
                <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Heslo" required>
            </div>
            <div class="btn-group">
                <button class="btn" type="submit">Přihlásit se</button>
            </div>
        </form>
    </div>
</div>

<style>
    .login-card{
        background-color: var(--lightcolor);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 8vh;
        border-radius: 10px;
        min-width: 25vw;
    }

    @media only screen and (max-width:768px){
        .container{
            width: 100%;
        }
        .login-card{
            border-radius: 0;
        }
    }

    form{
        min-width: 50vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
    }

    form > .form-group{
        padding:2vh;
    }

    .form-group > input{
        border-color: white;
        border-radius: 0.5rem;
        outline: 0;
        line-height: 1.5;
        padding: 5px;
        min-width: 100%;
    }

    form > .btn-group{
        padding:2vh;
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
</style>