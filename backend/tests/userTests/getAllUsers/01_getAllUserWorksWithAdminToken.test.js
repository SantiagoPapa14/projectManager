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

describe('GET /user/', () => {
    it('should respond with a 200 status and all users within the body when token is admin', async () => {
      
      //Pretend we have an admin token
      authM.validateAuthorization.mockImplementation((req, res, next)=>{
        req.userData = {
          userId: 1,
          username: 'James',
          isAdmin: true
        }
        next();
      })

      //Pretend there's two users in the database
      mongoDb.getAllUsers.mockReturnValue([
        {_id: 1, username: 'James', hashedPassword: 'password', isAdmin: true,  assignedTasks: []},
        {_id: 2, username: 'Adam',  hashedPassword: 'password', isAdmin: false, assignedTasks: []}
      ])

      //Pretend there are two users in the database

      const response = await request(app)
      .get('/user/')
      .expect(200);
      
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(        [
          {_id: 1, username: 'James', isAdmin: true,  assignedTasks: []},
          {_id: 2, username: 'Adam',  isAdmin: false, assignedTasks: []}
        ]
      );
    });
  });