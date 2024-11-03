import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  getTitles as fetchTitles,
  addTitle as createTitle,
  deleteTitle as removeTitle,
} from "../services/titleService";
import { AuthContext } from "./authContext";

export const TitleContext = createContext();

export const TitleProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [titles, setTitles] = useState([]);

  // Define loadTitles with useCallback to memoize it
  const loadTitles = useCallback(async (userId) => {
    if (!userId) return; // Prevent call if userId is undefined
    const response = await fetchTitles(userId);
    if (response.success) {
      setTitles(response.data);
    } else {
      console.error("Failed to load titles:", response.message);
    }
  }, []);

  // Call loadTitles only once when user ID changes
  useEffect(() => {
    if (user?.uuid) {
      loadTitles(user.uuid);
    }
  }, [user?.uuid, loadTitles]);

  const addTitle = async (titleData) => {
    const response = await createTitle(titleData);
    if (response.success) {
      setTitles((prevTitles) => [...prevTitles, response.data]);
    } else {
      console.error("Failed to add title:", response.message);
    }
  };

  const deleteTitle = async (id) => {
    const response = await removeTitle(id, user.uuid);
    if (response.success) {
      setTitles((prevTitles) => prevTitles.filter((title) => title.id !== id));
    } else {
      console.error("Failed to delete title:", response.message);
    }
  };

  return (
    <TitleContext.Provider
      value={{ titles, loadTitles, addTitle, deleteTitle }}
    >
      {children}
    </TitleContext.Provider>
  );
};
