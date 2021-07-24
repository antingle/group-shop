import { useContext } from "react";
import { ListContext } from "../contexts/ListContext";

export default function useList() {
  const context = useContext(ListContext);

  if (!context) {
    throw new Error("useList must be used within the ListProvider");
  }

  return context;
}
