import React from "react";
import { Text } from "react-native";

export default function CustomText({ style, weight = "medium" }) {
  let fontFamily = "Avenir-Medium";
  switch (weight) {
    case "light":
      fontFamily = "Avenir-Light";
      break;
    case "book":
      fontFamily = "Avenir-Book";
      break;
    case "heavy":
      fontFamily = "Avenir-Heavy";
      break;
    case "black":
      fontFamily = "Avenir-Black";
      break;
  }

  return <Text style={[{ fontFamily }, style]}></Text>;
}
