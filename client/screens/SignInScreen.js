import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "../colors.js";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);

  const emailRef = React.useRef();
  const passRef = React.useRef();

  const hasUnsavedChanges = Boolean(email || password);

  const handleCreate = () => {
    console.log({ email, password });
    navigation.navigate("createOrJoin");
  };

  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (!hasUnsavedChanges) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          "Discard changes?",
          "You have unsaved changes. Are you sure to discard them?",
          [
            { text: "Cancel", style: "cancel", onPress: () => {} },
            {
              text: "Discard",
              style: "destructive",
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }),
    [navigation, hasUnsavedChanges]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.heading}>Email</Text>
      <TextInput
        placeholder="Email"
        style={styles.textInput}
        autoFocus={false}
        autoCapitalize={"none"}
        onChangeText={setEmail}
        autoCorrect={false}
        autoCompleteType="email"
        textContentType="emailAddress"
        returnKeyType="next"
        ref={emailRef}
        onSubmitEditing={() => passRef.current.focus()}
      />
      <Text style={styles.heading}>Password</Text>
      <TextInput
        placeholder="Password"
        style={styles.textInput}
        autoCapitalize={"none"}
        onChangeText={setPassword}
        autoCorrect={false}
        autoCompleteType="password"
        secureTextEntry={true}
        textContentType="password"
        returnKeyType="next"
        ref={passRef}
      />

      <TouchableOpacity style={styles.signInButton} onPress={handleCreate}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 40,
    color: colors.green,
  },
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "900",
    color: colors.green,
    marginBottom: 12,
    marginTop: 24,
  },
  textInput: {
    fontSize: 24,
    paddingTop: 10,
    color: colors.dark,
  },
  signInButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 320,
    borderWidth: 2,
    borderRadius: 48,
    marginTop: 60,
    borderColor: colors.green,
    backgroundColor: colors.green,
  },
  signInText: {
    fontSize: 22,
    color: colors.light,
    fontWeight: "500",
  },
});
