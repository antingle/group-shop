import { useMutation } from "@apollo/client";
import React from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { REGISTER } from "../graphql/graphql.js";
import useAuth from "../hooks/useAuth.js";
import useScheme from "../hooks/useScheme.js";
import Loading from "./Loading.js";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function CreateAccountScreen() {
  const { colors, globalStyles } = useScheme();

  const [email, setEmail] = React.useState(null);
  const [name, setName] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [emailError, setEmailError] = React.useState(null);
  const [nameError, setNameError] = React.useState(null);
  const [passwordError, setPasswordError] = React.useState(null);

  const nameRef = React.useRef();
  const emailRef = React.useRef();
  const passRef = React.useRef();

  const { signIn } = useAuth();

  const [register, { loading, error }] = useMutation(REGISTER, {
    update(proxy, result) {
      try {
        const loginData = result.data.register;
        // const listData = returnedData.lists; // use in future when registering with link?
        signIn(loginData);
      } catch (e) {
        console.log(e); // in the future, add error to display on screen
      }
    },
  });

  const validateForm = () => {
    const re = /\S+@\S+\.\S+/;
    let valid = true;
    if (name == "" || name == null) {
      setNameError("Entering a name is required");
      valid = false;
    }
    if (!re.test(email)) {
      setEmailError("Must be a valid email address");
      valid = false;
    }
    if (password == null || password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      valid = false;
    }
    return valid;
  };
  const updateValidation = () => {
    const re = /\S+@\S+\.\S+/;
    if (name != "" && name != null) setNameError(null);
    if (re.test(email)) setEmailError(null);
    if (password != null && password.length >= 8) setPasswordError(null);
  };

  const handleCreate = () => {
    console.log(password);
    console.log(validateForm());
    if (!validateForm()) return;
    register({
      variables: { name, email, password, confirmPassword: password },
    });
  };

  // const hasUnsavedChanges = Boolean(name || email || password);

  // React.useEffect(
  //   () =>
  //     navigation.addListener("beforeRemove", (e) => {
  //       if (!hasUnsavedChanges) {
  //         // If we don't have unsaved changes, then we don't need to do anything
  //         return;
  //       }

  //       // Prevent default behavior of leaving the screen
  //       e.preventDefault();

  //       // Prompt the user before leaving the screen
  //       Alert.alert(
  //         "Discard changes?",
  //         "You have unsaved changes. Are you sure to discard them?",
  //         [
  //           { text: "Cancel", style: "cancel", onPress: () => {} },
  //           {
  //             text: "Discard",
  //             style: "destructive",
  //             // If the user confirmed, then we dispatch the action we blocked earlier
  //             // This will continue the action that had triggered the removal of the screen
  //             onPress: () => navigation.dispatch(e.data.action),
  //           },
  //         ]
  //       );
  //     }),
  //   [navigation, hasUnsavedChanges]
  // );
  if (error) console.log(error.graphQLErrors);

  if (loading) return <Loading />;
  if (error)
    <View>
      <Text>{JSON.stringify(error)}</Text>
    </View>;

  return (
    <View style={globalStyles.containerTop2}>
      {/* <Header title={"Create Account"} /> */}
      <Text style={globalStyles.inputLabel}>Name</Text>
      <TextInput
        placeholder="Name"
        style={globalStyles.textInput}
        autoCapitalize={"words"}
        onChangeText={setName}
        onChange={updateValidation}
        autoCorrect={false}
        autoCompleteType="name"
        textContentType="name"
        returnKeyType="next"
        ref={nameRef}
        onSubmitEditing={() => emailRef.current.focus()}
      />
      <Text style={globalStyles.errorText}>{nameError}</Text>

      <Text style={globalStyles.inputLabel}>Email</Text>
      <TextInput
        placeholder="Email"
        style={globalStyles.textInput}
        autoCapitalize={"none"}
        onChangeText={setEmail}
        onChange={updateValidation}
        autoCorrect={false}
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType={"email-address"}
        returnKeyType="next"
        ref={emailRef}
        onSubmitEditing={() => passRef.current.focus()}
      />
      <Text style={globalStyles.errorText}>{emailError}</Text>

      <Text style={globalStyles.inputLabel}>Password</Text>
      <TextInput
        placeholder="Password"
        style={globalStyles.textInput}
        autoCapitalize={"none"}
        onChangeText={setPassword}
        onChange={updateValidation}
        autoCorrect={false}
        autoCompleteType="password"
        secureTextEntry={true}
        textContentType="newPassword"
        returnKeyType="done"
        ref={passRef}
      />
      <Text style={globalStyles.errorText}>{passwordError}</Text>
      <BouncyCheckbox
        text="Sign up for our weekly newsletter"
        textStyle={{
          fontSize: 16,
          fontWeight: "400",
          color: colors.caption,
          textDecorationLine: "none",
        }}
        style={{ marginTop: 16 }}
        fillColor={colors.primary}
        iconStyle={{ borderColor: colors.primary }}
      />
    </View>
  );
}
