import { registerRootComponent } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, Animated, AppState, Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect, useState, useRef } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import FadeWrapper from "./FadeWrapper";

export default function home() {

    const [getChatArray, setChatArray] = useState([]);
    const [getSearchQuery, setSearchQuery] = useState('');
    const [getFilteredChatArray, setFilteredChatArray] = useState([]);

    const [isSearchVisible, setSearchVisible] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [appState, setAppState] = useState(AppState.currentState);

    const [userId, setUserId] = useState(null);

    const [loaded, error] = useFonts(
        {
            "Fredoka-Bold": require('../assets/fonts/Fredoka-Bold.ttf'),
            "Fredoka-Light": require('../assets/fonts/Fredoka-Light.ttf'),
            "Fredoka-Medium": require('../assets/fonts/Fredoka-Medium.ttf'),
            "Fredoka-Regular": require('../assets/fonts/Fredoka-Regular.ttf'),
            "Fredoka-SemiBold": require('../assets/fonts/Fredoka-SemiBold.ttf'),
        }
    );

    const parseDateTime = (dateTimeString) => {
        const [year, month, day, time, period] = dateTimeString.split(/[ ,]+/);

        let [hours, minutes] = time.split(':');

        if (period === 'PM' && hours !== '12') {
            hours = parseInt(hours, 10) + 12;
        } else if (period === 'AM' && hours === '12') {
            hours = '00';
        }

        return new Date(year, month - 1, day, hours, minutes);
    };

    useEffect(
        () => {
            async function fetchData() {

                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);
                if (user) {
                    setUserId(user.id);
                    console.log("User ID:", user.id);
                }

                let response = await fetch(process.env.EXPO_PUBLIC_URL + "/ChatterWave/LoadHomeData?id=" + user.id);

                if (response.ok) {
                    let json = await response.json();
                    // console.log(json);

                    if (json.success) {
                        let chatArray = json.jsonChatArray;
                        console.log(chatArray);

                        chatArray.sort((a, b) => parseDateTime(b.dateTime) - parseDateTime(a.dateTime));

                        setChatArray(chatArray);
                    }
                }
            }

            fetchData();
        }, []
    );

    useEffect(() => {
        async function checkUser() {
            let userJson = await AsyncStorage.getItem("user");
            let user = JSON.parse(userJson);

            if (!user) {
                router.replace("/");
            }
        }

        checkUser();
    }, []);

    useEffect(() => {

        console.log(getChatArray);
        const filtered = getChatArray.filter(item =>
            item.other_user_name.toLowerCase().includes(getSearchQuery.toLowerCase())
        );

        filtered.sort((a, b) => parseDateTime(b.dateTime) - parseDateTime(a.dateTime));

        setFilteredChatArray(filtered);
    }, [getSearchQuery, getChatArray]);


    useEffect(
        () => {
            if (loaded || error) {
                SplashScreen.hideAsync();
            }
        }, [loaded, error]
    );

    useEffect(() => {
        const subscription = AppState.addEventListener("change",
            async (nextAppState) => {
                if (nextAppState === "active") {
                    console.log("App has come to the foreground!" + userId);

                    try {
                        console.log("User id: " + userId);
                        const response = await fetch(process.env.EXPO_PUBLIC_URL + "/ChatterWave/UpdateUserStatusOnline?id=" + userId);

                        if (response.ok) {
                            // const responseText = await response.text();
                            console.log("Success");
                        } else {
                            console.error("Failed to set user Online");
                        }
                    } catch (error) {
                        console.log(error);
                    }

                } else if (nextAppState === "background") {
                    console.log("App is now in the background." + userId);

                    try {
                        console.log("User id: " + userId);
                        const response = await fetch(process.env.EXPO_PUBLIC_URL + "/ChatterWave/UpdateUserStatusOffline?id=" + userId);

                        if (response.ok) {
                            // const responseText = await response.text();
                            console.log("Success");
                        } else {
                            console.error("Failed to set user offline");
                        }
                    } catch (error) {
                        console.log(error);
                    }

                } else if (nextAppState === "inactive") {
                    console.log("App is in an inactive state.");
                }
                setAppState(nextAppState);
            });

        return () => {
            subscription.remove();
        };
    }, [userId]);

    if (!loaded && !error) {
        return null;
    }
    const toggleSearchBar = () => {
        setSearchVisible(!isSearchVisible);
        Animated.timing(fadeAnim, {
            toValue: isSearchVisible ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const formatDateTime = (dateTimeString) => {
        const [year, month, day, time, period] = dateTimeString.split(/[ ,]+/);

        const inputDate = new Date(year, month - 1, day);

        const today = new Date();
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (inputDate.getTime() === todayDate.getTime()) {
            return `${time} ${period}`;
        } else {
            return `${month}/${day}/${year}`;
        }
    };



    return (
        <SafeAreaView style={stylesheet.view1}>

            <StatusBar backgroundColor="#f57c00" />

            <View style={stylesheet.header}>

                <Text style={stylesheet.headerTitle}>ChatterWave</Text>
                <View style={{ flexDirection: "row", columnGap: 30 }}>
                    <Pressable onPress={toggleSearchBar}>
                        <FontAwesome6 name={"magnifying-glass"} color={"black"} size={24} />
                    </Pressable>
                    <Pressable onPress={
                        () => {
                            router.push("/profileUpdate");
                            // router.push("/test");
                        }
                    }>
                        <FontAwesome6 name={"circle-user"} color={"black"} size={24} />
                    </Pressable>

                </View>
            </View>

            <Animated.View style={{ opacity: fadeAnim }}>
                {isSearchVisible && (
                    <View style={{ backgroundColor: "#f57c00" }}>
                        <TextInput
                            style={stylesheet.searchBar}
                            placeholder="Search..."
                            value={getSearchQuery}
                            onChangeText={setSearchQuery}
                            selectionColor="#f57c00"
                        />
                    </View>

                )}
            </Animated.View>


            <View style={{ flex: 1, }}>
                <FlashList

                    data={getFilteredChatArray}
                    renderItem={
                        ({ item }) =>
                            <FadeWrapper>
                                <Pressable style={({ pressed }) => [
                                    stylesheet.view5,
                                    { backgroundColor: pressed ? '#ffcfa6' : '#fff8f2' }
                                ]} onPress={
                                    () => {
                                        // Alert.alert("View CHat", "User:" + item.other_user_id);

                                        router.push(
                                            {
                                                pathname: "/chat",
                                                params: item
                                            }
                                        );
                                    }
                                }>

                                    <View style={stylesheet.avatarContainer}>
                                        <View style={item.other_user_status == 1 ? stylesheet.view6_2 : stylesheet.view6_1}>
                                            {
                                                item.avatar_image_found ?
                                                    <Image
                                                        style={stylesheet.image1}
                                                        contentFit="cover"
                                                        source={process.env.EXPO_PUBLIC_URL + "/ChatterWave/AvatarImages/" + item.other_user_mobile + ".png"} />
                                                    :
                                                    <Text style={stylesheet.text6}>{item.other_user_avatar_letters}</Text>
                                            }
                                        </View>
                                        {item.other_user_status == 1 && (
                                            <View style={stylesheet.onlineIndicator} />
                                        )}
                                    </View>
                                    <View style={stylesheet.view4}>
                                        <View style={stylesheet.viewNMandDT}>
                                            <Text style={stylesheet.textName}>{item.other_user_name}</Text>
                                            <Text style={stylesheet.text5}>{formatDateTime(item.dateTime)}</Text>
                                        </View>

                                        <View style={stylesheet.view7}>
                                            <Text style={stylesheet.textMsg} numberOfLines={1}>{item.message}</Text>
                                            <FontAwesome6 name={"check"} color={item.chat_status_id == 1 ? "green" : "gray"} size={14} />
                                        </View>
                                    </View>

                                </Pressable>
                            </FadeWrapper>
                    }
                    estimatedItemSize={200}
                />
            </View>


        </SafeAreaView>
    );
}

const stylesheet = StyleSheet.create(
    {
        header: {
            padding: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f57c00",
            position: "static"
        },
        headerTitle: {
            fontFamily: "Fredoka-SemiBold",
            fontSize: 30,
        },
        view1: {
            flex: 1,
            backgroundColor: "#fff8f2"
        },
        searchBar: {
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 10,
            paddingHorizontal: 10,
            borderRadius: 25,
            paddingStart: 15,
            backgroundColor: "#F5E9DD",
            marginStart: 20,
            marginEnd: 20,
            fontFamily: "Fredoka-Regular"
        },
        view2: {
            flexDirection: "row",
            columnGap: 20,
            padding: 10,
            backgroundColor: "#5dade2",
            borderBottomColor: "black",
            borderBottomWidth: 2,
            borderRadius: 10,
        },
        view3: {
            width: 80,
            height: 80,
            backgroundColor: "white",
            borderRadius: 40,
        },
        view4: {
            flex: 1,
            justifyContent: "center",
            rowGap: 10
            // alignItems: "space-between",
            // backgroundColor:"yellow",
        },
        textName: {
            fontFamily: "Fredoka-SemiBold",
            fontSize: 16,
        },
        text2: {
            fontFamily: "Fredoka-Regular",
            fontSize: 16,
        },
        text3: {
            fontFamily: "Fredoka-Regular",
            fontSize: 14,
            alignSelf: "flex-end",
        },
        view5: {
            flexDirection: "row",
            // marginVertical: 10,
            columnGap: 20,
            padding: 15,
            paddingHorizontal: 25
        },
        view6_1: {
            width: 52,
            height: 52,
            borderRadius: 26,
            borderStyle: "solid",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            backgroundColor: "#f57c00"
        },
        view6_2: {
            width: 52,
            height: 52,
            borderRadius: 26,
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: "green",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            backgroundColor: "#f57c00"
        },
        avatarContainer: {
            position: "relative",
            width: 52,
            height: 52,
        },
        onlineIndicator: {
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: "green",
            borderColor: "white",
            borderWidth: 2,
        },
        textMsg: {
            fontFamily: "Fredoka-Regular",
            fontSize: 14,
            color: "#8E8E93"
            // overflow:"hidden",
            // height:24,
        },
        text5: {
            fontFamily: "Fredoka-Regular",
            fontSize: 14,
            alignSelf: "flex-end",
            color: "#8E8E93"
        },
        text6: {
            fontFamily: "Fredoka-Bold",
            fontSize: 24,
            color: "white"
        },
        profileText: {
            fontFamily: "Fredoka-Bold",
            fontSize: 24,
            color: "white"
        },
        scrollview1: {
            marginTop: 20,

        },
        view7: {
            flexDirection: "row",
            columnGap: 25,
            rowGap: 25,
            justifyContent: "space-between",
            alignItems: "center",
        },
        viewNMandDT: {
            flexDirection: "row",
            columnGap: 20,
            justifyContent: "space-between",
            alignItems: "center",
        },
        image1: {
            width: "100%",
            height: "100%",
            borderRadius: 26,
        }
    }
);