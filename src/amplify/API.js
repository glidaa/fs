import awsconfig from "../aws-exports";
import Auth from "./Auth";
import signAwsReq from "./signAwsReq";
import * as mutationsGraphQL from "../graphql/mutations";
import * as mutationId from "../utils/mutationId";

class API {
  constructor() {
    this.mutationQueue = [];
    this.apiEndpoint = awsconfig.aws_appsync_graphqlEndpoint;
    this.region = awsconfig.aws_appsync_region;
  }
  async execute(query, variables) {
    const body = JSON.stringify({ query, variables });
    const headers = (await Auth.isLoggedIn())
      ? {
          "Content-Type": "application/json",
          Authorization: await Auth.getIdToken(),
        }
      : await signAwsReq(
          "POST",
          "appsync",
          this.apiEndpoint,
          this.region,
          Auth.accessToken,
          Auth.secretKey,
          Auth.sessionToken,
          body
        );
    const rawRes = await fetch(this.apiEndpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ query, variables }),
    });
    if (rawRes.status >= 400) {
      throw "Error executing query";
    } else {
      const res = await rawRes.json();
      if (res.errors) {
        throw new Error(res.errors[0].message);
      } else {
        return res;
      }
    }
  }
  async mutate(template) {
    this.mutationQueue.push({
      type: template.type,
      variables: template.variables,
      success: template.success,
      error: template.error,
    });
    if (this.mutationQueue.length === 1) {
      this.sendNextMutation();
    }
  }
  async sendNextMutation(retries = 0) {
    if (this.mutationQueue.length) {
      if (/^update\w+$/.test(this.mutationQueue[0].type)) {
        for (let i = 1; i < this.mutationQueue.length; i++) {
          if (this.mutationQueue[i].type === this.mutationQueue[0].type && this.mutationQueue[i].variables.id === this.mutationQueue[0].variables.id) {
            const redundantMutation = this.mutationQueue.splice(i--, 1)[0];
            Object.assign(this.mutationQueue[0].variables, redundantMutation.variables);
          } else {
            break;
          }
        }
      }
      const mutation = this.mutationQueue[0];
      try {
        const generatedMutationId = mutationId.generate((await Auth.getUser()).username);
        const result = await this.execute(mutationsGraphQL[mutation.type], {
          input: {
            ...mutation.variables,
            mutationId: generatedMutationId,
          }
        });
        if (mutation.success) mutation.success(result);
      } catch (e) {
        if (retries < 0) {
          return this.sendNextMutation(retries + 1);
        } else {
          if (mutation.error) mutation.error(e);
        }
      }
      this.mutationQueue.shift();
      if (this.mutationQueue.length) {
        this.sendNextMutation();
      }
    }
  }
}

const singletone = new API();

export default singletone;
