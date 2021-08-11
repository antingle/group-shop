import { BlurView } from "expo-blur";
import React from "react";
import { View, Text, Modal, StyleSheet, Dimensions } from "react-native";
import useScheme from "../hooks/useScheme";
import AnimatedPressable from "./AnimatedPressable";

export default function ErrorMessage({ error, onDismiss }) {
  const { colors } = useScheme();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [title, setTitle] = React.useState(":(");
  const [message, setMessage] = React.useState("Oops something went wrong!");

  React.useEffect(() => {
    if (error) {
      if (error.message) setTitle(error.message);
      if (error.graphQLErrors[0]?.extensions.errors) {
        const obj = error.graphQLErrors[0]?.extensions.errors;
        setMessage(obj[Object.keys(obj)[0]]);
      }

      if (error.networkError) {
        setTitle("No connection");
        setMessage("Make sure you are connected to the internet");
      }
      setModalVisible(true);
    }
  }, [error]);

  const onClose = () => {
    setModalVisible(!modalVisible);
    if (onDismiss) onDismiss();
  };

  const styles = StyleSheet.create({
    view: {
      justifyContent: "center",
      alignItems: "center",
      zIndex: 5,
      height: Dimensions.get("screen").height,
    },
    modalView: {
      backgroundColor: colors.foreground,
      borderRadius: 24,
      width: 300,
      padding: 24,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 15,
      elevation: 10,
    },
    button: {
      borderRadius: 24,
      elevation: 2,
      width: 240,
      height: 48,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primary,
    },
    buttonText: {
      color: colors.foreground,
      textAlign: "center",
      fontFamily: "Avenir-Heavy",
      fontSize: 18,
    },
    title: {
      fontFamily: "Avenir-Heavy",
      fontSize: 24,
      color: colors.text,
      marginBottom: 12,
      textAlign: "center",
    },
    message: {
      fontFamily: "Avenir",
      fontSize: 18,
      color: colors.text,
      marginBottom: 32,
      textAlign: "center",
    },
  });
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <BlurView
        intensity={100}
        tint="dark"
        style={[StyleSheet.absoluteFillObject, styles.view]}
      >
        <View style={styles.modalView}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <AnimatedPressable onPress={onClose}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Ok</Text>
            </View>
          </AnimatedPressable>
        </View>
      </BlurView>
    </Modal>
  );
}
