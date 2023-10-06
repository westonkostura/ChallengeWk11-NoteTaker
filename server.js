const express = require('express');
const routes = require('./routes/routes');
const sequelize = require('./config/connection');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// turn on routes
app.use(routes);

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
  const notes = await getNotes();
  const newNotes = notes.filter((note) => note.id !== id);
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


// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
});
