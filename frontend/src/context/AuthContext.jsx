import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { checkAuth }
from "../api/authApi";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  const fetchUser = async () => {

  try {

    const res =
      await checkAuth();

    console.log(res.data);

    setUser(
      res.data.user ||
      res.data.payload ||
      res.data
    );

  } catch {

    setUser(null);

  }
};

  useEffect(() => {
    fetchUser();
  }, []);

  return (

    <AuthContext.Provider
      value={{
        user,
        setUser,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>

  );
};

export const useAuth = () =>
  useContext(AuthContext);