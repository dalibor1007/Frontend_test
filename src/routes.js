import { useContext } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import DashboardLayout from "./layout/dashboardLayout/DashboardLayout";
import LoginLayout from "./layout/LoginLayout";
import DashboardApp from "./pages/DashboardApp";
import Title from "./pages/Title";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { AuthContext } from "./context/authContext";

export const Router = () => {
  const { user } = useContext(AuthContext);

  return useRoutes([
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        {
          path: "app",
          element: user ? <DashboardApp /> : <Navigate to="/login" replace />,
        },
        {
          path: "title",
          element: user ? <Title /> : <Navigate to="/login" replace />,
        },
      ],
    },
    {
      path: "/",
      element: <LoginLayout />,
      children: [
        { path: "/", element: <Navigate to="/login" /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
      ],
    },
    { path: "*", element: <NotFound /> },
  ]);
};
