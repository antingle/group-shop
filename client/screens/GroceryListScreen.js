import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text } from "react-native";
import Item from "../components/Item";
import { colors } from "../colors.js";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];

export default function ({ navigation, groceryListName, groceryListCode }) {
  const renderItem = ({ item }) => <Item name={item.title} />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>{groceryListName}</Text>
      <FlatList data={DATA} renderItem={renderItem} />
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
