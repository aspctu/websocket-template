let db = require('./db_functions.js')
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());

app.post("/api/start/", (req, res) => {
  let name = req.body.name;
  res.status(200).send(name);
});

module.exports = app;