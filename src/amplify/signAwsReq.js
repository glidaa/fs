import sortObj from "../utils/sortObj";
import { abufToUint8, uint8ToHex } from "./util/converters";
import { hashSha256, signSha256Hmac } from "./util/crypto";

const encoder = new TextEncoder("utf-8");

const getSignatureKey = async (key, dateStamp, regionName, serviceName) => {
  const kDate = await signSha256Hmac(encoder.encode("AWS4" + key), encoder.encode(dateStamp));
  const kRegion = await signSha256Hmac(kDate, encoder.encode(regionName));
  const kService = await signSha256Hmac(kRegion, encoder.encode(serviceName));
  const kSigning = await signSha256Hmac(kService, encoder.encode("aws4_request"));
  return kSigning;
};

const signAwsReq = async (
  method,
  service,
  endpoint,
  region,
  accessKey,
  secretKey,
  sessionToken,
  payload,
  headers = {},
) => {
  const parsedEndpoint = new URL(endpoint);
  const host = parsedEndpoint.hostname;
  const amzDate = new Date().toISOString().replace(/-|:|(\.\d+)/g, "");
  const dateStamp = amzDate.split("T")[0];
  const canonicalUri = parsedEndpoint.pathname;
  const canonicalQuerystring = "";
  headers = sortObj({
    "Content-Type": "application/json",
    "host": host,
    "X-Amz-Date": amzDate,
    "X-Amz-Security-Token": sessionToken,
    "X-Amz-User-Agent": "aws-amplify/4.3.13 js",
    ...headers
  })
  let canonicalHeaders = "";
  for (const header of Object.entries(headers)) {
    canonicalHeaders += `${header[0].toLowerCase()}:${header[1]}\n`;
  }
  const signedHeaders = Object.keys(headers).map((x) => x.toLowerCase()).join(";");
  const payloadHash = uint8ToHex(abufToUint8(await hashSha256(encoder.encode(payload))));
  const canonicalRequest =
    method +
    "\n" +
    canonicalUri +
    "\n" +
    canonicalQuerystring +
    "\n" +
    canonicalHeaders +
    "\n" +
    signedHeaders +
    "\n" +
    payloadHash;
  const algorithm = "AWS4-HMAC-SHA256";
  const credential_scope =
    dateStamp + "/" + region + "/" + service + "/" + "aws4_request";
  const string_to_sign =
    algorithm +
    "\n" +
    amzDate +
    "\n" +
    credential_scope +
    "\n" +
    uint8ToHex(abufToUint8(await hashSha256(encoder.encode(canonicalRequest))));
  const signingKey = await getSignatureKey(secretKey, dateStamp, region, service);
  const signature = uint8ToHex(abufToUint8(await signSha256Hmac(signingKey, encoder.encode(string_to_sign))));
  const authorizationHeader =
    algorithm +
    " " +
    "Credential=" +
    accessKey +
    "/" +
    credential_scope +
    ", " +
    "SignedHeaders=" +
    signedHeaders +
    ", " +
    "Signature=" +
    signature;
  return {
    ...headers,
    Authorization: authorizationHeader,
  };
};

export default signAwsReq;
