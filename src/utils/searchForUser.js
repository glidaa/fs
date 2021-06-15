import { API, Auth } from "aws-amplify";

export default async (filter) => {
  const queryData = { 
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
    },
    queryStringParameters: {
        filter: filter,
    },
  };
  try {
    return await API.get("AdminQueries", "/searchForUser", queryData)
  } catch(err) {
    console.error(err)
  }
}