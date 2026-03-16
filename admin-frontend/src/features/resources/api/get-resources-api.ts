import axios from 'axios';

export const getResourcesApi = async () => {
  const { data } = await axios.get('/resource');

  return data;
};
