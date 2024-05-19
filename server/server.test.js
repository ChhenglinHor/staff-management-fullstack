const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/staff_management', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Staff Management API', () => {
  let server;

  beforeAll(() => {
    server = app.listen(3002); // Use a different port for testing to avoid conflicts
  });

  afterAll(() => {
    server.close();
  });

  it('should create a new staff member', async () => {
    const res = await request(app)
      .post('/staff')
      .send({
        staffId: 'A12324',
        fullName: 'John Doe',
        birthday: '1990-01-01',
        gender: 1,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  // Add more test cases for other API endpoints
});
