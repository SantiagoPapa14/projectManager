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

describe('GET /user/login', () => {
    it('should respond with a 401 status when wrong password', async () => {
      mongoDb.getUser.mockReturnValue({
        username: 'TestUser1',
        //This would be 'TestPassword1'
        hashedPassword: '$2a$10$AYPl5DbEjtpSH3DIiXHXkuUODN79EOVZzu85ouCQVmGyJ1s3uwEEG'
      });
      const response = await request(app)
      .get('/user/login')
      .send({username: 'TestUser1', password: 'WrongPassword'})
      .expect(401);
      
      expect(response.unauthorized).toBe(true);
      expect(response.body.authorization).not.toBeDefined();
    });
  });