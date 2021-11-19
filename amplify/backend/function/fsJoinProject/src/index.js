const AWS = require('aws-sdk');
const CognitoExpress = require("cognito-express");
const docClient = new AWS.DynamoDB.DocumentClient();

const CONNECTIONTABLE = process.env.API_FSCOREAPI_CONNECTIONTABLE_NAME;
const PROJECTTABLE = process.env.API_FSCOREAPI_PROJECTTABLE_NAME;

const REGION = process.env.REGION;

const USERPOOL = process.env.AUTH_FSCOGNITO_USERPOOLID;

const UNAUTHORIZED = "UNAUTHORIZED";
const PROJECT_NOT_FOUND = "PROJECT_NOT_FOUND";

const cognitoExpress = new CognitoExpress({
	region: REGION,
	cognitoUserPoolId: USERPOOL,
	tokenUse: "access",
	tokenExpiration: 3600000
});

async function getProject(projectID) {
  const params = {
    TableName: PROJECTTABLE,
    Key: {
      "id": projectID
    }
  }
  try {
    const data = await docClient.get(params).promise()
    if (data.Item) {
      return data.Item
    } else {
      throw new Error(PROJECT_NOT_FOUND)
    }
  } catch (err) {
    throw new Error(err)
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

exports.handler = async (event, context, callback) => {
  const { projectID, jwt } = JSON.parse(event.body).data;
  let username;
  try {
    username = (await cognitoExpress.validate(jwt)).username;
  } catch {
    callback(null, { statusCode: 401, body: UNAUTHORIZED });
  }
  try {
    if (await isProjectSharedWithClient(projectID, username)) {
      const putParams = {
        TableName: CONNECTIONTABLE,
        Item: {
          id: event.requestContext.connectionId,
          projectID: projectID,
          username: username
        },
      };
      await docClient.put(putParams).promise();
      callback(null, { statusCode: 200, body: 'Connected.' });
    } else {
      callback(null, { statusCode: 401, body: UNAUTHORIZED });
    }
  } catch (err) {
    callback(null, { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) });
  }
};
