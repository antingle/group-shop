import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { View, Text, TextInput } from "react-native";
import { JOIN_LIST } from "../graphql/graphql.js";
import useAuth from "../hooks/useAuth.js";
import Header from "../components/Header.js";
import useList from "../hooks/useList.js";
import useScheme from "../hooks/useScheme.js";
import Loading from "./Loading";

export default function CodeScreen({ navigation }) {
  const { globalStyles } = useScheme();
  const [code, setCode] = React.useState(null);
  const { authData } = useAuth();
  const { setCurrentListID } = useList();

  useEffect(() => {}, []);

  const [joinList, { loading }] = useMutation(JOIN_LIST, {
    update(proxy, result) {
      try {
        let returnedData = result.data.join_list;
        // let listArray = [];
        // listArray.push(returnedData);
        // updateLists(listArray);
        // pass params to grocery list
        setCurrentListID(returnedData.id);
        navigation.navigate("listDetail");
      } catch (e) {
        console.log(e);
      }
    },
  });

  const handleSubmit = async () => {
    try {
      // get userID from storage
      await joinList({ variables: { code } });
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <Loading />;

  return (
    <View style={globalStyles.containerTop}>
      <Header />
      <Text style={globalStyles.heading}>What is the List Code?</Text>
      <TextInput
        autoFocus={true}
        placeholder="Enter Code"
        style={globalStyles.nameInput}
        autoCapitalize={"characters"}
        autoCorrect={false}
        onChangeText={setCode}
        onSubmitEditing={handleSubmit}
        maxLength={6}
      />
    </View>
  );
}
