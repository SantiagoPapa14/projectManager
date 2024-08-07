const request = require('supertest');
const app = require('@App'); 
const mongoDb = require('@managers/mongoManager');
jest.mock('@managers/mongoManager');

let server;
beforeEach(() => {
    server = app.listen(4000);
});

afterEach(() => {
  server.close();
});

describe('POST /user/login', () => {
    it('should respond with a 404 status when user does not exist', async () => {
      mongoDb.getUser.mockReturnValue(null);
      const response = await request(app)
      .post('/user/login')
      .send({username: 'UserThatDefinetlyDoesNotExistDonaldTrump', password: 'TestPassword1'})
      .expect(404);
      expect(response.notFound).toBe(true);
    });
  });