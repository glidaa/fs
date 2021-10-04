/* Amplify Params - DO NOT EDIT
	API_FSCOREAPI_COMMENTTABLE_ARN
	API_FSCOREAPI_COMMENTTABLE_NAME
	API_FSCOREAPI_GRAPHQLAPIIDOUTPUT
	API_FSCOREAPI_PROJECTTABLE_ARN
	API_FSCOREAPI_PROJECTTABLE_NAME
	API_FSCOREAPI_TASKTABLE_ARN
	API_FSCOREAPI_TASKTABLE_NAME
	API_FSCOREAPI_USERTABLE_ARN
	API_FSCOREAPI_USERTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  }, 
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
