import { useMutation } from "@apollo/client";
import React from "react";
import { Text, TextInput, View } from "react-native";
import Header from "../components/Header.js";
import { CREATE_LIST } from "../graphql/graphql.js";
import useAuth from "../hooks/useAuth.js";
import useList from "../hooks/useList.js";
import useScheme from "../hooks/useScheme.js";

export default function NameListScreen({ navigation }) {
  const { globalStyles } = useScheme();
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
      createList({ variables: { listName } });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={globalStyles.containerTop}>
      <Header />
      <Text style={globalStyles.heading}>What is your list for?</Text>
      <TextInput
        autoFocus={true}
        placeholder="Shopping List Name"
        style={globalStyles.nameInput}
        autoCapitalize={"words"}
        onChangeText={setListName}
        onSubmitEditing={handleSubmit}
        autoCorrect={false}
        returnKeyType={"done"}
        maxLength={30}
      />
    </View>
  );
}
