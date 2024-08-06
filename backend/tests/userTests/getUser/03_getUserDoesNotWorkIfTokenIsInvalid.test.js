const request = require('supertest');
const app = require('@App'); 

let server;

beforeEach(() => {
  server = app.listen(4000);
});

afterEach(() => {
  server.close();
});

describe('GET /user/Peter', () => {
    it('should respond with a 403 status if token is invalid', async () => {

      const response = await request(app)
      .get('/user/Peter')
      .set('authorization', 'Bearer ClearlyNotSignedByAPI')
      .expect(403);
      
      expect(response.forbidden).toBe(true);
      expect(response.body).not.toHaveProperty('data');
    });
  });