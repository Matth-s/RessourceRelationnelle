import axios from "axios";

export const getCategoriesApi = async () => {
  const { data } = await axios.get("/categories");

  return data;
};
