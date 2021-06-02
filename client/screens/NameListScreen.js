import { useMutation } from "@apollo/client";
import React from "react";
import { Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { CREATE_LIST } from "../graphql/graphql.js";
import useAuth from "../hooks/useAuth.js";
import { colors } from "../other/colors.js";

export default function NameListScreen({ navigation }) {
  const [listName, setListName] = React.useState(null);
  const { authData, updateLists } = useAuth();

  const [createList] = useMutation(CREATE_LIST, {
    update(proxy, result) {
      returnedData = result.data.create_list;
      let listArray = [];
      listArray.push(returnedData);
      updateLists(listArray);
      // pass params to grocery list
      navigation.navigate("groceryList", { listID: returnedData.id });
    },
  });

  const handleSubmit = () => {
    try {
      console.log("creating list:", listName);
      createList({ variables: { userID: authData.id, listName } });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>What is your list for?</Text>
      <TextInput
        autoFocus={true}
        placeholder="Grocery List Name"
        style={styles.nameInput}
        autoCapitalize={"words"}
        onChangeText={setListName}
        onSubmitEditing={handleSubmit}
        autoCorrect={false}
        returnKeyType={"done"}
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
  },
  nameInput: {
    fontSize: 24,
    paddingTop: 80,
    paddingBottom: 300,
    color: colors.dark,
  },
});
