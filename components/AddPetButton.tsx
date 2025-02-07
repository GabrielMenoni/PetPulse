import React from "react";
import { View, TextInput, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { colors } from '../styles/colors';
import { Image } from 'react-native';
import PenIcon from '../assets/Images/PenIcon.svg';

const AddPetButton: React.FC = () => {

    const handleAddPet = () => {
        console.log('Adicionar pet');
    }

    return (
        <TouchableOpacity onPress={handleAddPet} style={styles.container}>
            <PenIcon width={24} height={24} />
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
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