const { v4: uuidv4 } = require('uuid');
const AWSXRay = require("aws-xray-sdk-core");
const AWS = AWSXRay.captureAWS(require("aws-sdk"));

const docClient = new AWS.DynamoDB.DocumentClient();

const UNAUTHORIZED = "UNAUTHORIZED";
const ALREADY_ASSIGNED = "ALREADY_ASSIGNED";
const USER_NOT_ASSIGNED = "USER_NOT_ASSIGNED";
const NOT_ASSIGNED = "NOT_ASSIGNED";
const PROJECT_NOT_FOUND = "PROJECT_NOT_FOUND";
const NOTE_NOT_FOUND = "NOTE_NOT_FOUND";
const COMMENT_NOT_FOUND = "COMMENT_NOT_FOUND";

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
    importData: (ctx) => {
      return importData(ctx);
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
    onImportOwnedProjects: (ctx) => {
      return onImportOwnedProjects(ctx);
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
    onCreateCommentByNoteID: (ctx) => {
      return onCreateCommentByNoteID(ctx);
    },
    onUpdateCommentByNoteID: (ctx) => {
      return onUpdateCommentByNoteID(ctx);
    },
    onDeleteCommentByNoteID: (ctx) => {
      return onDeleteCommentByNoteID(ctx);
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

async function isProjectOwner(projectID, client) {
  const params = {
    TableName: PROJECTTABLE,
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

async function isNoteOwner(noteID, client) {
  const params = {
    TableName: NOTETABLE,
    Key: {
      "id": noteID
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

async function isNoteOwnerOrAssignee(noteID, client) {
  const params = {
    TableName: NOTETABLE,
    Key: {
      "id": noteID
    }
  }
  try {
    const data = await docClient.get(params).promise()
    if (data.Item) {
      return client === data.Item.owner || client === data.Item.assignee
    } else {
      throw new Error(NOTE_NOT_FOUND)
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
      notesCount: 0,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client
    }
    projectData.prevProject = projectData.prevProject || null
    projectData.nextProject = projectData.nextProject || null
    const params = {
      TableName: PROJECTTABLE,
      Item: projectData
    };
    try {
      await docClient.put(params).promise();
      await injectProjectOrder(projectData.id, projectData.prevProject, projectData.nextProject)
      return projectData;
    } catch (err) {
      throw new Error(err);
    }
  } else {
    throw new Error(UNAUTHORIZED)
  }
}

async function removeNoteOrder(noteID) {
  const noteParams = {
    TableName: NOTETABLE,
    Key: {
      "id": noteID
    },
    ProjectionExpression: "prevNote, nextNote"
  }
  const noteData = await docClient.get(noteParams).promise()
  if (noteData.Item) {
    const { prevNote, nextNote } = noteData.Item
    const prevNoteUpdateParams = {
      TableName: NOTETABLE,
      Key: {
        "id": prevNote
      },
      UpdateExpression: "SET nextNote = :nextNote, updatedAt = :updatedAt",
      ReturnValues: "NONE",
      ExpressionAttributeValues: {
        ":nextNote": nextNote,
        ":updatedAt": new Date().toISOString()
      }
    };
    const nextNoteUpdateParams = {
      TableName: NOTETABLE,
      Key: {
        "id": nextNote
      },
      UpdateExpression: "SET prevNote = :prevNote, updatedAt = :updatedAt",
      ReturnValues: "NONE",
      ExpressionAttributeValues: {
        ":prevNote": prevNote,
        ":updatedAt": new Date().toISOString()
      }
    };
    try {
      if (prevNote) {
        await docClient.update(prevNoteUpdateParams).promise()
      }
      if (nextNote) {
        await docClient.update(nextNoteUpdateParams).promise()
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}

async function injectNoteOrder(noteID, prevNote, nextNote) {
  const prevNoteUpdateParams = {
    TableName: NOTETABLE,
    Key: {
      "id": prevNote
    },
    UpdateExpression: "SET nextNote = :nextNote, updatedAt = :updatedAt",
    ReturnValues: "NONE",
    ExpressionAttributeValues: {
      ":nextNote": noteID,
      ":updatedAt": new Date().toISOString()
    }
  };
  const nextNoteUpdateParams = {
    TableName: NOTETABLE,
    Key: {
      "id": nextNote
    },
    UpdateExpression: "SET prevNote = :prevNote, updatedAt = :updatedAt",
    ReturnValues: "NONE",
    ExpressionAttributeValues: {
      ":prevNote": noteID,
      ":updatedAt": new Date().toISOString()
    }
  };
  try {
    if (prevNote) {
      await docClient.update(prevNoteUpdateParams).promise()
    }
    if (nextNote) {
      await docClient.update(nextNoteUpdateParams).promise()
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function createNote(ctx) {
  const projectID = ctx.arguments.input.projectID
  const client = ctx.identity.sub
  const projectParams = {
    TableName: PROJECTTABLE,
    Key: {
      "id": projectID
    }
  }
  const projectData = await docClient.get(projectParams).promise()
  if (client === projectData.Item.owner) {
    const noteData = {
      ...ctx.arguments.input,
      id: uuidv4(),
      permalink: projectData.Item.notesCount + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client,
      assignee: NOT_ASSIGNED
    }
    noteData.prevNote = noteData.prevNote || null
    noteData.nextNote = noteData.nextNote || null
    const projectUpdateParams = {
      TableName: PROJECTTABLE,
      Key: {
        "id": projectID
      },
      UpdateExpression: "SET notesCount = notesCount + :increment, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":increment": 1,
        ":updatedAt": new Date().toISOString()
      },
      ReturnValues: "NONE"
    };
    const noteParams = {
      TableName: NOTETABLE,
      Item: noteData
    };
    try {
      await docClient.put(noteParams).promise();
      await injectNoteOrder(noteData.id, noteData.prevNote, noteData.nextNote)
      await docClient.update(projectUpdateParams).promise()
      return noteData;
    } catch (err) {
      throw new Error(err);
    }
  } else {
    throw new Error(UNAUTHORIZED)
  }
}

async function createComment(ctx) {
  const noteID = ctx.arguments.input.noteID
  const client = ctx.identity.sub
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

async function updateNote(ctx) {
  const updateData = ctx.arguments.input
  const noteID = updateData.id
  const client = ctx.identity.sub
  if (isNoteOwner(noteID, client)) {
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
      TableName: NOTETABLE,
      Key: {
        "id": noteID
      },
      UpdateExpression: updateExp,
      ExpressionAttributeValues: expAttrVal,
      ReturnValues: "ALL_NEW"
    };
    try {
      if (updateData.prevNote !== undefined && updateData.nextNote !== undefined) {
        await removeNoteOrder(noteID)
        await injectNoteOrder(noteID, updateData.prevNote, updateData.nextNote)
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

async function assignNote(ctx) {
  const noteID = ctx.arguments.noteID
  const client = ctx.identity.sub
  const noteGetParams = {
    TableName: NOTETABLE,
    Key: {
      "id": noteID
    }
  }
  const noteData = await docClient.get(noteGetParams).promise()
  if (client === noteData.Item.owner) {
    if (noteData.Item.assignee === NOT_ASSIGNED) {
      const noteUpdateParams = {
        TableName: NOTETABLE,
        Key: {
          "id": noteID
        },
        UpdateExpression: "set assignee=:assignee, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":assignee": ctx.arguments.assignee,
          ":updatedAt": new Date().toISOString()
        },
        ReturnValues: "ALL_NEW"
      };
      try {
        const updatedNote = await docClient.update(noteUpdateParams).promise();
        return updatedNote.Attributes;
      } catch (err) {
        throw new Error(err);
      }
    } else {
      return ALREADY_ASSIGNED
    }
  } else {
    throw new Error(UNAUTHORIZED)
  }
}

async function disallowNote(ctx) {
  const noteID = ctx.arguments.noteID
  const client = ctx.identity.sub
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
          ":assignee": NOT_ASSIGNED
        },
        ReturnValues: "ALL_NEW"
      };
      try {
        const updatedNote = await docClient.update(noteUpdateParams).promise();
        return updatedNote.Attributes;
      } catch (err) {
        throw new Error(err);
      }
    } else {
      return USER_NOT_ASSIGNED
    }
  } else {
    throw new Error(UNAUTHORIZED)
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
    for (const project of data) {
      const notes = project.notes
      const projectData = await createProject({
        [identity.sub]: client,
        [arguments.input]: {
          prevProject: project.prevProject,
          nextProject: project.nextProject,
          permalink: project.permalink,
          title: project.title,
        }
      })
      for (const note of notes) {
        await createNote({
          [identity.sub]: client,
          [arguments.input]: {
            projectID: projectData.id,
            prevNote: note.prevNote,
            nextNote: note.nextNote,
            note: note.note,
            isDone: note.isDone,
            task: note.task,
            description: note.description,
            steps: note.steps,
            due: note.due,
            watcher: note.watcher,
            tag: note.tag,
            sprint: note.sprint,
            status: note.status
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

async function listNotesForProject(ctx) {
  const projectID = ctx.arguments.projectID
  const client = ctx.identity.sub
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
    throw new Error(err);
  }
}

async function listCommentsForNote(ctx) {
  const noteID = ctx.arguments.noteID
  const client = ctx.identity.sub
  if (await isNoteOwnerOrAssignee(noteID, client)) {
    try {
      const commentsList = await _listCommentsForNote(noteID)
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

async function deleteProjectAndNotes(ctx) {
  const projectID = ctx.arguments.projectID
  const client = ctx.identity.sub
  if (await isProjectOwner(projectID, client)) {
    const removeNotesProm = removeNotesOfProject(projectID);
    const removeProjectProm = deleteProject(projectID);
    const [_, deletedProject] = await Promise.all([
      removeNotesProm,
      removeProjectProm,
    ]);
    await removeProjectOrder(projectID)
    return deletedProject
  } else {
    throw new Error(UNAUTHORIZED)
  }
}

async function deleteNoteAndComments(ctx) {
  const noteID = ctx.arguments.noteId
  const client = ctx.identity.sub
  if (await isNoteOwner(noteID, client)) {
    const removeCommentsProm = removeCommentsOfNote(noteID);
    const removeNoteProm = deleteNote(noteID);
    const [_, deletedNote] = await Promise.all([
      removeCommentsProm,
      removeNoteProm,
    ]);
    await removeNoteOrder(noteID)
    return deletedNote
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
      notesCount: 0,
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
      notesCount: 0,
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
      notesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: client
    }
  } else {
    throw new Error(UNAUTHORIZED)
  }
}

async function onAssignNote(ctx) {
  const client = ctx.identity.sub
  const assignee = ctx.arguments.assignee
  if (client === assignee) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      note: "Dump Note",
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

async function onDisallowNote(ctx) {
  const client = ctx.identity.sub
  const assignee = ctx.arguments.assignee
  if (client === assignee) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      note: "Dump Note",
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

async function onUpdateAssignedNoteByProjectID(ctx) {
  const client = ctx.identity.sub
  const assignee = ctx.arguments.assignee
  if (client === assignee) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      note: "Dump Note",
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

async function onDeleteAssignedNoteByProjectID(ctx) {
  const client = ctx.identity.sub
  const assignee = ctx.arguments.assignee
  if (client === assignee) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      note: "Dump Note",
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

async function onCreateOwnedNoteByProjectID(ctx) {
  const client = ctx.identity.sub
  const projectID = ctx.arguments.projectID
  if (isProjectOwner(projectID, client)) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      note: "Dump Note",
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

async function onUpdateOwnedNoteByProjectID(ctx) {
  const client = ctx.identity.sub
  const projectID = ctx.arguments.projectID
  if (isProjectOwner(projectID, client)) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      note: "Dump Note",
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

async function onDeleteOwnedNoteByProjectID(ctx) {
  const client = ctx.identity.sub
  const projectID = ctx.arguments.projectID
  if (isProjectOwner(projectID, client)) {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      projectID: "00000000-0000-0000-0000-000000000000",
      note: "Dump Note",
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

async function onCreateCommentByNoteID(ctx) {
  const client = ctx.identity.sub
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
    throw new Error(UNAUTHORIZED)
  }
}

async function onUpdateCommentByNoteID(ctx) {
  const client = ctx.identity.sub
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
    throw new Error(UNAUTHORIZED)
  }
}

async function onDeleteCommentByNoteID(ctx) {
  const client = ctx.identity.sub
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
    throw new Error(UNAUTHORIZED)
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
    throw new Error(err);
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
    throw new Error(err);
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
    throw new Error(err);
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
    throw new Error(err);
  }
}
