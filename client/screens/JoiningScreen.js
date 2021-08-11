import { useMutation } from "@apollo/client";
import { StackActions } from "@react-navigation/native";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { JOIN_LIST } from "../graphql/graphql";
import useList from "../hooks/useList";
import useScheme from "../hooks/useScheme";
import ErrorMessage from "../components/ErrorMessage.js";

export default function JoiningScreen({ navigation, route }) {
  const { colors } = useScheme();
  const code = route.params.code;
  const { setCurrentListID, setCreatingList } = useList();

  const [joinList, { error }] = useMutation(JOIN_LIST, {
    update(proxy, result) {
      try {
        let returnedData = result.data.join_list;
        setCurrentListID(returnedData.id);
        setCreatingList(true);
        navigation.dispatch(StackActions.replace("listDetail"));
      } catch (e) {
        console.log(e);
      }
    },
  });

  useEffect(() => {
    joinList({ variables: { code } });
  }, []);

  // styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      height: 200,
      width: 200,
      resizeMode: "contain",
      marginVertical: 90,
      marginRight: 20,
    },
    heading: {
      textAlign: "center",
      fontSize: 40,
      fontWeight: "900",
      color: colors.primary,
      marginBottom: 20,
    },
  });

  return (
    <View style={styles.container}>
      <ErrorMessage error={error} onDismiss={() => navigation.goBack()} />
      <Text style={styles.heading}>Joining List...</Text>
      <Image
        source={require("../assets/shoppingcartgray.png")}
        style={styles.image}
      />
    </View>
  );
}
