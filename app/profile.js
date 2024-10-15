import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import { router, SplashScreen, useLocalSearchParams } from 'expo-router';

import AsyncStorage from "@react-native-async-storage/async-storage";


import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";



export default function profile() {

    const item = useLocalSearchParams();
    const [firstName, lastName] = item.other_user_name.split(' ');

    const [imageExists, setImageExists] = useState(false);
    const imageUrl = `${process.env.EXPO_PUBLIC_URL}/ChatterWave/AvatarImages/${item.other_user_mobile}.png`;

    const avatarImage = require("../assets/images/user.png")

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
            if (loaded || error) {
                SplashScreen.hideAsync();
            }
        }, [loaded, error]
    );

    useEffect(() => {
        const checkImageExists = async () => {
            try {
                const response = await fetch(imageUrl);
                if (response.status === 200) {
                    setImageExists(true); 
                } else {
                    setImageExists(false); 
                }
            } catch (error) {
                setImageExists(false); 
            }
        };

        checkImageExists();
    }, [imageUrl]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <View style={stylesheet.mainView}>

            <StatusBar backgroundColor="#f57c00" />

            <View style={stylesheet.header}>
                <Pressable onPress={
                    () => router.back()
                }>
                    <FontAwesome6 name={"arrow-left"} color={"black"} size={20} />
                </Pressable>
                <View style={stylesheet.headerSub}>
                    <Text style={stylesheet.headerText}>{firstName}'s Profile</Text>
                </View>
            </View>

            <ScrollView style={{ padding: 20 }}>
                <View style={stylesheet.scroll}>
                    <Pressable>
                        {
                            imageExists  ?
                                <Image contentFit="cover" source={{ uri: `${process.env.EXPO_PUBLIC_URL}/ChatterWave/AvatarImages/${item.other_user_mobile}.png` }} style={stylesheet.profileImage} />
                                :
                                <Image source={avatarImage} style={stylesheet.profileImage} />

                        }
                        <View style={stylesheet.imgIcon}>
                            <FontAwesome6 name={"camera"} color={"#f57c00"} size={32} />
                        </View>
                    </Pressable>
                </View>
                <View>
                    <Text style={stylesheet.textTitle}>Mobile</Text>
                    <View style={stylesheet.textView}>
                        <TextInput value={item.other_user_mobile} />
                    </View>

                    <Text style={stylesheet.textTitle}>First Name</Text>
                    <View style={stylesheet.textView}>
                        <TextInput value={firstName} />
                    </View>

                    <Text style={stylesheet.textTitle}>Last Name</Text>
                    <View style={stylesheet.textView}>
                        <TextInput value={lastName} />
                    </View>

                    <Pressable style={stylesheet.logoutBtn} onPress={async () => {

                        Alert.alert(
                            "Sign Out", "Are you sure do you want to Sign Out from your account ?",
                            [{
                                text: "yes",
                                onPress: async () => {
                                    console.log("delete")
                                    try {
                                        
                                        await AsyncStorage.removeItem("user");

                                        router.replace("/signin");
                                    } catch (e) {
                                        console.log(e);
                                        Alert.alert("Error", "Failed to sign out.");
                                    }
                                }
                            },
                            {
                                text: "no",
                                onPress: () => {
                                    console.log("nothing")
                                }
                            }],
                            {
                                cancelable: true 
                            }
                        )

                    }}>

                        <Text style={{ color: '#fff', fontSize: 20, fontFamily: "Fredoka-Regular" }}>Sign Out</Text>
                        <FontAwesome6 name={"power-off"} color={"white"} size={18} />
                    </Pressable>
                </View>


            </ScrollView>
        </View>
    );


}

const stylesheet = StyleSheet.create(
    {
        mainView: {
            flex: 1,
            // backgroundColor: "#FFF7F1"
        },
        header: {
            backgroundColor: "#f57c00",
            // marginTop: 20,
            // height: 50,
            padding: 20,
            // paddingBottom:20,
            paddingHorizontal: 20,
            flexDirection: "row",
            columnGap: 20,
            justifyContent: "flex-start",
            alignItems: "center"
        },
        headerSub: {
            alignSelf: "center"
        },
        headerText: {
            fontSize: 20,
            fontFamily: "Fredoka-SemiBold",
        },
        scroll: {
            alignItems: "center",
            marginVertical: 22,

        },
        profileImage: {
            height: 170,
            width: 170,
            borderRadius: 85,
            borderWidth: 2,
            borderColor: "#f57c00",
            backgroundColor: "#FFF7F1",

        },
        imgIcon: {
            position: "absolute",
            bottom: 0,
            right: 10,
            zIndex: 9999
        },
        textTitle: {
            fontFamily: "Fredoka-SemiBold",
            fontSize: 18,
            marginTop: 20,
        },
        textView: {
            height: 40,
            width: "100%",
            borderColor: "black",
            borderRadius: 10,
            marginVertical: 6,
            // justifyContent: "center",
            paddingLeft: 8,
            paddingRight: 8,
            borderBottomWidth: 1,
            flexDirection: "row"
        },
        updateBtn: {
            backgroundColor: '#f57c00',
            height: 58,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
            flexDirection: "row",
            columnGap: 20
        },
        logoutBtn: {
            backgroundColor: 'red',
            height: 58,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
            flexDirection: "row",
            columnGap: 20
        }
    }
)