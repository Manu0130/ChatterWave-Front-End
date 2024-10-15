import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect, useState, useRef } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import FadeWrapper from "./FadeWrapper";

import CustomAlert from "./CustomAlert";

export default function chat() {

    const item = useLocalSearchParams();
    console.log(item.other_user_id);
    // console.log(item);

    const flashListRef = useRef(null);

    const [getChatArray, setChatArray] = useState([]);

    const [getChatText, setChatText] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);

    const [selectedMessageId, setSelectedMessageId] = useState(null);

    const [loading, setLoading] = useState(true); // Loading state

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


    useEffect(

        () => {
            let intervalId;
            setLoading(true); 
            async function fetchChatArray() {
                

                try {
                    let userJson = await AsyncStorage.getItem("user");
                    let user = JSON.parse(userJson);
                    console.log(user.id);

                    if (user) {
                        let response = await fetch(process.env.EXPO_PUBLIC_URL + "/ChatterWave/LoadChat?logged_user_id=" + user.id + "&other_user_id=" + item.other_user_id);

                        if (response.ok) {
                            let chatArray = await response.json();
                            // console.log(chatArray);
                            setChatArray(chatArray);
                        }

                    } else {
                        clearInterval(intervalId);
                    }
                } catch (error) {
                    console.log("Error fetching chat:", error);
                } finally {
                    setLoading(false); // Finished loading
                }
            }
            fetchChatArray();

            intervalId = setInterval(()=>{
            fetchChatArray();
            }, 5000);

            return () => {
                clearInterval(intervalId);
            }
        }, [item.other_user_id]
    );

    if (loading) {
        return <View style={stylesheet.loadingContainer}>
            <Image source={require('../assets/gif/loading.gif')} style={stylesheet.gifStyle}/>
            <Text style={stylesheet.text3}>Loading...</Text>
        </View>; 
    }

    if (!loaded && !error) {
        return null;
    }

    const deleteMessage = async (messageId) => {
        try {
            let response = await fetch(
                process.env.EXPO_PUBLIC_URL + "/ChatterWave/DeleteChat?message_id=" + messageId,
                {
                    method: "DELETE",
                });

            if (response.ok) {
                let json = await response.json();
                if (json.success) {
                    console.log("Message Deleted");
                    setChatArray((prevChats) => prevChats.filter((msg) => msg.id !== messageId));
                }
            }
        } catch (error) {
            console.log("Error deleting message:", error);
        }
    };

    return (

        <SafeAreaView style={stylesheet.view1}>

            <StatusBar backgroundColor="#f57c00" />

            <View style={stylesheet.view2}>
                <Pressable onPress={
                    () => router.back()
                }>
                    <FontAwesome6 name={"arrow-left"} color={"black"} size={20} />
                </Pressable>

                <Pressable style={{ flexDirection: "row", columnGap: 10 }} onPress={
                    () =>
                        router.push(
                            {
                                pathname: "/userProfile",
                                params: item
                            }
                        )
                }>
                    <View style={stylesheet.view3}>
                        {
                            item.avatar_image_found == "true"
                                ? <Image style={stylesheet.image1}
                                    source={process.env.EXPO_PUBLIC_URL + "/ChatterWave/AvatarImages/" + item.other_user_mobile + ".png"}
                                    contentFit="cover" />
                                : <Text style={stylesheet.text1}>{item.other_user_avatar_letters}</Text>
                        }


                    </View>
                    <View style={stylesheet.view4}>
                        <Text style={stylesheet.text2}>{item.other_user_name}</Text>
                        <Text style={stylesheet.text3}>{item.other_user_status == 1 ? "Online" : "Offline"}</Text>
                    </View>
                </Pressable>

            </View>
            <FadeWrapper>

                <View style={stylesheet.center_view}>

                    <FlashList
                        ref={flashListRef}
                        data={getChatArray}
                        renderItem={
                            ({ item }) =>
                                <Pressable
                                    onLongPress={() => {
                                        setSelectedMessageId(item.id);
                                        setModalVisible(true);
                                    }}
                                >
                                    <View style={item.side == "right" ? stylesheet.view5_1 : stylesheet.view5_2}>

                                        <Text style={stylesheet.text3}>{item.message}</Text>
                                        <View style={stylesheet.view6}>
                                            <Text style={stylesheet.text4}>{item.datetime}</Text>
                                            {
                                                item.side == "right" ?
                                                    <FontAwesome6 name={"check"} color={item.status == 1 ? "green" : "gray"} size={18} />
                                                    :
                                                    null
                                            }
                                        </View>
                                    </View>
                                </Pressable>
                        }
                        estimatedItemSize={200}
                        onContentSizeChange={
                            () => {
                                if (flashListRef.current && getChatArray && getChatArray.length > 0) {
                                    flashListRef.current.scrollToEnd({ animated: true });
                                }
                            }
                        }

                    />

                </View>
            </FadeWrapper>

            <View style={stylesheet.view7}>
                <TextInput style={stylesheet.input1} selectionColor="#f57c00" placeholder='Message' value={getChatText} onChangeText={
                    (text) => {
                        setChatText(text);
                    }
                }
                />

                <Pressable onPress={
                    () => {
                        ImagePicker.launchCameraAsync({

                        });
                    }
                }>
                    <FontAwesome6 name={"camera"} color={"gray"} size={24} />
                </Pressable>

                <FontAwesome6 name={"microphone"} color={"gray"} size={24} />

                <Pressable style={stylesheet.pressable1} onPress={
                    async () => {
                        // Alert.alert("hi");

                        if (getChatText.length == 0) {
                            Alert.alert("Error", "Please enter your message");
                        } else {
                            let userJson = await AsyncStorage.getItem("user");
                            let user = JSON.parse(userJson);

                            let response = await fetch(process.env.EXPO_PUBLIC_URL + "/ChatterWave/SendChat?logged_user_id=" + user.id + "&other_user_id=" + item.other_user_id + "&message=" + getChatText);

                            if (response.ok) {
                                let json = await response.json();

                                if (json.success) {
                                    console.log("Message Sent");
                                    setChatText("");
                                }
                            }
                        }
                    }
                }>
                    <Text style={stylesheet.sendBtnText}>Send</Text>
                </Pressable>
            </View>

            <CustomAlert
                visible={modalVisible}
                title="Warning !"
                message="Are you sure do you want to Delete this message?"
                confirmText="Yes"
                cancelText="No"
                onConfirm={
                    () => {
                        if (selectedMessageId) {
                            deleteMessage(selectedMessageId);
                        }
                        setModalVisible(false);
                    }
                }
                onCancel={() => setModalVisible(false)}
            />

        </SafeAreaView>
    );
}

const stylesheet = StyleSheet.create(
    {
        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        gifStyle: {
            width: 150, 
            height: 150, 
            marginBottom: 15 
        },
        view1: {
            flex: 1,
        },
        view2: {
            backgroundColor: "#f57c00",
            // marginTop: 20,
            padding: 20,
            paddingHorizontal: 20,
            flexDirection: "row",
            columnGap: 20,
            justifyContent: "flex-start",
            alignItems: "center"
        },
        view3: {
            backgroundColor: "white",
            width: 50,
            height: 50,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
        },
        image1: {
            width: "100%",
            height: "100%",
            borderRadius: 50,
            // backgroundColor: "white",
            // justifyContent: "center",
            // alignItems: "center",
            // alignSelf: "center"
        },
        text1: {
            fontFamily: "Fredoka-Bold",
            fontSize: 24,
            color: "#f57c00"
        },
        view4: {
            rowGap: 4,
        },
        text2: {
            fontSize: 20,
            fontFamily: "Fredoka-SemiBold"
        },
        text3: {
            fontSize: 18,
            fontFamily: "Fredoka-Regular",
        },
        view5_1: {
            backgroundColor: "#F5AC62",
            borderRadius: 10,
            borderBottomRightRadius: 0,
            marginHorizontal: 20,
            marginVertical: 5,
            padding: 10,
            justifyContent: "center",
            alignSelf: "flex-end",
            rowGap: 5,
            width: "auto",

        },
        view5_2: {
            backgroundColor: "#F5DDC4",
            borderRadius: 10,
            borderBottomLeftRadius: 0,
            marginHorizontal: 20,
            marginVertical: 5,
            padding: 10,
            justifyContent: "center",
            alignSelf: "flex-start",
            rowGap: 5,
            width: "auto",

        },
        view6: {
            flexDirection: "row",
            columnGap: 10,
        },
        text4: {
            fontSize: 12,
            fontFamily: "Fredoka-Regular",
            color: "gray"

        },
        view7: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            columnGap: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: "#dddddd",
        },
        input1: {
            height: 40,
            borderRadius: 20,
            borderStyle: "solid",
            borderColor: "#ddddd",
            borderWidth: 1,
            fontFamily: "Fredoka-Regular",
            fontSize: 16,
            flex: 1,
            paddingStart: 15,
            paddingEnd: 15,
            paddingHorizontal: 10
        },
        pressable1: {
            backgroundColor: "#f57c00",
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 8
            // justifyContent: "center",
            // alignItems: "center"
        },
        center_view: {
            flex: 1,
            marginVertical: 20
        },
        sendBtnText: {
            textAlign: "center",
            color: "white",
            fontFamily: "Fredoka-Regular",
        }
    }
)