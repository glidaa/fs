const getCryptoKey = (key) =>
  window.crypto.subtle.importKey(
    "raw",
    key,
    {
      name: "HMAC",
      hash: { name: "SHA-256" },
    },
    false,
    ["sign", "verify"]
  );

export const signSha256Hmac = async (key, data) =>
  window.crypto.subtle.sign("HMAC", await getCryptoKey(key), data);

export const hashSha256 = (data) =>
  window.crypto.subtle.digest("SHA-256", data);

export const getRandomValues = (sizeBytes) =>
  window.crypto.getRandomValues(new Uint8Array(sizeBytes));
