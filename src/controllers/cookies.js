export const getCookie = (key) => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split("=");
    if (cookie[0]) {
      if (cookie[0].trim() === key) {
        return cookie[1];
      }
    }
  }
  return null;
};

export const setCookie = (key, value, expires) => {
  document.cookie = `${key}=${value}; path=/; expires=${new Date(expires).toUTCString()}`
}

export const removeCookie = (key) => {
  document.cookie = `${key}=; path=/; expires=${new Date(0).toUTCString()}`;
}
