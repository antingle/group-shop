import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { colors } from "../other/colors";
import Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsCard({
  type = "default",
  field,
  content,
  onPress,
}) {
  const [captionColor, setCaptionColor] = useState(colors.primary);

  const handleCopy = () => {
    setCaptionColor(colors.caption);
    Clipboard.setString(content);
  };

  const styles = StyleSheet.create({
    card: {
      alignItems: "center",
      flexDirection: "row",
      height: 56,
      width: 340,
      borderRadius: 24,
      paddingLeft: 20,
      backgroundColor: colors.foreground,
      marginBottom: 10,
    },
    middleCard: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      height: 56,
      width: 340,
      borderRadius: 24,
      backgroundColor: colors.foreground,
      marginBottom: 10,
    },
    middleView: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      height: 56,
      width: 340,
      borderRadius: 24,
      backgroundColor: colors.foreground,
    },
    cardText: {
      fontSize: 20,
      fontWeight: "400",
      color: colors.text,
    },
    grayText: {
      fontSize: 20,
      fontWeight: "400",
      color: colors.caption,
    },
    fieldText: {
      fontSize: 20,
      fontWeight: "500",
      color: colors.primary,
    },
    deleteText: {
      fontSize: 20,
      fontWeight: "400",
      color: colors.destructive,
    },
    touchable: {
      borderRadius: 24,
      height: 56,
      marginBottom: 10,
    },
    caption: {
      position: "absolute",
      right: 25,
      color: captionColor,
    },
    editTouchable: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.lightButton,
      position: "absolute",
      right: 20,
      borderRadius: 12,
      width: 60,
      height: 30,
    },
    editButton: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.lightButton,
      borderRadius: 12,
      width: 60,
      height: 30,
    },
    editText: {
      fontSize: 15,
      color: colors.text,
    },
    buttonCard: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      height: 56,
      width: 340,
      borderRadius: 24,
      backgroundColor: colors.primary,
      marginBottom: 10,
    },
    buttonView: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      height: 56,
      width: 340,
      borderRadius: 24,
      backgroundColor: colors.primary,
    },
    buttonText: {
      fontSize: 20,
      fontWeight: "400",
      color: colors.foreground,
    },
    listIcon: {
      color: colors.background,
      fontSize: 24,
      marginRight: 10,
    },
  });

  if (type == "default")
    return (
      <View style={styles.card}>
        <Text style={styles.fieldText}>{field}</Text>
        <Text style={styles.cardText}>{content}</Text>
      </View>
    );
  else if (type == "copy")
    return (
      <TouchableHighlight
        onPress={handleCopy}
        style={styles.touchable}
        underlayColor={colors.text}
      >
        <View style={styles.card}>
          <Text style={styles.fieldText}>{field}</Text>
          <Text style={styles.cardText}>{content}</Text>
          <Text style={styles.caption}>Tap to Copy</Text>
        </View>
      </TouchableHighlight>
    );
  else if (type == "modifiable")
    return (
      <View style={styles.card}>
        <Text style={styles.fieldText}>{field}</Text>
        <Text style={styles.cardText}>{content}</Text>
        <TouchableHighlight
          style={styles.editTouchable}
          underlayColor={colors.text}
          onPress={onPress}
        >
          <View style={styles.editButton}>
            <Text style={styles.editText}>Edit</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  else if (type == "warning")
    return (
      <TouchableHighlight
        style={styles.middleCard}
        underlayColor={colors.text}
        onPress={onPress}
      >
        <View style={styles.middleView}>
          <Text style={styles.deleteText}>{content}</Text>
        </View>
      </TouchableHighlight>
    );
  else if (type == "middle")
    return (
      <TouchableHighlight
        style={styles.middleCard}
        underlayColor={colors.text}
        onPress={onPress}
      >
        <View style={styles.middleView}>
          <Text style={styles.grayText}>{content}</Text>
        </View>
      </TouchableHighlight>
    );
  else if (type == "button")
    return (
      <TouchableHighlight
        onPress={onPress}
        style={styles.buttonCard}
        underlayColor={colors.text}
      >
        <View style={styles.buttonView}>
          <Ionicons name="person-add" style={styles.listIcon} />
          <Text style={styles.buttonText}>{content}</Text>
        </View>
      </TouchableHighlight>
    );
}
