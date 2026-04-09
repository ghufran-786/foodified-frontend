import React, { createContext, useState, useEffect } from "react";
import { food_items } from "./food";

export const dataContext = createContext();

const UserContext = ({ children }) => {
  let [cate, setCate] = useState(food_items);
  let [input, setInput] = useState("");
  let [showCart, setShowCart] = useState(false);
  let [isAuthenticated, setIsAuthenticated] = useState(false);
  let [userName, setUserName] = useState("");
  let [userEmail, setUserEmail] = useState("");

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("authData");
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setIsAuthenticated(authData.isAuthenticated);
        setUserName(authData.userName);
        setUserEmail(authData.userEmail || "");
      } catch (error) {
        console.error("Error parsing stored auth data:", error);
      }
    }
  }, []);

  // Update localStorage whenever auth state changes
  useEffect(() => {
    if (isAuthenticated && userName) {
      localStorage.setItem(
        "authData",
        JSON.stringify({ isAuthenticated, userName, userEmail })
      );
    } else if (!isAuthenticated) {
      localStorage.removeItem("authData");
    }
  }, [isAuthenticated, userName, userEmail]);

  let data = {
    input,
    setInput,
    cate,
    setCate,
    showCart,
    setShowCart,
    isAuthenticated,
    setIsAuthenticated,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
  };

  return (
    <div>
      <dataContext.Provider value={data}>{children}</dataContext.Provider>
    </div>
  );
};

export default UserContext;
