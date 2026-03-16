import axios from 'axios';

export const getCommentsToVerify = async () => {
  const { data } = await axios.get('/comments/moderate');

  return data;
};
