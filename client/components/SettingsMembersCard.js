import React, { useEffect } from "react";
import { View, Text, TouchableHighlight, StyleSheet } from "react-native";
import useAuth from "../hooks/useAuth";
import useScheme from "../hooks/useScheme";

export default function SettingsMembersCard({ members, owner }) {
  const { colors } = useScheme();
  const { authData } = useAuth();

  const styles = StyleSheet.create({
    card: {
      alignItems: "center",
      width: 340,
      borderRadius: 24,
      paddingLeft: 20,
      backgroundColor: colors.foreground,
      marginBottom: 10,
      textAlign: "left",
      paddingBottom: 12,
    },
    cardText: {
      fontSize: 18,
      fontWeight: "400",
      color: colors.text,
    },
    heading: {
      fontSize: 20,
      color: colors.primary,
      fontWeight: "500",
      marginTop: 10,
      paddingLeft: 10,
      width: 340,
    },
    touchable: {
      borderRadius: 24,
      marginBottom: 10,
    },
    caption: {
      marginLeft: 20,
      color: colors.caption,
    },
    member: {
      alignItems: "center",
      justifyContent: "flex-start",
      flexDirection: "row",
      width: 340,
      marginTop: 10,
      paddingLeft: 10,
    },
  });

  let memberComponents = [];
  if (members)
    for (let i = 0; i < members.length; i++) {
      let isOwner = false;
      if (members[i].id == owner) isOwner = true;
      memberComponents.push(
        <View style={styles.member} key={members[i].id}>
          <Text style={styles.cardText}>
            {members[i].id == authData.id ? "Me" : members[i].screen_name}
          </Text>
          {isOwner && <Text style={styles.caption}>Owner</Text>}
        </View>
      );
    }

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Members: </Text>
      {memberComponents}
    </View>
  );
}
