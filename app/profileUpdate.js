import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import { router, SplashScreen } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

import CustomAlert from "./CustomAlert";
import SuccessModal from "./SuccessModal";
import RemoveImgSuccessModal from "./RemoveImgSuccessModal";

import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Modal } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";

import FadeWrapper from "./FadeWrapper";

export default function profileUpdate() {

    const avatarImage = require("../assets/images/user.png")

    const [getUserId, setUserId] = useState();
    const [getFirstName, setFirstName] = useState();
    const [getLastName, setLastName] = useState();
    const [getMobile, setMobile] = useState();
    const [getPassword, setPassword] = useState();

    const [passwordVisible, setPasswordVisible] = useState(false);

    const [getResponse, setResponse] = useState("");

    const [getImage, setImage] = useState(null);
    const [imageExists, setImageExists] = useState(false);

    const [imageOptionsModalVisible, setImageOptionsModalVisible] = useState(false);

    const defaultImageUrl = `${process.env.EXPO_PUBLIC_URL}/ChatterWave/AvatarImages/${getMobile}.png?timestamp=${new Date().getTime()}`;
    // const defaultImageUrl = process.env.EXPO_PUBLIC_URL + "/ChatterWave/AvatarImages/" + getMobile + ".png";


    const [modalVisible, setModalVisible] = useState(false);

    const [successModalVisible, setSuccessModalVisible] = useState(false);

    const [removeImgSuccessModalVisible, setRemoveImgSuccessModalVisible] = useState(false);

    const handleLogout = async () => {
        setModalVisible(false);
        try {

            console.log("User id: " + getUserId);
            const response = await fetch(process.env.EXPO_PUBLIC_URL + "/ChatterWave/UpdateUserStatusOffline?id=" + getUserId);

            if (response.ok) {
                // const responseText = await response.text();
                console.log("Success");
                await AsyncStorage.removeItem("user");
                router.replace("/");
            } else {
                console.error("Failed to set user Offline");
            }


        } catch (e) {
            console.log(e);
            Alert.alert("Error", "Failed to sign out.");
        }
    };


    const [loaded, error] = useFonts(
        {
            "Fredoka-Bold": require('../assets/fonts/Fredoka-Bold.ttf'),
            "Fredoka-Light": require('../assets/fonts/Fredoka-Light.ttf'),
            "Fredoka-Medium": require('../assets/fonts/Fredoka-Medium.ttf'),
            "Fredoka-Regular": require('../assets/fonts/Fredoka-Regular.ttf'),
            "Fredoka-SemiBold": require('../assets/fonts/Fredoka-SemiBold.ttf'),
        }
    );

    useEffect(() => {
        const checkImageExists = async () => {
            try {
                const response = await fetch(defaultImageUrl);
                setImageExists(response.ok);
            } catch (error) {
                setImageExists(false);
            }
        };

        checkImageExists();
    }, [getMobile]);

    useEffect(
        () => {
            async function fetchData() {
                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);
                console.log(user.id);

                setUserId(user.id);
                setFirstName(user.first_name);
                setLastName(user.last_name);
                setMobile(user.mobile);
                setPassword(user.password);

            }
            fetchData();
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

    const handleImagePick = async () => {
        setImageOptionsModalVisible(true);
    };

    const openCamera = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
        setImageOptionsModalVisible(false);
    };

    const openGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
        setImageOptionsModalVisible(false);
    };

    const removeImage = async () => {

        try {

            const response = await fetch(process.env.EXPO_PUBLIC_URL + "/ChatterWave/DeleteProfileImage?mobile=" + getMobile);

            if (response.ok) {

                console.log("Delete Img Successfully");
                setRemoveImgSuccessModalVisible(true);
                setImage(null);
                console.log("User id: " + getMobile);
            } else {
                console.error("Failed to Delete Img");
            }
        } catch (error) {
            console.log(error);
        }

        setImageOptionsModalVisible(false);

    };

    async function updateProfile() {

        // Alert.alert("Update Function");

        try {

            let formData = new FormData();
            formData.append("mobile", getMobile);
            formData.append("firstName", getFirstName);
            formData.append("lastName", getLastName);
            formData.append("password", getPassword);

            if (getImage != null) {
                formData.append("avatarImage",
                    {
                        name: "avatar.png",
                        type: "image/png",
                        uri: getImage
                    }
                );
            }

            console.log(formData)

            let response = await fetch(
                process.env.EXPO_PUBLIC_URL + "/ChatterWave/UpdateUser",

                {
                    method: "POST",
                    body: formData
                }
            );

            if (response.ok) {
                let json = await response.json();

                if (json.success) {

                    // Alert.alert("Success", json.message);

                    let updatedUser = {
                        id: getUserId,
                        first_name: getFirstName,
                        last_name: getLastName,
                        mobile: getMobile,
                        password: getPassword,
                    };
                    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

                    const updatedImageUrl = `${process.env.EXPO_PUBLIC_URL}/ChatterWave/AvatarImages/${getMobile}.png?timestamp=${new Date().getTime()}`;
                    setImage(updatedImageUrl);
                    setResponse("");
                    setSuccessModalVisible(true);

                } else {

                    // Alert.alert("Error", json.message);
                    setResponse(json.message);

                }

            }



        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Failed to Update profile. Please try again later")
        }

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
                    <Text style={stylesheet.headerText}>Profile</Text>
                </View>
            </View>
            <FadeWrapper>

                <ScrollView style={{ padding: 20 }}>
                    <View style={stylesheet.scroll}>
                        <Pressable onPress={handleImagePick} >

                            {
                                getImage ? (
                                    <Image contentFit="cover" style={stylesheet.profileImage} source={{ uri: getImage }} />
                                ) : imageExists ? (
                                    // <Image source={avatarImage} style={stylesheet.profileImage} />
                                    <Image contentFit="cover" style={stylesheet.profileImage} source={{ uri: `${defaultImageUrl}?timestamp=${new Date().getTime()}` }} />

                                ) : (
                                    // <Image contentFit="cover" style={stylesheet.profileImage} source={{ uri: `${defaultImageUrl}?timestamp=${new Date().getTime()}` }} />
                                    <Image source={avatarImage} style={stylesheet.profileImage} />

                                )
                            }

                            <View style={stylesheet.imgIcon}>
                                <FontAwesome6 name={"camera"} color={"white"} size={20} />
                            </View>
                        </Pressable>
                    </View>

                    <Text style={{ color: 'red', fontSize: 14, fontFamily: "Fredoka-Regular", alignSelf: 'center', marginBottom: 5 }}>{getResponse}</Text>

                    <View>
                        <Text style={stylesheet.textTitle}>Mobile</Text>
                        <View style={stylesheet.textView}>
                            <TextInput value={getMobile} style={{ flex: 1, fontFamily: "Fredoka-Regular" }} editable={false} placeholder='Enter Mobile Number' keyboardType='phone-pad' maxLength={10} onChangeText={
                                (text) => {
                                    setMobile(text);
                                }
                            } />

                        </View>

                        <Text style={stylesheet.textTitle}>First Name</Text>
                        <View style={stylesheet.textView}>
                            <TextInput selectionColor="#f57c00" style={{ flex: 1, fontFamily: "Fredoka-Regular" }} value={getFirstName} placeholder='Enter First Name' keyboardType='default' onChangeText={
                                (text) => {
                                    setFirstName(text);
                                }
                            } />
                            <Pressable>
                                <FontAwesome6
                                    name={"user-pen"}
                                    size={20}
                                    color="gray"
                                />
                            </Pressable>
                        </View>

                        <Text style={stylesheet.textTitle}>Last Name</Text>
                        <View style={stylesheet.textView}>
                            <TextInput selectionColor="#f57c00" style={{ flex: 1, fontFamily: "Fredoka-Regular" }} value={getLastName} placeholder='Enter Last Name' keyboardType='default' onChangeText={
                                (text) => {
                                    setLastName(text);
                                }
                            } />
                            <Pressable>
                                <FontAwesome6
                                    name={"user-pen"}
                                    size={20}
                                    color="gray"
                                />
                            </Pressable>
                        </View>

                        <Text style={stylesheet.textTitle}>Passowrd</Text>
                        <View style={stylesheet.textView}>
                            <TextInput selectionColor="#f57c00" style={{ flex: 1, fontFamily: "Fredoka-Regular" }} placeholder='Enter Password' keyboardType='default' secureTextEntry={!passwordVisible} value={getPassword} onChangeText={
                                (text) => {
                                    setPassword(text);
                                }
                            } />
                            <Pressable onPress={() => setPasswordVisible(!passwordVisible)} >
                                <FontAwesome6
                                    name={passwordVisible ? "eye" : "eye-slash"}
                                    size={20}
                                    color="gray"
                                    style={stylesheet.eyeIcon}
                                />
                            </Pressable>
                        </View>

                        <Pressable style={stylesheet.updateBtn} onPress={updateProfile}>
                            <Text style={{ color: 'white', fontSize: 20, fontFamily: "Fredoka-Regular" }}>Save Changes</Text>
                            <FontAwesome6 name={"floppy-disk"} color={"white"} size={18} />

                        </Pressable>

                        <Pressable style={stylesheet.logoutBtn} onPress={() => setModalVisible(true)}>
                            <Text style={{ color: '#f57c00', fontSize: 20, fontFamily: "Fredoka-Regular" }}>Sign Out</Text>
                            <FontAwesome6 name={"power-off"} color={"#f57c00"} size={18} />
                        </Pressable>

                    </View>

                </ScrollView>
            </FadeWrapper>

            <Modal
                visible={imageOptionsModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setImageOptionsModalVisible(false)}
            >
                <View style={stylesheet.modalContainer}>
                    <View style={stylesheet.modalContent}>
                        <Pressable style={stylesheet.modalButton} onPress={openCamera}>
                            <Text style={stylesheet.modalButtonText}>Open Camera</Text>
                        </Pressable>
                        <Pressable style={stylesheet.modalButton} onPress={openGallery}>
                            <Text style={stylesheet.modalButtonText}>Open Gallery</Text>
                        </Pressable>
                        <Pressable style={stylesheet.modalButton} onPress={removeImage}>
                            <Text style={stylesheet.modalButtonText}>Remove Image</Text>
                        </Pressable>
                        <Pressable style={stylesheet.modalButton} onPress={() => setImageOptionsModalVisible(false)}>
                            <Text style={stylesheet.modalButtonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <CustomAlert
                visible={modalVisible}
                title="Sign Out"
                message="Are you sure you want to sign out from your account?"
                confirmText="Yes"
                cancelText="No"
                onConfirm={handleLogout}
                onCancel={() => setModalVisible(false)}
            />
            <SuccessModal visible={successModalVisible} onClose={() => setSuccessModalVisible(false)} />

            <RemoveImgSuccessModal visible={removeImgSuccessModalVisible} onClose={
                () => {
                    setRemoveImgSuccessModalVisible(false);
                    router.replace("/profileUpdate");
                }
            } />
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
            right: 9,
            zIndex: 9999,
            backgroundColor: "#f57c00",
            padding: 10,
            borderRadius: 100,

        },
        textTitle: {
            fontFamily: "Fredoka-SemiBold",
            fontSize: 18,
            marginTop: 10,
        },
        textView: {
            height: 30,
            width: "100%",
            borderColor: "black",
            borderRadius: 10,
            marginVertical: 6,
            // justifyContent: "center",
            paddingStart: 10,
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
            backgroundColor: 'white',
            height: 58,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            flexDirection: "row",
            columnGap: 20,
            borderColor: "#f57c00",
            borderWidth: 1
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 20,
            width: '80%',
        },
        modalButton: {
            padding: 15,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
        },
        modalButtonText: {
            fontSize: 16,
            fontFamily: "Fredoka-Regular",
            color: '#f57c00',
        }
    }
)