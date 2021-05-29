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
import { LOGIN } from "../graphql/graphql.js";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);

  const emailRef = React.useRef();
  const passRef = React.useRef();

  const [login, { loading, error }] = useMutation(LOGIN, {
    update(proxy, result) {
      try {
        const returnedData = result.data.login;
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

  const handleSignIn = () => {
    console.log({ email, password });
    navigation.navigate("createOrJoin");
  };

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
        returnKeyType="done"
        ref={passRef}
      />

      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
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
