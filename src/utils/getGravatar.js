import md5 from "blueimp-md5";

const getGravatar = async (email, size = 200) => {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const hash = md5(normalizedEmail);
    const url = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=404`;
    const response = await fetch(url);
    if (response.status !== 404) {
      const blob = await response.blob();
      const imageURL = await new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      return imageURL;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

export default getGravatar;
