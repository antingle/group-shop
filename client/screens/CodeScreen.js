import { useMutation } from "@apollo/client";
import React from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { colors } from "../colors.js";
import { join_list } from "../graphql.js";
import { userID } from "../storage.js";

export default function CodeScreen({ navigation }) {
  const [code, setCode] = React.useState(null);
  const [joinList, { loading }] = useMutation(join_list, {
    update(proxy, result) {
      let listID = result.data.join_list.id;
      let listName = result.data.join_list.list_name;

      // pass params to grocery list
      if (result)
        navigation.navigate("groceryList", {
          listID: listID,
          listName: listName,
        });
    },
  });

  const handleSubmit = async () => {
    try {
      await joinList({ variables: { code: code, userID: userID } });
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
