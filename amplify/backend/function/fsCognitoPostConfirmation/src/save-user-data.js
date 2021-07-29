/* eslint-disable-line */ 

const aws = require('aws-sdk');

const docClient = new aws.DynamoDB.DocumentClient();
const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
});

const USERTABLE = process.env.API_FSCOREAPI_USERTABLE_NAME;

exports.handler = async (event) => {
  console.log(event)
  try {
    const userData = {
      username: event.userName,
      firstName: event.request.userAttributes.given_name,
      lastName: event.request.userAttributes.family_name,
      gender: event.request.userAttributes.gender,
      birthdate: event.request.userAttributes.birthdate,
      email: event.request.userAttributes.email,
      plan: "free",
      avatar: event.request.userAttributes.picture,
      sharedProjects: [],
      watchedTasks: [],
      assignedTasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const userParams = {
      TableName: USERTABLE,
      Item: userData
    };
    const addUserParams = {
      GroupName: process.env.GROUP,
      UserPoolId: event.userPoolId,
      Username: event.userName,
    };
    await cognitoidentityserviceprovider.adminAddUserToGroup(addUserParams).promise();
    await docClient.put(userParams).promise();
    return event;
  } catch (err) {
    throw new Error(err)
  }
};