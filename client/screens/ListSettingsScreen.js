import { gql } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, ScrollView, Alert, Share } from "react-native";
import Header from "../components/Header";
import SettingsCard from "../components/SettingsCard";
import SettingsMembersCard from "../components/SettingsMembersCard";
import { cache } from "../graphql/cache";
import useAuth from "../hooks/useAuth";
import useList from "../hooks/useList";
import {
  calculateElapsedTime,
  getFormattedDate,
} from "../other/helperFunctions";
import * as Linking from "expo-linking";
import useScheme from "../hooks/useScheme";

export default function ListSettingsScreen() {
  const { globalStyles } = useScheme();
  const { authData } = useAuth();
  const { currentListID, deleteList, leaveList } = useList();
  const navigation = useNavigation();

  const readList = cache.readQuery({
    query: gql`
      query readList($listID: String!) {
        get_list(listID: $listID) {
          id
          owner
          list_name
          code
          members {
            id
            screen_name
          }
          created
          last_modified
        }
      }
    `,
    variables: { listID: currentListID },
  });

  function handleDelete(type) {
    Alert.alert(
      "Are you sure?",
      type == "delete"
        ? "Are you sure you want to delete this list? All data will be erased."
        : "Are you sure you want to leave this list? You can be reinvited.",
      [
        { text: "Cancel", style: "cancel", onPress: () => {} },
        {
          text: type == "delete" ? "Delete List" : "Leave List",
          style: "destructive",
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: async () => {
            try {
              if (type == "delete") await deleteList();
              else if (type == "leave") await leaveList();
            } catch (error) {
              console.log(error);
            } finally {
              navigation.navigate("lists");
            }
          },
        },
      ]
    );
  }

  const handleName = () => {
    Alert.prompt(
      "Change name",
      "The list name will change for everyone in this list",
      (text) => console.log(text),
      "plain-text",
      listData.list_name
    );
  };

  const handleInvite = async () => {
    let inviteURL = Linking.createURL("main/join", {
      queryParams: { code: listData.code },
    });

    try {
      console.log(inviteURL);
      await Share.share({ url: inviteURL });
    } catch (e) {
      console.log(e);
    }
  };

  const listData = readList.get_list;
  const dateCreated = new Date(listData.created);
  const dateModified = new Date(listData.last_modified);
  const timeElapsed = calculateElapsedTime(dateModified);

  return (
    <View style={globalStyles.container}>
      <Header title={"List Settings"} headerLeft={"x"} />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <SettingsCard
          content={"Invite Members"}
          type={"button"}
          onPress={handleInvite}
        />
        <SettingsCard
          field={"Name: "}
          content={listData.list_name}
          type={"modifiable"}
          onPress={handleName}
        />
        <SettingsCard
          type={"copy"}
          field={"List Code: "}
          content={listData.code}
        />
        <SettingsMembersCard
          members={listData.members}
          owner={listData.owner}
        />
        <SettingsCard field={"Last Modified: "} content={timeElapsed} />
        <SettingsCard
          field={"Date Created: "}
          content={getFormattedDate(dateCreated)}
        />
        <SettingsCard
          type={"warning"}
          onPress={() => handleDelete("leave")}
          content={"Leave List"}
        />
        {listData.owner == authData.id && (
          <SettingsCard
            type={"warning"}
            onPress={() => handleDelete("delete")}
            content={"Delete List"}
          />
        )}
      </ScrollView>
    </View>
  );
}
