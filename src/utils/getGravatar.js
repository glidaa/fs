import crypto from "crypto-browserify";

export default async (email, size = 200) => {
  const normalizedEmail = email.toLowerCase().trim();
  const hash = crypto.createHash("md5").update(normalizedEmail).digest("hex");
  const url = `https://www.gravatar.com/avatar/${hash}?s=${size}`;
  const response = await fetch(url);
  const blob = await response.blob();
  const image = await createImageBitmap(blob);
  return image;
};
