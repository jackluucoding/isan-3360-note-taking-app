// The page's JavaScript. It runs in the browser.

const form = document.getElementById("note-form");
const input = document.getElementById("note-text");
const list = document.getElementById("note-list");

// READ: get the notes from the server, and show one list item per note
async function loadNotes() {
  const response = await fetch("/api/notes");
  const notes = await response.json();
  list.innerHTML = "";
  notes.forEach(function (note) {
    const li = document.createElement("li");
    li.textContent = note.text;
    list.appendChild(li);
  });
}

// CREATE: send the new note to the server, then show the list again
async function addNote(event) {
  event.preventDefault(); // stay on this page
  await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input.value }),
  });
  input.value = "";
  loadNotes();
}

form.addEventListener("submit", addNote);
loadNotes();
