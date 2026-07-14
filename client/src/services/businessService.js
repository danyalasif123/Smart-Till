import api from "./api";

export const registerBusiness = async (data) => {
  const response = await api.post(
    "/business/register",
    data
  );

  return response.data;
};