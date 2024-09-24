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

app.post('/musicians', async (req, res) => {
  try {
    const musician = await Musician.create(req.body);
    res.status(201).json(musician);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create musician' });
  }
});

app.put('/musicians/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const musician = await Musician.findByPk(id);
    if (musician) {
      await musician.update(req.body);
      res.json(musician);
    } else {
      res.status(404).json({ error: 'Musician not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update musician' });
  }
});

app.delete('/musicians/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const musician = await Musician.findByPk(id);
    if (musician) {
      await musician.destroy();
      res.status(204).send(); // No content after deletion
    } else {
      res.status(404).json({ error: 'Musician not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete musician' });
  }
});



module.exports = app;