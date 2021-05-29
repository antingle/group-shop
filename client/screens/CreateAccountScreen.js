import { useMutation } from "@apollo/client";
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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { colors } from "../colors.js";
import { REGISTER } from "../graphql/graphql.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setStorageData } from "../storage.js";

export default function CreateAccountScreen({ navigation }) {
  const [email, setEmail] = React.useState(null);
  const [name, setName] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [confirmPassword, setConfirmPassword] = React.useState(null);

  const nameRef = React.useRef();
  const emailRef = React.useRef();
  const passRef = React.useRef();
  const confirmPassRef = React.useRef();

  const [register, { loading, error }] = useMutation(REGISTER, {
    update(proxy, result) {
      try {
        const returnedData = result.data.register;
        let userData = returnedData;
        delete userData.lists; // delete is not an ideal operation
        const listData = returnedData.lists;
        setStorageData("@user", userData);
      } catch (e) {
        console.log(e);
        navigation.navigate("firstScreen");
      }
    },
  });

  const hasUnsavedChanges = Boolean(
    name || email || password || confirmPassword
  );

  const handleCreate = () => {
    console.log({ email, name, password, confirmPassword });
    register({ variables: { name, email, password, confirmPassword } });
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

  if (loading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  if (error)
    <View>
      <Text>{error}</Text>
    </View>;

  return (
    <KeyboardAwareScrollView>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.heading}>Name</Text>
        <TextInput
          autoFocus={true}
          placeholder="Name"
          style={styles.textInput}
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
          style={styles.textInput}
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
          textContentType="newPassword"
          returnKeyType="next"
          ref={passRef}
          onSubmitEditing={() => confirmPassRef.current.focus()}
        />
        <Text style={styles.heading}>Confirm Password</Text>
        <TextInput
          placeholder="Confirm Password"
          style={styles.textInput}
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
    </KeyboardAwareScrollView>
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
    width: 280,
    marginTop: 40,
    color: colors.green,
  },
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "800",
    color: colors.green,
    marginBottom: 12,
    paddingTop: 40,
  },
  textInput: {
    fontSize: 24,
    marginTop: 20,
    width: 280,
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
