export const setAuthCookie = (token: string) => {
  cookieStore.set("auth-token", token);
};

export const getAuthToken = () => {
  return document.cookie
    .split(";")
    .find((row) => row.startsWith("auth-token="))
    ?.split("=")[1];
};
