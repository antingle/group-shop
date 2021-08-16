import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  Pressable,
  TextInput,
  StatusBar,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Logo from "../components/Logo.js";
import LongButton from "../components/LongButton.js";
import TwoPicker from "../components/TwoPicker.js";
import useScheme from "../hooks/useScheme.js";
import { SharedElement } from "react-navigation-shared-element";
import useAuth from "../hooks/useAuth.js";
import { useMutation } from "@apollo/client";
import { LOGIN, REGISTER } from "../graphql/graphql.js";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { AntDesign } from "@expo/vector-icons";
import AnimatedPressable from "../components/AnimatedPressable.js";
import ErrorMessage from "../components/ErrorMessage.js";

function FirstScreen({ navigation }) {
  const { colors, globalStyles, theme } = useScheme();
  const [signUp, setSignUp] = React.useState("Sign Up");
  const [loading, setLoading] = React.useState(false);

  const [email, setEmail] = React.useState(null);
  const [name, setName] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [emailError, setEmailError] = React.useState(null);
  const [nameError, setNameError] = React.useState(null);
  const [passwordError, setPasswordError] = React.useState(null);
  const [graphqlError, setGraphqlError] = React.useState(null);

  const nameRef = React.useRef();
  const emailRef = React.useRef();
  const passRef = React.useRef();

  const { signIn } = useAuth();

  const [register, { loading: loadingReg }] = useMutation(REGISTER, {
    update(proxy, result) {
      const loginData = result.data.register;
      // const listData = returnedData.lists; // use in future when registering with link?
      signIn(loginData);
    },
    onError: (error) => {
      setGraphqlError(error);
      console.log(error.message);
      console.log(error.graphQLErrors[0]?.extensions.errors);
      console.log(error.extraInfo);

      // if (error.networkError)
      //   Alert.alert(
      //     "No connection",
      //     "If your connection looks good, this could be on us!"
      //   );
    },
  });

  const [login, { loading: loadingLog }] = useMutation(LOGIN, {
    update(proxy, result) {
      const loginData = result.data.login;
      signIn(loginData);
    },
    onError: (e) => {
      setGraphqlError(e);
    },
  });

  // Set loading for LongButton when mutations loading
  React.useEffect(() => {
    if (loadingReg || loadingLog) setLoading(true);
    else setLoading(false);
  }, [loadingReg, loadingLog]);

  const handlePicker = (text) => {
    setSignUp(text);
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const validateForm = () => {
    const re = /\S+@\S+\.\S+/; // regex for email
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
    if (!valid)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // pretty animations for your mistakes
    return valid;
  };

  const updateValidation = () => {
    const re = /\S+@\S+\.\S+/;
    if (name != null && name != "") setNameError(null);
    if (re.test(email)) setEmailError(null);
    if (password != null && password.length >= 7) setPasswordError(null);
  };

  const handleSubmit = () => {
    if (signUp == "Sign Up") {
      if (!validateForm()) return;
      register({
        variables: { name, email, password, confirmPassword: password },
      });
    } else {
      if (email != null && password != null)
        login({ variables: { email, password } });
    }
  };

  // styles
  const styles = StyleSheet.create({
    keyboardContainer: {
      backgroundColor: colors.foreground,
    },
    container: {
      flex: 1,
      backgroundColor: colors.foreground,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    topContainer: {
      justifyContent: "space-between",
      alignItems: "center",
      height: "40%",
    },
    logoContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.foreground,
      width: Dimensions.get("screen").width,
    },
    logoContainerFill: {
      backgroundColor: colors.primary,
      borderBottomLeftRadius: 42,
      borderBottomRightRadius: 42,
    },
    logo: {
      textAlign: "center",
      fontSize: 48,
      fontWeight: "900",
      color: colors.theme,
      fontFamily: "Avenir-Heavy",
    },
    title: {
      textAlign: "center",
      fontSize: 40,
      fontWeight: "900",
      color: colors.primary,
    },
    createText: {
      fontSize: 22,
      color: colors.foreground,
      fontWeight: "500",
    },
    signInText: {
      fontSize: 22,
      color: colors.primary,
      fontWeight: "500",
    },
    orText: {
      padding: 12,
      fontSize: 14,
      color: colors.caption,
      fontFamily: "Avenir",
    },
    guestText: {
      fontSize: 18,
      color: colors.primary,
      fontFamily: "Avenir",
    },
    gradient: {
      height: Dimensions.get("window").height,
      width: Dimensions.get("window").width,
      position: "absolute",
      opacity: 0.5,
    },
    logoText: {
      flexDirection: "row",
      width: 320,
      justifyContent: "space-evenly",
    },
    checkboxText: {
      fontSize: 16,
      color: colors.text,
      textDecorationLine: "none",
      fontFamily: "Avenir",
    },
    bottomContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      textAlign: "center",
      backgroundColor: colors.foreground,
    },
  });

  return (
    <View style={styles.container}>
      <ErrorMessage error={graphqlError} />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        style={styles.keyboardContainer}
        keyboardOpeningTime={0}
      >
        <View style={styles.topContainer}>
          <Pressable
            style={styles.logoContainer}
            onPress={() => navigation.goBack()}
          >
            <SharedElement id="bg" style={StyleSheet.absoluteFillObject}>
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  styles.logoContainerFill,
                ]}
              />
            </SharedElement>
            <View style={styles.logoText}>
              <SharedElement id="group">
                <Text style={styles.logo}>Group</Text>
              </SharedElement>
              <SharedElement id="shop">
                <Text style={styles.logo}>Shop</Text>
              </SharedElement>
            </View>

            <SharedElement id="logo" style={{ marginRight: 10 }}>
              <Logo />
            </SharedElement>
          </Pressable>
          <TwoPicker
            onPressLeft={() => handlePicker("Sign Up")}
            onPressRight={() => handlePicker("Sign In")}
          />
        </View>
        {signUp == "Sign Up" && (
          <View>
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
          </View>
        )}
        <Text style={globalStyles.errorText}>{nameError}</Text>
        <View>
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
        </View>
        <View>
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
        </View>
        <View style={styles.bottomContainer}>
          {signUp == "Sign Up" && (
            <View style={globalStyles.row}>
              <BouncyCheckbox
                text="Subscribe to our newsletter"
                textStyle={styles.checkboxText}
                fillColor={colors.primary}
                iconStyle={{ borderColor: colors.primary }}
              />
              <AnimatedPressable>
                <AntDesign
                  name="questioncircleo"
                  size={24}
                  color={colors.primary}
                  style={{ marginLeft: 12 }}
                />
              </AnimatedPressable>
            </View>
          )}

          <LongButton
            text={signUp}
            loading={loading}
            onPress={handleSubmit}
            textColor={colors.theme}
            backgroundColor={colors.primary}
            style={{ marginTop: "5%" }}
          />
          {signUp == "Sign Up" && <Text style={styles.orText}>Or</Text>}
          {signUp == "Sign Up" && (
            <Pressable
              onPress={() => navigation.navigate("name")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Text style={styles.guestText}>Continue as Guest</Text>
            </Pressable>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default FirstScreen;
