const express = require("express");
const { DatabaseSync } = require("node:sqlite"); // SQLite is built into Node.js
const app = express();

app.use(express.json()); // read the JSON that the page sends
app.use(express.static("public")); // send the page in the public folder

// The notes live in a database, the file notes.db, so they are still there after a restart
const sqlite = new DatabaseSync("notes.db");
sqlite.exec(
  "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, text TEXT, time TEXT)"
);

// Two helpers, so that each route can run one SQL statement in one line.
// db.all reads rows, and db.run changes rows. Each ? takes the next value after the SQL
const db = {
  all: (sql, ...values) => sqlite.prepare(sql).all(...values),
  run: (sql, ...values) => sqlite.prepare(sql).run(...values),
};

// READ: send back all the notes
app.get("/api/notes", (req, res) => {
  let rows = db.all("SELECT * FROM notes");
  res.json(rows);
});

// CREATE: check the new note, then add it
app.post("/api/notes", (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ error: "A note needs text." });
  }
  const time = new Date().toLocaleString(); // the date and time now
  db.run("INSERT INTO notes (text, time) VALUES (?, ?)", req.body.text, time);
  res.status(201).json({ ok: true });
});

// UPDATE: check the new text, then change the note that has this id
app.put("/api/notes/:id", (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ error: "A note needs text." });
  }
  db.run("UPDATE notes SET text = ? WHERE id = ?", req.body.text, req.params.id);
  res.json({ ok: true });
});

// DELETE: remove the note that has this id
app.delete("/api/notes/:id", (req, res) => {
  db.run("DELETE FROM notes WHERE id = ?", req.params.id);
  res.json({ ok: true });
});

app.listen(3000, () => {
  console.log("Notes app with a database is running. Open http://localhost:3000");
});
