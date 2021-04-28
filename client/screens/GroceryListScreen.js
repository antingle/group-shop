import React from "react";
import { SafeAreaView, SectionList, StyleSheet, Text } from "react-native";
import Item from "../components/Item";
import { colors } from "../colors.js";

const DATA = [
  {
    data: [
      { id: 1, title: "carrots", purchased: false },
      { id: 2, title: "lettuce", purchased: false },
    ],
  },
  {
    title: "Purchased",
    data: [{ id: 3, title: "oats", purchased: true }],
  },
];

export default function ({ navigation, groceryListName, groceryListCode }) {
  const [refresh, setRefresh] = React.useState(false);
  const setPurchased = (item) => {
    let arr = DATA[0].data;
    if (arr.indexOf(item) == -1) return;
    let spliced = arr.splice(arr.indexOf(item), 1);
    DATA[1].data.push(spliced[0]);
    setRefresh(!refresh);

    return spliced[0];
  };

  const renderItem = ({ item }) => (
    <Item
      id={item.id}
      name={item.title}
      onPress={() => {
        item = setPurchased(item);
        if (item == -1) return;
        item.purchased = true;
      }}
      purchased={item.purchased}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Groceries</Text>
      <SectionList
        sections={DATA}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) =>
          title && <Text style={styles.heading}>{title}</Text>
        }
        extraData={refresh}
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
  heading: {
    fontSize: 28,
    fontWeight: "800",
    width: 280,
    marginTop: 20,
    marginBottom: 10,
    color: colors.green,
  },
  nameInput: {
    fontSize: 24,
    paddingTop: 80,
    paddingBottom: 300,
    color: colors.dark,
  },
});
