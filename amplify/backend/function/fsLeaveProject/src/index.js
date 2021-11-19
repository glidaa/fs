const AWS = require('aws-sdk');
const CONNECTIONTABLE = process.env.API_FSCOREAPI_CONNECTIONTABLE_NAME;
const docClient = new AWS.DynamoDB.DocumentClient();
exports.handler = async (event, context, callback) => {
  const deleteParams = {
    TableName: CONNECTIONTABLE,
    Key: {
      id: event.requestContext.connectionId
    }
  };
  try {
    await docClient.delete(deleteParams).promise();
  } catch (err) {
    callback(null, {
      statusCode: 500,
      body: "Failed to disconnect: " + JSON.stringify(err),
    });
  }
  callback(null, { statusCode: 200, body: 'Disconnected.' });
};