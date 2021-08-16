import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  I18nManager,
  TextInput,
  Dimensions,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Swipeable } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import useAuth from "../hooks/useAuth.js";
import useScheme from "../hooks/useScheme.js";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Item({
  id,
  name,
  member,
  purchased,
  onPress,
  onTriggerLeftSwipe,
  onEndRightSwipe,
  onAdd,
  onChangeAdd,
}) {
  const { colors } = useScheme();
  const checkboxRef = React.useRef();
  const swipeableRef = React.useRef();
  const { authData } = useAuth();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (id.includes("new")) setEditing(true);
  }, []);

  const onEndRight = () => {
    onEndRightSwipe(id);
  };

  const onTriggerLeft = () => {
    swipeableRef?.current.close();
    onTriggerLeftSwipe(id, member);
  };

  const renderLeftActions = (dragX) => {
    if (purchased) return;
    const trans = dragX.interpolate({
      inputRange: [-101, -100, -50, 0],
      outputRange: [1, 0, 0, -20],
    });

    return (
      <View style={styles.leftAction}>
        <Animated.Text style={[styles.actionText]}>
          {member == authData.screen_name ? "Unclaim" : "Claim"}
        </Animated.Text>
      </View>
    );
  };

  const renderRightActions = (dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-101, -100, -50, 0],
      outputRange: [1, 0, 0, -20],
    });
    return (
      <View style={styles.rightAction}>
        <Ionicons
          name="trash"
          size={24}
          color={colors.light}
          style={styles.actionIcon}
        />
      </View>
    );
  };

  // styles
  const styles = StyleSheet.create({
    card: {
      alignItems: "center",
      flexDirection: "row",
      height: 48,
      width: Dimensions.get("screen").width * 0.9,
      borderRadius: 24,
      paddingLeft: 20,
      backgroundColor: colors.foreground,
    },
    touchable: {
      borderRadius: 24,
    },
    swipeable: {
      borderRadius: 24,
      marginBottom: 8,
    },
    cardText: {
      fontSize: 16,
      fontWeight: "400",
      color: colors.text,
    },
    leftAction: {
      flex: 1,
      backgroundColor: "#fcd703",
      justifyContent: "center",
    },
    rightAction: {
      alignItems: "center",
      flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
      backgroundColor: "#dd2c00",
      flex: 1,
      justifyContent: "flex-end",
    },
    actionText: {
      color: colors.dark,
      fontSize: 16,
      backgroundColor: "transparent",
      paddingHorizontal: 20,
    },
    actionIcon: {
      marginHorizontal: 20,
    },
    textContainer: {
      flex: 1,
      alignItems: "flex-end",
    },
    caption: {
      marginRight: 20,
      color: colors.caption,
    },
    textInput: {
      color: "#757575",
      fontSize: 16,
      fontWeight: "400",
      color: colors.text,
      width: "100%",
    },
  });

  return (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      containerStyle={styles.swipeable}
      overshootLeft={false}
      leftThreshold={100}
      onSwipeableRightOpen={onEndRight}
      friction={1}
      overshootFriction={8}
      onSwipeableLeftOpen={onTriggerLeft}
      useNativeAnimations={true}
    >
      <TouchableHighlight
        style={styles.touchable}
        underlayColor={colors.primary}
        activeOpacity={0.7}
        onPress={() => onPress(id, purchased)}
      >
        <View style={styles.card}>
          <BouncyCheckbox
            text={name}
            textStyle={styles.cardText}
            fillColor={colors.primary}
            iconStyle={{ borderColor: colors.primary }}
            isChecked={purchased}
            disabled={true}
            ref={checkboxRef}
            style={{ maxWidth: member ? "60%" : "90%" }}
          />
          {editing && (
            <TextInput
              style={styles.textInput}
              autoFocus={true}
              onChangeText={onChangeAdd}
              onEndEditing={() => {
                onAdd();
                setEditing(false);
              }}
              returnKeyType="done"
              autoCorrect={false}
              maxLength={70}
            />
          )}
          <View style={styles.textContainer}>
            {purchased ? (
              <Text style={styles.caption}>
                <FontAwesome5 name="shopping-bag" color={colors.caption} />
                {"  "}
                {member}
              </Text>
            ) : (
              member && (
                <Text style={styles.caption}>{member} is getting...</Text>
              )
            )}
          </View>
        </View>
      </TouchableHighlight>
    </Swipeable>
  );
}
