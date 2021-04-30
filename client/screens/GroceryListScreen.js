import React from "react";
import { SafeAreaView, SectionList, StyleSheet, Text } from "react-native";
import Item from "../components/Item";
import { colors } from "../colors.js";
import { useQuery } from "@apollo/client";
import { get_list } from "../graphql";

const DATA = [
  {
    data: [{ id: "1235124123442", name: "carrots", purchased: false }],
  },
  {
    title: "Purchased",
    data: [{ id: "3242141234", name: "oats", purchased: true }],
  },
];

function sortData(receievedData) {
  for (let i = 0; i < receievedData.get_list.items.length; i++) {
    let item = receievedData.get_list.items[i];
    console.log(item);
    let exists = false;

    //TEMP ERROR CHECK
    for (let j = 0; j < DATA[1].data.length; j++) {
      if (DATA[1].data[j].id == item.id) exists = true;
    }

    for (let j = 0; j < DATA[0].data.length; j++) {
      if (DATA[0].data[j].id == item.id) exists = true;
    }
    //TEMP ERROR CHECK

    if (!exists) {
      if (item.purchased) DATA[1].data.push(item);
      else DATA[0].data.push(item);
    }
  }
}

function purchaseItem() {}

export default function ({ route, navigation }) {
  // refreshes SectionList state (could be temporary fix)
  const [refresh, setRefresh] = React.useState(false);

  // gets id and name from the join or create screen
  // const { listID, listName } = route.params;
  const tempName = "Test List";
  const tempID = "6085efe2fd203d0c80907c18";

  const { loading, error, data } = useQuery(get_list, {
    variables: { listID: tempID },
  });

  if (loading)
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );

  if (error) console.log(error);
  if (!loading) sortData(data);

  // move item to purchase section
  const setPurchased = (item) => {
    let arr = DATA[0].data;
    if (arr.indexOf(item) == -1) return;
    let spliced = arr.splice(arr.indexOf(item), 1);
    DATA[1].data.push(spliced[0]);
    setRefresh(!refresh);

    return spliced[0];
  };

  // renders SectionList
  const renderItem = ({ item }) => (
    <Item
      id={item.id}
      name={item.name}
      onPress={() => {
        setRefresh(!refresh);
        console.log(DATA);
      }}
      purchased={item.purchased}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{tempName}</Text>
      <SectionList
        sections={DATA}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) =>
          title && <Text style={styles.heading}>{title}</Text>
        }
        keyExtractor={(item) => item.id}
        extraData={refresh}
        stickySectionHeadersEnabled={false}
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
