// Dependencies

const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require(`${__dirname}/db/db.json`);
var uniqueID = require('uniqid');
const { parse } = require('path');

// Sets up the Express App

const app = express();
var PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));


// example note:
// {
// "title": "Test Title",
// "text": "Test text"
// }

// Routes

// Basic route that sends the user first to the AJAX Page
app.get('/', (req, res) => res.sendFile(path.join(`${__dirname}/public`, 'index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(`${__dirname}/public`, 'notes.html')));

// Displays all notes
app.get('/api/notes', (req, res) => res.json(notes));


app.post('/api/notes', (req, res) => {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    const newNotes = req.body;
      // use uniqid() to generate random id to note.
    newNotes.id = uniqueID();
    console.log(newNotes);
    // Checks to see if new note is object or string
    let newObj = parseData(newNotes);
    // checks to see if original notes from db.json file is object or string.
    let obj = parseData(notes);
    console.log(obj);
    // let obj = JSON.parse(notes);

    // Since the data found in db.json is now parsed into workable array, we push new note into array
    obj.push(newObj);
    // old db.json is overwritten with new file containing new array.
    fs.writeFile(`${__dirname}/db/db.json`, JSON.stringify(obj, null, '\t'), (err) =>
    err ? console.error(err) : console.log('New Note logged!')
    );

    res.json(newNotes);
  });

// This route will listen for the DELETE req from web page front end. It will read the id passed in and compare it to what is in the db.json file. It remove the object in the array that matches it.
// Then the json file is rewritten using file system.
  app.delete('/api/notes/:id', (req, res) => {
    let deleteID = req.params.id;

    // Runs logic to compare id from req to what is in the db.json. Splices result that matches req.
    let oldNotes = parseData(notes);
    for (var i=0; i < oldNotes.length; i++){
        if (oldNotes[i].id == deleteID){
            oldNotes.splice(i, 1);
            fs.writeFile(`${__dirname}/db/db.json`, JSON.stringify(oldNotes, null, '\t'), (err) =>
            err ? console.error(err) : console.log('Note Deleted')
            );
        }else{
            // DO NOTHING
        }

    }
   
  });


// Checks to see if data received is either string or object.
  function parseData(data) {
    if (!data) return {};
    if (typeof data === 'object') return data;
    if (typeof data === 'string') return JSON.parse(data);

    return {};
}




// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
