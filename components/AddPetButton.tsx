import React from "react";
import { View, TextInput, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { colors } from '../styles/colors';
import { Image } from 'react-native';

const AddPetButton: React.FC = () => {

    const handleAddPet = () => {
        console.log('Adicionar pet');
    }

    return (
        <TouchableOpacity onPress={handleAddPet} style={styles.container}>
            <Image source={require('../assets/Images/PenIcon.png')}/>
            <Text style={styles.text}>Adicionar pet</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        backgroundColor: colors['blue'],
        borderRadius: 16,
        padding: 5,
    },

    text: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
        height: 54,
    }
});

export default AddPetButton;