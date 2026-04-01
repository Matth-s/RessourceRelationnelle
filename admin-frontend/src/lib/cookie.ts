export const setAuthCookie = (token: string) => {
  document.cookie = `auth-token=${token}; path=/; SameSite=Lax`;
};

export const getAuthToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth-token="))
    ?.split("=")[1];
};
