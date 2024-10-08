const { execSync } = require('child_process');
execSync('npm install');
execSync('npm run seed');

const request = require("supertest")
const { db } = require('./db/connection');
const { Musician } = require('./models/index')
const app = require('./src/app');
const { seedMusician } = require("./seedData");

describe('/musicians endpoint', () => {
  // // Before all tests, ensure the database is seeded with data
  // beforeAll(async () => {
  //   await db.sync({ force: true }); // Reset the database
  //   await seedMusician(); // Seed the musicians data
  // });

  // // After all tests, close the database connection
  // afterAll(async () => {
  //   await db.close();
  // });

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

describe('GET /musicians/:id', () => {
  it('should return a musician with a valid ID', async () => {
    const response = await request(app).get('/musicians/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', 1); // Assuming musician ID is 1
  });

  it('should return 404 if musician is not found', async () => {
    const response = await request(app).get('/musicians/999');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Musician not found');
  });
});

describe('POST /musicians', () => {
  it('should create a new musician', async () => {
    const response = await request(app)
      .post('/musicians')
      .send({ name: 'New Musician', instrument: 'Guitar' });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('name', 'New Musician');
  });
});

describe('PUT /musicians/:id', () => {
  it('should update an existing musician', async () => {
    const response = await request(app)
      .put('/musicians/1')
      .send({ name: 'Updated Musician', instrument: 'Piano' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('name', 'Updated Musician');
  });
});

describe('DELETE /musicians/:id', () => {
  it('should delete a musician', async () => {
    const response = await request(app).delete('/musicians/1');
    expect(response.statusCode).toBe(204);
  });
  });
