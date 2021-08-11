import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  LayoutAnimation,
  Animated,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import ListCard from "../components/ListCard.js";
import Header from "../components/Header.js";
import useList from "../hooks/useList.js";
import { sortByDateDescending } from "../other/helperFunctions.js";
import { useFocusEffect } from "@react-navigation/native";
import useScheme from "../hooks/useScheme.js";
import AnimatedPressable from "../components/AnimatedPressable.js";
import EmptyList from "../components/EmptyList.js";
import Loading from "./Loading.js";

export default function ListScreen({ navigation }) {
  const { globalStyles, colors } = useScheme();
  const { lists, setCreatingList, refreshLists, loading, fetchLists } =
    useList();
  const [selectNewList, setSelectNewList] = useState(false);
  const joinButtonAnimated = useRef(new Animated.Value(0)).current;
  const createButtonAnimated = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      setSelectNewList(false);
      fetchLists();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [])
  );
  const renderItem = useCallback(({ item }) => {
    return (
      <ListCard
        id={item.id}
        name={item.list_name}
        members={item.members}
        lastModified={item.last_modified}
        navigation={navigation}
      />
    );
  }, []);

  const animation = (toValue) =>
    Animated.stagger(100, [
      Animated.spring(joinButtonAnimated, {
        toValue: toValue,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(createButtonAnimated, {
        toValue: toValue,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

  const translateYJoin = joinButtonAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const translateYCreate = createButtonAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const handleNewList = () => {
    if (selectNewList == false) {
      setSelectNewList(true);
      animation(1);
    } else {
      animation(0);
      setTimeout(() => setSelectNewList((prev) => !prev), 350);
    }
  };

  const handleCreate = async () => {
    await setCreatingList(true);
    setSelectNewList(false);
    navigation.navigate("nameList");
  };

  const handleJoin = async () => {
    await setCreatingList(true);
    setSelectNewList(false);
    navigation.navigate("code");
  };

  const sortedLists = lists ? [...lists].sort(sortByDateDescending) : null;

  // styles
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
      borderRadius: 45,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      height: 60,
      width: 180,
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
      bottom: 103,
      width: 180,
      height: 130,
      borderRadius: 45,
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "space-around",
      zIndex: 10,
    },
    listButton: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      backgroundColor: colors.caption,
      width: 180,
      height: 60,
      borderRadius: 45,
      zIndex: 10,
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

  return (
    <TouchableWithoutFeedback onPress={handleNewList} disabled={!selectNewList}>
      <View style={styles.container}>
        <Header title={"Lists"} headerLeft={"settings"} />
        {!loading ? (
          <FlatList
            data={sortedLists}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onRefresh={refreshLists}
            refreshing={loading}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={EmptyList}
          />
        ) : (
          <Loading />
        )}

        {selectNewList && (
          <View style={styles.listSelection}>
            <Animated.View
              style={{
                opacity: createButtonAnimated,
                transform: [{ translateY: translateYCreate }],
              }}
            >
              <AnimatedPressable onPress={handleCreate}>
                <View style={[styles.listButton, globalStyles.shadow]}>
                  <Ionicons name="create-outline" style={styles.listIcon} />
                  <Text style={styles.buttonText}>Create List</Text>
                </View>
              </AnimatedPressable>
            </Animated.View>

            <Animated.View
              style={{
                opacity: joinButtonAnimated,
                transform: [{ translateY: translateYJoin }],
              }}
            >
              <AnimatedPressable onPress={handleJoin}>
                <View style={[styles.listButton, globalStyles.shadow]}>
                  <Ionicons name="person-add" style={styles.listIcon} />
                  <Text style={styles.buttonText}>Join List</Text>
                </View>
              </AnimatedPressable>
            </Animated.View>
          </View>
        )}

        <View style={styles.absolute}>
          <AnimatedPressable onPress={handleNewList}>
            <View style={[styles.addButton, globalStyles.shadow]}>
              <AntDesign name="plus" style={styles.plus} />
              <Text style={styles.buttonText}>New List</Text>
            </View>
          </AnimatedPressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
