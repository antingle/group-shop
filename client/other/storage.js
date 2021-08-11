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

export const removeStorageData = (itemStored) => {
  try {
    const key = getStorageKey(itemStored);
    AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};
export const clearStorageData = () => {
  AsyncStorage.clear();
};

/*
  storage keys in use:
    "@user"
    "@lists"
    "@theme"
    "@token"
    -- all list IDs for offline use
*/

const getStorageKey = (itemStored) => {
  return String("@" + itemStored);
};
