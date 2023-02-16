import BigInt from "big-integer";

export const hexToUint8 = (hexString) =>
  new Uint8Array(
    (hexString.match(/.{1,2}/g) || []).map((byte) => parseInt(byte, 16))
  );

export const codePointToUint8 = (codePoints) =>
  new window.TextEncoder().encode(codePoints);

export const abufToUint8 = (buf) => new Uint8Array(buf);

export const uint8ToHex = (uint8) =>
  Array.prototype.map
    .call(uint8, (x) => `00${x.toString(16)}`.slice(-2))
    .join("");

export const uint8ToB64 = (uint8) =>
  window.btoa(String.fromCharCode(...uint8));

export const b64ToUint8 = (b64) =>
  new Uint8Array(
    window.atob(b64)
      .split("")
      .map((c) => c.charCodeAt(0))
  );

export const bigIntToHex = (v) => v.toString(16);

export const hexToBigInt = (hex) => BigInt(`${hex}`, 16);
