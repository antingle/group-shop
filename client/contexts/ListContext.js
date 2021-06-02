import React, { createContext, useState } from "react";

export const ListContext = createContext();

export const ListProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState(false);
  const [creatingList, setCreatingList] = useState(false);

  return (
    <ListContext.Provider
      value={{
        creatingList,
        setCreatingList,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
