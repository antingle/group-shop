import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableHighlight,
  Alert,
} from "react-native";
import Header from "../components/Header";
import SettingsCard from "../components/SettingsCard";
import useAuth from "../hooks/useAuth";
import { colors } from "../other/colors";

export default function SettingsScreen() {
  const [yes, setYes] = useState(false);
  const { authData, signOut } = useAuth();

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

  return (
    <View style={styles.container}>
      <Header title={"Settings"} />
      <ScrollView>
        <SettingsCard field={"Name: "} content={authData.screen_name} />
        <SettingsCard
          type={"middle"}
          content={"Sign Out"}
          onPress={handleSignOut}
        />
        <SettingsCard type={"warning"} content={"Delete Account"} />
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
