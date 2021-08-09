import React from "react";
import { View, ScrollView, Alert, Text } from "react-native";
import Header from "../components/Header";
import SettingsCard from "../components/SettingsCard";
import SidePicker from "../components/SidePicker";
import useAuth from "../hooks/useAuth";
import useScheme from "../hooks/useScheme";

export default function SettingsScreen() {
  const { globalStyles } = useScheme();
  const { authData, signOut, deleteUser } = useAuth();

  const handleSignOut = () => {
    Alert.alert("Are you sure?", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel", onPress: () => {} },
      {
        text: "Sign Out",
        style: "destructive",
        // If the user confirmed, then we dispatch the action we blocked earlier
        // This will continue the action that had triggered the removal of the screen
        onPress: () => signOut(),
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      "Are you sure?",
      "Are you sure you want to delete your account? You will be removed from all lists and all your data will be erased.",
      [
        { text: "Cancel", style: "cancel", onPress: () => {} },
        {
          text: "Delete Account",
          style: "destructive",
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => deleteUser(),
        },
      ]
    );
  };

  const handleName = () => {
    Alert.prompt(
      "Change name",
      "Your name is what other people see",
      (text) => console.log(text),
      "plain-text",
      authData.screen_name
    );
  };

  return (
    <View style={globalStyles.container}>
      <Header title={"Settings"} headerLeft={"x"} />
      <ScrollView>
        <SettingsCard
          field={"Name: "}
          content={authData.screen_name}
          type={"modifiable"}
          onPress={handleName}
        />
        <SidePicker />
        {authData.email != null && (
          <SettingsCard
            type={"middle"}
            content={"Sign Out"}
            onPress={handleSignOut}
          />
        )}
        <SettingsCard
          type={"warning"}
          content={"Delete Account"}
          onPress={handleDelete}
        />
        {!authData.email && (
          <Text style={globalStyles.caption}>
            You are currently a guest user, so signing out will mean deleting
            your account.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
