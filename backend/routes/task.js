const requestManager = require('../managers/requestManager');
const { handleError } = require('../managers/errorManager');
const vm = require('../managers/validationManager');
const {validateAuthorization} = require('../managers/tokenManager')

const express = require('express');
const router = express.Router();
router.use(express.json());

//Create Task
router.post('/create',
  validateAuthorization,
  vm.validateBodyTitle,
  vm.validateBodyDescription,
  vm.validateBodyDeadline,
   async (req, res) => {
  try{
    const {title, description, deadline} = req.body;
    result = await requestManager.createTask(req.userData, title, description, deadline);
    res.status(201).json(result);
  }
  catch(err){
    handleError(err);
    res.status(err.statusCode).json(err.message);
  }
})

//Create Task
router.get('/:taskId', validateAuthorization, async (req, res) => {
  try{
    const {taskId} = req.params;
    validateNullFields([taskId]);
    validateFieldTypes([taskId], [Number]);
    result = await requestManager.getTask(req.userData, taskId);
    res.status(201).json(result);
  }
  catch(err){
    handleError(err);
    res.status(err.statusCode).json(err.message);
  }
})

//Update Task
router.patch('/:taskId/:taskField', validateAuthorization, async (req, res) => {
  try{
    const {taskId, taskField} = req.params;
    const {fieldValue} = req.body;
    validateNullFields([taskId, taskField, fieldValue]);
    validateFieldTypes([taskId, taskField], [Number, String]);
    validateFieldValueType(taskField, fieldValue);
    result = await requestManager.updateTask(req.userData, taskId, taskField, fieldValue);
    res.status(201).json(result);
  }
  catch(err){
    handleError(err);
    res.status(err.statusCode).json(err.message);
  }
});

module.exports = router;