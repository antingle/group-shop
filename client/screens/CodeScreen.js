import React from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { colors } from "../colors.js";

export default function CodeScreen({ navigation }) {
  const [code, setCode] = React.useState(null);

  const handleSubmit = () => {
    console.log(code);
    navigation.navigate("groceryList");
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
