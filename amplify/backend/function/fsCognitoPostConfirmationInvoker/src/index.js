var aws = require("aws-sdk");

aws.config.region = process.env.REGION

const lambda = new aws.Lambda({
  region: process.env.REGION,
});

exports.handler = async (event) => {
  console.log(event)
  try {
    const data = await lambda.invoke({
        FunctionName: "fsCognitoPostConfirmation",
        InvocationType: "Event",
        Payload: JSON.stringify(event, null, 2)
      }).promise();
    return data;
  } catch (err) {
    throw new Error(err)
  }
};
