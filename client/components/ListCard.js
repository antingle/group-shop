import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "../other/colors.js";
import { Ionicons } from "@expo/vector-icons";
import useAuth from "../hooks/useAuth.js";
import { calculateElapsedTime } from "../other/helperFunctions.js";
import useList from "../hooks/useList.js";

export default function ListCard({
  id,
  name,
  members,
  lastModified,
  navigation,
}) {
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

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.topContainer}>
        <Text style={styles.cardText}>{name}</Text>
        <Text style={styles.timeText}>{elapsedTime}</Text>
      </View>
      {(members.length > 1) && <View style={styles.members}>
        <Ionicons name="person" style={styles.icon} />
        <Text style={styles.membersText}>{renderMembers()}</Text>
      </View>}
    </TouchableOpacity>
  );
}

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
    width: 340,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  cardText: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  members: {
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
    fontSize: 14,
    fontWeight: "400",
    color: colors.caption2,
  },
});
