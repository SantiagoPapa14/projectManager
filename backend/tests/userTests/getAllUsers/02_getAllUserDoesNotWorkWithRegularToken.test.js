const request = require('supertest');
const app = require('@App'); 

const authM = require('@managers/tokenManager');
jest.mock('@managers/tokenManager');

let server;

beforeEach(() => {
  server = app.listen(4000);
});

afterEach(() => {
  server.close();
});

describe('GET /user/', () => {
    it('should respond with a 403 status when token is not admin', async () => {
      
      //Pretend we have a regular token
      authM.validateAuthorization.mockImplementation((req, res, next)=>{
        req.userData = {
          userId: 1,
          username: 'James',
          isAdmin: false
        }
        next();
      })

      const response = await request(app)
      .get('/user/')
      .expect(403);
      expect(response.forbidden).toBe(true);
    });
  });