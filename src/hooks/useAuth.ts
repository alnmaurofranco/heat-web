import { useContext } from "react";
import { AuthContext } from "../contexts/auth";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Context does not exists.");
  }

  return context;
}
