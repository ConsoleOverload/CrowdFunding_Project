import { createContext, useContext, useEffect, useState } from "react";
import { checkAuth } from "../api/authApi";
import axiosInstance from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,        setUser]        = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  /**
   * fetchUser — calls /auth-api/check-auth which returns the JWT payload
   * (id, email, role), then also fetches full profile so we have name,
   * profileImageURL, numberOfDonations, totalAmountDonated, etc.
   */
  const fetchUser = async () => {
    try {
      const authRes = await checkAuth();
      // JWT payload: { id, email, role, iat, exp }
      const jwtPayload = authRes.data.payload || authRes.data;

      // Fetch full user profile to get name, avatar, stats, etc.
      const profileRes = await axiosInstance.get("/user-api/users");
      const fullUser   = profileRes.data.payload || profileRes.data;

      // Merge: prefer full profile fields, keep JWT role/id as fallback
      setUser({ ...jwtPayload, ...fullUser });
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser().finally(() => setAuthLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
