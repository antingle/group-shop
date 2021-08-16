import React from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import Logo from "../components/Logo";
import LongButton from "../components/LongButton";
import useScheme from "../hooks/useScheme";
import { SharedElement } from "react-navigation-shared-element";
import { useFocusEffect } from "@react-navigation/native";

function GetStartedScreen({ navigation }) {
  const { colors, globalStyles } = useScheme();
  const getStartedAnimation = React.useRef(new Animated.Value(0)).current;
  const welcomeAnimation = React.useRef(new Animated.Value(0)).current;
  useFocusEffect(() => {
    setTimeout(() => animation(1), 500);

    return () => animation(0);
  });

  const animation = (toValue) =>
    Animated.stagger(500, [
      Animated.spring(welcomeAnimation, {
        toValue: toValue,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(getStartedAnimation, {
        toValue: toValue,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

  const translateY = getStartedAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  // styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.foreground,
      alignItems: "center",
      justifyContent: "space-evenly",
      paddingVertical: "10%",
    },
    logoContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    logo: {
      textAlign: "center",
      fontSize: 75,
      fontWeight: "900",
      color: colors.theme,
      fontFamily: "Avenir-Heavy",
    },
    title: {
      textAlign: "center",
      fontSize: 32,
      color: colors.theme,
      marginBottom: 24,
      fontFamily: "Avenir",
    },
    gradient: {
      height: Dimensions.get("screen").height,
      width: Dimensions.get("screen").width,
      position: "absolute",
    },
  });

  return (
    <View style={styles.container}>
      <SharedElement id="bg" style={StyleSheet.absoluteFillObject}>
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: colors.primary },
          ]}
        />
      </SharedElement>
      {/* <LinearGradient
        colors={[colors.primaryShade, colors.primary]}
        style={styles.gradient}
      /> */}
      <View style={styles.logoContainer}>
        <Animated.Text style={[styles.title, { opacity: welcomeAnimation }]}>
          Welcome to
        </Animated.Text>
        <SharedElement id="group">
          <Text style={styles.logo}>Group</Text>
        </SharedElement>
        <SharedElement id="shop">
          <Text style={styles.logo}>Shop</Text>
        </SharedElement>
      </View>
      <SharedElement id="logo" style={{ marginRight: 20 }}>
        <Logo size={200} style={{ marginVertical: 42 }} />
      </SharedElement>
      <LongButton
        style={[
          {
            transform: [{ translateY }],
            opacity: getStartedAnimation,
          },
          globalStyles.shadow,
        ]}
        text="Get Started"
        onPress={() => navigation.navigate("firstScreen")}
        textColor={colors.primary}
        backgroundColor={colors.theme}
        marginBottom={0}
        st
      />
    </View>
  );
}

GetStartedScreen.sharedElements = (route) => {
  return [
    {
      id: "bg",
      animation: "move",
    },
    {
      id: "group",
      animation: "move",
    },
    {
      id: "shop",
      animation: "move",
    },
    {
      id: "logo",
      animation: "move",
    },
  ];
};

export default GetStartedScreen;
