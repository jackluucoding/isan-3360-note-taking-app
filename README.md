# ISAN 3360 Note-Taking App

A small note-taking app for ISAN 3360, Web Design and Development. It has one web page, one server and two routes.

It uses only what the course has covered: HTML, CSS, JavaScript, `fetch`, JSON, Node.js, npm and Express. Everything is free. You need no account, no database and no key.

## What You Need

- **Node.js**, the free program that runs JavaScript outside the browser. Download the version marked **LTS** from [nodejs.org](https://nodejs.org) and accept the defaults. npm is installed with it.
- **Git**, from the GitHub workshop. If you do not have Git, click the green **Code** button on this page, choose **Download ZIP**, and unzip the folder.

To check that Node.js is ready, open a terminal (PowerShell on Windows, Terminal on a Mac) and type:

```
node --version
```

You should see a version number, such as `v24.11.0`.

## Run the App

Type these four commands in the terminal, one line at a time.

```
git clone https://github.com/jackluucoding/isan-3360-note-taking-app.git
cd isan-3360-note-taking-app
npm install
npm start
```

Then open <http://localhost:3000> in your browser. To stop the server, click the terminal and press **Ctrl+C**.

| Command | What it does |
|---|---|
| `git clone ...` | Downloads a copy of this repository to your computer |
| `cd isan-3360-note-taking-app` | Moves the terminal into the new folder |
| `npm install` | Reads `package.json` and downloads Express into a `node_modules` folder |
| `npm start` | Runs `node app.js`, which starts the server |

`localhost` means this computer, and `3000` is the port, a door number where the server waits. Only you can reach it.

## What Each File Does

| File | Where it runs | What it does |
|---|---|---|
| `package.json` | read by npm | Lists what the project needs (Express) and what `npm start` runs |
| `app.js` | on the server, in Node.js | Holds the notes and answers two kinds of request |
| `public/index.html` | in the browser | The page: a form and an empty list |
| `public/styles.css` | in the browser | The look of the page |
| `public/script.js` | in the browser | Gets the notes from the server, and sends new ones with `fetch` |

The server has two routes.

| Request | What the server does | Answer |
|---|---|---|
| `GET /api/notes` | Reads the list of notes | `200` and the notes as JSON |
| `POST /api/notes` | Checks the new note, then adds it | `201` and the new note, or `400` if the note has no text |

## Try These

1. **Add a note.** Type a note and click **Add**. It appears in the list.
2. **Watch the requests.** Open DevTools (press F12, or right-click the page and choose Inspect) and choose the **Network** tab. Add another note. You see a `POST` with status `201`, then a `GET` with status `200`.
3. **Send an empty note.** Click **Add** with nothing in the box. Nothing is added. In the Network tab, the `POST` shows `400`, because the server checks the note first.
4. **Read the raw data.** Open <http://localhost:3000/api/notes>. You see the notes as JSON, the same data that `script.js` receives.
5. **Ask for something that is not there.** Open <http://localhost:3000/api/desserts>. Express answers `404`, because no route has that address.
6. **Restart the server.** Press **Ctrl+C**, run `npm start` again, and reload the page. Your new notes are gone. They lived in an array in the server's memory. A database fixes that.

## If Something Goes Wrong

| What you see | What to do |
|---|---|
| `node` or `npm` is "not recognized" or "command not found" | Install Node.js, then close the terminal and open a new one |
| `Cannot find module 'express'` | Run `npm install` in this folder |
| `address already in use :::3000` | Another server is using port 3000. Go to its terminal and press Ctrl+C |
| The page does not load | Check that the terminal still says "Notes app is running" |
