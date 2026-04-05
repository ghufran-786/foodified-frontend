import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { dataContext } from "../UserContext";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(dataContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
