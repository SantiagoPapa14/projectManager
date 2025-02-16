const mongoManager = require("./mongoManager");
const bcrypt = require('bcryptjs');
const { handleError, throwError } = require('../managers/errorManager');
const {generateToken} = require("./tokenManager")

//#region USER ROUTE FUNCTIONS

//#region Tokenless functions
async function createUser(username, password){
    const userExists = await mongoManager.getUser(username);
    if(userExists != null){
        throwError(409);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await mongoManager.addUser(username, hashedPassword);
}

async function loginUser(username, password){;
    const user = await mongoManager.getUser(username);
    if(user == null){
        throwError(404);
    }
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    await new Promise(resolve => setTimeout(resolve, 3000));
    if(!passwordMatch){
        throwError(401);
    }
    return(generateToken(user.username, user._id, user.isAdmin))
}
//#endregion

//#region Token required functions
async function getUser(token, username){
    const user = await mongoManager.getUser(username);
    if(user == null){
        throwError(404);
    }
    if(!token.isAdmin && token.userId != user._id){
        delete user['hashedPassword'];
        delete user['assignedTasks'];
    }
    return(user);
}

async function getAllUsers(token){
    if(!token.isAdmin){
        throwError(403)
    }
    const user = await mongoManager.getAllUsers();
    if(user == null || user.length == 0){
        throwError(404);
    }
    return user;
}

async function assignUserToTask(token, userToAssign, taskId){
    const isOwner = await mongoManager.isTaskOwner(token.userId, taskId);
    if(!isOwner){
        throwError(401);
    }
    const userId = await mongoManager.getUser(userToAssign);
    await mongoManager.assignToTask(userId._id, taskId);
}

async function unassignUserToTask(token, userToAssign, taskId){
    const isOwner = await mongoManager.isTaskOwner(token.userId, taskId);
    if(!isOwner){
        throwError(401);
    }
    const userId = await mongoManager.getUser(userToAssign);
    await mongoManager.unassignToTask(userId._id, taskId);
}

//#endregion

//#endregion

//#region TASK ROUTE FUNCTIONS

async function getTask(token, taskId){
    const hasAccess = await mongoManager.hasAccessToTask(token.userId, taskId);
    if(!hasAccess){
        throwError(403);
    }
    const task = await mongoManager.getTask(taskId);
    return task;
}

async function createTask(token, title, description, deadline){
    const taskId = await mongoManager.addTask(token.userId, title, description, deadline);
    await mongoManager.assignToTask(token.userId, taskId);
    return taskId;
}

//#endregion
module.exports = {createUser, loginUser, getUser, getAllUsers, createTask, getTask, assignUserToTask, unassignUserToTask,}