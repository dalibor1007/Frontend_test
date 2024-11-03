import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getToken = () => {
  const token = localStorage.getItem("token");
  return token ? `${token}` : null;
};

export const getTitles = async (userId) => {
  try {
    const token = getToken();
    if (!token) throw new Error("Token is missing or invalid");

    const response = await axios.get(`${API_URL}/title`, {
      headers: { Authorization: token },
      params: { userId }, // Sending userId directly as a query parameter
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const addTitle = async (title) => {
  try {
    const token = getToken();
    if (!token) throw new Error("Token is missing or invalid");

    const response = await axios.post(
      `${API_URL}/title`,
      { title: title }, // Sending userId directly in the request body
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const deleteTitle = async (id, userId) => {
  try {
    const token = getToken();
    if (!token) throw new Error("Token is missing or invalid");

    const response = await axios.delete(`${API_URL}/title/${id}`, {
      headers: { Authorization: token },
      data: { userId }, // Sending userId directly in the request body
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
