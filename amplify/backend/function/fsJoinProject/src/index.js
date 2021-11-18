const AWS = require('aws-sdk');
const { verifierFactory } = require('@southlane/cognito-jwt-verifier');
const CONNECTIONTABLE = process.env.API_FSCOREAPI_CONNECTIONTABLE_NAME;
const docClient = new AWS.DynamoDB.DocumentClient();

const REGION = process.env.REGION;

const USERPOOL = process.env.AUTH_FSCOGNITO_USERPOOLID;
const APPCLIENT = process.env.AUTH_FSCOGNITO_APPCLIENTID;

const verifier = verifierFactory({
  region: REGION,
  userPoolId: USERPOOL,
  appClientId: APPCLIENT,
  tokenType: 'id'
})

exports.handler = async (event, context, callback) => {
  const { projectID, jwt } = JSON.parse(event.body).data;
  const userData = await verifier.verify(jwt);
  console.log(userData);
  const putParams = {
    TableName: CONNECTIONTABLE,
    Item: {
      id: event.requestContext.connectionId,
      projectID: projectID,
      username: username
    },
  };
  try {
    await docClient.put(putParams).promise();
  } catch (err) {
    callback(null, { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) });
  }
  callback(null, { statusCode: 200, body: 'Connected.' });
};
