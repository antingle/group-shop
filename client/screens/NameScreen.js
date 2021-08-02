import { useMutation } from "@apollo/client";
import React from "react";
import { View, Text, TextInput } from "react-native";
import Header from "../components/Header.js";
import { CREATE_TEMP_USER } from "../graphql/graphql.js";
import useAuth from "../hooks/useAuth.js";
import useScheme from "../hooks/useScheme.js";

export default function NameScreen() {
  const { globalStyles } = useScheme();
  const [name, setName] = React.useState(null);
  const { signIn } = useAuth();

  const [createTempUser] = useMutation(CREATE_TEMP_USER, {
    update(proxy, result) {
      try {
        const userData = result.data.create_temp_user;
        // const listData = returnedData.lists; // use in future when registering with link?
        delete userData.lists; // delete is not an ideal operation
        signIn(userData);
      } catch (e) {
        console.log(e); // in the future, add error to display on screen
      }
    },
  });

  const handleSubmit = () => {
    createTempUser({ variables: { name } });
  };

  return (
    <View style={globalStyles.containerTop}>
      <Header headerLeft={"back"} />
      <Text style={globalStyles.heading}>What is your name?</Text>
      <TextInput
        autoFocus={true}
        placeholder="Your name here"
        style={globalStyles.nameInput}
        autoCapitalize={"words"}
        onChangeText={setName}
        onSubmitEditing={handleSubmit}
        autoCorrect={false}
        maxLength={30}
        returnKeyType={"done"}
      />
    </View>
  );
}
