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
    titleFontSize -= Math.sqrt(title.length * 3);
  }

  // styles
  const styles = StyleSheet.create({
    container: {
      width: Dimensions.get("window").width,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      marginTop: 60,
      marginBottom: 12,
    },
    title: {
      textAlign: "center",
      flex: 1,
      fontSize: titleFontSize,
      fontWeight: "800",
      color: colors.primary,
    },
    sideHeader: {
      alignItems: "center",
      width: 90,
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
        <Text style={styles.title} ellipsizeMode="tail" numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.sideHeader}>{headerRight}</View>
      </View>
    </View>
  );
}
