'use strict';

const knex = require('../knex');

//Get all notes, but include a search term if needed
// Returns an array of objects
//DONE!!!!
let searchTerm;
knex
  .select('notes.id', 'title', 'content')
  .from('notes')
  .modify(queryBuilder => {
    if (searchTerm) {
      queryBuilder.where('title', 'like', `%${searchTerm}%`);
    }
  })
  .orderBy('notes.id')
  .then(results => {
    console.log(JSON.stringify(results, null, 2));
    //res.json(results);  
  })
  .catch(err => {
    console.error(err);
  });

//Get Note By Id
// DONE
const idToSearchFor = 1005;
knex
  .select('notes.id', 'title', 'content')
  .from('notes')
  .modify(queryBuilder => {
    if (idToSearchFor) {
      queryBuilder.where('id', idToSearchFor);
    }
  })
  .then(results => {
    console.log(JSON.stringify(results[0], null, 2));
    //res.json(results[0]);
  })
  .catch(err => {
    console.error(err);
  });

// Update NoteById -> accepts an ID and an Object
// returns the updated note as an object
const newObject = {'title': 'This is a new thing', 'content': 'This is new content'};

knex
  .from('notes')
  .modify( queryBuilder => {
    if (idToSearchFor && newObject) {
      queryBuilder.where('id', idToSearchFor);
      queryBuilder.update(newObject);
    }
  })
  .then(results => {
    console.log(JSON.stringify(results, null, 2));
    //res.json(results);
  })
  .catch(err => {
    console.error(err);
  });

//Create a Note: accepts object, inserts in database, returns the new note including id as an object
knex
  .into('notes')
  .modify( queryBuilder => {
    if (newObject) {
      queryBuilder.insert(newObject);
    }
  })
  .returning(['id', 'title', 'content'])
  .then(results => {
    console.log(JSON.stringify(results, null, 2));
    //res.json(results);
  })
  .catch(err => {
    console.error(err);
  });

const idToDelete = 1001;
//Delete a Note: accepts ID, deletes in database, returns nothing
knex
  .from('notes')
  .modify( queryBuilder => {
    if (idToDelete) {
      queryBuilder.del();
      queryBuilder.where({'id':idToDelete})
    }
  })
  .then(results => {
    console.log(JSON.stringify(results, null, 2));
  //res.json(results);
  })
  .catch(err => {
    console.error(err);
  });


//SHOW ALL NOTES
knex('notes')
  .select()
  .then(console.log)