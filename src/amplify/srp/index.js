import BigInt from "big-integer";
import { getRandomValues } from "../util/crypto.js";
import padHex from "../util/padHex.js";
import modPow from "../util/modPow.js";
import { hexToBigInt, uint8ToHex, bigIntToHex } from "../util/converters.js";

import { N, g } from "./params.js";
import { hashHex, hashUtf8 } from "../util/hashing.js";

export const aCreate = async () => hexToBigInt(uint8ToHex(getRandomValues(32)));

export const A = async ({ a }) => modPow(g, a, N);

export const k = async () =>
  hexToBigInt(await hashHex(`00${bigIntToHex(N)}0${bigIntToHex(g)}`));

export const u = async ({ A, B }) =>
  hexToBigInt(await hashHex(padHex(A) + padHex(B)));

export const S = async ({ u, a, x, B, k }) =>
  modPow(B.subtract(modPow(g, x, N).multiply(k)), BigInt(u).multiply(x).add(a), N);

export const x = async (salt, groupId, userIdForSrp, password) =>
  hexToBigInt(
    await hashHex(
      padHex(salt) + (await hashUtf8(`${groupId}${userIdForSrp}:${password}`))
    )
  );
