import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import GoBackButton from "../components/GoBackButton";
import useScheme from "../hooks/useScheme";
import SettingsButton from "./SettingsButton";
import XButton from "./XButton";

export default function Header({
  title,
  headerLeft = "back",
  headerRight,
  settingsScreen = "settings", // can navigate to settings or listsettings
  backPress = "back", // can navigate to lists or just goback
}) {
  const { colors } = useScheme();

  let titleFontSize = 40;
  if (title?.length == 9) titleFontSize--;
  if (title?.length > 9) {
    titleFontSize -= title.length - 8;
  }

  // styles
  const styles = StyleSheet.create({
    container: {
      width: Dimensions.get("window").width,
      backgroundColor: colors.background,
      alignItems: "flex-start",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    title: {
      textAlign: "center",
      flex: 1,
      fontSize: titleFontSize,
      fontWeight: "800",
      color: colors.primary,
      marginTop: 60,
      marginBottom: 12,
    },
    sideHeader: {
      alignItems: "center",
      width: 100,
    },
  });

  const renderComponent = (component) => {
    switch (component) {
      case "settings":
        component = <SettingsButton marginTop={34} screen={settingsScreen} />;
        break;
      case "back":
        component = <GoBackButton marginTop={35} navigate={backPress} />;
        break;
      case "x":
        component = <XButton marginTop={32} />;
        break;
      default:
        component = null;
    }
    return component;
  };
  headerLeft = renderComponent(headerLeft);
  headerRight = renderComponent(headerRight);

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.sideHeader}>{headerLeft}</View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.sideHeader}>{headerRight}</View>
      </View>
    </View>
  );
}
