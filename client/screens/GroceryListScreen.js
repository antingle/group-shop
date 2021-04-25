import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text } from "react-native";
import Item from "../components/Item";
import { colors } from "../colors.js";

const DATA = [
  {
    id: 1,
    title: "carrots",
    purchased: false,
  },
  {
    id: 2,
    title: "lettuce",
    purchased: false,
  },
];

export default function ({ navigation, groceryListName, groceryListCode }) {
  const [purchased, setPurchased] = React.useState(false);

  const renderItem = ({ item }) => (
    <Item
      name={item.title}
      onPress={() => {
        setPurchased(true);
        console.log(purchased);
      }}
      purchased={purchased}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Groceries</Text>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "800",
    color: colors.green,
    marginBottom: 12,
    marginTop: 24,
  },
  nameInput: {
    fontSize: 24,
    paddingTop: 80,
    paddingBottom: 300,
    color: colors.dark,
  },
});
