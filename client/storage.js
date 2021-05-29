import AsyncStorage from "@react-native-async-storage/async-storage";

export const userID = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@user");
    const user = jsonValue != null ? JSON.parse(jsonValue) : null;
    return user.id;
  } catch (e) {
    console.log(e);
  }
};

export const getStorageData = async (key, field = "all") => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    storedData = jsonValue != null ? JSON.parse(jsonValue) : null;
    // AsyncStorage.removeItem("@lists");
    // AsyncStorage.removeItem("@user");

    if (field === "all") return storedData;
    else return storedData[field];
  } catch (e) {
    console.log(e);
  }
};

export const setStorageData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e);
  }
};
