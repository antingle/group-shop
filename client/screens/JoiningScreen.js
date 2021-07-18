import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { JOIN_LIST } from "../graphql/graphql";
import useAuth from "../hooks/useAuth";
import useList from "../hooks/useList";
import { colors } from "../other/colors";

export default function JoiningScreen({ navigation, route }) {
  const code = route.params.code;
  const { authData } = useAuth();
  const { setCurrentListID } = useList();

  const [joinList] = useMutation(JOIN_LIST, {
    update(proxy, result) {
      try {
        let returnedData = result.data.join_list;
        setCurrentListID(returnedData.id);
        navigation.navigate("listDetail");
      } catch (e) {
        console.log(e);
      }
    },
    onError: (error) => {
      Alert.alert(error.message, "You may already be a part of this list", [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("lists");
          },
        },
      ]);
    },
  });

  useEffect(() => {
    joinList({ variables: { code, userID: authData.id } });
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      height: 200,
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
      <Text style={styles.heading}>Joining List...</Text>
      <Image
        source={require("../assets/shoppingcartgray.png")}
        style={styles.image}
      />
    </View>
  );
}
