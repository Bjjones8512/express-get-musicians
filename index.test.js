const { execSync } = require('child_process');
const request = require('supertest');
const { db } = require('./db/connection'); // Use db variable from connection.js
const { Musician } = require('./models/index'); // Assuming Musician is part of index.js
const app = require('./src/app'); // Express app
const { seedMusician } = require('./seedData'); // Your seed data

describe('/musicians endpoint', () => {
  // Before all tests, ensure the database is seeded with data
  beforeAll(async () => {
    await db.sync({ force: true }); // Reset the database
    await seedMusician(); // Seed the musicians data
  });

  // After all tests, close the database connection
  afterAll(async () => {
    await db.close();
  });

  // Test if GET /musicians returns a 200 status code
  test('It should respond with a 200 status code', async () => {
    const response = await request(app).get('/musicians');
    expect(response.statusCode).toBe(200);
  });

  // Test if the response is in JSON format
  test('It should return a list of musicians in JSON format', async () => {
    const response = await request(app).get('/musicians');
    expect(response.headers['content-type']).toMatch(/json/); // Check if response is JSON

    const musicians = response.body; // Automatically parsed as JSON
    expect(Array.isArray(musicians)).toBe(true); // Ensure it’s an array
  });

  // Test if the response contains the seeded musicians
  test('It should return the correct musicians data', async () => {
    const response = await request(app).get('/musicians');
    const musicians = response.body;

    // Assuming your seed data contains specific musicians
    expect(musicians.length).toBeGreaterThan(0); // Ensure the array has musicians

    // Check for specific musicians' properties
    musicians.forEach(musician => {
      expect(musician).toHaveProperty('id');
      expect(musician).toHaveProperty('name');
      expect(musician).toHaveProperty('instrument');
    });
  });
});