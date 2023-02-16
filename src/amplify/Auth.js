import awsconfig from "../aws-exports";
import * as SRP from "./srp/index.js";
import calculateClaimSig from "./srp/signing/calculateClaimSig";
import { bigIntToHex } from "./util/converters";
import * as cookies from "../controllers/cookies";
import decodeJwt from "../utils/decodeJwt";

class Auth {
  constructor() {
    this.clientId = awsconfig.aws_user_pools_web_client_id;
    this.identityPoolId = awsconfig.aws_cognito_identity_pool_id;
    this.groupId = awsconfig.aws_user_pools_id.split("_")[1];
    this.cognitoEndpoint = `https://cognito-idp.${awsconfig.aws_cognito_region}.amazonaws.com/`;
    this.identityEndpoint = `https://cognito-identity.${awsconfig.aws_cognito_region}.amazonaws.com/`;
    this.accessToken = cookies.getCookie("accessToken");
    this.idToken = cookies.getCookie("idToken");
    this.refreshToken = cookies.getCookie("refreshToken");
    this.secretKey = null;
    this.sessionToken = null;
    if (this.idToken) {
      const decodedIdToken = decodeJwt(this.idToken);
      this.expiresAt = decodedIdToken.exp * 1000;
      this.user = {
        username: decodedIdToken["cognito:username"],
        given_name: decodedIdToken.given_name,
        family_name: decodedIdToken.family_name,
        email: decodedIdToken.email,
      };
    } else {
      this.expiresAt = null;
      this.user = null;
    }
  }
  updateData(accessToken, idToken, refreshToken, refreshed = false) {
    this.accessToken = accessToken;
    this.idToken = idToken;
    this.refreshToken = refreshToken;
    this.secretKey = null;
    this.sessionToken = null;
    const decodedIdToken = decodeJwt(this.idToken);
    this.expiresAt = decodedIdToken.exp * 1000;
    this.user = {
      username: decodedIdToken["cognito:username"],
      given_name: decodedIdToken.given_name,
      family_name: decodedIdToken.family_name,
      email: decodedIdToken.email,
    };
    cookies.setCookie("accessToken", this.accessToken, this.expiresAt);
    cookies.setCookie("idToken", this.idToken, this.expiresAt);
    if (!refreshed) {
      cookies.setCookie(
        "refreshToken",
        this.refreshToken,
        decodedIdToken.iat * 1000 + 3600 * 24 * 30 * 1000
      );
    }
  }
  resetData() {
    this.accessToken = null;
    this.idToken = null;
    this.refreshToken = null;
    this.expiresAt = null;
    this.user = null;
    this.secretKey = null;
    this.sessionToken = null;
    cookies.removeCookie("accessToken");
    cookies.removeCookie("idToken");
    cookies.removeCookie("refreshToken");
  }
  async getUser() {
    if (this.refreshToken) {
      if (this.expiresAt <= Date.now()) {
        await this.refresh();
      }
      return this.user;
    } else {
      throw new Error("User is not logged in");
    }
  }
  async getIdToken() {
    if (this.refreshToken) {
      if (this.expiresAt <= Date.now()) {
        await this.refresh();
      }
      return this.idToken;
    } else {
      throw new Error("User is not logged in");
    }
  }
  async getAccessToken() {
    if (this.refreshToken) {
      if (this.expiresAt <= Date.now()) {
        await this.refresh();
      }
      return this.accessToken;
    } else {
      throw new Error("User is not logged in");
    }
  }
  async isLoggedIn() {
    if (this.refreshToken !== null) {
      return true;
    } else {
      if (this.sessionToken === null) {
        try {
          await this.anonymousSignIn();
        } catch {
          return false;
        }
      }
      return false;
    }
  }
  async signIn(username, password) {
    const a = await SRP.aCreate();
    const A = await SRP.A({ a });
    const SRP_A = bigIntToHex(A);
    const rawSrpAuthRes = await fetch(this.cognitoEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
        "X-Amz-User-Agent": "amazon",
      },
      body: JSON.stringify({
        AuthFlow: "USER_SRP_AUTH",
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: username,
          SRP_A,
        },
        ClientMetadata: {},
      }),
    });
    const srpAuthRes = await rawSrpAuthRes.json();
    if (rawSrpAuthRes.status === 400) {
      throw {
        code: srpAuthRes.__type,
        message: srpAuthRes.message,
      };
    }
    const { claimSig, timestamp } = await calculateClaimSig(
      a,
      this.groupId,
      username,
      password,
      srpAuthRes.ChallengeParameters
    );
    const rawPasswordVerifierRes = await fetch(this.cognitoEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target":
          "AWSCognitoIdentityProviderService.RespondToAuthChallenge",
        "X-Amz-User-Agent": "amazon",
      },
      body: JSON.stringify({
        ChallengeName: "PASSWORD_VERIFIER",
        ClientId: this.clientId,
        ChallengeResponses: {
          USERNAME: srpAuthRes.ChallengeParameters.USER_ID_FOR_SRP,
          TIMESTAMP: timestamp,
          PASSWORD_CLAIM_SECRET_BLOCK:
            srpAuthRes.ChallengeParameters.SECRET_BLOCK,
          PASSWORD_CLAIM_SIGNATURE: claimSig,
        },
      }),
    });
    const passwordVerifierRes = await rawPasswordVerifierRes.json();
    if (rawPasswordVerifierRes.status === 400) {
      throw {
        code: passwordVerifierRes.__type,
        message: passwordVerifierRes.message,
      };
    } else {
      const accessToken = passwordVerifierRes.AuthenticationResult.AccessToken;
      const idToken = passwordVerifierRes.AuthenticationResult.IdToken;
      const refreshToken =
        passwordVerifierRes.AuthenticationResult.RefreshToken;
      this.updateData(accessToken, idToken, refreshToken);
    }
  }
  async forgotPassword(username) {
    const rawForgotPasswordRes = await fetch(this.cognitoEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.ForgotPassword",
        "X-Amz-User-Agent": "amazon",
      },
      body: JSON.stringify({
        ClientId: this.clientId,
        Username: username,
      }),
    });
    const forgotPasswordRes = await rawForgotPasswordRes.json();
    if (rawForgotPasswordRes.status === 400) {
      throw {
        code: forgotPasswordRes.__type,
        message: forgotPasswordRes.message,
      };
    } else {
      return forgotPasswordRes;
    }
  }
  async forgotPasswordSubmit(username, code, newPassword) {
    const rawForgotPasswordSubmitRes = await fetch(this.cognitoEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target":
          "AWSCognitoIdentityProviderService.ConfirmForgotPassword",
        "X-Amz-User-Agent": "amazon",
      },
      body: JSON.stringify({
        ClientId: this.clientId,
        Username: username,
        ConfirmationCode: code,
        Password: newPassword,
      }),
    });
    const forgotPasswordSubmitRes = await rawForgotPasswordSubmitRes.json();
    if (rawForgotPasswordSubmitRes.status === 400) {
      throw {
        code: forgotPasswordSubmitRes.__type,
        message: forgotPasswordSubmitRes.message,
      };
    } else {
      return forgotPasswordSubmitRes;
    }
  }
  async signUp(username, password, attributes) {
    let attributeList = [];
    for (let key in attributes) {
      attributeList.push({
        Name: key,
        Value: attributes[key],
      });
    }
    const rawSignUpRes = await fetch(this.cognitoEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.SignUp",
        "X-Amz-User-Agent": "amazon",
      },
      body: JSON.stringify({
        ClientId: this.clientId,
        Username: username,
        Password: password,
        UserAttributes: attributeList,
      }),
    });
    const signUpRes = await rawSignUpRes.json();
    if (rawSignUpRes.status === 400) {
      throw {
        code: signUpRes.__type,
        message: signUpRes.message,
      };
    } else {
      return signUpRes;
    }
  }
  async confirmSignUp(username, code) {
    const rawConfirmSignUpRes = await fetch(this.cognitoEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.ConfirmSignUp",
        "X-Amz-User-Agent": "amazon",
      },
      body: JSON.stringify({
        ClientId: this.clientId,
        Username: username,
        ConfirmationCode: code,
      }),
    });
    const confirmSignUpRes = await rawConfirmSignUpRes.json();
    if (rawConfirmSignUpRes.status === 400) {
      throw {
        code: confirmSignUpRes.__type,
        message: confirmSignUpRes.message,
      };
    } else {
      return confirmSignUpRes;
    }
  }
  async signOut() {
    const rawSignOutRes = await fetch(this.cognitoEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.RevokeToken",
        "X-Amz-User-Agent": "amazon",
      },
      body: JSON.stringify({
        Token: this.accessToken,
        ClientId: this.clientId,
      }),
    });
    const signOutRes = await rawSignOutRes.json();
    this.resetData();
    return signOutRes;
  }
  async refresh() {
    const rawRefreshTokenRes = await fetch(this.cognitoEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
        "X-Amz-User-Agent": "amazon",
      },
      body: JSON.stringify({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        AuthParameters: {
          REFRESH_TOKEN: this.refreshToken,
        },
        ClientId: this.clientId,
      }),
    });
    const refreshTokenRes = await rawRefreshTokenRes.json();
    if (rawRefreshTokenRes.status === 400) {
      throw {
        code: refreshTokenRes.__type,
        message: refreshTokenRes.message,
      };
    } else {
      const accessToken = refreshTokenRes.AuthenticationResult.AccessToken;
      const idToken = refreshTokenRes.AuthenticationResult.IdToken;
      this.updateData(accessToken, idToken, this.refreshToken, true);
      return refreshTokenRes;
    }
  }
  async anonymousSignIn() {
    const rawIdentifyRes = await fetch(this.identityEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityService.GetId",
        "X-Amz-User-Agent": "amazon",
      },
      body: JSON.stringify({
        IdentityPoolId: this.identityPoolId,
      }),
    });
    const identifyRes = await rawIdentifyRes.json();
    const identityId = identifyRes.IdentityId;
    const rawAnonymousSignInRes = await fetch(this.identityEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityService.GetCredentialsForIdentity",
        "X-Amz-User-Agent": "aws-amplify/4.3.13 js",
      },
      body: JSON.stringify({
        IdentityId: identityId,
      }),
    });
    const anonymousSignInRes = await rawAnonymousSignInRes.json();
    if (rawAnonymousSignInRes.status === 400) {
      throw {
        code: anonymousSignInRes.__type,
        message: anonymousSignInRes.message,
      };
    } else {
      this.accessToken = anonymousSignInRes.Credentials.AccessKeyId;
      this.secretKey = anonymousSignInRes.Credentials.SecretKey;
      this.sessionToken = anonymousSignInRes.Credentials.SessionToken;
      return anonymousSignInRes;
    }
  }
}

const singletone = new Auth();

export default singletone;
