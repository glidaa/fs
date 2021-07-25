const { v4: uuidv4 } = require('uuid');
const AWSXRay = require("aws-xray-sdk-core");
const AWS = AWSXRay.captureAWS(require("aws-sdk"));

const docClient = new AWS.DynamoDB.DocumentClient();

const UNAUTHORIZED = "UNAUTHORIZED";
const ALREADY_ASSIGNED = "ALREADY_ASSIGNED";
const INVALID_ASSIGNEE = "INVALID_ASSIGNEE"
const USER_NOT_ASSIGNED = "USER_NOT_ASSIGNED";
const USER_NOT_FOUND = "USER_NOT_FOUND";
const PROJECT_NOT_FOUND = "PROJECT_NOT_FOUND";
const TASK_NOT_FOUND = "TASK_NOT_FOUND";
const COMMENT_NOT_FOUND = "COMMENT_NOT_FOUND";

const TODO = "todo"
const PENDING = "pending"
const DONE = "done"

const USERTABLE = process.env.USERTABLE;
const PROJECTTABLE = process.env.PROJECTTABLE;
const TASKTABLE = process.env.TASKTABLE;
const COMMENTTABLE = process.env.COMMENTTABLE;

const resolvers = {
  Mutation: {
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
    importData: (ctx) => {
      return importData(ctx);
    },
  },
  Query: {
    getUserByID: (ctx) => {
      return getUserByID(ctx);
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
    listTasksForProject: (ctx) => {
      return listTasksForProject(ctx);
    },
    listCommentsForTask: (ctx) => {
      return listCommentsForTask(ctx);
    }
  }, 
  Subscription: {
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
    onAssignTask: (ctx) => {
      return onAssignTask(ctx);
    },
    onunassignTask: (ctx) => {
      return onunassignTask(ctx);
    },
    onUpdateAssignedTaskByProjectID: (ctx) => {
      return onUpdateAssignedTaskByProjectID(ctx);
    },
    onDeleteAssignedTaskByProjectID: (ctx) => {
      return onDeleteAssignedTaskByProjectID(ctx);
    },
    onCreateOwnedTaskByProjectID: (ctx) => {
      return onCreateOwnedTaskByProjectID(ctx);
    },
    onUpdateOwnedTaskByProjectID: (ctx) => {
      return onUpdateOwnedTaskByProjectID(ctx);
    },
    onDeleteOwnedTaskByProjectID: (ctx) => {
      return onDeleteOwnedTaskByProjectID(ctx);
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

exports.handler = async function (ctx) {
  console.log(ctx);

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
}

async function isProjectSharedWithClient(projectID, client) {
  const params = {
    TableName: PROJECTTABLE,
    ProjectionExpression: "privacy, members, owner",
    Key: {
      "id": projectID
    }
  }
  try {
    const data = await docClient.get(params).promise()
    if (data.Item) {
      const { privacy, members, owner } = data.Item
      return "public" === privacy || members.includes(client) || client === owner
    } else {
      throw new Error(PROJECT_NOT_FOUND)
    }
  } catch (err) {
    throw new Error(err)
  }
}

async function isProjectEditableByClient(projectID, client) {
  const params = {
    TableName: PROJECTTABLE,
    ProjectionExpression: "privacy, members, owner, permissions",
    Key: {
      "id": projectID
    }
  }
  try {
    const data = await docClient.get(params).promise()
    if (data.Item) {
      const { privacy, members, owner, permissions } = data.Item
      return ("rw" === permissions && ("public" === privacy || members.includes(client))) || client === owner
    } else {
      throw new Error(PROJECT_NOT_FOUND)
    }
  } catch (err) {
    throw new Error(err)
  }
}

async function isProjectOwner(projectID, client) {
  const params = {
    TableName: PROJECTTABLE,
    ProjectionExpression: "owner",
    Key: {
      "id": projectID
    }
  }
  try {
    const data = await docClient.get(params).promise()
    if (data.Item) {
      return client === data.Item.owner
    } else {
      throw new Error(PROJECT_NOT_FOUND)
    }
  } catch (err) {
    throw new Error(err)
  }
}

async function isTaskOwner(taskID, client) {
  const params = {
    TableName: TASKTABLE,
    ProjectionExpression: "owner",
    Key: {
      "id": taskID
    }
  }
  try {
    const data = await docClient.get(params).promise()
    if (data.Item) {
      return client === data.Item.owner
    } else {
      throw new Error(PROJECT_NOT_FOUND)
    }
  } catch (err) {
    throw new Error(err)
  }
}

async function isCommentOwner(commentID, client) {
  const params = {
    TableName: COMMENTTABLE,
    ProjectionExpression: "owner",
    Key: {
      "id": commentID
    }
  }
  try {
    const data = await docClient.get(params).promise()
    if (data.Item) {
      return client === data.Item.owner
    } else {
      throw new Error(COMMENT_NOT_FOUND)
    }
  } catch (err) {
    throw new Error(err)
  }
}

async function isTaskSharedWithClient(taskID, client) {
  const params = {
    TableName: TASKTABLE,
    ProjectionExpression: "projectID",
    Key: {
      "id": taskID
    }
  }
  try {
    const data = await docClient.get(params).promise()
    if (data.Item) {
      const { projectID } = data.Item
      return await isProjectSharedWithClient(projectID, client)
    } else {
      throw new Error(TASK_NOT_FOUND)
    }
  } catch (err) {
    throw new Error(err)
  }
}

async function isTaskEditableByClient(taskID, client) {
  const params = {
    TableName: TASKTABLE,
    ProjectionExpression: "projectID",
    Key: {
      "id": taskID
    }
  }
  try {
    const data = await docClient.get(params).promise()
    if (data.Item) {
      const { projectID } = data.Item
      return await isProjectEditableByClient(projectID, client)
    } else {
      throw new Error(TASK_NOT_FOUND)
    }
  } catch (err) {
    throw new Error(err)
  }
}

async function getUserByID(ctx) {
  const params = {
    TableName: USERTABLE,
    Key: {
      "id": ctx.arguments.userID
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

async function removeProjectOrder(projectID) {
  const projectParams = {
    TableName: PROJECTTABLE,
    Key: {
      "id": projectID
    },
    ProjectionExpression: "prevProject, nextProject"
  }
  const projectData = await docClient.get(projectParams).promise()
  if (projectData.Item) {
    const { prevProject, nextProject } = projectData.Item
    const prevProjectUpdateParams = {
      TableName: PROJECTTABLE,
      Key: {
        "id": prevProject
      },
      UpdateExpression: "SET nextProject = :nextProject, updatedAt = :updatedAt",
      ReturnValues: "NONE",
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
      ReturnValues: "NONE",
      ExpressionAttributeValues: {
        ":prevProject": prevProject,
        ":updatedAt": new Date().toISOString()
      }
    };
    try {
      if (prevProject) {
        await docClient.update(prevProjectUpdateParams).promise()
      }
      if (nextProject) {
        await docClient.update(nextProjectUpdateParams).promise()
      }
    } catch (err) {
      throw new Error(err);
    }
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
    ReturnValues: "NONE",
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
    ReturnValues: "NONE",
    ExpressionAttributeValues: {
      ":prevProject": projectID,
      ":updatedAt": new Date().toISOString()
    }
  };
  try {
    if (prevProject) {
      await docClient.update(prevProjectUpdateParams).promise()
    }
    if (nextProject) {
      await docClient.update(nextProjectUpdateParams).promise()
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function createProject(ctx) {
  const client = ctx.identity.sub
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
  const taskParams = {
    TableName: TASKTABLE,
    Key: {
      "id": taskID
    },
    ProjectionExpression: "prevTask, nextTask"
  }
  const taskData = await docClient.get(taskParams).promise()
  if (taskData.Item) {
    const { prevTask, nextTask } = taskData.Item
    const prevTaskUpdateParams = {
      TableName: TASKTABLE,
      Key: {
        "id": prevTask
      },
      UpdateExpression: "SET nextTask = :nextTask, updatedAt = :updatedAt",
      ReturnValues: "NONE",
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
      ReturnValues: "NONE",
      ExpressionAttributeValues: {
        ":prevTask": prevTask,
        ":updatedAt": new Date().toISOString()
      }
    };
    try {
      if (prevTask) {
        await docClient.update(prevTaskUpdateParams).promise()
      }
      if (nextTask) {
        await docClient.update(nextTaskUpdateParams).promise()
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}

async function injectTaskOrder(taskID, prevTask, nextTask) {
  const prevTaskUpdateParams = {
    TableName: TASKTABLE,
    Key: {
      "id": prevTask
    },
    UpdateExpression: "SET nextTask = :nextTask, updatedAt = :updatedAt",
    ReturnValues: "NONE",
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
    ReturnValues: "NONE",
    ExpressionAttributeValues: {
      ":prevTask": taskID,
      ":updatedAt": new Date().toISOString()
    }
  };
  try {
    if (prevTask) {
      await docClient.update(prevTaskUpdateParams).promise()
    }
    if (nextTask) {
      await docClient.update(nextTaskUpdateParams).promise()
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function updateTaskCount(taskID, nextStatus = null) {
  const taskGetParams = {
    TableName: TASKTABLE,
    Key: {
      "id": taskID
    }
  }
  const taskData = await docClient.get(taskGetParams).promise()
  if (taskData.Item) {
    const { projectID, status: prevStatus } = taskData.Item
    const projectUpdateParams = {
      TableName: PROJECTTABLE,
      Key: {
        "id": projectID
      },
      UpdateExpression: "SET todoCount = todoCount + :isTodo, pendingCount = pendingCount + :isPending, doneCount = doneCount + :isDone, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":isTodo": (-1 * prevStatus === TODO) || (1 * nextStatus === TODO),
        ":isPending": (-1 * prevStatus === PENDING) || (1 * nextStatus === PENDING),
        ":isDone": (-1 * prevStatus === DONE) || (1 * nextStatus === DONE),
        ":updatedAt": new Date().toISOString()
      },
      ReturnValues: "NONE"
    };
    try {
      if (prevStatus !== nextStatus) await docClient.update(projectUpdateParams).promise();
    } catch (err) {
      throw new Error(err);
    }
  } else {
    throw new Error(TASK_NOT_FOUND)
  }
}

async function createTask(ctx) {
  const projectID = ctx.arguments.input.projectID
  const client = ctx.identity.sub
  const projectParams = {
    TableName: PROJECTTABLE,
    Key: {
      "id": projectID
    }
  }
  const projectData = await docClient.get(projectParams).promise()
  const isAuthorized = await isProjectEditableByClient(projectID, client)
  if (isAuthorized) {
    const taskData = {
      ...ctx.arguments.input,
      id: uuidv4(),
      status: ctx.arguments.input.status || TODO,
      permalink: projectData.Item.tasksCount + 1,
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
        ":isTodo": 1 * taskData.status === TODO,
        ":isPending": 1 * taskData.status === PENDING,
        ":isDone": 1 * taskData.status === DONE,
        ":updatedAt": new Date().toISOString()
      },
      ReturnValues: "NONE"
    };
    const taskParams = {
      TableName: TASKTABLE,
      Item: taskData
    };
    try {
      await docClient.put(taskParams).promise();
      if (isCont) {
        await injectTaskOrder(taskData.id, taskData.prevTask, null)
      } else {
        await injectTaskOrder(taskData.id, taskData.prevTask, taskData.nextTask)
      }
      await docClient.update(projectUpdateParams).promise()
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
  const client = ctx.identity.sub
  const isAuthorized = await isTaskSharedWithClient(taskID, client)
  if (isAuthorized) {
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
  const client = ctx.identity.sub
  if (isProjectOwner(projectID, client)) {
    delete updateData["id"]
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
      TableName: PROJECTTABLE,
      Key: {
        "id": projectID
      },
      UpdateExpression: updateExp,
      ExpressionAttributeValues: expAttrVal,
      ReturnValues: "ALL_NEW"
    };
    try {
      if (updateData.prevProject !== undefined && updateData.nextProject !== undefined) {
        await removeProjectOrder(projectID)
        await injectProjectOrder(projectID, updateData.prevProject, updateData.nextProject)
      }
      const data = await docClient.update(params).promise();
      return data.Attributes;
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
  const client = ctx.identity.sub
  const isAuthorized = await isTaskEditableByClient(taskID, client)
  if (isAuthorized) {
    delete updateData["id"]
    const expAttrVal = {}
    let updateExp = []
    for (const item in updateData) {
      expAttrVal[`:${item}`] = updateData[item]
      updateExp.push(`${item}=:${item}`)
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
    try {
      if (updateData.prevTask !== undefined && updateData.nextTask !== undefined) {
        await removeTaskOrder(taskID)
        await injectTaskOrder(taskID, updateData.prevTask, updateData.nextTask)
      }
      const data = await docClient.update(taskUpdateParams).promise();
      if (updateData.status) await updateTaskCount(taskID, updateData.status)
      return data.Attributes;
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
  const client = ctx.identity.sub
  if (isCommentOwner(commentID, client)) {
    delete updateData["id"]
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
      ReturnValues: "ALL_NEW"
    };
    try {
      const data = await docClient.update(params).promise();
      return data.Attributes;
    } catch (err) {
      throw new Error(err);
    }
  } else {
    throw new Error(UNAUTHORIZED)
  }
}

async function assignTask(ctx) {
  const { assignee, taskID } = ctx.arguments
  const client = ctx.identity.sub
  const isValidAssignee = /^(user:[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12})|(anonymous:(\w+\s)*\w+)$/.test(assignee)
  if (isValidAssignee) {
    const [, assigneeType, assigneeID] = assignee.match(/(user|anonymous):(.*)/)
    const isUser = assigneeType === "user"
    const taskGetParams = {
      TableName: TASKTABLE,
      Key: {
        "id": taskID
      }
    }
    const userGetParams = {
      TableName: USERTABLE,
      Key: {
        "id": assigneeID
      }
    }
    const taskData = await docClient.get(taskGetParams).promise()
    const userData = isUser && await docClient.get(userGetParams).promise()
    const { projectID, assignees } = taskData.Item
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
          ReturnValues: "ALL_NEW"
        };
        const userUpdateParams = isUser && {
          TableName: USERTABLE,
          Key: {
            "id": assigneeID
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
          if (isUser) await docClient.update(userUpdateParams).promise();
          return updatedTask.Attributes;
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
  const { assignee, taskID } = ctx.arguments
  const client = ctx.identity.sub
  const isValidAssignee = /^(user:[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12})|(anonymous:(\w+\s)*\w+)$/.test(assignee)
  if (isValidAssignee) {
    const [, assigneeType, assigneeID] = assignee.match(/(user|anonymous):(.*)/)
    const isUser = assigneeType === "user"
    const taskGetParams = {
      TableName: TASKTABLE,
      Key: {
        "id": taskID
      }
    }
    const userGetParams = {
      TableName: USERTABLE,
      Key: {
        "id": assigneeID
      }
    }
    const taskData = await docClient.get(taskGetParams).promise()
    const userData = isUser && await docClient.get(userGetParams).promise()
    const { projectID, assignees } = taskData.Item
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
          ReturnValues: "ALL_NEW"
        };
        const userUpdateParams = isUser && {
          TableName: USERTABLE,
          Key: {
            "id": assigneeID
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
          if (isUser) await docClient.update(userUpdateParams).promise();
          return updatedTask.Attributes;
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

async function getLastProject (client) {
  const params = {
    TableName: PROJECTTABLE,
    IndexName: "byOwner",
    ProjectionExpression: "id, nextProject",
    KeyConditionExpression: "#owner = :owner",
    ExpressionAttributeNames: { "#owner": "owner" },
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
    ProjectionExpression: "id, nextTask",
    KeyConditionExpression: "projectID = :projectID",
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
  const client = ctx.identity.sub
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
          sub: client
        },
        arguments: {
          input: {
            permalink: project.permalink,
            title: project.title
          }
        }
      })
      let sortedTasks = parseLinkedList(tasks, "prevTask", "nextTask")
      const sortedTasksCount = sortedTasks.length
      for (let k = 0; k < sortedTasksCount; k++) {
        const task = sortedTasks[k]
        await createTask({
          identity: {
            sub: client
          },
          arguments: {
            input: {
              projectID: projectData.id,
              task: task.task,
              description: task.description,
              due: task.due,
              tags: task.tags,
              status: task.status
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
  const params = {
    TableName: PROJECTTABLE,
    Key: {
      "permalink": ctx.arguments.permalink
    }
  }
  const data = await docClient.get(params).promise()
  return data.Item
}

async function listOwnedProjects(ctx) {
  const client = ctx.identity.sub
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
  const client = ctx.identity.sub
  const params = {
    TableName: TASKTABLE,
    IndexName: "byAssignee",
    ProjectionExpression: "projectID",
    KeyConditionExpression: "assignee = :assignee",
    ExpressionAttributeValues: {
      ":assignee": client
    },
  };
  try {
    const data = await docClient.query(params).promise();
    let projects = new Set()
    for (const item of data.Items) {
      projects.add(item.projectID)
    }
    projects = Array.from(projects)
    for (const [i, projectID] of projects.entries()) {
      projects[i] = await getProjectByID({
        arguments: {
          projectID
        }
      })
    }
    return {
      items: projects
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function listTasksForProject(ctx) {
  const projectID = ctx.arguments.projectID
  const client = ctx.identity.sub
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
      items: data.Items.filter(item => (
        client === item.owner || client === item.assignee
      ))
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function listCommentsForTask(ctx) {
  const taskID = ctx.arguments.taskID
  const client = ctx.identity.sub
  if (await isTaskSharedWithClient(taskID, client)) {
    try {
      const commentsList = await _listCommentsForTask(taskID)
      return {
        items: commentsList
      };
    } catch (err) {
      throw new Error(err);
    }
  } else {
    throw new Error(UNAUTHORIZED)
  }
}

async function deleteComment(ctx) {
  const commentID = ctx.arguments.commentID
  const client = ctx.identity.sub
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
  const client = ctx.identity.sub
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
  const client = ctx.identity.sub
  if (await isTaskOwner(taskID, client)) {
    const removeCommentsProm = removeCommentsOfTask(taskID);
    const removeTaskProm = deleteTask(taskID);
    const [_, deletedTask] = await Promise.all([
      removeCommentsProm,
      removeTaskProm,
    ]);
    await removeTaskOrder(taskID)
    await updateTaskCount(taskID)
    return deletedTask
  } else {
    throw new Error(UNAUTHORIZED)
  }
}

async function onCreateOwnedProject(ctx) {
  const client = ctx.identity.sub
  const owner = ctx.arguments.owner
  if (client === owner) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      permalink: "dump-project",
      title: "Dump Project",
      tasksCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client
    }
  } else {
    throw new Error(UNAUTHORIZED)
  }
}

async function onImportOwnedProjects(ctx) {
  const client = ctx.identity.sub
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

async function onUpdateOwnedProject(ctx) {
  const client = ctx.identity.sub
  const owner = ctx.arguments.owner
  if (client === owner) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      permalink: "dump-project",
      title: "Dump Project",
      tasksCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client
    }
  } else {
    throw new Error(UNAUTHORIZED)
  }
}

async function onDeleteOwnedProject(ctx) {
  const client = ctx.identity.sub
  const owner = ctx.arguments.owner
  if (client === owner) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      permalink: "dump-project",
      title: "Dump Project",
      tasksCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client
    }
  } else {
    throw new Error(UNAUTHORIZED)
  }
}

async function onAssignTask(ctx) {
  const client = ctx.identity.sub
  const assignee = ctx.arguments.assignee
  if (client === assignee) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      task: "Dump Task",
      permalink: 1,
      isDone: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client,
      assignee: client
    }
  } else {
    throw new Error(UNAUTHORIZED)
  }
}

async function onunassignTask(ctx) {
  const client = ctx.identity.sub
  const assignee = ctx.arguments.assignee
  if (client === assignee) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      task: "Dump Task",
      permalink: 1,
      isDone: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client,
      assignee: client
    }
  } else {
    throw new Error(UNAUTHORIZED)
  }
}

async function onUpdateAssignedTaskByProjectID(ctx) {
  const client = ctx.identity.sub
  const assignee = ctx.arguments.assignee
  if (client === assignee) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      task: "Dump Task",
      permalink: 1,
      isDone: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client,
      assignee: client
    }
  } else {
    throw new Error(UNAUTHORIZED)
  }
}

async function onDeleteAssignedTaskByProjectID(ctx) {
  const client = ctx.identity.sub
  const assignee = ctx.arguments.assignee
  if (client === assignee) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      task: "Dump Task",
      permalink: 1,
      isDone: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client,
      assignee: client
    }
  } else {
    throw new Error(UNAUTHORIZED)
  }
}

async function onCreateOwnedTaskByProjectID(ctx) {
  const client = ctx.identity.sub
  const projectID = ctx.arguments.projectID
  if (isProjectOwner(projectID, client)) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      task: "Dump Task",
      permalink: 1,
      isDone: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client,
      assignee: client
    }
  } else {
    throw new Error(UNAUTHORIZED)
  }
}

async function onUpdateOwnedTaskByProjectID(ctx) {
  const client = ctx.identity.sub
  const projectID = ctx.arguments.projectID
  if (isProjectOwner(projectID, client)) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      task: "Dump Task",
      permalink: 1,
      isDone: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client,
      assignee: client
    }
  } else {
    throw new Error(UNAUTHORIZED)
  }
}

async function onDeleteOwnedTaskByProjectID(ctx) {
  const client = ctx.identity.sub
  const projectID = ctx.arguments.projectID
  if (isProjectOwner(projectID, client)) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      task: "Dump Task",
      permalink: 1,
      isDone: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client,
      assignee: client
    }
  } else {
    throw new Error(UNAUTHORIZED)
  }
}

async function onCreateCommentByTaskID(ctx) {
  const client = ctx.identity.sub
  const taskID = ctx.arguments.taskID
  if (isTaskSharedWithClient(taskID, client)) {
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
  const client = ctx.identity.sub
  const taskID = ctx.arguments.taskID
  if (isTaskSharedWithClient(taskID, client)) {
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

async function onDeleteCommentByTaskID(ctx) {
  const client = ctx.identity.sub
  const taskID = ctx.arguments.taskID
  if (isTaskSharedWithClient(taskID, client)) {
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

async function deleteTask(id) {
  const params = {
    TableName: TASKTABLE,
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
