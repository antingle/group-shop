import React from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { colors } from "../colors.js";

export default function NameListScreen({ navigation }) {
  const [listName, setListName] = React.useState(null);

  const handleSubmit = () => {
    console.log(listName);
    navigation.navigate("groceryList");
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
