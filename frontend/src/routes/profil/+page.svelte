<script>
    import { base } from '$app/paths';
</script>

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
                        <td>Jmeno</td>
                    </tr>
                    <tr>
                        <th scope="row">E-mail</th>
                        <td>Email</td>
                    </tr>
                    <tr>
                        <th scope="row">Adresa</th>
                        <td>Adresa</td>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</div>

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
    table {
        color: black;
        border-collapse: collapse;
    }
    tr { 
        border: solid;
        border-width: 1px 0;
    }
    tr:first-child {
        border-top: none;
    }
    tr:last-child {
        border-bottom: none;
    }
    th{
        text-align: left;
    }
</style>