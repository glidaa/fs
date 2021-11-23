/* eslint-disable-line */ 

const aws = require('aws-sdk');
const sgMail = require('@sendgrid/mail');
const getEmailContent = require("./email/index").getContent;
require('dotenv').config();

const docClient = new aws.DynamoDB.DocumentClient();
const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
});
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    const emailToBeSent = getEmailContent("accountCreation", {
      FIRST_NAME: userData.firstName,
    })
    await sgMail.send({
      to: userData.email,
      from: "notify@forwardslash.ch",
      subject: emailToBeSent.subject,
      html: emailToBeSent.body
    })
    return event;
  } catch (err) {
    throw new Error(err)
  }
};