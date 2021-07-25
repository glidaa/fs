var aws = require("aws-sdk");

const lambda = new aws.Lambda({
  region: process.env.REGION,
});

exports.handler = async (event, context) => {
  lambda.invoke(
    {
      FunctionName: "fsCognitoPostConfirmation",
      Payload: JSON.stringify(event, null, 2),
    },
    function (error, data) {
      if (error) {
        context.done("error", error);
      }
      if (data.Payload) {
        context.succeed(data.Payload);
      }
    }
  );
};
