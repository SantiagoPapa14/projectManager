const request = require('supertest');
const app = require('@App'); 

const authM = require('@managers/tokenManager');
jest.mock('@managers/tokenManager');

const mongoDb = require('@managers/mongoManager');
jest.mock('@managers/mongoManager');

let server;

beforeEach(() => {
  server = app.listen(4000);
});

afterEach(() => {
  server.close();
});

describe('GET /user/Peter', () => {
    it('by regular user should respond with a 404 status if user doesnt exist', async () => {
      
      //Pretend we have an admin token
      authM.validateAuthorization.mockImplementation((req, res, next)=>{
        req.userData = {
          userId: 1,
          username: 'James',
          isAdmin: false
        }
        next();
      })

      //Pretend there's a guy called Peter in the database
      mongoDb.getUser.mockReturnValue(null);

      const response = await request(app)
      .get('/user/Peter')
      .expect(404);
      
      expect(response.notFound).toBe(true);
      expect(response.body).not.toHaveProperty('data');
    });
  });