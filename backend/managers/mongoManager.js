const { MongoClient, ServerApiVersion } = require('mongodb');

const dotenv = require('dotenv')
dotenv.config({path:__dirname+'/../.env'})
const uri = process.env.MONGO_URI

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

var database;
async function connectToDatabase() {
  try {
    await client.connect();
    database = await client.db("project_manager");
  } catch (err) {
    await client.close();
    throw err;
  }
}

async function getCollection(name) {
  if (!database) {
    await connectToDatabase();
  }
  return database.collection(name);
}

//#region Utility Functions
async function hasAccessToTask(userId, taskId){
  const collection = await getCollection("User");
  const user = await collection.findOne({
    _id: new ObjectId(userId)
  })
  for(task of user.assignedTasks){
    if(task.toString() == taskId){
      return true;
    }
  }
  return false;
}

async function isTaskOwner(userId, taskId){
  const collection = await getCollection("Task");
  const task = await collection.findOne({
    _id: new ObjectId(taskId)
  })
  if(task.creator.toString() == userId){
    return true;
  }
  return false;
}

//#endregion

//#region User Functions

async function addUser(username, hashedPassword){
    const collection = await getCollection("User");
    return await collection.insertOne({
      username: username,   
      hashedPassword: hashedPassword,
      isAdmin: false,
      assignedTasks: []
    })
}

async function getUser(username){
  const collection = await getCollection("User");
  result = await collection.findOne({
    username: username   
  })
  return result;
}

async function getAllUsers(){
  const collection = await getCollection("User");
  result = await collection.find({})
  const documents = await result.toArray();
  return documents;
}

async function assignToTask(userId, taskId){
  const collection = await getCollection("User");
  const result = await collection.updateOne(
    { _id: new ObjectId(userId)},
    { $push: { assignedTasks: new ObjectId(taskId) } }
  );
}

async function unassignToTask(userId, taskId){
  const collection = await getCollection("User");
  const result = await collection.updateOne(
    { _id: new ObjectId(userId)},
    { $pull: { assignedTasks: new ObjectId(taskId) } }
  );
}

async function makeUserAdmin(userId) {
    const collection = await getCollection("User");
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: { isAdmin: true }
      });
}

async function deleteUser(userId) {
  const collection = await getCollection("User");
  const result = await collection.deleteOne(
    { _id: userId }
  );
}

//#endregion

//#region Task Functions

async function getTask(taskId){
  const collection = await getCollection("Task");
  result = await collection.findOne({
    _id: new ObjectId(taskId)   
  })
  return result;
}

async function addTask(userId, title, description, deadline){
  const collection = await getCollection("Task");
  const taskId = await collection.insertOne({
      creator: new ObjectId(userId),
      title: title,
      description: description,
      deadline: deadline
    })
    return taskId.insertedId.toString();
}

async function updateTask(taskId, field, value){
  const collection = await getCollection("Task");
  result = await collection.findOne({
    _id: new ObjectId(taskId)   
  })
  return result;
}

//#endregion

module.exports = {addUser, getUser, getAllUsers, addTask, getTask, assignToTask, unassignToTask, isTaskOwner, hasAccessToTask, makeUserAdmin, deleteUser}