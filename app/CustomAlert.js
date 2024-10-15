import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import FadeWrapper from './FadeWrapper';

const CustomAlert = ({ visible, title, message, onConfirm, onCancel, confirmText, cancelText }) => {
    return (
        <Modal transparent={true} visible={visible} animationType="fade">
            <View style={customStyles.modalBackground}>
                    <View style={customStyles.modalContainer}>
                        <Text style={customStyles.modalTitle}>{title}</Text>
                        <Text style={customStyles.modalMessage}>{message}</Text>
                        <View style={customStyles.buttonContainer}>
                            <Pressable style={customStyles.button} onPress={onConfirm}>
                                <Text style={customStyles.buttonText}>{confirmText}</Text>
                            </Pressable>
                            <Pressable style={customStyles.button} onPress={onCancel}>
                                <Text style={customStyles.buttonText}>{cancelText}</Text>
                            </Pressable>
                        </View>
                    </View>
            </View>
        </Modal>
    );
};

const customStyles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        // fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: "Fredoka-SemiBold",
    },
    modalMessage: {
        marginVertical: 10,
        textAlign: 'center',
        fontFamily: "Fredoka-Regular",
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: '#f57c00',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontFamily: "Fredoka-SemiBold",
    },
});

export default CustomAlert;
