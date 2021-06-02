import { useContext } from "react";
import { ListContext } from "../contexts/ListContext";

export default function useList() {
  const context = useContext(ListContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
