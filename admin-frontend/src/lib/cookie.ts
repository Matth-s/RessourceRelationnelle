export const setAuthCookie = (token: string) => {
  document.cookie = `auth-token=${token}; path=/; SameSite=Lax`;
};

export const getAuthToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth-token="))
    ?.split("=")[1];
};

export const deleteAuthCookie = () => {
  document.cookie = `auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
};
