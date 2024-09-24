const express = require("express");
const app = express();
const { Musician } = require("../models/index")
const { db } = require("../db/connection")

const port = 3000;

//TODO: Create a GET /musicians route to return all musicians 
app.get('/musicians', async (req, res) => {
  try {
    const musicians = await Musician.findAll();
    res.json(musicians);
  } catch (error) {
    console.error('Error fetching musicians:', error);
    res.status(500).json({ error: 'Failed to fetch musicians' });
  }
});

// GET /musicians/:id
app.get('/musicians/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const musician = await Musician.findByPk(id);
    if (musician) {
      res.json(musician);
    } else {
      res.status(404).json({ error: 'Musician not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = app;