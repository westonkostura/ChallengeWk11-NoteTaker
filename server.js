const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3002;

//routes for public folder
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./db/db.json"));
});

//function to create note
function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}

//function to delete note
function deleteNote(id, notesArray) {
  const note = notesArray.filter((note) => note.id !== id);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify({ notes: note }, null, 2)
  );
  return note;
}

app.delete("/api/notes/:id", (req, res) => {
  const note = deleteNote(req.params.id, notes);
  res.json(note);
});

app.post("/api/notes", (req, res) => {
  req.body.id = notes.length.toString();
  const note = createNewNote(req.body, notes);
  res.json(note);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
