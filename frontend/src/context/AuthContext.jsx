import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { checkAuth } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const fetchUser = async () => {

    try {

      const res = await checkAuth();

      setUser(res.data.payload);

    } catch {

      setUser(null);

    } finally {

      setLoading(false);

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
        loading,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);