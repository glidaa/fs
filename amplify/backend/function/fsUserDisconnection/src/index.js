const AWS = require('aws-sdk');
const CONNECTIONTABLE = process.env.API_FSCOREAPI_CONNECTIONTABLE_NAME;
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });
exports.handler = async (event, context, callback) => {
  const deleteParams = {
    TableName: CONNECTIONTABLE,
    Key: {
      id: event.requestContext.connectionId
    }
  };
  try {
    await ddb.delete(deleteParams).promise();
  } catch (err) {
    callback(null, {
      statusCode: 500,
      body: "Failed to disconnect: " + JSON.stringify(err),
    });
  }
  callback(null, { statusCode: 200, body: 'Disconnected.' });
};