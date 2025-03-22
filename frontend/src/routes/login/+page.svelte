<script>

</script>

<div class="container">
    <div class="login-card">
        <h1>Login</h1>
            <form>
                <div class="form-group">
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="adresa@seznam.cz">
                </div>
                <div class="form-group">
                    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Heslo">
                </div>
                <div class="btn-group">
                    <button class="btn">Přihlásit se</button>
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