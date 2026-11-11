// The server. Run it with: npm start

const express = require("express");
const app = express();

app.use(express.json()); // read the JSON that the page sends
app.use(express.static("public")); // send the page in the public folder

// The notes live in a plain array, so they are gone when the server stops
let notes = [{ id: 1, text: "Welcome to the notes app" }];

// READ: send back all the notes
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// CREATE: check the new note, then add it
app.post("/api/notes", (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ error: "A note needs text." });
  }
  const note = { id: notes.length + 1, text: req.body.text };
  notes.push(note);
  res.status(201).json(note);
});

app.listen(3000, () => {
  console.log("Notes app is running. Open http://localhost:3000");
});
