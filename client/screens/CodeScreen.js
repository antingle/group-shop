import { useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { colors } from "../other/colors.js";
import { JOIN_LIST } from "../graphql/graphql.js";
import { getStorageData, setStorageData } from "../other/storage.js";

export default function CodeScreen({ navigation }) {
  const [code, setCode] = React.useState(null);

  const mergeList = async (value) => {
    try {
      let lists = await getStorageData("lists");
      if (lists == null) lists = new Array();
      lists.unshift(value);
      console.log("newLists", lists);
      setStorageData("lists", lists);
    } catch (e) {
      console.log(e);
    }
  };

  const [joinList, { loading }] = useMutation(JOIN_LIST, {
    update(proxy, result) {
      try {
        mergeList(result.data.join_list);
        // pass params to grocery list
        let listID = result.data.join_list.id;
        let listName = result.data.join_list.list_name;
        navigation.navigate("groceryList", {
          listID: listID,
          listName: listName,
        });
      } catch (e) {
        console.log(e);
      }
    },
  });

  const handleSubmit = async () => {
    try {
      // get userID from storage
      const userID = await getStorageData("user", "id");
      console.log(`${userID} is joining list with code ${code}`);
      await joinList({ variables: { code: code, userID } });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>What is the</Text>
      <Text style={styles.heading}>Grocery List Code?</Text>
      <TextInput
        autoFocus={true}
        placeholder="Enter Code"
        style={styles.nameInput}
        autoCapitalize={"characters"}
        onChangeText={setCode}
        onSubmitEditing={handleSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.green,
    textAlign: "center",
  },
  nameInput: {
    fontSize: 24,
    paddingTop: 80,
    paddingBottom: 300,
    color: colors.dark,
  },
});
