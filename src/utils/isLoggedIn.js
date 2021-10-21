import Auth from "@aws-amplify/auth";

export default async () => {
  try {
    await Auth.currentAuthenticatedUser();
    return true;
  } catch {
    return false;
  }
};
