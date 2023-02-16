const decodeJwt = (token) => JSON.parse(window.atob(token.split(".")[1]));

export default decodeJwt;
