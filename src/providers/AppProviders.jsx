import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { CircularProgress, Container, Box } from "@mui/material";

export const AuthContext = createContext({
  authUser: null,
});

const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = () => auth.signOut();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
      setIsLoading(false)
    });
  }, []);

  if (isLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" pt="10rem">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        authUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
