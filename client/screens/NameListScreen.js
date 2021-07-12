import { useMutation } from "@apollo/client";
import React from "react";
import { Text, TextInput, StyleSheet, View } from "react-native";
import Header from "../components/Header.js";
import { CREATE_LIST } from "../graphql/graphql.js";
import useAuth from "../hooks/useAuth.js";
import useList from "../hooks/useList.js";
import { colors } from "../other/colors.js";

export default function NameListScreen({ navigation }) {
  const [listName, setListName] = React.useState(null);
  const { authData } = useAuth();
  const { updateLists, setCurrentListID } = useList();

  const [createList] = useMutation(CREATE_LIST, {
    update(proxy, result) {
      returnedData = result.data.create_list;
      let listArray = [];
      listArray.push(returnedData);
      updateLists(listArray);
      setCurrentListID(returnedData.id);
      navigation.navigate("listDetail");
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
    <View style={styles.container}>
      <Header />
      <Text style={styles.heading}>What is your list for?</Text>
      <TextInput
        autoFocus={true}
        placeholder="Shopping List Name"
        style={styles.nameInput}
        autoCapitalize={"words"}
        onChangeText={setListName}
        onSubmitEditing={handleSubmit}
        autoCorrect={false}
        returnKeyType={"done"}
        maxLength={35}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 100,
  },
  nameInput: {
    fontSize: 24,
    paddingTop: 80,
    paddingBottom: 300,
    color: colors.text,
    textAlign: "center"
  },
});
