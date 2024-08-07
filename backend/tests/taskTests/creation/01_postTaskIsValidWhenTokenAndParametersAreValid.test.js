const request = require('supertest');
const app = require('@App'); 

const mongoDb = require('@managers/mongoManager');
jest.mock('@managers/mongoManager');

const authM = require('@managers/tokenManager');
jest.mock('@managers/tokenManager');

let server;

beforeEach(() => {
  server = app.listen(4000);
});

afterEach(() => {
  server.close();
});

describe('POST /task/create', () => {
    it('should respond with a 201 status when credentials and parameters are valid', async () => {
      mongoDb.addTask.mockReturnValue('100');
      mongoDb.assignToTask.mockReturnValue({});
      authM.validateAuthorization.mockImplementation((req, res, next)=>{
        req.userData = {
          userId: 1,
          username: 'James',
          isAdmin: false,
        }
        next();
      });
      const response = await request(app)
      .post('/task/create')
      .send({title: 'Test Task 1', description: 'Simple testing task', deadline: Date.now()})
      .expect(201);
      expect(response.body.message).toBe('Created');
    });
  });