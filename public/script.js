// The parts of the page that this script reads or changes
const form = document.getElementById("note-form");
const formTitle = document.getElementById("form-title");
const textInput = document.getElementById("note-text");
const saveButton = document.getElementById("save");
const clearButton = document.getElementById("clear");
const message = document.getElementById("message");
const lastRequest = document.getElementById("last-request");
const count = document.getElementById("count");
const list = document.getElementById("note-list");

let editing = null; // the note in the form while you edit it, or null for a new note

// READ: get the notes from the server, and show one card per note
async function loadNotes() {
  const response = await fetch("/api/notes");
  const notes = await response.json();
  count.textContent = `Notes: ${notes.length}`;
  list.innerHTML = "";
  notes.forEach(function (note) {
    showNote(note);
  });
}

// Make one element, fill its text, and attach it to a card: create, fill, attach
function addPart(card, tag, words) {
  const part = document.createElement(tag);
  part.textContent = words;
  card.appendChild(part);
  return part;
}

// Show one note as a card in the list, with its two buttons
function showNote(note) {
  const card = document.createElement("li");
  addPart(card, "p", note.text);
  addPart(card, "small", note.time);

  const editButton = addPart(card, "button", "Edit");
  editButton.addEventListener("click", function () {
    startEdit(note);
  });
  const deleteButton = addPart(card, "button", "Delete");
  deleteButton.addEventListener("click", function () {
    deleteNote(note);
  });

  list.appendChild(card);
}

// The form does two jobs: it adds a new note, or it saves the note you are editing
function saveNote(event) {
  event.preventDefault(); // stay on this page
  if (editing === null) {
    addNote();
  } else {
    updateNote();
  }
}

// CREATE: send the new note to the server, then show the list again
async function addNote() {
  const response = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: textInput.value }),
  });
  showRequest("POST /api/notes", response);
  await finishForm(response);
  loadNotes();
}

// UPDATE: send the changed note to the server, then show the list again
async function updateNote() {
  const address = "/api/notes/" + editing.id;
  const response = await fetch(address, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: textInput.value }),
  });
  showRequest("PUT " + address, response);
  await finishForm(response);
  loadNotes();
}

// After Add or Save: empty the form, or show the server's reason for saying no
async function finishForm(response) {
  if (response.ok) {
    clearForm();
  } else {
    const problem = await response.json();
    message.textContent = problem.error;
  }
}

// EDIT: put the note's text in the form, so that you can change it
function startEdit(note) {
  editing = note;
  formTitle.textContent = "Edit Note";
  textInput.value = note.text;
  saveButton.textContent = "Save";
  message.textContent = "";
}

// Empty the form, and go back to adding new notes
function clearForm() {
  editing = null;
  formTitle.textContent = "New Note";
  textInput.value = "";
  saveButton.textContent = "Add";
  message.textContent = "";
}

// DELETE: ask the server to remove the note, then show the list again
async function deleteNote(note) {
  const address = "/api/notes/" + note.id;
  const response = await fetch(address, { method: "DELETE" });
  showRequest("DELETE " + address, response);
  loadNotes();
}

// Show the last request that changed the notes, and the status code of its answer
function showRequest(request, response) {
  lastRequest.textContent = `Last request: ${request}, status ${response.status}`;
}

form.addEventListener("submit", saveNote);
clearButton.addEventListener("click", clearForm);
loadNotes();
