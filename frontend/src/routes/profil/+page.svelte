<script>
    import { base } from '$app/paths';
    import { onMount } from 'svelte';
    import { auth } from '$stores/auth';
    import { writable } from 'svelte/store';

    let userId = $auth.user.id;
    let userData = writable({});

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
        fetchUserData();
        fetchUserReviews();
        fetchUserAdvertisements();
    });
</script>

<div class="container">
    <div class="profilecardholder">
        <div class="profilecard">
            <img class="profilepicture" src="{base}/media/placeholder.webp">
            <button class="message">Napsat Zprávu</button>
        </div>
        <div class="profilecard">
            <table>
                <thead>
                    <tr>
                        <th scope="row">Jmeno</th>
                        <td>{$userData.username}</td>
                    </tr>
                    <tr>
                        <th scope="row">E-mail</th>
                        <td>{$userData.email}</td>
                    </tr>
                    <tr>
                        <th scope="row">Tel. Číslo</th>
                        <td>{$userData.phone}</td>
                    </tr>
                    <tr>
                        <th scope="row">Datum založení</th>
                        <td>{(new Date($userData.created_at)).toLocaleDateString("cs-CZ")}</td>
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