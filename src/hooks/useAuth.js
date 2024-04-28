import { useContext } from "react";
import { AuthContext } from "../providers/AppProviders";

export const useAuth = () => useContext(AuthContext)