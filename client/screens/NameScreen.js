import { useMutation } from "@apollo/client";
import React from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { CREATE_TEMP_USER } from "../graphql/graphql.js";
import useAuth from "../hooks/useAuth.js";
import { colors } from "../other/colors.js";

export default function NameScreen({ navigation }) {
  const [name, setName] = React.useState(null);
  const { signIn } = useAuth();

  const [createTempUser, { loading, error }] = useMutation(CREATE_TEMP_USER, {
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
    console.log(name);
    createTempUser({ variables: { name } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>What is your name?</Text>
      <TextInput
        autoFocus={true}
        placeholder="Your name here"
        style={styles.nameInput}
        autoCapitalize={"words"}
        onChangeText={setName}
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
