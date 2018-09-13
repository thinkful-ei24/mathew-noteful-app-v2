'use strict';

function hydrateNotes(input) {
  const hydrated = [], lookup = {};
  
  for (let note of input) {
    if (!lookup[note.id]) {
      lookup[note.id] = note;
      lookup[note.id].tags = [];
      hydrated.push(lookup[note.id]);
    }

    if (note.TagId && note.TagName) {
      console.log('test2')
      lookup[note.id].tags.push({
        id: note.TagId,
        name: note.TagName
      });
    }
    delete lookup[note.id].TagId;
    delete lookup[note.id].TagName;
  }
  return hydrated;
}

module.exports = hydrateNotes;