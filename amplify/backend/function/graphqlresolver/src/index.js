const {
  v4: uuidv4
} = require('uuid');
const AWSXRay = require("aws-xray-sdk-core");
const AWS = AWSXRay.captureAWS(require("aws-sdk"));

const docClient = new AWS.DynamoDB.DocumentClient();

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
    deleteProjectAndNotes: (ctx) => {
      return deleteProjectAndNotes(ctx);
    },
    deleteNoteAndComments: (ctx) => {
      return deleteNoteAndComments(ctx);
    },
    deleteComment: (ctx) => {
      return deleteComment(ctx);
    },
  },
  Query: {
    listNotesForProject: (ctx) => {
      return listNotesForProject(ctx);
    },
    listCommentsForNote: (ctx) => {
      return listCommentsForNote(ctx);
    },
  }
};

exports.handler = async function (ctx, context) {
  console.log(ctx);

  const typeHandler = resolvers[ctx.typeName];
  if (typeHandler) {
    const resolver = typeHandler[ctx.fieldName];
    if (resolver) {
      return await resolver(ctx);
    }
  }
  throw new Error("Resolver not found.");
};

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

async function isProjectOwnerOrAssignee(projectID, client) {
  const params = {
    TableName: PROJECTTABLE,
    Key: {
      "id": projectID
    }
  }
  const data = await docClient.get(params).promise()
  return client === data.Item.owner || data.Item.assignees.includes(client)
}

async function isNoteOwnerOrAssignee(noteID, client) {
  const params = {
    TableName: NOTETABLE,
    Key: {
      "id": noteID
    }
  }
  const data = await docClient.get(params).promise()
  return client === data.Item.owner || data.Item.assignees.includes(client)
}

async function createProject(ctx) {
  const client = ctx.identity.claims["cognito:username"]
  if (client) {
    const projectData = {
      ...ctx.arguments.input,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client,
      assignees: []
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
    return null;
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
      assignees: []
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
    return null;
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
    return null;
  }
}

async function listNotesForProject(ctx) {
  const projectID = ctx.arguments.projectID
  const client = ctx.identity.claims["cognito:username"]
  if (await isProjectOwnerOrAssignee(projectID, client)) {
    const params = {
      TableName: NOTETABLE,
      IndexName: "byProject",
      KeyConditionExpression: "projectID = :projectID",
      FilterExpression: "owner = :client OR contains (assignees, :client)",
      ExpressionAttributeValues: {
        ":projectID": projectID,
        ":client": client
      },
    };
    try {
      const data = await docClient.query(params).promise();
      return {
        items: data.Items
      }
    } catch (err) {
      return err;
    }
  } else {
    return null;
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
    return null;
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
      const deletedNote = data.Attributes;
      return {
        id: deletedNote.id
      };
    } catch (err) {
      return err;
    }
  } else {
    return null;
  }
}

async function deleteProjectAndNotes(ctx) {
  const projectID = ctx.arguments.projectID
  const client = ctx.identity.claims["cognito:username"]
  if (await isProjectOwner(projectID, client)) {
    const removeNotesProm = removeNotesOfProject(projectID);
    const removeProjectProm = removeProject(projectID);
    const [_, deletedProject] = await Promise.all([
      removeNotesProm,
      removeProjectProm,
    ]);
    return {
      id: deletedProject.id
    };
  } else {
    return
  }
}

async function deleteNoteAndComments(ctx) {
  const noteID = ctx.arguments.noteId
  const client = ctx.identity.claims["cognito:username"]
  if (await isNoteOwner(noteID, client)) {
    const removeCommentsProm = removeCommentsOfNote(noteID);
    const removeNoteProm = removeNote(noteID);
    const [_, deletedNote] = await Promise.all([
      removeCommentsProm,
      removeNoteProm,
    ]);
    return {
      id: deletedNote.id
    };
  } else {
    return
  }
}

async function removeProject(projectID) {
  const deletedProject = await deleteProject(projectID);
  console.log("Deleted project is: ", deletedProject);
  console.log("Deleted project with id: ", deletedProject.id);
  return deletedProject;
}

async function removeNote(noteId) {
  const deletedNote = await deleteNote(noteId);
  console.log("Deleted note is: ", deletedNote);
  console.log("Deleted note with id: ", deletedNote.id);
  return deletedNote;
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
    const removeNoteProm = removeNote(note.id);
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