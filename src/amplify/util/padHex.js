import { bigIntToHex } from "./converters.js";

const padHex = (input) => {
  const h = typeof input === "string" ? input : bigIntToHex(input);
  return h.length % 2 === 1
    ? `0${h}`
    : "89ABCDEFabcdef".indexOf(h[0]) !== -1
    ? `00${h}`
    : h;
};

export default padHex;
