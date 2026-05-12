import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {

  // LOAD USER FROM LOCALSTORAGE

  const [user, setUser] =
    useState(() => {

      const storedUser =
        localStorage.getItem("user");

      return storedUser
        ? JSON.parse(storedUser)
        : null;
    });

  // SAVE USER TO LOCALSTORAGE

  useEffect(() => {

    if (user) {

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

    } else {

      localStorage.removeItem("user");

    }

  }, [user]);

  return (

    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>

  );
};

export const useAuth = () =>
  useContext(AuthContext);