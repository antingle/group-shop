import React, { createContext, useState } from "react";

export const ListContext = createContext();

export const ListProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState(false);
  const [creatingList, setCreatingList] = useState(false);
  const [currentListID, setCurrentListID] = useState(null);

  return (
    <ListContext.Provider
      value={{
        creatingList,
        setCreatingList,
        currentListID,
        setCurrentListID,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
