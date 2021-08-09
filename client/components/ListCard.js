import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import useAuth from "../hooks/useAuth.js";
import { calculateElapsedTime } from "../other/helperFunctions.js";
import useList from "../hooks/useList.js";
import useScheme from "../hooks/useScheme";
import AnimatedPressable from "./AnimatedPressable.js";

export default function ListCard({
  id,
  name,
  members,
  lastModified,
  navigation,
}) {
  const { colors } = useScheme();
  const { authData } = useAuth();
  const { setCurrentListID, currentListID } = useList();
  const handlePress = async () => {
    await setCurrentListID(id);
    navigation.navigate("listDetail", { listID: currentListID });
  };

  const membersArray = members.filter(
    (member) => member.screen_name != authData.screen_name
  );

  const renderMembers = () => {
    let renderedMembers = "";
    for (let i = 0; i < membersArray.length; i++) {
      if (membersArray[i].screen_name !== authData.screen_name)
        renderedMembers += membersArray[i].screen_name;

      if (renderedMembers.length > 30) {
        renderedMembers += ",...";
        break;
      }
      if (i < membersArray.length - 1) renderedMembers += ", ";
    }
    return renderedMembers;
  };

  const elapsedTime = calculateElapsedTime(new Date(lastModified));

  // styles
  const styles = StyleSheet.create({
    card: {
      alignItems: "center",
      justifyContent: "center",
      height: 100,
      width: 340,
      borderRadius: 24,
      backgroundColor: colors.foreground,
      marginBottom: 12,
    },
    topContainer: {
      paddingHorizontal: 32,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
    },
    cardTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      flex: 3,
    },
    members: {
      marginTop: 16,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    icon: {
      color: colors.caption,
      marginRight: 6,
    },
    membersText: {
      fontSize: 13,
      fontWeight: "400",
      color: colors.caption,
    },
    timeText: {
      textAlign: "right",
      fontSize: 14,
      fontWeight: "400",
      color: colors.caption2,
      flex: 2,
    },
  });

  return (
    <AnimatedPressable onPress={handlePress}>
      <View style={styles.card}>
        <View style={styles.topContainer}>
          <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">
            {name}
          </Text>
          <Text style={styles.timeText}>{elapsedTime}</Text>
        </View>
        {members.length > 1 && (
          <View style={styles.members}>
            <Ionicons name="person" style={styles.icon} />
            <Text style={styles.membersText} numberOfLines={1}>
              {renderMembers()}
            </Text>
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
}
