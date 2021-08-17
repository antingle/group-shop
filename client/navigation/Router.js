import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import useScheme from "../hooks/useScheme";
import Loading from "../screens/Loading";
import AuthStack from "./AuthStack";
import { ListProvider } from "../contexts/ListContext";
import MainStack from "./MainStack";
import * as Linking from "expo-linking";
import { Platform, UIManager, useColorScheme, View } from "react-native";

// for deep linking in app
const prefix = Linking.createURL("/");

export default function Router() {
  const { authData, loading } = useAuth();
  const { colors } = useScheme();
  const colorScheme = useColorScheme();

  const theme = {
    dark: colorScheme == "dark",
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.background,
      text: colors.text,
    },
  };

  // To allow Android to use LayoutAnimation
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const linking = {
    prefixes: [prefix],
  };

  if (loading) return <Loading />;

  // This view wrapping the navigation container prevents flashing of expo background color on certain transitions
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <NavigationContainer theme={theme} linking={linking}>
        {authData ? (
          <ListProvider>
            <MainStack />
          </ListProvider>
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </View>
  );
}
