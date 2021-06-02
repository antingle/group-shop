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
import useAuth from "../hooks/useAuth";
import { colors } from "../other/colors";

export default function SettingsScreen() {
  const [yes, setYes] = useState(false);
  const { signOut } = useAuth();

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
        <View style={styles.card}>
          <Switch onValueChange={() => setYes((prev) => !prev)} value={yes} />
          <Text style={styles.cardText}>Yes</Text>
        </View>
        <TouchableHighlight
          style={styles.middleCard}
          underlayColor={colors.dark}
          onPress={handleSignOut}
        >
          <View style={styles.middleView}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </View>
        </TouchableHighlight>
      </ScrollView>
    </View>
  );
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
    paddingTop: 20,
    paddingBottom: 20,
  },
  card: {
    alignItems: "center",
    flexDirection: "row",
    height: 56,
    width: 340,
    borderRadius: 24,
    paddingLeft: 20,
    backgroundColor: "white",
    marginBottom: 10,
  },
  middleCard: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 56,
    width: 340,
    borderRadius: 24,
    backgroundColor: "white",
    marginBottom: 10,
  },
  middleView: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 56,
    width: 340,
    borderRadius: 24,
    backgroundColor: "white",
  },
  cardText: {
    fontSize: 20,
    fontWeight: "400",
    color: colors.dark,
    marginLeft: 20,
  },
  signOutText: {
    fontSize: 20,
    fontWeight: "400",
    color: colors.red,
  },
});
