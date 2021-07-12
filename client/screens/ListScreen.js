import React, { useState } from "react";
import {
  View,
  TouchableHighlight,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  LayoutAnimation,
  Image,
} from "react-native";
import { colors } from "../other/colors.js";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import ListCard from "../components/ListCard.js";
import Header from "../components/Header.js";
import useList from "../hooks/useList.js";
import { sortByDate } from "../other/helperFunctions.js";
import { useFocusEffect } from "@react-navigation/native";

export default function ListScreen({ navigation }) {
  const { lists, setCreatingList, refreshLists, loading, fetchLists } =
    useList();
  const [selectNewList, setSelectNewList] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchLists();
    }, [])
  );

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

  const renderItem = ({ item }) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    return (
      <ListCard
        id={item.id}
        name={item.list_name}
        members={item.members}
        lastModified={item.last_modified}
        navigation={navigation}
      />
    );
  };

  const sortedLists = lists ? [...lists].sort(sortByDate) : null;

  return (
    <TouchableWithoutFeedback
      onPress={() => setSelectNewList(false)}
      disabled={!selectNewList}
    >
      <View style={styles.container}>
        <Header title={"Lists"} headerLeft={"settings"} />
        {lists?.length > 0 ? (
          <FlatList
            data={sortedLists}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onRefresh={refreshLists}
            refreshing={loading}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <Image
            source={require("../assets/emptylists.png")}
            style={styles.emptyImage}
          />
        )}
        {selectNewList && (
          <View style={styles.listSelection}>
            <TouchableHighlight
              style={styles.listButton}
              onPress={handleCreate}
              underlayColor={colors.background}
            >
              <View style={styles.listContainer}>
                <Ionicons name="create-outline" style={styles.listIcon} />
                <Text style={styles.buttonText}>Create List</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.listButton}
              onPress={handleJoin}
              underlayColor={colors.background}
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
            underlayColor={colors.background}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 40,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 60,
    marginBottom: 12,
  },
  addButton: {
    width: 180,
    height: 60,
    borderRadius: 45,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonText: {
    fontSize: 20,
    color: colors.background,
  },
  plus: {
    fontSize: 36,
    color: colors.background,
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
    backgroundColor: colors.foreground,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 7,
  },
  listContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: colors.caption,
    width: 180,
    height: 60,
    borderRadius: 45,
  },
  listIcon: {
    color: colors.background,
    fontSize: 24,
    marginRight: 10,
  },
  emptyImage: {
    height: 300,
    resizeMode: "contain",
    flex: 1,
    marginTop: 150,
    marginBottom: 250,
  },
});
