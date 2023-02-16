/* Amplify Params - DO NOT EDIT
  AUTH_FSCOGNITO_USERPOOLID
  ENV
  REGION
Amplify Params - DO NOT EDIT */

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
require('dotenv').config();

const {
  SENDGRID_API_KEY,
  RDS_HOST,
  RDS_USER,
  RDS_PASSWORD,
} = process.env;

const aws = require('aws-sdk');
const sgMail = require('@sendgrid/mail');
const mariadb = require('mariadb');
const getEmailContent = require('./email/index').getContent;

const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
});
sgMail.setApiKey(SENDGRID_API_KEY);

const pool = mariadb.createPool({
  host: RDS_HOST,
  user: RDS_USER,
  password: RDS_PASSWORD,
  database: 'forwardslash',
  connectionLimit: 5,
});

exports.handler = async (event) => {
  try {
    const query = 'CALL create_user(?, ?, ?, ?)';
    const params = [
      event.userName,
      event.request.userAttributes.given_name,
      event.request.userAttributes.family_name,
      event.request.userAttributes.email,
    ];
    const addUserParams = {
      GroupName: 'free',
      UserPoolId: event.userPoolId,
      Username: event.userName,
    };
    await cognitoidentityserviceprovider.adminAddUserToGroup(addUserParams).promise();
    await pool.execute(query, params);
    const emailToBeSent = getEmailContent('accountCreation', {
      FIRST_NAME: params[1],
    });
    await sgMail.send({
      to: params[3],
      from: 'notify@forwardslash.ch',
      subject: emailToBeSent.subject,
      html: emailToBeSent.body,
    });
    return event;
  } catch (err) {
    throw new Error(err);
  }
};
