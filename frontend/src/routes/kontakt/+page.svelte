<script>
    
</script>

<main>
    <div class="container">
        <div class="card">
            <h1>Kontakt</h1>
            <hr>
            <h2>Autodily.cz a.s.</h2>
            <p>Email: <a href="mailto:technickapodpora@autodily.cz">technickapodpora@autodily.cz</a></p>
            <p>Tel.číslo podpory: <a href="tel:123 456 789">+420 123 456 789</a></p>
            <hr>
        </div>
        <div class="card">
            <h2>Kde nás najdete:</h2>
            <iframe class="map" style="border:none" src="https://mapy.cz/s/debekulonu" width=100% height="280" frameborder="0"></iframe>
        </div>
    </div>
    
</main>

<style>
    .container{
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }
    hr{
        color:var(--textcolor);
        width: 100%;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .map{
        margin-top:20px;
        border-radius: 20px;
    }
    .card{
        width: 50%;
        margin: 50px;
        background-color: var(--lightcolor);
        display: flex;
        flex-direction: column;
        padding: 8vh;
        border-radius: 10px;
        min-width: 25vw;
    }
    a{
        text-decoration: underline;
        color: var(--textcolor);
    }
    @media only screen and (max-width:768px){
        .container{
            width: 100%;
        }
        .card{
            border-radius: 0;
            margin:0;
        }
    }
</style>