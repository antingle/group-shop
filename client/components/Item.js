import React from "react";
import {
  View,
  StyleSheet,
  TouchableHighlight,
  I18nManager,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Swipeable } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { colors } from "../colors.js";
import { Ionicons } from "@expo/vector-icons";

export default function Item({
  id,
  name,
  purchased,
  onPress,
  onTriggerLeftSwipe,
  onTriggerRightSwipe,
  onRightOpen,
}) {
  const checkboxRef = React.useRef();

  const onTriggerLeft = (progress) => {
    let progressFloat = parseFloat(JSON.stringify(progress));
    onTriggerLeftSwipe(id, { progress: progressFloat });
  };

  const onTriggerRight = () => {
    onTriggerRightSwipe(id);
  };

  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    onTriggerLeft(progress);
    return (
      <View style={styles.leftAction}>
        <Animated.Text style={[styles.actionText]}>Claim</Animated.Text>
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
          color="white"
          style={styles.actionIcon}
        />
      </View>
    );
  };

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      containerStyle={styles.swipeable}
      overshootLeft={false}
      leftThreshold={680}
      onSwipeableRightWillOpen={onTriggerRight}
      onSwipeableRightOpen={() => onRightOpen(id)}
      friction={1.7}
      overshootFriction={4}
    >
      <TouchableHighlight
        style={styles.touchable}
        underlayColor={colors.green}
        activeOpacity={0.6}
        onPress={() => onPress(id, purchased)}
      >
        <View style={styles.card}>
          <BouncyCheckbox
            text={name}
            fillColor={colors.green}
            iconStyle={{ borderColor: colors.green }}
            isChecked={purchased}
            disabled={true}
            ref={checkboxRef}
          />
        </View>
      </TouchableHighlight>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    flexDirection: "row",
    height: 56,
    width: 340,
    borderRadius: 24,
    paddingLeft: 20,
    backgroundColor: "white",
  },
  touchable: {
    borderRadius: 24,
  },
  swipeable: {
    borderRadius: 24,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.dark,
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
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    paddingHorizontal: 20,
  },
  actionIcon: {
    marginHorizontal: 20,
  },
});
