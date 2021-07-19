// Dependencies

const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require(`${__dirname}/db/db.json`);
var uniqueID = require('uniqid');
const { parse } = require('path');

// Sets up the Express App

const app = express();
const PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// example note:
// {
// "title": "Test Title",
// "text": "Test text"
// }

// Routes

// Basic route that sends the user first to the AJAX Page
app.get('/', (req, res) => res.sendFile(path.join(`${__dirname}/public`, '/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(`${__dirname}/public`, '/notes.html')));

// Displays all notes
app.get('/api/notes', (req, res) => res.json(notes));


app.post('/api/notes', (req, res) => {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    const newNotes = req.body;
  
    newNotes.id = uniqueID();
    console.log(newNotes);
    let newObj = parseData(newNotes);
    let obj = parseData(notes);
    console.log(obj);
    // let obj = JSON.parse(notes);
    obj.push(newObj);
    fs.writeFile(`${__dirname}/db/db.json`, JSON.stringify(obj, null, '\t'), (err) =>
    err ? console.error(err) : console.log('New Note logged!')
    );
    // notes.push(newNotes);

    // use uniqid() to generate random id to note.


    res.json(newNotes);
  });






  function parseData(data) {
    if (!data) return {};
    if (typeof data === 'object') return data;
    if (typeof data === 'string') return JSON.parse(data);

    return {};
}




// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
