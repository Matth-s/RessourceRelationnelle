import axios from 'axios';

export const getPopulariesResourcesApi = async () => {
  const { data } = await axios.get('/resource/popularies');

  return data;
};
