const AWS = require('aws-sdk');
const CONNECTIONTABLE = process.env.API_FSCOREAPI_CONNECTIONTABLE_NAME;
const docClient = new AWS.DynamoDB.DocumentClient();
exports.handler = async (event, context, callback) => {
  const connectionId = event.requestContext.connectionId
  const deleteParams = {
    TableName: CONNECTIONTABLE,
    Key: {
      id: connectionId
    },
    ReturnValues: "ALL_OLD",
  };
  try {
    const { Attributes: { projectID, username }} = await docClient.delete(deleteParams).promise();
    const getAvailConnectionsParams = {
      TableName: CONNECTIONTABLE,
      IndexName: "byProject",
      KeyConditionExpression: "projectID = :projectID",
      ExpressionAttributeValues: {
        ":projectID": projectID
      }
    }
    const availConnections = await docClient.query(getAvailConnectionsParams).promise()
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
    });
    const postData = JSON.stringify({
      action: "LEAVE_PROJECT",
      username: username
    });
    const postCalls = availConnections.Items.map(async ({ id }) => {
      try {
        if (id !== connectionId) {
          await apigwManagementApi.postToConnection({ ConnectionId: id, Data: postData }).promise();
        }
      } catch (e) {
        if (e.statusCode === 410) {
          console.log(`Found stale connection, deleting ${id}`);
          await docClient.delete({ TableName: CONNECTIONTABLE, Key: { id } }).promise();
        }
      }
    });
    try {
      await Promise.all(postCalls);
    } catch {}
  } catch (err) {
    callback(null, {
      statusCode: 500,
      body: "Failed to disconnect: " + JSON.stringify(err),
    });
  }
  callback(null, { statusCode: 200, body: 'Disconnected.' });
};