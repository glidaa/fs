var aws = require("aws-sdk");

const lambda = new aws.Lambda({
  region: process.env.REGION,
});

exports.handler = async (event, context) => {
  console.log(event)
  lambda.invoke(
    {
      FunctionName: "fsCognitoPostConfirmation",
      Payload: JSON.stringify(event, null, 2),
    },
    function (error, data) {
      console.log(data)
      if (error) {
        context.fail("error", error);
      }
      if (data.Payload) {
        context.succeed(data.Payload);
      }
    }
  );
};
