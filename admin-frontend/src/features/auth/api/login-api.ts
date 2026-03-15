import type { loginType } from '../schemas/login-schema';

export const loginApi = async (credentials: loginType) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const res = await fetch(
      `${import.meta.env.VITE_PUBLIC_API_ROUTE}/authentication/login`,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
    );

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();

    return data;
  } catch (err) {
    throw err;
  }
};
