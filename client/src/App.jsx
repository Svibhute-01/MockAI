import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";

import API from "./api/api";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";
import Interview from "./pages/Interview";

export const serverUrl = "http://localhost:3001";

function App() {
  const dispatch=useDispatch()
  useEffect(() => {
  const getUser = async () => {
    try {
      console.log("BASE URL:", API.defaults.baseURL);

      const result = await API.get("/api/user/current-user");

      console.log("USER:", result.data);

      dispatch(setUserData(result.data.user));
    } catch (error) {
      console.error("FETCH USER ERROR:", error);
      dispatch(setUserData(null))
      console.log("ACTUAL URL:", error?.request?.responseURL);
    }
  };

  getUser();
}, [dispatch]);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/interview" element={<Interview/>} />

    </Routes>
  );
}

export default App;