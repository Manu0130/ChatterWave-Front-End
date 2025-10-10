import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { router, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Button, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import FadeWrapper from "./FadeWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function index() {

  const welcomeImage = require("../assets/gif/welcome.gif");

  const [loaded, error] = useFonts(
    {
      "Fredoka-Bold": require('../assets/fonts/Fredoka-Bold.ttf'),
      "Fredoka-Light": require('../assets/fonts/Fredoka-Light.ttf'),
      "Fredoka-Medium": require('../assets/fonts/Fredoka-Medium.ttf'),
      "Fredoka-Regular": require('../assets/fonts/Fredoka-Regular.ttf'),
      "Fredoka-SemiBold": require('../assets/fonts/Fredoka-SemiBold.ttf'),
    }
  );

  useEffect(
    () => {

      async function checkUserInAsyncStorage() {
        try {
          let userJson = await AsyncStorage.getItem("user");
          if (userJson != null) {
            router.replace("/home");
            // router.replace("/test");

            // Alert.alert(userJson);
          }
        } catch (e) {
          console.log(e);
        }
      }
      checkUserInAsyncStorage();
    }, []
  );

  useEffect(
    () => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    }, [loaded, error]
  );

  if (!loaded && !error) {
    return null;
  }

  return (

    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <FadeWrapper>
        <View style={stylesheet.innerContainer}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Image source={welcomeImage} style={stylesheet.welcomeImage} />

            <Text style={stylesheet.welcomeText}>Hey There!</Text>
            <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 40 }}>
              <Text style={stylesheet.welcomeText}>Welcome to </Text>
              <Text style={stylesheet.welcomeAppName}>ChatterWave!</Text>
            </View>


            <Text style={stylesheet.descriptionText}>Connect with friends and family in real time.</Text>
            <Text style={stylesheet.descriptionText}>Start chatting now and enjoy seamless conversations anytime, anywhere!</Text>
          </View>
          <Pressable style={stylesheet.button} onPress={
            () => {
              router.push("/signin")
            }
          }>
            <Text style={stylesheet.buttonText} >Get Started</Text>
          </Pressable>


        </View>
      </FadeWrapper>


    </SafeAreaView>
  );
}

const stylesheet = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    // backgroundColor: "red"
  },
  welcomeImage: {
    width: 300,
    height: 300,
    marginBottom: 60,
    // backgroundColor: "yellow"
  },
  welcomeText: {
    fontSize: 30,
    fontFamily: "Fredoka-Bold",
    textAlign: "center",
  },
  welcomeAppName: {
    fontSize: 30,
    fontFamily: "Fredoka-Bold",
    textAlign: "center",
    color: "#f57c00"
  },
  descriptionText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 5,
    paddingHorizontal: 10,
    fontFamily: "Fredoka-Regular",
  },
  button: {
    backgroundColor: '#FFA500',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    width: "90%",
    height: 60,
    marginBottom: 30

  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: "Fredoka-SemiBold",
  },
});