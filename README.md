# ISAN 3360 Note-Taking App

Bobcat Notes is a small note-taking app for ISAN 3360, Web Design and Development, at Texas State University. It has one web page, one server and four routes. You can add a note, edit it and delete it.

It uses only what the course has covered: HTML, CSS, JavaScript, `fetch`, JSON, Node.js, npm and Express. Everything is free. You need no account and no key, and you have no database to install.

## What You Need

- **Node.js**, the free program that runs JavaScript outside the browser. Download the version marked **LTS** from [nodejs.org](https://nodejs.org) and accept the defaults. npm is installed with it.
- **Git**, from the GitHub workshop. If you do not have Git, click the green **Code** button on this page, choose **Download ZIP**, and unzip the folder.

To check that Node.js is ready, open a terminal (PowerShell on Windows, Terminal on a Mac) and type:

```
node --version
```

You should see a version number, such as `v24.11.0`.

## Run the App

First make a **fork** (your own copy of this app in your GitHub account, which you can change).

1. Sign in to GitHub on this page.
2. Select **Fork**, near the top right of the page.
3. Keep the boxes as they are and select **Create fork**. GitHub opens your fork, github.com/your-name/isan-3360-note-taking-app.
4. Type these four commands in the terminal, one line at a time. Put your GitHub user name in place of `your-name`. You can also copy and paste them: on GitHub, each gray box of commands has a copy button in its top right corner.

```
git clone https://github.com/your-name/isan-3360-note-taking-app.git
cd isan-3360-note-taking-app
npm install
npm start
```

Then open <http://localhost:3000> in your browser. To stop the server, click the terminal and press **Ctrl+C**.

| Command | What it does |
|---|---|
| `git clone ...` | Downloads a copy of your fork to your computer |
| `cd isan-3360-note-taking-app` | Moves the terminal into the new folder |
| `npm install` | Reads `package.json` and downloads Express into a `node_modules` folder |
| `npm start` | Runs `node app.js`, which starts the server |

`localhost` means this computer, and `3000` is the port, a door number where the server waits. Only you can reach it.

## What the Page Does

| Part of the page | What it does | The request it sends |
|---|---|---|
| The **Note** box and the **Add** button | Adds a new note | `POST /api/notes` |
| The count and the list of notes | Shows every note, with its date and time | `GET /api/notes` |
| The **Edit** button on a note | Puts the note's text in the box. **Add** becomes **Save**, and **Save** changes the note | `PUT /api/notes/2` |
| The **Delete** button on a note | Removes the note | `DELETE /api/notes/2` |
| The **Clear** button | Empties the box, and stops an edit | none |
| The red line under the buttons | Shows the server's reason when it refuses a note | none |
| The **Last request** line | Shows the last request that changed the notes, and its status code | none |

The number at the end of an address, such as `2`, is the note's `id`. It tells the server which note you mean.

## What Each File Does

| File | Where it runs | What it does |
|---|---|---|
| `package.json` | read by npm | Lists what the project needs (Express) and what `npm start` runs |
| `app.js` | on the server, in Node.js | Holds the notes in an array and answers four kinds of request |
| `app-db.js` | on the server, in Node.js | The same four routes, with the notes in a database file, `notes.db` |
| `app-cloudflare.js` | on Cloudflare | The same four routes, with the notes in D1, Cloudflare's database |
| `wrangler.jsonc` | read by Cloudflare | Tells Cloudflare which file to run, where the page is, and that the app needs one database |
| `public/index.html` | in the browser | The page: a form, a count and an empty list |
| `public/styles.css` | in the browser | The look of the page, in the Texas State colors |
| `public/script.js` | in the browser | Gets the notes from the server, and sends each change with `fetch` |

The server has four routes. Together they are the four CRUD actions: create, read, update and delete.

| Request | CRUD action | What `app.js` does | Answer from `app.js` |
|---|---|---|---|
| `GET /api/notes` | Read | Reads the list of notes | `200` and the notes as JSON |
| `POST /api/notes` | Create | Checks the new note, then adds it | `201` and the new note, or `400` if the note has no text |
| `PUT /api/notes/2` | Update | Finds note 2, checks the new text, then changes the note | `200` and the note, `400` if the text is empty, or `404` if no note has that id |
| `DELETE /api/notes/2` | Delete | Finds note 2, then removes it | `200`, or `404` if no note has that id |

The server also prints one line in the terminal for each of these requests, such as `POST /api/notes`. Watch the terminal while you use the page.

## Try These

1. **Add a note.** Type a note and click **Add**. It appears in the list with the date and time. The **Last request** line reads `POST /api/notes, status 201`, and the terminal prints `POST /api/notes`, then `GET /api/notes`.
2. **Send an empty note.** Click **Add** with nothing in the box. Nothing is added. The page shows the server's reason, "A note needs text.", and the status is `400`, because the server checks the note first.
3. **Edit a note.** Click **Edit** on a note. Its text moves into the box, and **Add** becomes **Save**. Change the text and click **Save**. The **Last request** line reads `PUT`, then the address with the note's `id`, and status `200`.
4. **Delete a note.** Click **Delete** on a note. It leaves the list, and the **Last request** line reads `DELETE` and status `200`.
5. **Watch the requests.** Open DevTools (press F12, or right-click the page and choose Inspect) and choose the **Network** tab. Add another note. You see a `POST` with status `201`, then a `GET` with status `200`.
6. **Read the raw data.** Open <http://localhost:3000/api/notes>. You see the notes as JSON, the same data that `script.js` receives.
7. **Ask for something that is not there.** Open <http://localhost:3000/api/desserts>. Express answers `404`, because no route has that address.
8. **Restart the server.** Press **Ctrl+C**, run `npm start` again, and reload the page. Your notes are gone, and the welcome note is back. The notes lived in an array in the server's memory. A database fixes that.

## The Database Version

`app-db.js` is the same server with a database. The notes live in a file named `notes.db`, so they are still there after a restart. The database is **SQLite**, which is built into Node.js, so you install nothing new.

1. Stop the other server first with **Ctrl+C**, because both servers use port 3000.
2. On your fork's GitHub page, select **Sync fork**, then **Update branch**. This copies the newest files from this app into your fork. If there is no **Update branch** button, your fork is already up to date.
3. Type these two commands in the terminal, in the app's folder, one line at a time. You can also copy and paste them.

```
git pull
node app-db.js
```

`git pull` downloads the newest files from GitHub, and `node app-db.js` starts the database version.

Open <http://localhost:3000>. The page is the same page, and only the server changed. The list starts empty, because a new database has no rows.

The four routes do the same jobs. Each line that used the array now runs one SQL statement.

The database version is also shorter. It prints no line in the terminal for each request, and it does not look for the note first, so an address with an `id` that no note has changes no rows and still gets `200`.

| Job | In `app.js`, with the array | In `app-db.js`, with the database |
|---|---|---|
| Read | `res.json(notes)` | `SELECT * FROM notes` |
| Create | `notes.push(note)` | `INSERT INTO notes (text, time) VALUES (?, ?)` |
| Update | `note.text = req.body.text` | `UPDATE notes SET text = ? WHERE id = ?` |
| Delete | keeps every note except one | `DELETE FROM notes WHERE id = ?` |

Each `?` is a blank that the server fills with a value. That keeps the text a visitor types apart from the SQL.

Try these with the database version.

1. **Keep a note.** Add a note. Press **Ctrl+C**, run `node app-db.js` again, and reload the page. The note is still there.
2. **Find the file.** Look in the folder. `notes.db` is the whole database, in one file.
3. **Compare the two servers.** Open `app.js` and `app-db.js` side by side in VS Code, and find the lines in the table above.
4. **Start again with no notes.** Stop the server and delete `notes.db`. The app makes a new, empty file the next time it starts.

## Put the App on Cloudflare

`app-cloudflare.js` is the same server, written for Cloudflare, the host from the lecture on deploying. It has the same four routes and the same four SQL statements. The notes live in **D1**, Cloudflare's database, which uses the SQL of SQLite. After you deploy, anyone with the link can open your notes app.

You need the free Cloudflare account and the GitHub connection from the lecture on deploying.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jackluucoding/isan-3360-note-taking-app)

1. Select the **Deploy to Cloudflare** button above. Sign in to Cloudflare if it asks.
2. On the page **Set up your application**, choose your GitHub name under **Git account**. Type `bobcat-notes` as the **Project name**, because your fork already uses this app's name. Keep the other boxes as they are.
3. Select **Deploy**. Cloudflare copies this repository into your GitHub account, makes the database, `notes-db`, and builds the app. This takes about one minute, and the build log ends with `Success! Build completed.`
4. Open your project in Cloudflare and select **Visit**. Your address ends in `workers.dev`.

Add a note, then open the same address on your phone. The note is there, because it lives in a database on the web.

Anyone with your link can read and change these notes, so write nothing private. To take the app offline, delete the project in Cloudflare.

The two database versions differ in two ways. The database is on another computer, so each route waits for it with `await`. `app-cloudflare.js` also looks for the note first, so an `id` that no note has gets `404`.

| | `app-db.js` | `app-cloudflare.js` |
|---|---|---|
| Runs on | Node.js, on your computer | Cloudflare's computers |
| Database | SQLite, in the file `notes.db` | D1, at Cloudflare |
| The line that reads the notes | `let rows = db.all("SELECT * FROM notes");` | `let rows = await db.all("SELECT * FROM notes");` |
| Address | `localhost:3000` | an address that ends in `workers.dev` |
| Who can open it | only you | anyone with the link |

## If Something Goes Wrong

| What you see | What to do |
|---|---|
| `node` or `npm` is "not recognized" or "command not found" | Install Node.js, then close the terminal and open a new one |
| `Cannot find module 'express'` | Run `npm install` in this folder |
| `address already in use :::3000` | Another server is using port 3000. Go to its terminal and press Ctrl+C |
| The page does not load | Check that the last line in the terminal still ends with "Open http://localhost:3000" |
| You changed `app.js` and nothing is different | Stop the server with Ctrl+C and run `npm start` again. The server reads `app.js` only when it starts |
| The terminal prints `GET /favicon.ico` | Some browsers ask for a small picture for the tab. The app has none, so you can ignore that line |
| `node app-db.js` shows an error that names `node:sqlite` | Your Node.js is too old for the database version. Install the **LTS** version from [nodejs.org](https://nodejs.org), then open a new terminal |
| The terminal prints `ExperimentalWarning` about SQLite | Some versions of Node.js print this line. The app still works |
| `git pull` says that your local changes would be overwritten | You changed a file. Clone the repository again into a new folder, and run `npm install` there |
| On Cloudflare, the **Git account** list is empty | Select **New GitHub connection**, and allow Cloudflare to use your GitHub account |
| On Cloudflare, the project page says **No URLs enabled** right after the deploy | Reload the page, and the address appears |
| Cloudflare does not accept the project name | Type another **Project name**. Each name can be used only once in your account |
