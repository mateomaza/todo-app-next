import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const useAuth = () => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  return { loading, isAuthenticated };
};

export default useAuth;
