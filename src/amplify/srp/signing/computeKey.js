import { signSha256Hmac } from "../../util/crypto.js";

import {
  uint8ToHex,
  codePointToUint8,
  abufToUint8,
} from "../../util/converters.js";

const computeKey = async (message, key) => {
  const pdk1 = await signSha256Hmac(key, message);
  const pdk2 = await signSha256Hmac(
    abufToUint8(pdk1),
    codePointToUint8("Caldera Derived Key\u0001")
  );
  const hex = uint8ToHex(abufToUint8(pdk2));
  return hex.slice(0, 32);
};

export default computeKey;
