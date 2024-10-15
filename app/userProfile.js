import { Image } from "expo-image";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { router, SplashScreen, useLocalSearchParams } from 'expo-router';
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { FontAwesome6 } from "@expo/vector-icons";

export default function userProfile() {

    const item = useLocalSearchParams();

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
        <SafeAreaView style={{ flex: 1 }}>

            <StatusBar backgroundColor="#f57c00" />

            <View style={stylesheet.header}>
                <Pressable onPress={
                    () => router.back()
                }>
                    <FontAwesome6 name={"arrow-left"} color={"black"} size={20} />
                </Pressable>
                <View style={stylesheet.headerSub}>
                    <Text style={stylesheet.headerText}>Profile</Text>
                </View>
            </View>

            <View style={stylesheet.container}>
                <View style={stylesheet.profile}>
                    {
                        imageExists ?
                            <Image contentFit="cover" source={{ uri: `${process.env.EXPO_PUBLIC_URL}/ChatterWave/AvatarImages/${item.other_user_mobile}.png` }} style={stylesheet.profileImage} />
                            :
                            <Image source={avatarImage} style={stylesheet.profileImage} />

                    }

                    <Text style={stylesheet.profileFullName}>{item.other_user_name}</Text>
                    <Text style={stylesheet.profileMobile}>{item.other_user_mobile}</Text>
                    <Text style={stylesheet.profileSience}></Text>
                </View>
                <View style={{ padding: 40 }}>
                    <Pressable onPress={
                        () => router.back()
                    }>
                        <View style={stylesheet.profileButton}>
                            <Text style={stylesheet.profileButtonText}>Message</Text>
                            <FontAwesome6 name={"message"} color={"white"} size={20} />
                        </View>
                    </Pressable>
                </View>
            </View>

        </SafeAreaView>
    );
}

const stylesheet = StyleSheet.create({
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
    container: {
        paddingVertical: 48,
        flex: 1,
    },
    profile: {
        padding: 16,
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "black"
    },
    profileImage: {
        height: 170,
        width: 170,
        borderRadius: 85,
        borderWidth: 2,
        borderColor: "#f57c00",
        backgroundColor: "#FFF7F1"
    },
    profileFullName: {
        marginTop: 15,
        fontSize: 20,
        fontFamily: "Fredoka-SemiBold"
    },
    profileMobile: {
        marginTop: 10,
        fontSize: 15,
        fontStyle: "Fredoka-Regular",
        color: "#848484"
    },
    profileButton: {
        marginTop: 12,
        paddingVertical: 15,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f57c00',
        borderRadius: 12,
    },
    profileButtonText: {
        marginRight: 8,
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
        fontStyle: "Fredoka-Regular",
    },
});