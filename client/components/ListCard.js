import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "../other/colors.js";
import { Ionicons } from "@expo/vector-icons";
import useAuth from "../hooks/useAuth.js";

export default function ListCard({ id, name, members, navigation }) {
  const { authData } = useAuth();
  const handlePress = () => {
    navigation.navigate("groceryList", { listID: id });
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

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Text style={styles.cardText}>{name}</Text>
      <View style={styles.members}>
        <Ionicons name="person" style={styles.icon} />
        <Text style={styles.membersText}>{renderMembers()}</Text>
      </View>
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
  cardText: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
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
    fontSize: 14,
    fontWeight: "400",
    color: colors.caption,
  },
});
