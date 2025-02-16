const request = require('supertest');
const app = require('@App'); 
//No need to mock since requests won't reach the database

let server;

beforeEach(() => {
  server = app.listen(4000);
});

afterEach(() => {
  server.close();
});

describe('POST /user/register', () => {
    it('should respond with a 400 status when username is missing', async () => {
      const response = await request(server)
      .post('/user/register')
      .send({password: 'TestPassword1'})
      .expect(400);
      expect(response.badRequest).toBe(true);
    });

  it('should respond with a 400 status when password is missing', async () => {
    const response = await request(server)
    .post('/user/register')
    .send({username: 'TestUser1'})
    .expect(400);
    expect(response.badRequest).toBe(true);
  });

  it('should respond with a 400 status when username and password are missing', async () => {
    const response = await request(server)
    .post('/user/register')
    .send({})
    .expect(400);
    expect(response.badRequest).toBe(true);
  });
});