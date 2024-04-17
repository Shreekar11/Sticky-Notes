# Stick Notes

Sticky Notes is a web application that allows `users` to create and manage sticky notes, and collaborate with other `users`.

# Description

In this application `users` can create, edit and delete their notes. Also `users` have ability to set the privacy of their notes to `public` or `private`. Users can also view other usres notes which are `public`.
The application also consists of `admin` role based, where the `admin` can add, edit, and delete `users` notes. `admin` has ability to view all notes, manage role change, `admin` can promote other `users` to `admin`.

# View website

Here is the deployed website : [Deployed Link](https://sticky-notes-liart.vercel.app/)

# Installation

To install and run this project locally, add the following commands in your terminal, follow these steps:

1. Clone the repository from GitHub:

   ```bash
   `git clone https://github.com/Shreekar11/Sticky-Notes.git`

   ```

2. Navigate into the project directory:

```bash
   `cd Sticky-Notes`
```

3. Install `dependencies` for the frontend (assuming you have `Node.js` and `npm` installed):

```bash
   `cd client`
   `npm install`
```

4. Install `dependencies` for the backend (assuming you have `Node.js` and `npm` installed):

```bash
   `cd server`
   `npm install`
```

5. Create a .env file in the `client` folder and add backend `api endpoint`:

   `NEXT_PUBLIC_BASEURL`=`http://localhost:5000` (for local server)

   `NEXT_PUBLIC_BASEURL`=`https://sticky-notes-9hjs.onrender.com` (for deployed server)


6. Create a .env file in the `server` folder and connect the `postgresql` credentials:

   `PORT`=`5000`
   `HOST`=`ep-misty-darkness-a4sisp1p-pooler.us-east-1.aws.neon.tech`
   `USER`=`default`
   `PASSWORD`=`8har4fbuynAd`
   `DB`=`verceldb`

7. Start the frontend and backend servers:

   client: `npm run dev`
   server: `npm run dev`

8. Open your browser and navigate to `http://localhost:3000` to view the application.

9. Here is the `DB` diagram of the application :

![db](https://github.com/Shreekar11/Sticky-Notes/assets/123613407/59aaee76-78d2-4586-8441-81850340be49)

