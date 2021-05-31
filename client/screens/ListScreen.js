import React from "react";
import { SafeAreaView, Text, StyleSheet, FlatList } from "react-native";
import { colors } from "../other/colors.js";
import ListCard from "../components/ListCard.js";
import { cache } from "../graphql/cache.js";
import useAuth from "../hooks/useAuth.js";

export default function ListScreen({ navigation }) {
  const { lists } = useAuth();

  const renderItem = ({ item }) => (
    <ListCard
      id={item.id}
      name={item.list_name}
      members={item.members}
      navigation={navigation}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Grocery Lists</Text>
      <FlatList
        data={lists}
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
  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.green,
    padding: 40,
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 340,
    borderRadius: 24,
    backgroundColor: "white",
  },
  cardText: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.dark,
  },
});
