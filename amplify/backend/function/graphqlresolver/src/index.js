const { v4: uuidv4 } = require('uuid');
const AWSXRay = require("aws-xray-sdk-core");
const AWS = AWSXRay.captureAWS(require("aws-sdk"));

const docClient = new AWS.DynamoDB.DocumentClient();

const UNAUTHORIZED = "UNAUTHORIZED";
const ALREADY_ASSIGNED = "ALREADY_ASSIGNED";
const USER_NOT_ASSIGNED = "USER_NOT_ASSIGNED";

const PROJECTTABLE = process.env.PROJECTTABLE;
const NOTETABLE = process.env.NOTETABLE;
const COMMENTTABLE = process.env.COMMENTTABLE;

const resolvers = {
  Mutation: {
    createProject: (ctx) => {
      return createProject(ctx);
    },
    createNote: (ctx) => {
      return createNote(ctx);
    },
    createComment: (ctx) => {
      return createComment(ctx);
    },
    updateProject: (ctx) => {
      return updateProject(ctx);
    },
    updateNote: (ctx) => {
      return updateNote(ctx);
    },
    updateComment: (ctx) => {
      return updateComment(ctx);
    },
    deleteProjectAndNotes: (ctx) => {
      return deleteProjectAndNotes(ctx);
    },
    deleteNoteAndComments: (ctx) => {
      return deleteNoteAndComments(ctx);
    },
    deleteComment: (ctx) => {
      return deleteComment(ctx);
    },
    assignNote: (ctx) => {
      return assignNote(ctx);
    },
    disallowNote: (ctx) => {
      return disallowNote(ctx);
    },
  },
  Query: {
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
    listNotesForProject: (ctx) => {
      return listNotesForProject(ctx);
    },
    listCommentsForNote: (ctx) => {
      return listCommentsForNote(ctx);
    }
  }, 
  Subscription: {
    onCreateOwnedProject: (ctx) => {
      return onCreateOwnedProject(ctx);
    },
    onUpdateOwnedProject: (ctx) => {
      return onUpdateOwnedProject(ctx);
    },
    onDeleteOwnedProject: (ctx) => {
      return onDeleteOwnedProject(ctx);
    },
    onAssignNote: (ctx) => {
      return onAssignNote(ctx);
    },
    onDisallowNote: (ctx) => {
      return onDisallowNote(ctx);
    },
    onUpdateAssignedNoteByProjectID: (ctx) => {
      return onUpdateAssignedNoteByProjectID(ctx);
    },
    onDeleteAssignedNoteByProjectID: (ctx) => {
      return onDeleteAssignedNoteByProjectID(ctx);
    },
    onCreateOwnedNoteByProjectID: (ctx) => {
      return onCreateOwnedNoteByProjectID(ctx);
    },
    onUpdateOwnedNoteByProjectID: (ctx) => {
      return onUpdateOwnedNoteByProjectID(ctx);
    },
    onDeleteOwnedNoteByProjectID: (ctx) => {
      return onDeleteOwnedNoteByProjectID(ctx);
    },
    onCreateCommentByNoteId: (ctx) => {
      return onCreateCommentByNoteId(ctx);
    },
    onUpdateCommentByNoteId: (ctx) => {
      return onUpdateCommentByNoteId(ctx);
    },
    onDeleteCommentByNoteId: (ctx) => {
      return onDeleteCommentByNoteId(ctx);
    }
  }
};

exports.handler = async function (ctx) {
  console.log(ctx);

  const typeHandler = resolvers[ctx.typeName];
  if (typeHandler) {
    const resolver = typeHandler[ctx.fieldName];
    if (resolver) {
      const data = await resolver(ctx);
      if (data === UNAUTHORIZED) {
        throw new Error(UNAUTHORIZED);
      }
      if (data === USER_NOT_ASSIGNED) {
        throw new Error(USER_NOT_ASSIGNED);
      }
      if (data === ALREADY_ASSIGNED) {
        throw new Error(ALREADY_ASSIGNED);
      } else {
        return data
      }
    }
  }
  throw new Error("Resolver not found.");
}

async function isProjectOwner(projectID, client) {
  const params = {
    TableName: PROJECTTABLE,
    Key: {
      "id": projectID
    }
  }
  const data = await docClient.get(params).promise()
  return client === data.Item.owner
}

async function isNoteOwner(noteID, client) {
  const params = {
    TableName: NOTETABLE,
    Key: {
      "id": noteID
    }
  }
  const data = await docClient.get(params).promise()
  return client === data.Item.owner
}

async function isCommentOwner(commentID, client) {
  const params = {
    TableName: COMMENTTABLE,
    Key: {
      "id": commentID
    }
  }
  const data = await docClient.get(params).promise()
  return client === data.Item.owner
}

async function isNoteOwnerOrAssignee(noteID, client) {
  const params = {
    TableName: NOTETABLE,
    Key: {
      "id": noteID
    }
  }
  const data = await docClient.get(params).promise()
  return client === data.Item.owner || client === data.Item.assignee
}



async function createProject(ctx) {
  const client = ctx.identity.claims["cognito:username"]
  if (client) {
    const projectData = {
      ...ctx.arguments.input,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client
    }
    const params = {
      TableName: PROJECTTABLE,
      Item: projectData
    };
    try {
      await docClient.put(params).promise();
      return projectData;
    } catch (err) {
      console.error(err)
      return err;
    }
  } else {
    return UNAUTHORIZED;
  }
}

async function createNote(ctx) {
  const projectID = ctx.arguments.input.projectID
  const client = ctx.identity.claims["cognito:username"]
  if (await isProjectOwner(projectID, client)) {
    const noteData = {
      ...ctx.arguments.input,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client,
      assignee: ""
    }
    const params = {
      TableName: NOTETABLE,
      Item: noteData
    };
    try {
      await docClient.put(params).promise();
      return noteData;
    } catch (err) {
      console.error(err)
      return err;
    }
  } else {
    return UNAUTHORIZED;
  }
}

async function createComment(ctx) {
  const noteID = ctx.arguments.input.noteID
  const client = ctx.identity.claims["cognito:username"]
  if (await isNoteOwnerOrAssignee(noteID, client)) {
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
      console.error(err)
      return err;
    }
  } else {
    return UNAUTHORIZED;
  }
}

async function updateProject(ctx) {
  const updateData = ctx.arguments.input
  const projectID = updateData.id
  const client = ctx.identity.claims["cognito:username"]
  if (isProjectOwner(projectID, client)) {
    delete updateData["id"]
    const expAttrVal = {}
    let updateExp = []
    for (const item in updateData) {
      expAttrVal[`:${item}`] = updateData[item]
      updateExp.push(`${item}=:${item}`)
    }
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
      const data = await docClient.update(params).promise();
      return data.Attributes;
    } catch (err) {
      console.error(err)
      return err;
    }
  } else {
    return UNAUTHORIZED;
  }
}

async function updateNote(ctx) {
  const updateData = ctx.arguments.input
  const noteID = updateData.id
  const client = ctx.identity.claims["cognito:username"]
  if (isNoteOwner(noteID, client)) {
    delete updateData["id"]
    const expAttrVal = {}
    let updateExp = []
    for (const item in updateData) {
      expAttrVal[`:${item}`] = updateData[item]
      updateExp.push(`${item}=:${item}`)
    }
    updateExp = `set ${updateExp.join(", ")}`
    const params = {
      TableName: NOTETABLE,
      Key: {
        "id": noteID
      },
      UpdateExpression: updateExp,
      ExpressionAttributeValues: expAttrVal,
      ReturnValues: "ALL_NEW"
    };
    try {
      const data = await docClient.update(params).promise();
      return data.Attributes;
    } catch (err) {
      console.error(err)
      return err;
    }
  } else {
    return UNAUTHORIZED;
  }
}

async function updateComment(ctx) {
  const updateData = ctx.arguments.input
  const commentID = updateData.id
  const client = ctx.identity.claims["cognito:username"]
  if (isCommentOwner(commentID, client)) {
    delete updateData["id"]
    const expAttrVal = {}
    let updateExp = []
    for (const item in updateData) {
      expAttrVal[`:${item}`] = updateData[item]
      updateExp.push(`${item}=:${item}`)
    }
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
      console.error(err)
      return err;
    }
  } else {
    return UNAUTHORIZED;
  }
}

async function assignNote(ctx) {
  const noteID = ctx.arguments.noteID
  const client = ctx.identity.claims["cognito:username"]
  const noteGetParams = {
    TableName: NOTETABLE,
    Key: {
      "id": noteID
    }
  }
  const noteData = await docClient.get(noteGetParams).promise()
  if (client === noteData.Item.owner) {
    if (!noteData.Item.assignee) {
      const noteUpdateParams = {
        TableName: NOTETABLE,
        Key: {
          "id": noteID
        },
        UpdateExpression: "set assignee=:assignee",
        ExpressionAttributeValues: {
          ":assignee": ctx.arguments.assignee
        },
        ReturnValues: "ALL_NEW"
      };
      try {
        const updatedNote = await docClient.update(noteUpdateParams).promise();
        return updatedNote.Attributes;
      } catch (err) {
        console.error(err)
        return err;
      }
    } else {
      return ALREADY_ASSIGNED
    }
  } else {
    return UNAUTHORIZED;
  }
}

async function disallowNote(ctx) {
  const noteID = ctx.arguments.noteID
  const client = ctx.identity.claims["cognito:username"]
  const noteGetParams = {
    TableName: NOTETABLE,
    Key: {
      "id": noteID
    }
  }
  const noteData = await docClient.get(noteGetParams).promise()
  if (client === noteData.Item.owner) {
    if (noteData.Item.assignee !== ctx.arguments.assignee) {
      const noteUpdateParams = {
        TableName: NOTETABLE,
        Key: {
          "id": noteID
        },
        UpdateExpression: "set assignee=:assignee",
        ExpressionAttributeValues: {
          ":assignee": ""
        },
        ReturnValues: "ALL_NEW"
      };
      try {
        const updatedNote = await docClient.update(noteUpdateParams).promise();
        return updatedNote.Attributes;
      } catch (err) {
        console.error(err)
        return err;
      }
    } else {
      return USER_NOT_ASSIGNED
    }
  } else {
    return UNAUTHORIZED;
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
  const client = ctx.identity.claims["cognito:username"]
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
    console.error(err);
    return err;
  }
}

async function listAssignedProjects(ctx) {
  const client = ctx.identity.claims["cognito:username"]
  const params = {
    TableName: NOTETABLE,
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
    for (const [i, projectID] of projects) {
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
    console.error(err)
    return err;
  }
}

async function listNotesForProject(ctx) {
  const projectID = ctx.arguments.projectID
  const client = ctx.identity.claims["cognito:username"]
  const params = {
    TableName: NOTETABLE,
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
    return err;
  }
}

async function listCommentsForNote(ctx) {
  const noteID = ctx.arguments.noteID
  const client = ctx.identity.claims["cognito:username"]
  if (await isNoteOwnerOrAssignee(noteID, client)) {
    try {
      const commentsList = await _listCommentsForNote(noteID)
      return {
        items: commentsList
      };
    } catch (err) {
      console.error(err)
      return err;
    }
  } else {
    return UNAUTHORIZED;
  }
}

async function deleteComment(ctx) {
  const commentID = ctx.arguments.commentID
  const client = ctx.identity.claims["cognito:username"]
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
      return err;
    }
  } else {
    return UNAUTHORIZED;
  }
}

async function deleteProjectAndNotes(ctx) {
  const projectID = ctx.arguments.projectID
  const client = ctx.identity.claims["cognito:username"]
  if (await isProjectOwner(projectID, client)) {
    const removeNotesProm = removeNotesOfProject(projectID);
    const removeProjectProm = deleteProject(projectID);
    const [_, deletedProject] = await Promise.all([
      removeNotesProm,
      removeProjectProm,
    ]);
    return deletedProject
  } else {
    return UNAUTHORIZED;
  }
}

async function deleteNoteAndComments(ctx) {
  const noteID = ctx.arguments.noteId
  const client = ctx.identity.claims["cognito:username"]
  if (await isNoteOwner(noteID, client)) {
    const removeCommentsProm = removeCommentsOfNote(noteID);
    const removeNoteProm = deleteNote(noteID);
    const [_, deletedNote] = await Promise.all([
      removeCommentsProm,
      removeNoteProm,
    ]);
    return deletedNote
  } else {
    return UNAUTHORIZED;
  }
}

async function onCreateOwnedProject(ctx) {
  const client = ctx.identity.claims["cognito:username"]
  const owner = ctx.arguments.owner
  if (client === owner) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      permalink: "dump-project",
      title: "Dump Project",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client
    }
  } else {
    return UNAUTHORIZED
  }
}

async function onUpdateOwnedProject(ctx) {
  const client = ctx.identity.claims["cognito:username"]
  const owner = ctx.arguments.owner
  if (client === owner) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      permalink: "dump-project",
      title: "Dump Project",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client
    }
  } else {
    return UNAUTHORIZED
  }
}

async function onDeleteOwnedProject(ctx) {
  const client = ctx.identity.claims["cognito:username"]
  const owner = ctx.arguments.owner
  if (client === owner) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      permalink: "dump-project",
      title: "Dump Project",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client
    }
  } else {
    return UNAUTHORIZED
  }
}

async function onAssignNote(ctx) {
  const client = ctx.identity.claims["cognito:username"]
  const assignee = ctx.arguments.assignee
  if (client === assignee) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      note: "Dump Note",
      isDone: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client,
      assignee: client
    }
  } else {
    return UNAUTHORIZED
  }
}

async function onDisallowNote(ctx) {
  const client = ctx.identity.claims["cognito:username"]
  const assignee = ctx.arguments.assignee
  if (client === assignee) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      note: "Dump Note",
      isDone: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client,
      assignee: client
    }
  } else {
    return UNAUTHORIZED
  }
}

async function onUpdateAssignedNoteByProjectID(ctx) {
  const client = ctx.identity.claims["cognito:username"]
  const assignee = ctx.arguments.assignee
  if (client === assignee) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      note: "Dump Note",
      isDone: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client,
      assignee: client
    }
  } else {
    return UNAUTHORIZED
  }
}

async function onDeleteAssignedNoteByProjectID(ctx) {
  const client = ctx.identity.claims["cognito:username"]
  const assignee = ctx.arguments.assignee
  if (client === assignee) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      note: "Dump Note",
      isDone: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client,
      assignee: client
    }
  } else {
    return UNAUTHORIZED
  }
}

async function onCreateOwnedNoteByProjectID(ctx) {
  const client = ctx.identity.claims["cognito:username"]
  const projectID = ctx.arguments.projectID
  if (isProjectOwner(projectID, client)) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      note: "Dump Note",
      isDone: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client,
      assignee: client
    }
  } else {
    return UNAUTHORIZED
  }
}

async function onUpdateOwnedNoteByProjectID(ctx) {
  const client = ctx.identity.claims["cognito:username"]
  const projectID = ctx.arguments.projectID
  if (isProjectOwner(projectID, client)) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      note: "Dump Note",
      isDone: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client,
      assignee: client
    }
  } else {
    return UNAUTHORIZED
  }
}

async function onDeleteOwnedNoteByProjectID(ctx) {
  const client = ctx.identity.claims["cognito:username"]
  const projectID = ctx.arguments.projectID
  if (isProjectOwner(projectID, client)) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      note: "Dump Note",
      isDone: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client,
      assignee: client
    }
  } else {
    return UNAUTHORIZED
  }
}

async function onCreateCommentByNoteId(ctx) {
  const client = ctx.identity.claims["cognito:username"]
  const noteID = ctx.arguments.noteID
  if (isNoteOwnerOrAssignee(noteID, client)) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      noteID: "00000000-0000-0000-0000-000000000000",
      content: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client
    }
  } else {
    return UNAUTHORIZED
  }
}

async function onUpdateCommentByNoteId(ctx) {
  const client = ctx.identity.claims["cognito:username"]
  const noteID = ctx.arguments.noteID
  if (isNoteOwnerOrAssignee(noteID, client)) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      noteID: "00000000-0000-0000-0000-000000000000",
      content: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client
    }
  } else {
    return UNAUTHORIZED
  }
}

async function onDeleteCommentByNoteId(ctx) {
  const client = ctx.identity.claims["cognito:username"]
  const noteID = ctx.arguments.noteID
  if (isNoteOwnerOrAssignee(noteID, client)) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      noteID: "00000000-0000-0000-0000-000000000000",
      content: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client
    }
  } else {
    return UNAUTHORIZED
  }
}

async function removeNotesOfProject(projectID) {
  const notes = await _listNotesForProject(projectID);
  await deleteNotes(notes);
}

async function removeCommentsOfNote(noteId) {
  const comments = await _listCommentsForNote(noteId);
  await deleteComments(comments);
}

async function _listNotesForProject(projectID) {
  const params = {
    TableName: NOTETABLE,
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
    return err;
  }
}

async function _listCommentsForNote(noteId) {
  const params = {
    TableName: COMMENTTABLE,
    IndexName: "byNote",
    KeyConditionExpression: "noteID = :noteId",
    ExpressionAttributeValues: {
      ":noteId": noteId
    },
  };
  try {
    const data = await docClient.query(params).promise();
    return data.Items;
  } catch (err) {
    return err;
  }
}

async function deleteNotes(notes) {
  for (const note of notes) {
    const removeCommentsProm = removeCommentsOfNote(note.id);
    const removeNoteProm = deleteNote(note.id)
    await Promise.all([
      removeCommentsProm,
      removeNoteProm,
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
    return err;
  }
}

async function deleteNote(id) {
  const params = {
    TableName: NOTETABLE,
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
    return err;
  }
}
