import { useMutation } from "@apollo/client";
import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { LOGIN } from "../graphql/graphql.js";
import useAuth from "../hooks/useAuth.js";
import useScheme from "../hooks/useScheme.js";
import Loading from "./Loading.js";

export default function SignInScreen() {
  const { colors, globalStyles } = useScheme();
  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);

  const emailRef = React.useRef();
  const passRef = React.useRef();

  const { signIn } = useAuth();

  const [login, { loading, error }] = useMutation(LOGIN, {
    update(proxy, result) {
      try {
        const loginData = result.data.login;
        signIn(loginData);
      } catch (e) {
        console.log(e); // in future, display error messages on this screen
      }
    },
  });

  const handleSignIn = () => {
    login({ variables: { email, password } });
  };

  // styles
  const styles = StyleSheet.create({
    signInButton: {
      alignItems: "center",
      justifyContent: "center",
      height: 60,
      width: 320,
      borderWidth: 2,
      borderRadius: 48,
      marginTop: 60,
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    signInText: {
      fontSize: 22,
      color: colors.background,
      fontWeight: "500",
    },
  });

  if (loading) return <Loading />;
  if (error)
    <View>
      <Text>{error}</Text>
    </View>;

  return (
    <View style={globalStyles.containerTop2}>
      <Text style={globalStyles.inputLabel}>Email</Text>
      <TextInput
        placeholder="Email"
        style={globalStyles.textInput}
        autoCapitalize={"none"}
        onChangeText={setEmail}
        autoCorrect={false}
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType={"email-address"}
        returnKeyType="next"
        ref={emailRef}
        onSubmitEditing={() => passRef.current.focus()}
      />
      <Text style={globalStyles.inputLabel}>Password</Text>
      <TextInput
        placeholder="Password"
        style={globalStyles.textInput}
        autoCapitalize={"none"}
        onChangeText={setPassword}
        autoCorrect={false}
        autoCompleteType="password"
        secureTextEntry={true}
        textContentType="password"
        returnKeyType="done"
        ref={passRef}
      />
      {/* <LongButton
        text="Sign In"
        onPress={handleSignIn}
        textColor={colors.background}
        backgroundColor={colors.primary}
        marginTop={48}
      /> */}
    </View>
  );
}
