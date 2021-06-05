import { gql, useMutation } from "@apollo/client";
import React from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import Header from "../components/Header";
import SettingsCard from "../components/SettingsCard";
import SettingsMembersCard from "../components/SettingsMembersCard";
import { cache } from "../graphql/cache";
import { DELETE_LIST, LEAVE_LIST } from "../graphql/graphql";
import useAuth from "../hooks/useAuth";
import useList from "../hooks/useList";
import { colors } from "../other/colors";
import {
  calculateElapsedTime,
  getFormattedDate,
} from "../other/helperFunctions";

export default function ListSettingsScreen() {
  const { authData } = useAuth();
  const { currentListID } = useList();

  const [deleteList] = useMutation(DELETE_LIST);
  const [leaveList] = useMutation(LEAVE_LIST);
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
          onPress: () => {
            try {
              if (type == "delete")
                deleteList({ variables: { listID: currentListID } });
              else if (type == "leave")
                leaveList({
                  variables: { listID: currentListID, userID: authData.userID },
                });
            } catch (error) {
              console.log(error);
            }
          },
        },
      ]
    );
  }

  const listData = readList.get_list;
  const dateCreated = new Date(listData.created);
  const dateModified = new Date(listData.last_modified);
  const timeElapsed = calculateElapsedTime(dateModified);

  return (
    <View style={styles.container}>
      <Header title={"List Settings"} />
      <ScrollView>
        <SettingsCard field={"Name: "} content={listData.list_name} />
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
    paddingTop: 20,
    paddingBottom: 20,
  },
});
