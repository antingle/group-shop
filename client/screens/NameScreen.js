import React from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { colors } from "../colors.js";

export default function NameScreen({ navigation }) {
  const [name, setName] = React.useState(null);

  const handleSubmit = () => {
    console.log(name);
    navigation.navigate("groceryList");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>What is your name?</Text>
      <TextInput
        autoFocus={true}
        placeholder="Your Name Here"
        style={styles.nameInput}
        autoCapitalize={"words"}
        onChangeText={setName}
        onEndEditing={handleSubmit}
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
