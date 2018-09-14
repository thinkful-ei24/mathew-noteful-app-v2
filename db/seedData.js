'use strict';

const knex = require('../knex');
const fs = require('fs');

module.exports = function(file) {
  //readFileSync only reads the file once since this function will run multiple times
  const sql = fs.readFileSync(file).toString();
  return knex.raw(sql);
};