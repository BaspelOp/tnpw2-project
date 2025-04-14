# TNPW2 Project - Bazar náhradních dílů
Jednoduchý web využívající technologie Svelte, Node.JS. Web byl vytvořen v rámci předmětu TNPW2.
## How to use it
**To start use command:**
> docker compose up

**To terminate and remove docker use:**
>CTRL + C and docker compose down -v

**How to create .env file in backend/ :**

Create new file named .env 

Paste:
- DB_HOST=db
- DB_USER=root
- DB_NAME=bazar
- DB_PORT=3306
- JWT_SECRET=5f2d5a87d24d6d22b22c4529d89320f89cd4be189d2983df8baf4e38bb15c9a2 | This secret is for testing purpose only