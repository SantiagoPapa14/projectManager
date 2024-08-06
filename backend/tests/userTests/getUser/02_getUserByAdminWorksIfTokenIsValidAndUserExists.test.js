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
    it('by admin user should respond with a 200 status and Peters user WITH hashPass and assignedTasks', async () => {
      
      //Pretend we have an admin token
      authM.validateAuthorization.mockImplementation((req, res, next)=>{
        req.userData = {
          userId: 1,
          username: 'James',
          isAdmin: true
        }
        next();
      })

      //Pretend there's a guy called Peter in the database
      mongoDb.getUser.mockReturnValue(
        {_id: 1, username: 'Peter', hashedPassword: 'password', isAdmin: true,  assignedTasks: []}
      )

      const response = await request(app)
      .get('/user/Peter')
      .expect(200);
      
      expect(response.ok).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual( 
          {_id: 1, username: 'Peter', hashedPassword: 'password', isAdmin: true,  assignedTasks: []}
      );
    });
  });