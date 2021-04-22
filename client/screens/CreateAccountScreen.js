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

export default function CreateAccountScreen({ navigation }) {
  const [email, setEmail] = React.useState(null);
  const [name, setName] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [confirmPassword, setConfirmPassword] = React.useState(null);

  const nameRef = React.useRef();
  const emailRef = React.useRef();
  const passRef = React.useRef();
  const confirmPassRef = React.useRef();

  const hasUnsavedChanges = Boolean(
    name || email || password || confirmPassword
  );

  const handleCreate = () => {
    console.log({ email, name, password, confirmPassword });
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
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.heading}>Name</Text>
      <TextInput
        autoFocus={true}
        placeholder="Name"
        style={styles.nameInput}
        autoCapitalize={"words"}
        onChangeText={setName}
        autoCorrect={false}
        autoCompleteType="name"
        textContentType="name"
        returnKeyType="next"
        ref={nameRef}
        onSubmitEditing={() => emailRef.current.focus()}
      />
      <Text style={styles.heading}>Email</Text>
      <TextInput
        placeholder="Email"
        style={styles.nameInput}
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
        style={styles.nameInput}
        autoCapitalize={"none"}
        onChangeText={setPassword}
        autoCorrect={false}
        autoCompleteType="password"
        secureTextEntry={true}
        textContentType="newPassword"
        returnKeyType="next"
        ref={passRef}
        onSubmitEditing={() => confirmPassRef.current.focus()}
      />
      <Text style={styles.heading}>Confirm Password</Text>
      <TextInput
        placeholder="Confirm Password"
        style={styles.nameInput}
        autoCapitalize={"none"}
        onChangeText={setConfirmPassword}
        autoCorrect={false}
        autoCompleteType="password"
        secureTextEntry={true}
        textContentType="newPassword"
        returnKeyType="done"
        ref={confirmPassRef}
      />
      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createText}>Create Account</Text>
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
    fontSize: 24,
    fontWeight: "800",
    marginTop: 24,
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
  nameInput: {
    fontSize: 20,
    paddingTop: 10,
    color: colors.dark,
  },
  createButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 320,
    borderWidth: 2,
    borderRadius: 48,
    marginTop: 48,
    borderColor: colors.green,
    backgroundColor: colors.green,
  },
  createText: {
    fontSize: 22,
    color: colors.light,
    fontWeight: "500",
  },
});
