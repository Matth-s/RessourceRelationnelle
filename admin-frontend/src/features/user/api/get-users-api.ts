import axios from 'axios';

export const getUsersApi = async () => {
  const { data } = await axios.get('/users');

  return data;
};
