const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const CONNECTIONTABLE = process.env.API_FSCOREAPI_CONNECTIONTABLE_NAME;
exports.handler = async (event, context, callback) => {
  const connectionId = event.requestContext.connectionId;
  const getSessionParams = {
    TableName: CONNECTIONTABLE,
    Key: {
      "id": connectionId
    }
  }
  const sessionData = await docClient.get(getSessionParams).promise()
  const { projectID, username } = sessionData.Item
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
    ...JSON.parse(event.body).data,
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
      } else {
        throw e;
      }
    }
  });
  try {
    await Promise.all(postCalls);
  } catch (e) {
    callback(null, { statusCode: 500, body: e.stack });
  }
  callback(null, { statusCode: 200, body: 'Data sent.' });
};