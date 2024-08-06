const requestManager = require('../managers/requestManager');
const { handleError } = require('../managers/errorManager');
const vm = require('../managers/validationManager');
const {validateAuthorization} = require('../managers/tokenManager')

const express = require('express');
const { route } = require('./task');
const router = express.Router();
router.use(express.json());

//Create User
router.post('/register',
  vm.validateBodyUsername,
  vm.validateBodyPassword,
  vm.handleValidationErrors,
  async (req, res) => {
  try{
    const {username, password} = req.body;
    result = await requestManager.createUser(username, password)
    res.status(201).json({
      message: 'Created.'
    });
  }
  catch(err){
    handleError(err);
    res.status(err.statusCode).json({
      message: 'Bad request.'
    });
  }
})

//Login user
router.get('/login',
  vm.validateBodyUsername,
  vm.validateBodyPassword,
  vm.handleValidationErrors,
  async (req, res) => {
  try{
    const {username, password} = req.body;
    const token = await requestManager.loginUser(username, password)
    res.status(200).json({
      message: "Login successful.",
      authorization: "Bearer " + token
    });
  }catch(err){
      handleError(err);
      res.status(err.statusCode).json(err);
    }
})

//Get user
router.get('/:username',
  validateAuthorization,
  vm.validateParameterUsername,
  vm.handleValidationErrors,
  async (req, res) => {
  try{
    result = await requestManager.getUser(req.userData, req.params.username);
    res.status(200).json({
      message: 'Success',
      data: result
    });
  }catch(err){
      handleError(err);
      res.status(err.statusCode).json(err.message);
    }
})

//Get all users
router.get('/',
  validateAuthorization,
  async (req, res) => {
  try{
    result = await requestManager.getAllUsers(req.userData)
    res.status(200).json({
      message: 'Success',
      data: result
    });
  }catch(err){
      handleError(err);
      res.status(err.statusCode).json(err.message);
    }
})

//Assigns User To Task
router.get('/:username/assign/:taskId',
  validateAuthorization,
  vm.validateParameterUsername,
  vm.validateParameterTaskId,
  vm.handleValidationErrors,
   async (req, res) => {
  try{
    const {taskId, username} = req.params;
    result = await requestManager.assignUserToTask(req.userData, username, taskId);
    res.status(200).json(result);
  }catch(err){
      handleError(err);
      res.status(err.statusCode).json(err.message);
    }
})

//Unassign User to task
router.get('/:username/unassign/:taskId', validateAuthorization, async (req, res) => {
  try{
    const {taskId, username} = req.params;
    validateNullFields([username, taskId]);
    validateFieldTypes([username, taskId], [String, Number]);
    result = await requestManager.unassignUserToTask(req.userData, username, taskId);
    res.status(200).json(result);
  }catch(err){
      handleError(err);
      res.status(err.statusCode).json(err.message);
    }
})

//Delete User
router.delete('/:username', validateAuthorization, async (req, res) => {
  try{
    const {username} = req.body;
    validateNullFields([username]);
    // validateFieldTypes([username, password], [String, String]);
    result = await requestManager.createUser(username, password)
    res.status(201).json({message: 'Created.'});
  }
  catch(err){
    handleError(err);
    res.status(err.statusCode).json(err);
  }
})

module.exports = router;