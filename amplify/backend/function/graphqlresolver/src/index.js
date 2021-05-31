const { v4: uuidv4 } = require('uuid');
const AWSXRay = require("aws-xray-sdk-core");
const AWS = AWSXRay.captureAWS(require("aws-sdk"));

const docClient = new AWS.DynamoDB.DocumentClient();

const NOTETABLE = process.env.NOTETABLE;
const COMMENTTABLE = process.env.COMMENTTABLE;

const resolvers = {
  Mutation: {
    createNote: (ctx) => {
      return createNote(ctx);
    },
    deleteNoteAndComments: (ctx) => {
      return deleteNoteAndComments(ctx);
    },
  },
};

exports.handler = async function (ctx, context) {
  console.log(ctx);
  console.log(context);

  const typeHandler = resolvers[ctx.typeName];
  if (typeHandler) {
    const resolver = typeHandler[ctx.fieldName];
    if (resolver) {
      return await resolver(ctx);
    }
  }
  throw new Error("Resolver not found.");
};

async function createNote(ctx) {
  const noteData = {
    ...ctx.arguments,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: ctx.identity.username,
    assignees: []
  }
  var params = {
    TableName: NOTETABLE,
    Item: noteData
  };
  try {
    await docClient.put(params).promise();
    return noteData;
  } catch (err) {
    return err;
  }
}

async function deleteNoteAndComments(ctx) {
  const removeCommentsProm = removeCommentsOfNote(ctx.arguments.noteId);
  const removeNoteProm = removeNote(ctx.arguments.noteId);
  const [_, deletedNote] = await Promise.all([
    removeCommentsProm,
    removeNoteProm,
  ]);
  return { id: deletedNote.id };
}

async function removeNote(noteId) {
  const deletedNote = await deleteNote(noteId);
  console.log("Deleted note is: ", deletedNote);
  console.log("Deleted note with id: ", deletedNote.id);
  return deletedNote;
}

async function removeCommentsOfNote(noteId) {
  const comments = await listCommentsForNote(noteId);
  await deleteComments(comments);
}

async function listCommentsForNote(noteId) {
  var params = {
    TableName: COMMENTTABLE,
    IndexName: "byNote",
    KeyConditionExpression: "noteID = :noteId",
    ExpressionAttributeValues: { ":noteId": noteId },
  };
  try {
    const data = await docClient.query(params).promise();
    return data.Items;
  } catch (err) {
    return err;
  }
}

async function deleteComments(comments) {
  // format data for docClient
  const seedData = comments.map((item) => {
    return { DeleteRequest: { Key: { id: item.id } } };
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
        .batchWrite(
          {
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
      .batchWrite(
        {
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

async function deleteNote(id) {
  var params = {
    TableName: NOTETABLE,
    Key: { id },
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