import { useQuery } from "@apollo/client";
import React from "react";
import { render } from "react-dom";
import { SafeAreaView, Text, StyleSheet, FlatList } from "react-native";
import { colors } from "../colors.js";
import ListCard from "../components/ListCard.js";
import { cache } from "../graphql/cache.js";
import { GET_USER_LISTS } from "../graphql/graphql.js";
import { getStorageData } from "../storage.js";

export default function ListScreen({ route, navigation }) {
  const { userID } = route.params;
  console.log(userID);
  const { loading, error, data } = useQuery(GET_USER_LISTS, {
    variables: { userID },
  });

  if (loading)
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );

  if (error)
    return (
      <SafeAreaView>
        <Text>{error}</Text>
      </SafeAreaView>
    );

  let DATA = data.get_user_lists;
  console.log(data.get_user_lists);

  const renderItem = ({ list }) => <ListCard name={list.list_name} />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Grocery Lists</Text>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(list) => list.id}
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
