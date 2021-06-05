import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { colors } from "../other/colors";
import Clipboard from "expo-clipboard";

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
      textAlign: "right",
      marginLeft: 60,
      color: captionColor,
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
}
