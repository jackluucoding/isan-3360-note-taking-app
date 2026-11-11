const express = require("express");
const app = express();

app.use(express.json()); // read the JSON that the page sends
app.use(express.static("public")); // send the page in the public folder

// Print one line in the terminal for each request for notes, such as: GET /api/notes
app.use((req, res, next) => {
  console.log(req.method + " " + req.url);
  next(); // go on to the routes below
});

// The notes live in a plain array, so they are gone when the server stops
let notes = [
  {
    id: 1,
    text: "Welcome, Bobcat. Add, edit and delete your notes.",
    time: new Date().toLocaleString(), // the date and time now
  },
];
let nextId = 2; // the id that the next new note gets

// Find the note that has this id. The answer is null when no note has it
function findNote(id) {
  let found = null;
  notes.forEach(function (note) {
    // the id in the address arrives as text, so Number turns it into a number
    if (note.id === Number(id)) {
      found = note;
    }
  });
  return found;
}

// READ: send back all the notes
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// CREATE: check the new note, then add it
app.post("/api/notes", (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ error: "A note needs text." });
  }
  const note = {
    id: nextId,
    text: req.body.text,
    time: new Date().toLocaleString(), // the date and time now
  };
  nextId = nextId + 1;
  notes.push(note);
  res.status(201).json(note);
});

// UPDATE: find the note, check the new text, then change the note
app.put("/api/notes/:id", (req, res) => {
  const note = findNote(req.params.id);
  if (!note) {
    return res.status(404).json({ error: "No note has that id." });
  }
  if (!req.body.text) {
    return res.status(400).json({ error: "A note needs text." });
  }
  note.text = req.body.text;
  res.json(note);
});

// DELETE: find the note, then keep every note except that one
app.delete("/api/notes/:id", (req, res) => {
  const note = findNote(req.params.id);
  if (!note) {
    return res.status(404).json({ error: "No note has that id." });
  }
  const kept = [];
  notes.forEach(function (other) {
    if (other !== note) {
      kept.push(other);
    }
  });
  notes = kept;
  res.json({ ok: true });
});

app.listen(3000, () => {
  console.log("Notes app is running. Open http://localhost:3000");
});
