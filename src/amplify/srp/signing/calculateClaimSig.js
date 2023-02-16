import padHex from "../../util/padHex.js";
import { hexToUint8, hexToBigInt } from "../../util/converters.js";
import * as SRP from "../index.js";
import getTimestamp from "../../util/getTimestamp.js";
import computeKey from "./computeKey.js";
import getSecret from "./getSecret.js";
import signSecret from "./signSecret.js";

const calculateClaimSig = async (a, groupId, userId, password, challengeParameters) => {
  const timestamp = getTimestamp();
  const salt = challengeParameters.SALT;
  const B = hexToBigInt(challengeParameters.SRP_B);
  const A = await SRP.A({ a });
  const u = await SRP.u({ A, B });
  const k = await SRP.k();
  const x = await SRP.x(salt, groupId, userId, password);
  const s = await SRP.S({ u, a, x, B, k });
  const hkdf = await computeKey(hexToUint8(padHex(s)), hexToUint8(padHex(u)));

  const messageBuf = getSecret({ timestamp, challengeParameters, groupId });
  const claimSig = await signSecret(messageBuf, hkdf);

  return { claimSig, timestamp };
};

export default calculateClaimSig;
