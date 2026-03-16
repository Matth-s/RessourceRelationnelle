import axios from 'axios';

export const getAwaitedResourcesApi = async () => {
  const { data } = await axios('/resources/awaited');

  return data;
};
