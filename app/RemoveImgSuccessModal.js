import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Animated, Image } from 'react-native';

export default function RemoveImgSuccessModal({ visible, onClose }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <View style={styles.modalView}>
                <View style={styles.modalContent}>
                    <Animated.View style={{ opacity: fadeAnim }}>
                        <Image 
                            source={require('../assets/gif/success.gif')} 
                            style={styles.gifStyle}
                        />
                    </Animated.View>
                    <Text style={styles.modalText}>Profile image removed successfully!</Text>
                    <Pressable style={[styles.button, styles.buttonClose]} onPress={onClose}>
                        <Text style={styles.textStyle}>OK</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    gifStyle: {
        width: 150, 
        height: 150, 
        marginBottom: 15 
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18,
        fontFamily: "Fredoka-Medium"
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        width: 60
    },
    buttonClose: {
        backgroundColor: "#f57c00"
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});
