import { hexToUint8, abufToUint8, codePointToUint8, uint8ToHex } from "./converters.js";
import { hashSha256 } from "./crypto.js";

export const hashHex = async (hex) =>
  uint8ToHex(abufToUint8(await hashSha256(hexToUint8(hex))));

export const hashUtf8 = async (utf8) =>
  uint8ToHex(abufToUint8(await hashSha256(codePointToUint8(utf8))));