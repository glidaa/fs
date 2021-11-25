export default async () => {
  try {
    const testFile = "https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png"
    const options = {
      method: 'GET',
      cache: 'no-store'
    };
    const online = await fetch(testFile, options);
    return online.status >= 200 && online.status < 300;
  } catch (err) {
    return false;
  }
};