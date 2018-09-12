'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();
const knex = require('../knex');

router.get('/', (req, res, next) => {
  knex.select('id', 'name')
    .from('folders')
    .then( results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex
    .first('id', 'name')
    .from('folders')
    .modify(queryBuilder => {
      if (id) {
        queryBuilder.where('id', id);
      }
    })
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
      
    })
    .catch(err => {
      next(err);
    });

});

router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  const updateObj = {};
  const updateableFields = ['name'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });
  console.log(updateObj)

  /***** Never trust users - validate input *****/
  if (!updateObj.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex
    .from('folders')
    .modify( queryBuilder => {
      if (id && updateObj) {
        queryBuilder.where('id', id);
        queryBuilder.update(updateObj);
      }
    })
    .returning(['id', 'name'])
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const id = req.params.id;
  const name = req.body['name'];

  const newItem = { name };

  console.log(newItem)
  /***** Never trust users - validate input *****/
  if (!newItem.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex
    .into('folders')
    .modify( queryBuilder => {
      if (newItem) {
        queryBuilder.insert(newItem);
      }
    })
    //.returning(['id', 'name'])
    .then(item => {
      res.location(`http://${req.headers.host}/folders/${item.id}`).status(201).json(item);
    })
    .catch(err => {
      next(err);
    });
});

// Delete an item
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  console.log(id)

  knex
    .from('folders')
    .modify( queryBuilder => {
      if (id) {
        console.log(id)
        queryBuilder.where({'id':id});
        queryBuilder.del();
      }
    })
    .then( () => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});


module.exports = router;