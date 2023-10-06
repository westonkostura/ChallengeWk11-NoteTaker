const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;


//routes for public folder
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// function for getting notes
async function getNotes() {
  const notes = await fs.readFileSync('./db/db.json', 'utf8');
  return JSON.parse(notes);
}

function saveNotes(notes) {
  fs.writeFileSync('./db/db.json', JSON.stringify(notes));
}

async function deleteNote(id, notes) {
  const notes1 = await getNotes();
  const newNotes = notes1.filter((note) => note.id !== id);
  saveNotes(newNotes);
}

//Post route for notes api
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuid.v4();
  const notes = getNotes();
  notes.push(newNote);
  saveNotes(notes);
  res.json(newNote);
});

// GET Route for notes api
app.get('/api/notes', (req, res) => {
  res.json(getNotes());
});

//delete route for notes api
app.delete('/api/notes/:id', (req, res) => {
  deleteNote();
  res.json(getNotes());
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/notes.html'));
});

app.post('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
    });



app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
