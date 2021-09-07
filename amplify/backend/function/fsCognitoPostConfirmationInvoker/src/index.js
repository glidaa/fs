var aws = require("aws-sdk");

const ENV = process.env.ENV
const REGION = process.env.REGION

const lambda = new aws.Lambda({
  region: REGION,
});

exports.handler = async (event) => {
  console.log(event)
  try {
    const data = await lambda.invoke({
        FunctionName: `fsCognitoPostConfirmation-${ENV}`,
        InvocationType: "Event",
        Payload: JSON.stringify(event, null, 2)
      }).promise();
    return event;
  } catch (err) {
    throw new Error(err)
  }
};
