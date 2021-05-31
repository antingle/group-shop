import AsyncStorage from "@react-native-async-storage/async-storage";

export const getStorageData = async (itemStored, field = "all") => {
  try {
    const key = getStorageKey(itemStored);
    const jsonValue = await AsyncStorage.getItem(key);
    storedData = jsonValue != null ? JSON.parse(jsonValue) : null;

    if (field === "all") return storedData;
    else return storedData[field];
  } catch (e) {
    console.log(e);
  }
};

export const setStorageData = async (itemStored, value) => {
  try {
    const key = getStorageKey(itemStored);
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const removeStorageData = async (itemStored) => {
  try {
    const key = getStorageKey(itemStored);
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};

/*
  storage keys in use:
    "@user"
    "@lists"
*/

const getStorageKey = (itemStored) => {
  let key;
  switch (itemStored) {
    case "user":
      key = "@user";
      break;
    case "lists":
      key = "@lists";
      break;
  }
  return key;
};
