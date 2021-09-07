const { v4: uuidv4 } = require('uuid');
const AWS = require("aws-sdk");
const https = require('https');
const urlParse = require("url").URL;

const docClient = new AWS.DynamoDB.DocumentClient();
const cognitoClient = new AWS.CognitoIdentityServiceProvider();

const UNAUTHORIZED = "UNAUTHORIZED";
const ALREADY_ASSIGNED = "ALREADY_ASSIGNED";
const INVALID_ASSIGNEE = "INVALID_ASSIGNEE"
const USER_NOT_ASSIGNED = "USER_NOT_ASSIGNED";
const ALREADY_WATCHING = "ALREADY_WATCHING";
const INVALID_WATCHER = "INVALID_WATCHER"
const USER_NOT_WATCHING = "USER_NOT_WATCHING";
const USER_NOT_FOUND = "USER_NOT_FOUND";
const PROJECT_NOT_FOUND = "PROJECT_NOT_FOUND";
const TASK_NOT_FOUND = "TASK_NOT_FOUND";
const COMMENT_NOT_FOUND = "COMMENT_NOT_FOUND";
const PERMALINK_USED = "PERMALINK_USED";

const TODO = "todo"
const PENDING = "pending"
const DONE = "done"

const USERTABLE = process.env.API_FSCOREAPI_USERTABLE_NAME;
const PROJECTTABLE = process.env.API_FSCOREAPI_PROJECTTABLE_NAME;
const TASKTABLE = process.env.API_FSCOREAPI_TASKTABLE_NAME;
const COMMENTTABLE = process.env.API_FSCOREAPI_COMMENTTABLE_NAME;

const APIURL = process.env.API_FSCOREAPI_GRAPHQLAPIENDPOINTOUTPUT

const USERPOOL = process.env.AUTH_FSCOGNITO_USERPOOLID

const REGION = process.env.REGION

exports.handler = async function (ctx) {
  console.log(ctx);

  const cachedProjects = {}
  const cachedTasks = {}
  const cachedComments = {}

  const resolvers = {
    Mutation: {
      pushUserUpdate: (ctx) => {
        return pushUserUpdate(ctx);
      },
      pushProjectUpdate: (ctx) => {
        return pushProjectUpdate(ctx);
      },
      createProject: (ctx) => {
        return createProject(ctx);
      },
      createTask: (ctx) => {
        return createTask(ctx);
      },
      createComment: (ctx) => {
        return createComment(ctx);
      },
      updateProject: (ctx) => {
        return updateProject(ctx);
      },
      updateTask: (ctx) => {
        return updateTask(ctx);
      },
      updateComment: (ctx) => {
        return updateComment(ctx);
      },
      updateUser: (ctx) => {
        return updateUser(ctx);
      },
      deleteProjectAndTasks: (ctx) => {
        return deleteProjectAndTasks(ctx);
      },
      deleteTaskAndComments: (ctx) => {
        return deleteTaskAndComments(ctx);
      },
      deleteComment: (ctx) => {
        return deleteComment(ctx);
      },
      assignTask: (ctx) => {
        return assignTask(ctx);
      },
      unassignTask: (ctx) => {
        return unassignTask(ctx);
      },
      addWatcher: (ctx) => {
        return addWatcher(ctx);
      },
      removeWatcher: (ctx) => {
        return removeWatcher(ctx);
      },
      importData: (ctx) => {
        return importData(ctx);
      },
    },
    Query: {
      getUserByUsername: (ctx) => {
        return getUserByUsername(ctx);
      },
      listUsersByUsernames: (ctx) => {
        return listUsersByUsernames(ctx);
      },
      getProjectByID: (ctx) => {
        return getProjectByID(ctx);
      },
      getProjectByPermalink: (ctx) => {
        return getProjectByPermalink(ctx);
      },
      listOwnedProjects: (ctx) => {
        return listOwnedProjects(ctx);
      },
      listAssignedProjects: (ctx) => {
        return listAssignedProjects(ctx);
      },
      listWatchedProjects: (ctx) => {
        return listWatchedProjects(ctx);
      },
      listTasksForProject: (ctx) => {
        return listTasksForProject(ctx);
      },
      listCommentsForTask: (ctx) => {
        return listCommentsForTask(ctx);
      }
    }, 
    Subscription: {
      onPushUserUpdate: (ctx) => {
        return onPushUserUpdate(ctx);
      },
      onCreateOwnedProject: (ctx) => {
        return onCreateOwnedProject(ctx);
      },
      onImportOwnedProjects: (ctx) => {
        return onImportOwnedProjects(ctx);
      },
      onUpdateOwnedProject: (ctx) => {
        return onUpdateOwnedProject(ctx);
      },
      onDeleteOwnedProject: (ctx) => {
        return onDeleteOwnedProject(ctx);
      },
      onCreateTaskByProjectID: (ctx) => {
        return onCreateTaskByProjectID(ctx);
      },
      onUpdateTaskByProjectID: (ctx) => {
        return onUpdateTaskByProjectID(ctx);
      },
      onDeleteTaskByProjectID: (ctx) => {
        return onDeleteTaskByProjectID(ctx);
      },
      onCreateCommentByTaskID: (ctx) => {
        return onCreateCommentByTaskID(ctx);
      },
      onUpdateCommentByTaskID: (ctx) => {
        return onUpdateCommentByTaskID(ctx);
      },
      onDeleteCommentByTaskID: (ctx) => {
        return onDeleteCommentByTaskID(ctx);
      }
    }
  };

  const typeHandler = resolvers[ctx.typeName];
  if (typeHandler) {
    const resolver = typeHandler[ctx.fieldName];
    if (resolver) {
      try {
        return await resolver(ctx);
      } catch (err) {
        throw new Error(err);
      }
    }
  }
  throw new Error("Resolver not found.");

  async function getProject(projectID) {
    if (cachedProjects[projectID]) {
      return {...cachedProjects[projectID]}
    } else {
      const params = {
        TableName: PROJECTTABLE,
        Key: {
          "id": projectID
        }
      }
      try {
        const data = await docClient.get(params).promise()
        if (data.Item) {
          cachedProjects[projectID] = {...data.Item}
          return data.Item
        } else {
          throw new Error(PROJECT_NOT_FOUND)
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  }

  async function getTask(taskID) {
    if (cachedTasks[taskID]) {
      return {...cachedTasks[taskID]}
    } else {
      const params = {
        TableName: TASKTABLE,
        Key: {
          "id": taskID
        }
      }
      try {
        const data = await docClient.get(params).promise()
        if (data.Item) {
          cachedTasks[taskID] = {...data.Item}
          return data.Item
        } else {
          throw new Error(TASK_NOT_FOUND)
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  }

  async function getComment(commentID) {
    if (cachedComments[commentID]) {
      return {...cachedComments[commentID]}
    } else {
      const params = {
        TableName: COMMENTTABLE,
        Key: {
          "id": commentID
        }
      }
      try {
        const data = await docClient.get(params).promise()
        if (data.Item) {
          cachedComments[commentID] = {...data.Item}
          return data.Item
        } else {
          throw new Error(COMMENT_NOT_FOUND)
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  }

  async function isProjectSharedWithClient(projectID, client) {
    try {
      const { privacy, members, owner } = await getProject(projectID)
      return "public" === privacy || members?.includes(client) || client === owner
    } catch (err) {
      throw new Error(err)
    }
  }

  async function isProjectEditableByClient(projectID, client) {
    try {
      const { privacy, members, owner, permissions } = await getProject(projectID)
      return ("rw" === permissions && ("public" === privacy || members?.includes(client))) || client === owner
    } catch (err) {
      throw new Error(err)
    }
  }

  async function isProjectOwner(projectID, client) {
    try {
      const { owner } = await getProject(projectID)
      return client === owner
    } catch (err) {
      throw new Error(err)
    }
  }

  async function isCommentOwner(commentID, client) {
    try {
      const { owner } = await getComment(commentID)
      return client === owner
    } catch (err) {
      throw new Error(err)
    }
  }

  async function isTaskSharedWithClient(taskID, client) {
    try {
      const { projectID } = await getTask(taskID)
      return await isProjectSharedWithClient(projectID, client)
    } catch (err) {
      throw new Error(err)
    }
  }

  async function isTaskEditableByClient(taskID, client) {
    try {
      const { projectID } = await getTask(taskID)
      return await isProjectEditableByClient(projectID, client)
    } catch (err) {
      throw new Error(err)
    }
  }

  async function getUserByUsername(ctx) {
    const params = {
      TableName: USERTABLE,
      Key: {
        "username": ctx.arguments.username
      }
    }
    try {
      const data = await docClient.get(params).promise()
      if(data.Item) {
        return data.Item
      } else {
        throw new Error(USER_NOT_FOUND)
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async function pushUserUpdate(ctx) {
    try {
      return ctx.arguments.input
    } catch (err) {
      throw new Error(err);
    }
  }

  async function pushProjectUpdate(ctx) {
    try {
      return ctx.arguments.input
    } catch (err) {
      throw new Error(err);
    }
  }

  async function removeProjectOrder(projectID) {
    const { prevProject, nextProject } = await getProject(projectID)
    const prevProjectUpdateParams = {
      TableName: PROJECTTABLE,
      Key: {
        "id": prevProject
      },
      UpdateExpression: "SET nextProject = :nextProject, updatedAt = :updatedAt",
      ReturnValues: "ALL_NEW",
      ExpressionAttributeValues: {
        ":nextProject": nextProject,
        ":updatedAt": new Date().toISOString()
      }
    };
    const nextProjectUpdateParams = {
      TableName: PROJECTTABLE,
      Key: {
        "id": nextProject
      },
      UpdateExpression: "SET prevProject = :prevProject, updatedAt = :updatedAt",
      ReturnValues: "ALL_NEW",
      ExpressionAttributeValues: {
        ":prevProject": prevProject,
        ":updatedAt": new Date().toISOString()
      }
    };
    try {
      if (prevProject) {
        const updatedPrevProject = await docClient.update(prevProjectUpdateParams).promise()
        cachedProjects[prevProject] = {...updatedPrevProject.Attributes}
      }
      if (nextProject) {
        const updatedNextProject = await docClient.update(nextProjectUpdateParams).promise()
        cachedProjects[nextProject] = {...updatedNextProject.Attributes}
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  function parseLinkedList (arr, prevKey, nextKey) {
    const list = {}
    for (const arrItem of arr) {
      list[arrItem.id] = arrItem
    }
    const sortedArray = []
    const firstItemArr = arr.filter(x => !x[prevKey])
    if (firstItemArr.length === 1) {
      sortedArray.push(firstItemArr[0])
      let nextItem = firstItemArr[0][nextKey]
      while (nextItem) {
        sortedArray.push(list[nextItem])
        nextItem = list[nextItem][nextKey]
      }
      return sortedArray
    } else {
      return []
    }
  }

  async function injectProjectOrder(projectID, prevProject, nextProject) {
    const prevProjectUpdateParams = {
      TableName: PROJECTTABLE,
      Key: {
        "id": prevProject
      },
      UpdateExpression: "SET nextProject = :nextProject, updatedAt = :updatedAt",
      ReturnValues: "ALL_NEW",
      ExpressionAttributeValues: {
        ":nextProject": projectID,
        ":updatedAt": new Date().toISOString()
      }
    };
    const nextProjectUpdateParams = {
      TableName: PROJECTTABLE,
      Key: {
        "id": nextProject
      },
      UpdateExpression: "SET prevProject = :prevProject, updatedAt = :updatedAt",
      ReturnValues: "ALL_NEW",
      ExpressionAttributeValues: {
        ":prevProject": projectID,
        ":updatedAt": new Date().toISOString()
      }
    };
    try {
      if (prevProject) {
        const updatedPrevProject = await docClient.update(prevProjectUpdateParams).promise()
        cachedProjects[prevProject] = {...updatedPrevProject.Attributes}
      }
      if (nextProject) {
        const updatedNextProject = await docClient.update(nextProjectUpdateParams).promise()
        cachedProjects[nextProject] = {...updatedNextProject.Attributes}
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async function createProject(ctx) {
    const client = ctx.identity.username
    if (client) {
      const projectData = {
        ...ctx.arguments.input,
        id: uuidv4(),
        tasksCount: 0,
        todoCount: 0,
        pendingCount: 0,
        doneCount: 0,
        permalink: `${client}/${ctx.arguments.input.permalink}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: client
      }
      let isCont = false
      if (!projectData.prevProject) {
        projectData.prevProject = await getLastProject(client)
        isCont = true
      }
      projectData.nextProject = projectData.nextProject || null
      const params = {
        TableName: PROJECTTABLE,
        Item: projectData
      };
      try {
        await docClient.put(params).promise();
        cachedProjects[projectData.id] = {...projectData}
        if (isCont) {
          await injectProjectOrder(projectData.id, projectData.prevProject, null)
        } else {
          await injectProjectOrder(projectData.id, projectData.prevProject, projectData.nextProject)
        }
        return projectData;
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function removeTaskOrder(taskID) {
    const { prevTask, nextTask } = await getTask(taskID)
    const prevTaskUpdateParams = {
      TableName: TASKTABLE,
      Key: {
        "id": prevTask
      },
      UpdateExpression: "SET nextTask = :nextTask, updatedAt = :updatedAt",
      ReturnValues: "ALL_NEW",
      ExpressionAttributeValues: {
        ":nextTask": nextTask,
        ":updatedAt": new Date().toISOString()
      }
    };
    const nextTaskUpdateParams = {
      TableName: TASKTABLE,
      Key: {
        "id": nextTask
      },
      UpdateExpression: "SET prevTask = :prevTask, updatedAt = :updatedAt",
      ReturnValues: "ALL_NEW",
      ExpressionAttributeValues: {
        ":prevTask": prevTask,
        ":updatedAt": new Date().toISOString()
      }
    };
    try {
      if (prevTask) {
        const updatedPrevTask = await docClient.update(prevTaskUpdateParams).promise()
        cachedTasks[prevTask] = {...updatedPrevTask.Attributes}
      }
      if (nextTask) {
        const updatedNextTask = await docClient.update(nextTaskUpdateParams).promise()
        cachedTasks[nextTask] = {...updatedNextTask.Attributes}
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async function injectTaskOrder(taskID, prevTask, nextTask) {
    const prevTaskUpdateParams = {
      TableName: TASKTABLE,
      Key: {
        "id": prevTask
      },
      UpdateExpression: "SET nextTask = :nextTask, updatedAt = :updatedAt",
      ReturnValues: "ALL_NEW",
      ExpressionAttributeValues: {
        ":nextTask": taskID,
        ":updatedAt": new Date().toISOString()
      }
    };
    const nextTaskUpdateParams = {
      TableName: TASKTABLE,
      Key: {
        "id": nextTask
      },
      UpdateExpression: "SET prevTask = :prevTask, updatedAt = :updatedAt",
      ReturnValues: "ALL_NEW",
      ExpressionAttributeValues: {
        ":prevTask": taskID,
        ":updatedAt": new Date().toISOString()
      }
    };
    try {
      if (prevTask) {
        const updatedPrevTask = await docClient.update(prevTaskUpdateParams).promise()
        cachedTasks[prevTask] = {...updatedPrevTask.Attributes}
      }
      if (nextTask) {
        const updatedNextTask = await docClient.update(nextTaskUpdateParams).promise()
        cachedTasks[nextTask] = {...updatedNextTask.Attributes}
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async function updateTaskCount(taskID, nextStatus = null) {
    const { projectID, status: prevStatus } = await getTask(taskID)
    const projectUpdateParams = {
      TableName: PROJECTTABLE,
      Key: {
        "id": projectID
      },
      UpdateExpression: "SET todoCount = todoCount + :isTodo, pendingCount = pendingCount + :isPending, doneCount = doneCount + :isDone, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":isTodo": (prevStatus === TODO ? -1 : 0) || (nextStatus === TODO ? 1 : 0),
        ":isPending": (prevStatus === PENDING ? -1 : 0) || (nextStatus === PENDING ? 1 : 0),
        ":isDone": (prevStatus === DONE ? -1 : 0) || (nextStatus === DONE ? 1 : 0),
        ":updatedAt": new Date().toISOString()
      },
      ReturnValues: "ALL_NEW"
    };
    try {
      if (prevStatus !== nextStatus) {
        const updatedProject = await docClient.update(projectUpdateParams).promise();
        await _pushProjectUpdate(updatedProject.Attributes)
        cachedProjects[projectID] = {...updatedProject.Attributes}
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async function createTask(ctx) {
    const projectID = ctx.arguments.input.projectID
    const client = ctx.identity.username
    if (await isProjectEditableByClient(projectID, client)) {
      const projectData = await getProject(projectID)
      const taskData = {
        ...ctx.arguments.input,
        id: uuidv4(),
        status: ctx.arguments.input.status || TODO,
        assignees: ctx.arguments.input.assignees || [],
        watchers: ctx.arguments.input.watchers || [],
        tags: ctx.arguments.input.tags || [],
        permalink: projectData.tasksCount + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: client
      }
      let isCont = false
      if (!taskData.prevTask) {
        taskData.prevTask = await getLastTask(projectID)
        isCont = true
      }
      taskData.nextTask = taskData.nextTask || null
      const projectUpdateParams = {
        TableName: PROJECTTABLE,
        Key: {
          "id": projectID
        },
        UpdateExpression: "SET tasksCount = tasksCount + :increment, todoCount = todoCount + :isTodo, pendingCount = pendingCount + :isPending, doneCount = doneCount + :isDone, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":increment": 1,
          ":isTodo": taskData.status === TODO ? 1 : 0,
          ":isPending": taskData.status === PENDING ? 1 : 0,
          ":isDone": taskData.status === DONE ? 1 : 0,
          ":updatedAt": new Date().toISOString()
        },
        ReturnValues: "ALL_NEW"
      };
      const taskParams = {
        TableName: TASKTABLE,
        Item: taskData
      };
      try {
        await docClient.put(taskParams).promise();
        cachedTasks[taskData.id] = {...taskData}
        if (isCont) {
          await injectTaskOrder(taskData.id, taskData.prevTask, null)
        } else {
          await injectTaskOrder(taskData.id, taskData.prevTask, taskData.nextTask)
        }
        const updatedProject = await docClient.update(projectUpdateParams).promise()
        await _pushProjectUpdate(updatedProject.Attributes)
        cachedProjects[projectID] = {...updatedProject.Attributes}
        return taskData;
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function createComment(ctx) {
    const taskID = ctx.arguments.input.taskID
    const client = ctx.identity.username
    if (await isTaskSharedWithClient(taskID, client)) {
      const commentData = {
        ...ctx.arguments.input,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: client
      }
      const params = {
        TableName: COMMENTTABLE,
        Item: commentData
      };
      try {
        await docClient.put(params).promise();
        cachedComments[commentData.id] = {...commentData}
        return commentData;
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function updateProject(ctx) {
    const updateData = ctx.arguments.input
    const projectID = updateData.id
    const mutationID = updateData.mutationID
    const client = ctx.identity.username
    if (await isProjectOwner(projectID, client)) {
      delete updateData.id
      delete updateData.mutationID
      const expAttrVal = {}
      const expAttrNames = {}
      let updateExp = []
      for (const item in updateData) {
        if (item === "permalink") {
          const params = {
            TableName: PROJECTTABLE,
            IndexName: "byPermalink",
            KeyConditionExpression: "permalink = :permalink",
            ExpressionAttributeValues: {
              ":permalink": `${client}/${updateData[item]}`
            }
          }
          const data = await docClient.query(params).promise();
          if (!data.Items[0]) {
            expAttrVal[`:${item}`] = `${client}/${updateData[item]}`
            updateExp.push(`${item}=:${item}`)
          } else {
            throw new Error(PERMALINK_USED)
          }
        } else {
          expAttrVal[`:${item}`] = updateData[item]
          if (item === "permissions") {
            updateExp.push(`#${item}=:${item}`)
            expAttrNames[`#${item}`] = item
          } else {
            updateExp.push(`${item}=:${item}`)
          }
        }
      }
      expAttrVal[":updatedAt"] = new Date().toISOString()
      updateExp.push("updatedAt=:updatedAt")
      updateExp = `set ${updateExp.join(", ")}`
      const params = {
        TableName: PROJECTTABLE,
        Key: {
          "id": projectID
        },
        UpdateExpression: updateExp,
        ExpressionAttributeValues: expAttrVal,
        ReturnValues: "UPDATED_NEW"
      };
      if (Object.keys(expAttrNames).length) {
        params.ExpressionAttributeNames = expAttrNames
      }
      try {
        if (updateData.prevProject !== undefined && updateData.nextProject !== undefined) {
          await removeProjectOrder(projectID)
          await injectProjectOrder(projectID, updateData.prevProject, updateData.nextProject)
        }
        const data = await docClient.update(params).promise();
        return {
          id: projectID,
          owner: client,
          mutationID: mutationID,
          ...data.Attributes
        }
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function updateTask(ctx) {
    const updateData = ctx.arguments.input
    const taskID = updateData.id
    const mutationID = updateData.mutationID
    const client = ctx.identity.username
    if (await isTaskEditableByClient(taskID, client)) {
      delete updateData.id
      delete updateData.mutationID
      const expAttrVal = {}
      const expAttrNames = {}
      let updateExp = []
      for (const item in updateData) {
        expAttrVal[`:${item}`] = updateData[item]
        if (item === "status") {
          updateExp.push(`#${item}=:${item}`)
          expAttrNames[`#${item}`] = item
        } else {
          updateExp.push(`${item}=:${item}`)
        }
      }
      expAttrVal[":updatedAt"] = new Date().toISOString()
      updateExp.push("updatedAt=:updatedAt")
      updateExp = `set ${updateExp.join(", ")}`
      const taskUpdateParams = {
        TableName: TASKTABLE,
        Key: {
          "id": taskID
        },
        UpdateExpression: updateExp,
        ExpressionAttributeValues: expAttrVal,
        ReturnValues: "ALL_NEW"
      };
      if (Object.keys(expAttrNames).length) {
        taskUpdateParams.ExpressionAttributeNames = expAttrNames
      }
      try {
        if (updateData.prevTask !== undefined && updateData.nextTask !== undefined) {
          await removeTaskOrder(taskID)
          await injectTaskOrder(taskID, updateData.prevTask, updateData.nextTask)
        }
        if (updateData.status) {
          await updateTaskCount(taskID, updateData.status)
        }
        const data = await docClient.update(taskUpdateParams).promise();
        return {
          id: taskID,
          projectID: cachedTasks[taskID].projectID,
          mutationID: mutationID,
          ...data.Attributes
        }
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function updateComment(ctx) {
    const updateData = ctx.arguments.input
    const commentID = updateData.id
    const mutationID = updateData.mutationID
    const client = ctx.identity.username
    if (await isCommentOwner(commentID, client)) {
      delete updateData.id
      delete updateData.mutationID
      const expAttrVal = {}
      let updateExp = []
      for (const item in updateData) {
        expAttrVal[`:${item}`] = updateData[item]
        updateExp.push(`${item}=:${item}`)
      }
      expAttrVal[":updatedAt"] = new Date().toISOString()
      updateExp.push("updatedAt=:updatedAt")
      updateExp = `set ${updateExp.join(", ")}`
      const params = {
        TableName: COMMENTTABLE,
        Key: {
          "id": commentID
        },
        UpdateExpression: updateExp,
        ExpressionAttributeValues: expAttrVal,
        ReturnValues: "UPDATED_NEW"
      };
      try {
        const data = await docClient.update(params).promise();
        return {
          id: commentID,
          taskID: cachedComments[commentID].taskID,
          mutationID: mutationID,
          ...data.Attributes
        }
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function updateUser(ctx) {
    const updateData = ctx.arguments.input
    const { username } = updateData
    const client = ctx.identity.username
    if (client === username) {
      delete updateData.username
      const expAttrVal = {}
      let updateExp = []
      for (const item in updateData) {
        expAttrVal[`:${item}`] = updateData[item]
        updateExp.push(`${item}=:${item}`)
      }
      expAttrVal[":updatedAt"] = new Date().toISOString()
      updateExp.push("updatedAt=:updatedAt")
      updateExp = `set ${updateExp.join(", ")}`
      const UpdateUserParams = {
        TableName: USERTABLE,
        Key: {
          "username": username
        },
        UpdateExpression: updateExp,
        ExpressionAttributeValues: expAttrVal,
        ReturnValues: "ALL_NEW"
      };
      const UpdateUserCognitoParams = {
        UserAttributes: [
          ...((updateData.firstName && [{
            Name: 'given_name',
            Value: updateData.firstName
          }]) || []),
          ...((updateData.lastName && [{
            Name: 'family_name',
            Value: updateData.lastName
          }]) || [])
        ],
        UserPoolId: USERPOOL,
        Username: username
      };
      try {
        await cognitoClient.adminUpdateUserAttributes(UpdateUserCognitoParams).promise()
        const data = await docClient.update(UpdateUserParams).promise();
        return data.Attributes
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function assignTask(ctx) {
    const { assignee, taskID, mutationID } = ctx.arguments
    const client = ctx.identity.username
    const isValidAssignee = /^(user|anonymous):(.*)$/.test(assignee)
    if (isValidAssignee) {
      const [, assigneeType, assigneeID] = assignee.match(/(user|anonymous):(.*)/)
      const isUser = assigneeType === "user"
      const userGetParams = {
        TableName: USERTABLE,
        Key: {
          "username": assigneeID
        }
      }
      const userData = isUser && await docClient.get(userGetParams).promise()
      const { projectID, assignees } = await getTask(taskID)
      const taskPath = `${projectID}/${taskID}`
      if (await isProjectEditableByClient(projectID, client)) {
        if (!assignees.includes(assignee)) {
          const taskUpdateParams = {
            TableName: TASKTABLE,
            Key: {
              "id": taskID
            },
            UpdateExpression: "set assignees=:assignees, updatedAt = :updatedAt",
            ExpressionAttributeValues: {
              ":assignees": [...assignees, assignee],
              ":updatedAt": new Date().toISOString()
            },
            ReturnValues: "UPDATED_NEW"
          };
          const userUpdateParams = isUser && {
            TableName: USERTABLE,
            Key: {
              "username": assigneeID
            },
            UpdateExpression: "set assignedTasks=:assignedTasks, updatedAt = :updatedAt",
            ExpressionAttributeValues: {
              ":assignedTasks": [...userData.Item.assignedTasks, taskPath],
              ":updatedAt": new Date().toISOString()
            },
            ReturnValues: "ALL_NEW"
          };
          try {
            const updatedTask = await docClient.update(taskUpdateParams).promise();
            if (isUser) {
              const userUpdate = await docClient.update(userUpdateParams).promise();
              await _pushUserUpdate(userUpdate.Attributes)
            }
            return {
              id: taskID,
              projectID: cachedTasks[taskID].projectID,
              mutationID: mutationID,
              ...updatedTask.Attributes
            }
          } catch (err) {
            throw new Error(err);
          }
        } else {
          throw new Error(ALREADY_ASSIGNED)
        }
      } else {
        throw new Error(UNAUTHORIZED)
      }
    } else {
      throw new Error(INVALID_ASSIGNEE)
    }
  }

  async function unassignTask(ctx) {
    const { assignee, taskID, mutationID } = ctx.arguments
    const client = ctx.identity.username
    const isValidAssignee = /^(user|anonymous):(.*)$/.test(assignee)
    if (isValidAssignee) {
      const [, assigneeType, assigneeID] = assignee.match(/(user|anonymous):(.*)/)
      const isUser = assigneeType === "user"
      const userGetParams = {
        TableName: USERTABLE,
        Key: {
          "username": assigneeID
        }
      }
      const userData = isUser && await docClient.get(userGetParams).promise()
      const { projectID, assignees } = await getTask(taskID)
      const taskPath = `${projectID}/${taskID}`
      if (await isProjectEditableByClient(projectID, client)) {
        if (assignees.includes(assignee)) {
          const taskUpdateParams = {
            TableName: TASKTABLE,
            Key: {
              "id": taskID
            },
            UpdateExpression: "set assignees=:assignees, updatedAt = :updatedAt",
            ExpressionAttributeValues: {
              ":assignees": assignees.filter(x => x !== assignee),
              ":updatedAt": new Date().toISOString()
            },
            ReturnValues: "UPDATED_NEW"
          };
          const userUpdateParams = isUser && {
            TableName: USERTABLE,
            Key: {
              "username": assigneeID
            },
            UpdateExpression: "set assignedTasks=:assignedTasks, updatedAt = :updatedAt",
            ExpressionAttributeValues: {
              ":assignedTasks": userData.Item.assignedTasks.filter(x => x !== taskPath),
              ":updatedAt": new Date().toISOString()
            },
            ReturnValues: "ALL_NEW"
          };
          try {
            const updatedTask = await docClient.update(taskUpdateParams).promise();
            if (isUser) {
              const userUpdate = await docClient.update(userUpdateParams).promise();
              await _pushUserUpdate(userUpdate.Attributes)
            }
            return {
              id: taskID,
              projectID: cachedTasks[taskID].projectID,
              mutationID: mutationID,
              ...updatedTask.Attributes
            }
          } catch (err) {
            throw new Error(err);
          }
        } else {
          throw new Error(USER_NOT_ASSIGNED)
        }
      } else {
        throw new Error(UNAUTHORIZED)
      }
    } else {
      throw new Error(INVALID_ASSIGNEE)
    }
  }

  async function addWatcher(ctx) {
    const { watcher, taskID, mutationID } = ctx.arguments
    const client = ctx.identity.username
    const isValidWatcher = /^(user|anonymous):(.*)$/.test(watcher)
    if (isValidWatcher) {
      const [, watcherType, watcherID] = watcher.match(/(user|anonymous):(.*)/)
      const isUser = watcherType === "user"
      const userGetParams = {
        TableName: USERTABLE,
        Key: {
          "username": watcherID
        }
      }
      const userData = isUser && await docClient.get(userGetParams).promise()
      const { projectID, watchers } = await getTask(taskID)
      const taskPath = `${projectID}/${taskID}`
      if (await isProjectEditableByClient(projectID, client)) {
        if (!watchers.includes(watcher)) {
          const taskUpdateParams = {
            TableName: TASKTABLE,
            Key: {
              "id": taskID
            },
            UpdateExpression: "set watchers=:watchers, updatedAt = :updatedAt",
            ExpressionAttributeValues: {
              ":watchers": [...watchers, watcher],
              ":updatedAt": new Date().toISOString()
            },
            ReturnValues: "UPDATED_NEW"
          };
          const userUpdateParams = isUser && {
            TableName: USERTABLE,
            Key: {
              "username": watcherID
            },
            UpdateExpression: "set assignedTasks=:assignedTasks, updatedAt = :updatedAt",
            ExpressionAttributeValues: {
              ":assignedTasks": [...userData.Item.assignedTasks, taskPath],
              ":updatedAt": new Date().toISOString()
            },
            ReturnValues: "ALL_NEW"
          };
          try {
            const updatedTask = await docClient.update(taskUpdateParams).promise();
            if (isUser) {
              const userUpdate = await docClient.update(userUpdateParams).promise();
              await _pushUserUpdate(userUpdate.Attributes)
            }
            return {
              id: taskID,
              projectID: cachedTasks[taskID].projectID,
              mutationID: mutationID,
              ...updatedTask.Attributes
            }
          } catch (err) {
            throw new Error(err);
          }
        } else {
          throw new Error(ALREADY_WATCHING)
        }
      } else {
        throw new Error(UNAUTHORIZED)
      }
    } else {
      throw new Error(INVALID_WATCHER)
    }
  }

  async function removeWatcher(ctx) {
    const { watcher, taskID, mutationID } = ctx.arguments
    const client = ctx.identity.username
    const isValidWatcher = /^(user|anonymous):(.*)$/.test(watcher)
    if (isValidWatcher) {
      const [, watcherType, watcherID] = watcher.match(/(user|anonymous):(.*)/)
      const isUser = watcherType === "user"
      const userGetParams = {
        TableName: USERTABLE,
        Key: {
          "username": watcherID
        }
      }
      const userData = isUser && await docClient.get(userGetParams).promise()
      const { projectID, watchers } = await getTask(taskID)
      const taskPath = `${projectID}/${taskID}`
      if (await isProjectEditableByClient(projectID, client)) {
        if (watchers.includes(watcher)) {
          const taskUpdateParams = {
            TableName: TASKTABLE,
            Key: {
              "id": taskID
            },
            UpdateExpression: "set watchers=:watchers, updatedAt = :updatedAt",
            ExpressionAttributeValues: {
              ":watchers": watchers.filter(x => x !== watcher),
              ":updatedAt": new Date().toISOString()
            },
            ReturnValues: "UPDATED_NEW"
          };
          const userUpdateParams = isUser && {
            TableName: USERTABLE,
            Key: {
              "username": watcherID
            },
            UpdateExpression: "set assignedTasks=:assignedTasks, updatedAt = :updatedAt",
            ExpressionAttributeValues: {
              ":assignedTasks": userData.Item.assignedTasks.filter(x => x !== taskPath),
              ":updatedAt": new Date().toISOString()
            },
            ReturnValues: "ALL_NEW"
          };
          try {
            const updatedTask = await docClient.update(taskUpdateParams).promise();
            if (isUser) {
              const userUpdate = await docClient.update(userUpdateParams).promise();
              await _pushUserUpdate(userUpdate.Attributes)
            }
            return {
              id: taskID,
              projectID: cachedTasks[taskID].projectID,
              mutationID: mutationID,
              ...updatedTask.Attributes
            }
          } catch (err) {
            throw new Error(err);
          }
        } else {
          throw new Error(USER_NOT_WATCHING)
        }
      } else {
        throw new Error(UNAUTHORIZED)
      }
    } else {
      throw new Error(INVALID_WATCHER)
    }
  }

  async function getLastProject (client) {
    const params = {
      TableName: PROJECTTABLE,
      IndexName: "byOwner",
      ProjectionExpression: "#id, nextProject",
      KeyConditionExpression: "#owner = :owner",
      ExpressionAttributeNames: { "#id": "id", "#owner": "owner" },
      ExpressionAttributeValues: {
        ":owner": client
      },
    };
    try {
      const data = await docClient.query(params).promise();
      if (data.Items.length > 0) {
        return data.Items.filter(x => !x.nextProject)[0].id
      } else {
        return null
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async function getLastTask (projectID) {
    const params = {
      TableName: TASKTABLE,
      IndexName: "byProject",
      ProjectionExpression: "#id, nextTask",
      KeyConditionExpression: "projectID = :projectID",
      ExpressionAttributeNames: { "#id": "id" },
      ExpressionAttributeValues: {
        ":projectID": projectID
      },
    };
    try {
      const data = await docClient.query(params).promise();
      if (data.Items.length > 0) {
        return data.Items.filter(x => !x.nextTask)[0].id
      } else {
        return null
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async function importData(ctx) {
    const data = JSON.parse(ctx.arguments.data)
    const client = ctx.identity.username
    const importedProjects = {
      owner: client,
      items: []
    }
    try {
      let sortedProjects = parseLinkedList(data, "prevProject", "nextProject")
      const projectsCount = sortedProjects.length
      for (let i = 0; i < projectsCount; i++) {
        const project = sortedProjects[i]
        const tasks = project.tasks
        const projectData = await createProject({
          identity: {
            username: client
          },
          arguments: {
            input: {
              permalink: project.permalink,
              title: project.title,
              prevProject: project.prevProject,
              nextProject: project.nextProject,
              privacy: project.privacy,
              permissions: project.permissions,
              members: project.members
            }
          }
        })
        let sortedTasks = parseLinkedList(tasks, "prevTask", "nextTask")
        const sortedTasksCount = sortedTasks.length
        for (let k = 0; k < sortedTasksCount; k++) {
          const task = sortedTasks[k]
          await createTask({
            identity: {
              username: client
            },
            arguments: {
              input: {
                projectID: projectData.id,
                task: task.task,
                prevTask: project.prevTask,
                nextTask: project.nextTask,
                description: task.description,
                due: task.due,
                tags: task.tags,
                status: task.status,
                assignees: task.assignees
              }
            }
          })
        }
        importedProjects.items.push(projectData)
      }
      return importedProjects
    } catch (err) {
      throw new Error(err)
    } 
  }

  async function getProjectByID(ctx) {
    const params = {
      TableName: PROJECTTABLE,
      Key: {
        "id": ctx.arguments.projectID
      }
    }
    const data = await docClient.get(params).promise()
    return data.Item
  }

  async function getProjectByPermalink(ctx) {
    const client = ctx.identity.username
    const params = {
      TableName: PROJECTTABLE,
      IndexName: "byPermalink",
      KeyConditionExpression: "permalink = :permalink",
      ExpressionAttributeValues: {
        ":permalink": ctx.arguments.permalink
      },
    };
    try {
      const data = await docClient.query(params).promise();
      if (data.Items[0]) {
        const { privacy, members, owner } = data.Items[0]
        if ("public" === privacy || members?.includes(client) || client === owner) {
          return data.Items[0]
        } else {
          throw new Error(UNAUTHORIZED)
        }
      } else {
        throw new Error(PROJECT_NOT_FOUND)
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async function listOwnedProjects(ctx) {
    const client = ctx.identity.username
    const params = {
      TableName: PROJECTTABLE,
      IndexName: "byOwner",
      KeyConditionExpression: "#owner = :owner",
      ExpressionAttributeNames: { "#owner": "owner" },
      ExpressionAttributeValues: {
        ":owner": client
      },
    };
    try {
      const data = await docClient.query(params).promise();
      return {
        items: data.Items
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async function listAssignedProjects(ctx) {
    const client = ctx.identity.username
    try {
      const { assignedTasks } = await getUserByUsername({
        arguments: {
          username: client
        }
      })
      const assignedProjects = [...new Set(assignedTasks.map(taskPath => taskPath.match(/(.*)\/.*/)[1]))]
      const params = {
        RequestItems: {
          [PROJECTTABLE]: {
            Keys: assignedProjects.map(project => ({ id: project }))
          }
        }
      }
      const data = assignedProjects.length ? (await docClient.batchGet(params).promise()).Responses[PROJECTTABLE] : []
      return {
        items: data
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async function listWatchedProjects(ctx) {
    const client = ctx.identity.username
    try {
      const { watchedTasks } = await getUserByUsername({
        arguments: {
          username: client
        }
      })
      const watchedProjects = [...new Set(watchedTasks.map(taskPath => taskPath.match(/(.*)\/.*/)[1]))]
      const params = {
        RequestItems: {
          [PROJECTTABLE]: {
            Keys: watchedProjects.map(project => ({ id: project }))
          }
        }
      }
      const data = watchedProjects.length ? (await docClient.batchGet(params).promise()).Responses[PROJECTTABLE] : []
      return {
        items: data
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async function listUsersByUsernames (ctx) {
    const usernames = ctx.arguments.usernames
    const params = {
      RequestItems: {
        [USERTABLE]: {
          Keys: usernames.map(user => ({ username: user }))
        }
      }
    }
    try {
      const data = usernames.length ? (await docClient.batchGet(params).promise()).Responses[USERTABLE] : []
      return {
        items: data
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async function listTasksForProject(ctx) {
    const projectID = ctx.arguments.projectID
    const client = ctx.identity.username
    if (await isProjectSharedWithClient(projectID, client)) {
      const params = {
        TableName: TASKTABLE,
        IndexName: "byProject",
        KeyConditionExpression: "projectID = :projectID",
        ExpressionAttributeValues: {
          ":projectID": projectID
        },
      };
      try {
        const data = await docClient.query(params).promise();
        return {
          items: data.Items
        }
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function listCommentsForTask(ctx) {
    const taskID = ctx.arguments.taskID
    const client = ctx.identity.username
    if (await isTaskSharedWithClient(taskID, client)) {
      try {
        const commentsList = await _listCommentsForTask(taskID)
        return {
          items: commentsList
        }
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function deleteComment(ctx) {
    const commentID = ctx.arguments.commentID
    const client = ctx.identity.username
    if (await isCommentOwner(commentID, client)) {
      const params = {
        TableName: COMMENTTABLE,
        Key: {
          id: commentID
        },
        ReturnValues: "ALL_OLD",
      }
      try {
        const data = await docClient.delete(params).promise();
        return data.Attributes
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function deleteProjectAndTasks(ctx) {
    const projectID = ctx.arguments.projectID
    const client = ctx.identity.username
    if (await isProjectOwner(projectID, client)) {
      const removeTasksProm = removeTasksOfProject(projectID);
      const removeProjectProm = deleteProject(projectID);
      const [_, deletedProject] = await Promise.all([
        removeTasksProm,
        removeProjectProm,
      ]);
      await removeProjectOrder(projectID)
      return deletedProject
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function deleteTaskAndComments(ctx) {
    const taskID = ctx.arguments.taskId
    const client = ctx.identity.username
    if (await isTaskEditableByClient(taskID, client)) {
      const removeCommentsProm = removeCommentsOfTask(taskID);
      await removeTaskOrder(taskID)
      await updateTaskCount(taskID)
      const taskAssignees = cachedTasks[taskID].assignees
      const taskWatchers = cachedTasks[taskID].watchers
      const taskUsers = [...new Set([...taskAssignees, ...taskWatchers])]
      if (taskUsers.length) {
        const { projectID } = cachedTasks[taskID]
        const taskPath = `${projectID}/${taskID}`
        for (const taskUser of taskUsers) {
          const [, taskUserType, taskUserID] = taskUser.match(/(user|anonymous):(.*)/)
          if (taskUserType === "user") {
            const userGetParams = {
              TableName: USERTABLE,
              Key: {
                "username": taskUserID
              }
            }
            const userData = await docClient.get(userGetParams).promise()
            const userUpdateParams = {
              TableName: USERTABLE,
              Key: {
                "username": taskUserID
              },
              UpdateExpression: "set assignedTasks=:assignedTasks, watchedTasks=:watchedTasks, updatedAt = :updatedAt",
              ExpressionAttributeValues: {
                ":assignedTasks": userData.Item.assignedTasks.filter(x => x !== taskPath),
                ":watchedTasks": userData.Item.watchedTasks.filter(x => x !== taskPath),
                ":updatedAt": new Date().toISOString()
              },
              ReturnValues: "ALL_NEW"
            }
            console.log(userData.Item.assignedTasks)
            const userUpdate = await docClient.update(userUpdateParams).promise();
            await _pushUserUpdate(userUpdate.Attributes)
          }
        }
      }
      const removeTaskProm = deleteTask(taskID);
      const [_, deletedTask] = await Promise.all([
        removeCommentsProm,
        removeTaskProm,
      ]);
      return deletedTask
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function onCreateOwnedProject(ctx) {
    const client = ctx.identity.username
    const owner = ctx.arguments.owner
    if (client === owner) {
      return {
        id: "00000000-0000-0000-0000-000000000000",
        permalink: "dummy-project",
        tasksCount: 0,
        todoCount: 0,
        pendingCount: 0,
        doneCount: 0,
        privacy: "public",
        permissions: "rw",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: client
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function onImportOwnedProjects(ctx) {
    const client = ctx.identity.username
    const owner = ctx.arguments.owner
    if (client === owner) {
      return {
        owner: client,
        items: []
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function onPushUserUpdate(ctx) {
    const client = ctx.identity.username
    const username = ctx.arguments.username
    if (client === username) {
      return {
        username: username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: username
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function onUpdateOwnedProject(ctx) {
    const client = ctx.identity.username
    const owner = ctx.arguments.owner
    if (client === owner) {
      return {
        id: "00000000-0000-0000-0000-000000000000",
        permalink: "dummy-project",
        tasksCount: 0,
        todoCount: 0,
        pendingCount: 0,
        doneCount: 0,
        privacy: "public",
        permissions: "rw",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: client,
        mutationID: "DUMMY_MUTATION_ID"
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function onDeleteOwnedProject(ctx) {
    const client = ctx.identity.username
    const owner = ctx.arguments.owner
    if (client === owner) {
      return {
        id: "00000000-0000-0000-0000-000000000000",
        permalink: "dummy-project",
        tasksCount: 0,
        todoCount: 0,
        pendingCount: 0,
        doneCount: 0,
        privacy: "public",
        permissions: "rw",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: client
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function onCreateTaskByProjectID(ctx) {
    const client = ctx.identity.username
    const projectID = ctx.arguments.projectID
    if (await isProjectSharedWithClient(projectID, client)) {
      return {
        id: "00000000-0000-0000-0000-000000000000",
        projectID: "00000000-0000-0000-0000-000000000000",
        task: "Dummy Task",
        permalink: 1,
        status: "todo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: client
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function onUpdateTaskByProjectID(ctx) {
    const client = ctx.identity.username
    const projectID = ctx.arguments.projectID
    if (await isProjectSharedWithClient(projectID, client)) {
      return {
        id: "00000000-0000-0000-0000-000000000000",
        projectID: "00000000-0000-0000-0000-000000000000",
        updatedAt: new Date().toISOString(),
        mutationID: "DUMMY_MUTATION_ID"
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function onDeleteTaskByProjectID(ctx) {
    const client = ctx.identity.username
    const projectID = ctx.arguments.projectID
    if (await isProjectSharedWithClient(projectID, client)) {
      return {
        id: "00000000-0000-0000-0000-000000000000",
        projectID: "00000000-0000-0000-0000-000000000000",
        task: "Dummy Task",
        permalink: 1,
        status: "todo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: client
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function onCreateCommentByTaskID(ctx) {
    const client = ctx.identity.username
    const taskID = ctx.arguments.taskID
    if (await isTaskSharedWithClient(taskID, client)) {
      return {
        id: "00000000-0000-0000-0000-000000000000",
        taskID: "00000000-0000-0000-0000-000000000000",
        content: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: client
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function onUpdateCommentByTaskID(ctx) {
    const client = ctx.identity.username
    const taskID = ctx.arguments.taskID
    if (await isTaskSharedWithClient(taskID, client)) {
      return {
        id: "00000000-0000-0000-0000-000000000000",
        taskID: "00000000-0000-0000-0000-000000000000",
        content: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: client,
        mutationID: "DUMMY_MUTATION_ID"
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function onDeleteCommentByTaskID(ctx) {
    const client = ctx.identity.username
    const taskID = ctx.arguments.taskID
    if (await isTaskSharedWithClient(taskID, client)) {
      return {
        id: "00000000-0000-0000-0000-000000000000",
        taskID: "00000000-0000-0000-0000-000000000000",
        content: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: client
      }
    } else {
      throw new Error(UNAUTHORIZED)
    }
  }

  async function removeTasksOfProject(projectID) {
    const tasks = await _listTasksForProject(projectID);
    const projectAssignees = tasks.map(x => x.assignees).flat()
    const projectWatchers = tasks.map(x => x.watchers).flat()
    const projectUsers = [...new Set([...projectAssignees, ...projectWatchers])]
    if (projectUsers.length) {
      for (const projectUser of projectUsers) {
        const [, projectUserType, projectUserID] = projectUser.match(/(user|anonymous):(.*)/)
        if (projectUserType === "user") {
          const userGetParams = {
            TableName: USERTABLE,
            Key: {
              "username": projectUserID
            }
          }
          const userData = await docClient.get(userGetParams).promise()
          const userUpdateParams = {
            TableName: USERTABLE,
            Key: {
              "username": projectUserID
            },
            UpdateExpression: "set assignedTasks=:assignedTasks, watchedTasks=:watchedTasks, updatedAt = :updatedAt",
            ExpressionAttributeValues: {
              ":assignedTasks": userData.Item.assignedTasks.filter(x => new RegExp(`^${projectID}/.*`).test(x)),
              ":watchedTasks": userData.Item.watchedTasks.filter(x => new RegExp(`^${projectID}/.*`).test(x)),
              ":updatedAt": new Date().toISOString()
            },
            ReturnValues: "ALL_NEW"
          };
          const userUpdate = await docClient.update(userUpdateParams).promise();
          await _pushUserUpdate(userUpdate.Attributes)
        }
      }
    }
    await deleteTasks(tasks);
  }

  async function removeCommentsOfTask(taskId) {
    const comments = await _listCommentsForTask(taskId);
    await deleteComments(comments);
  }

  async function _listTasksForProject(projectID) {
    const params = {
      TableName: TASKTABLE,
      IndexName: "byProject",
      KeyConditionExpression: "projectID = :projectID",
      ExpressionAttributeValues: {
        ":projectID": projectID
      },
    };
    try {
      const data = await docClient.query(params).promise();
      return data.Items;
    } catch (err) {
      throw new Error(err);
    }
  }

  async function _listCommentsForTask(taskId) {
    const params = {
      TableName: COMMENTTABLE,
      IndexName: "byTask",
      KeyConditionExpression: "taskID = :taskId",
      ExpressionAttributeValues: {
        ":taskId": taskId
      },
    };
    try {
      const data = await docClient.query(params).promise();
      return data.Items;
    } catch (err) {
      throw new Error(err);
    }
  }

  async function deleteTasks(tasks) {
    for (const task of tasks) {
      const removeCommentsProm = removeCommentsOfTask(task.id);
      const removeTaskProm = deleteTask(task.id)
      await Promise.all([
        removeCommentsProm,
        removeTaskProm,
      ]);
    }
  }

  async function deleteComments(comments) {
    // format data for docClient
    const seedData = comments.map((item) => {
      return {
        DeleteRequest: {
          Key: {
            id: item.id
          }
        }
      };
    });

    /* We can only batch-write 25 items at a time,
      so we'll store both the quotient, as well as what's left.
      */

    let quotient = Math.floor(seedData.length / 25);
    const remainder = seedData.length % 25;
    /* Delete in increments of 25 */

    let batchMultiplier = 1;
    while (quotient > 0) {
      for (let i = 0; i < seedData.length - 1; i += 25) {
        await docClient
          .batchWrite({
              RequestItems: {
                [COMMENTTABLE]: seedData.slice(i, 25 * batchMultiplier),
              },
            },
            (err, data) => {
              if (err) {
                console.log(err);
                console.log("something went wrong...");
              }
            }
          )
          .promise();
        ++batchMultiplier;
        --quotient;
      }
    }

    /* Upload the remaining items (less than 25) */
    if (remainder > 0) {
      await docClient
        .batchWrite({
            RequestItems: {
              [COMMENTTABLE]: seedData.slice(seedData.length - remainder),
            },
          },
          (err, data) => {
            if (err) {
              console.log(err);
              console.log("something went wrong...");
            }
          }
        )
        .promise();
    }
  }

  async function deleteProject(id) {
    const params = {
      TableName: PROJECTTABLE,
      Key: {
        id
      },
      ReturnValues: "ALL_OLD",
    };
    try {
      const data = await docClient.delete(params).promise();
      const response = data.Attributes;
      return response;
    } catch (err) {
      throw new Error(err);
    }
  }

  async function deleteTask(taskID) {
    const params = {
      TableName: TASKTABLE,
      Key: {
        "id": taskID
      },
      ReturnValues: "ALL_OLD",
    }
    try {
      const data = await docClient.delete(params).promise();
      const response = data.Attributes;
      return response;
    } catch (err) {
      throw new Error(err);
    }
  }

  async function _pushUserUpdate(userUpdate) {
    const graphqlQuery = /* GraphQL */ `
      mutation pushUserUpdate($input: PushUserUpdateInput!) {
        pushUserUpdate(input: $input) {
          username
          firstName
          lastName
          gender
          birthdate
          email
          plan
          avatar
          sharedProjects
          watchedTasks
          assignedTasks
          createdAt
          updatedAt
        }
      }
    `
    try {
      const req = new AWS.HttpRequest(APIURL, REGION);
      const endpoint = new urlParse(APIURL).hostname.toString()
      req.method = "POST";
      req.path = "/graphql";
      req.headers.host = endpoint;
      req.headers["Content-Type"] = "application/json";
      req.body = JSON.stringify({
        query: graphqlQuery,
        operationName: "pushUserUpdate",
        variables: {
          input: userUpdate
        }
      });
      const signer = new AWS.Signers.V4(req, "appsync", true);
      signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
      const data = await new Promise((resolve, reject) => {
        const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
          let data = "";
          result.on("data", (chunk) => {
            data += chunk;
          });
          result.on("end", () => {
            resolve(JSON.parse(data.toString()));
          });
        });
        httpRequest.write(req.body);
        httpRequest.end();
      });
      console.log(data)
    } catch (err) {
      throw new Error(err)
    }
  }

  async function _pushProjectUpdate(projectUpdate) {
    const graphqlQuery = /* GraphQL */ `
      mutation pushProjectUpdate($input: PushProjectUpdateInput!) {
        pushProjectUpdate(input: $input) {
          id
          prevProject
          nextProject
          permalink
          title
          tasksCount
          todoCount
          pendingCount
          doneCount
          privacy
          permissions
          updatedAt
          owner
        }
      }
    `
    try {
      const req = new AWS.HttpRequest(APIURL, REGION);
      const endpoint = new urlParse(APIURL).hostname.toString()
      req.method = "POST";
      req.path = "/graphql";
      req.headers.host = endpoint;
      req.headers["Content-Type"] = "application/json";
      req.body = JSON.stringify({
        query: graphqlQuery,
        operationName: "pushProjectUpdate",
        variables: {
          input: projectUpdate
        }
      });
      const signer = new AWS.Signers.V4(req, "appsync", true);
      signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
      const data = await new Promise((resolve, reject) => {
        const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
          let data = "";
          result.on("data", (chunk) => {
            data += chunk;
          });
          result.on("end", () => {
            resolve(JSON.parse(data.toString()));
          });
        });
        httpRequest.write(req.body);
        httpRequest.end();
      });
      console.log(data)
    } catch (err) {
      throw new Error(err)
    }
  }
}