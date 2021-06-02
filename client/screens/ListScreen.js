import React, { useState } from "react";
import {
  View,
  TouchableHighlight,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { colors } from "../other/colors.js";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import ListCard from "../components/ListCard.js";
import useAuth from "../hooks/useAuth.js";
import CreateOrJoinScreen from "./CreateOrJoinScreen.js";
import Header from "../components/Header.js";
import useList from "../hooks/useList.js";

export default function ListScreen({ navigation }) {
  const { lists } = useAuth();
  const { setCreatingList } = useList();
  const [selectNewList, setSelectNewList] = useState(false);

  const newList = () => {
    setSelectNewList((prevState) => !prevState);
  };

  const handleCreate = async () => {
    console.log("creating list...");
    await setCreatingList(true);
    setSelectNewList(false);
    navigation.navigate("nameList");
  };

  const handleJoin = async () => {
    console.log("joining list...");
    await setCreatingList(true);
    setSelectNewList(false);
    navigation.navigate("code");
  };

  const renderItem = ({ item }) => (
    <ListCard
      id={item.id}
      name={item.list_name}
      members={item.members}
      navigation={navigation}
    />
  );

  if (lists)
    return (
      <TouchableWithoutFeedback
        onPress={() => setSelectNewList(false)}
        disabled={!selectNewList}
      >
        <View style={styles.container}>
          <Header title={"Lists"} headerLeft={"settings"} />

          <FlatList
            data={lists}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
          {selectNewList && (
            <View style={styles.listSelection}>
              <TouchableHighlight
                style={styles.listButton}
                onPress={handleCreate}
                underlayColor={colors.light}
              >
                <View style={styles.listContainer}>
                  <Ionicons name="create-outline" style={styles.listIcon} />
                  <Text style={styles.buttonText}>Create List</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.listButton}
                onPress={handleJoin}
                underlayColor={colors.light}
              >
                <View style={styles.listContainer}>
                  <Ionicons name="person-add" style={styles.listIcon} />
                  <Text style={styles.buttonText}>Join List</Text>
                </View>
              </TouchableHighlight>
            </View>
          )}
          <View style={styles.absolute}>
            <TouchableHighlight
              style={styles.addButton}
              onPress={newList}
              underlayColor={colors.light}
            >
              <View style={styles.addButton}>
                <AntDesign name="plus" style={styles.plus} />
                <Text style={styles.buttonText}>New List</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  else return <CreateOrJoinScreen navigation={navigation} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 40,
    fontWeight: "800",
    color: colors.green,
    marginTop: 60,
    marginBottom: 12,
  },
  addButton: {
    width: 180,
    height: 60,
    borderRadius: 45,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonText: {
    fontSize: 20,
    color: colors.light,
  },
  plus: {
    fontSize: 36,
    color: colors.light,
    marginRight: 16,
  },
  absolute: {
    position: "absolute",
    bottom: 40,
  },
  listSelection: {
    position: "absolute",
    bottom: 34,
    width: 180,
    height: 200,
    borderRadius: 45,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  listButton: {
    width: 180,
    height: 60,
    borderRadius: 45,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 7,
  },
  listContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: colors.dark,
    width: 180,
    height: 60,
    borderRadius: 45,
  },
  listIcon: {
    color: "white",
    fontSize: 24,
    marginRight: 10,
  },
});
