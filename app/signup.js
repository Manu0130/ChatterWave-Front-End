import { StatusBar } from 'expo-status-bar';
import { Alert, Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect, useState } from "react";
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome6 } from '@expo/vector-icons';
import FadeWrapper from './FadeWrapper';



SplashScreen.preventAutoHideAsync();

export default function signup() {

    const backgroundImage = require("../assets/backgroundImage.jpg")
    const avatarImage = require("../assets/images/user.png")
    const appIcon = require("../assets/chatIcon.png")

    const [getImage, setImage] = useState(avatarImage);

    const [getMobile, setMobile] = useState("");
    const [getFirstName, setFirstName] = useState("");
    const [getLastName, setLastName] = useState("");
    const [getPassword, setPassword] = useState("");

    const [getResponse, setResponse] = useState("");

    const [passwordVisible, setPasswordVisible] = useState(false);

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
        <View style={stylesheet.container}>

            <StatusBar backgroundColor='#ff6600' />

            <FadeWrapper>
                <Image source={backgroundImage} style={stylesheet.backgroundImage} />
                <View style={{ justifyContent: "center", alignItems: "center", alignSelf: "center", width: "100%", height: 200, flexDirection: "row" }}>
                    <View style={{ backgroundColor: "rgba(255, 255, 255, 0.5)", flexDirection: "row", justifyContent: "center", alignItems: "center", flex: 1 }}>
                        <Text style={stylesheet.appName}>ChatterWave</Text>
                        <Image source={appIcon} style={stylesheet.appIcon} />
                    </View>
                </View>



                <View style={stylesheet.whiteSheet}>
                    <View style={stylesheet.subWhiteSheet}>

                        <ScrollView style={{ width: "100%" }}>
                            <View style={stylesheet.view1}>
                                <Text style={stylesheet.title}>Register</Text>

                                <Pressable onPress={
                                    async () => {
                                        let result = await ImagePicker.launchImageLibraryAsync(
                                            {
                                                mediaTypes: ImagePicker.MediaTypeOptions.All,
                                                mediaTypes: ImagePicker.MediaTypeOptions.All,
                                                allowsEditing: true,
                                                aspect: [1, 1],
                                                quality: 1
                                            }
                                        );

                                        if (!result.canceled) {
                                            setImage(result.assets[0].uri);
                                        }

                                    }
                                } style={stylesheet.avatar1} >
                                    <Image source={getImage} style={stylesheet.image1} contentFit={"contain"} />
                                </Pressable>

                            </View>


                            <View style={stylesheet.view2}>
                                <Text style={{ color: 'red', fontSize: 14, fontFamily: "Fredoka-Regular", alignSelf: 'center', marginBottom: 5 }}>{getResponse}</Text>
                                <TextInput style={[stylesheet.input, stylesheet.inputContainer]} placeholder='Enter Mobile Number' keyboardType='phone-pad' maxLength={10} onChangeText={
                                    (text) => {
                                        setMobile(text);
                                    }
                                } />

                                <TextInput style={[stylesheet.input, stylesheet.inputContainer]} placeholder='Enter First Name' keyboardType='default' onChangeText={
                                    (text) => {
                                        setFirstName(text);
                                    }
                                } />
                                
                                <TextInput style={[stylesheet.input, stylesheet.inputContainer]} placeholder='Enter Last Name' keyboardType='default' onChangeText={
                                    (text) => {
                                        setLastName(text);
                                    }
                                } />

                                <View style={stylesheet.inputContainer}>
                                    <TextInput style={[stylesheet.input, { flex: 1 }]} placeholder='Enter Password' keyboardType='default' secureTextEntry={!passwordVisible} onChangeText={
                                        (text) => {
                                            setPassword(text);
                                        }
                                    } />
                                    <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
                                        <FontAwesome6
                                            name={passwordVisible ? "eye" : "eye-slash"}
                                            size={24}
                                            color="gray"
                                            style={stylesheet.eyeIcon}
                                        />
                                    </Pressable>
                                </View>

                            </View>



                            <Pressable style={stylesheet.button} onPress={
                                async () => {
                                    // Alert.alert("Data", getMobile + "" + getFirstName + "" + getLastName + "" + getPassword);

                                    let formData = new FormData();

                                    formData.append("mobile", getMobile);
                                    formData.append("firstName", getFirstName);
                                    formData.append("lastName", getLastName);
                                    formData.append("password", getPassword);

                                    if (getImage != avatarImage) {
                                        formData.append("avatarImage",
                                            {
                                                name: "avatar.png",
                                                type: "image/png",
                                                uri: getImage
                                            }
                                        );
                                    }

                                    let response = await fetch(
                                        process.env.EXPO_PUBLIC_URL + "/ChatterWave/SignUp",

                                        {
                                            method: "POST",
                                            body: formData
                                        }
                                    );

                                    if (response.ok) {
                                        let json = await response.json();

                                        if (json.success) {

                                            // Alert.alert("Success", json.message);
                                            router.replace("/signin");

                                        } else {

                                            // Alert.alert("Error", json.message);
                                            setResponse(json.message);

                                        }

                                    }

                                }
                            }>
                                <Text style={{ color: '#fff', fontSize: 20, fontFamily: "Fredoka-SemiBold" }}>Sign Up</Text>
                            </Pressable>
                            <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                                <Text style={{ color: 'gray', fontSize: 14, fontFamily: "Fredoka-Regular" }}>Already have an account? </Text>
                                <Pressable onPress={
                                    () => {
                                        router.replace("/signin");
                                    }
                                }>
                                    <Text style={{ color: '#f57c00', fontSize: 14, fontFamily: "Fredoka-SemiBold" }}> Sign In</Text>
                                </Pressable>
                            </View>

                        </ScrollView>
                    </View>
                </View>

            </FadeWrapper>
        </View>
    );
}

const stylesheet = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    input1: {
        width: "100%",
        height: 50,
        borderStyle: "solid",
        borderWidth: 2,
        borderRadius: 15,
        paddingStart: 10
    },
    backgroundImage: {
        width: "100%",
        height: 340,
        position: "absolute",
        top: 0,
    },
    appName: {
        fontSize: 45,
        color: "#f57c00",
        // alignSelf: "center",
        fontFamily: "Fredoka-SemiBold",
        padding: 5,

    },
    appIcon: {
        width: 120,
        height: 120,
        alignSelf: 'center',

    },
    view1: {
        flexDirection: "row",
        columnGap: 20,
        marginBottom: 55,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    view2: {
        // marginTop: 25,
    },
    image1: {
        width: 150,
        height: 150,
        borderStyle: 'solid',
        borderColor: '#f57c00',
        borderWidth: 5,
        borderRadius: 100,
    },
    whiteSheet: {
        width: '100%',
        height: '80%',
        position: "absolute",
        bottom: 0,
        backgroundColor: '#fff',
        borderTopRightRadius: 90,
    },
    subWhiteSheet: {
        padding: 30,
    },
    title: {
        fontSize: 40,
        color: "#f57c00",
        alignSelf: "center",
        fontFamily: "Fredoka-Regular",
        marginRight: 80
    },
    input: {
        fontSize: 16,
        fontFamily: "Fredoka-Light",
    },
    inputView: {
        flexDirection: "row",
        backgroundColor: "#F6F7FB",
        height: 58,
        marginBottom: 25,
        borderRadius: 10,
        padding: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#F6F7FB",
        height: 58,
        marginBottom: 25,
        borderRadius: 10,
        padding: 12,
    },
    button: {
        backgroundColor: '#FFA500',
        height: 58,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        elevation: 3,
    },
});
