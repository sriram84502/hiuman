# How to Deploy HIUMAN to Render

Since HIUMAN uses PHP, Node.js, and MySQL, we use **Render.com** which supports all these natively (unlike Vercel).

## Prerequisites
1.  **GitHub Account**: Push this code to a GitHub Repository.
2.  **Render Account**: Sign up at [render.com](https://render.com).
3.  **MySQL Database**: You need a hosted MySQL database (Free tier: Aiven.io, Clever-Cloud, or similar).
    *   *Render doesn't offer free MySQL, only PostgreSQL.*

## Steps

1.  **Push to GitHub**:
    Commit all files and push to a new repo.

2.  **Import to Render**:
    *   Go to Dashboard -> "Blueprints" -> "New Blueprint Instance".
    *   Connect your GitHub Repo.
    *   Render will read `render.yaml`.

3.  **Configure Environment**:
    Render will ask for Environment Variables for the **Backend (`hiuman-api`)**:
    *   `DB_HOST`: (Enter the Host from your Aiven Dashboard)
    *   `DB_NAME`: defaultdb
    *   `DB_USER`: avnadmin
    *   `DB_PASS`: (Enter your Aiven Password)
    *   `DB_PORT`: 15140

    *(Check your Aiven dashboard for these values)*

4.  **Deploy**:
    Click "Apply". Render will build:
    *   Backend (Docker)
    *   Frontend (Static Site)
    *   Signal Server (Node)

## That's it!
Your app will be live at the URL Render provides for `hiuman-web`.
