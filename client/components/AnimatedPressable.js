import React, { useRef } from "react";
import { Pressable, Animated } from "react-native";

export default function AnimatedPressable({
  children,
  onPress,
  disabled = false,
  style,
}) {
  const animation = useRef(new Animated.Value(0)).current;
  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.85],
  });

  const onPressIn = () => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPressOut={onPressOut}
        onPressIn={onPressIn}
        onPress={onPress}
        disabled={disabled}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
