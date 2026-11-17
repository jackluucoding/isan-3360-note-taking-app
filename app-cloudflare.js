import express from "express"; // import does the same job as require in app-db.js
import { env } from "cloudflare:workers"; // env.DB is this app's database at Cloudflare
import { httpServerHandler } from "cloudflare:node"; // lets an Express app run at Cloudflare

const app = express();

app.use(express.json()); // read the JSON that the page sends
// Cloudflare sends the page in the public folder by itself. The file wrangler.jsonc says so

// The notes live in D1, Cloudflare's SQLite database, so they are still there tomorrow.
// Two helpers, so that each route can run one SQL statement in one line.
// db.all reads rows, and db.run changes rows. Each ? takes the next value after the SQL.
// The database is on another computer, so each route waits for it with await
const db = {
  all: async (sql, ...values) => {
    const answer = await env.DB.prepare(sql).bind(...values).all();
    return answer.results;
  },
  run: (sql, ...values) => env.DB.prepare(sql).bind(...values).run(),
};

// Make the notes table the first time a request for notes arrives
let tableReady = false;
app.use(async (req, res, next) => {
  if (!tableReady) {
    await db.run(
      "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, text TEXT, time TEXT)"
    );
    tableReady = true;
  }
  next(); // go on to the routes below
});

// Find the note that has this id. The answer is undefined when no row has it
async function findNote(id) {
  const rows = await db.all("SELECT * FROM notes WHERE id = ?", id);
  return rows[0];
}

// READ: send back all the notes
app.get("/api/notes", async (req, res) => {
  let rows = await db.all("SELECT * FROM notes");
  res.json(rows);
});

// CREATE: check the new note, then add it
app.post("/api/notes", async (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ error: "A note needs text." });
  }
  // the date and time now in Texas, because Cloudflare's own clock uses world time
  const time = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });
  await db.run("INSERT INTO notes (text, time) VALUES (?, ?)", req.body.text, time);
  res.status(201).json({ ok: true });
});

// UPDATE: find the note, check the new text, then change the note
app.put("/api/notes/:id", async (req, res) => {
  const note = await findNote(req.params.id);
  if (!note) {
    return res.status(404).json({ error: "No note has that id." });
  }
  if (!req.body.text) {
    return res.status(400).json({ error: "A note needs text." });
  }
  await db.run("UPDATE notes SET text = ? WHERE id = ?", req.body.text, req.params.id);
  res.json({ ok: true });
});

// DELETE: find the note, then remove it
app.delete("/api/notes/:id", async (req, res) => {
  const note = await findNote(req.params.id);
  if (!note) {
    return res.status(404).json({ error: "No note has that id." });
  }
  await db.run("DELETE FROM notes WHERE id = ?", req.params.id);
  res.json({ ok: true });
});

app.listen(3000);
export default httpServerHandler({ port: 3000 }); // hand the app to Cloudflare
