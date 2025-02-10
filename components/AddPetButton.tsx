import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/colors';
import PenIcon from '../assets/images/PenIcon.svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

const AddPetButton: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const handleAddPet = () => {
        navigation.navigate('BluetoothConnect');
    };

    return (
        <TouchableOpacity onPress={handleAddPet} style={styles.container}>
            <PenIcon width={24} height={24} />
            <Text style={styles.text}>Adicionar pet</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        backgroundColor: colors.blue,
        borderRadius: 8,
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
    },
});

export default AddPetButton;
