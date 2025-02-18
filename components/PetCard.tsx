import React from 'react';
import { PetProps } from '../utils/interfaces';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';
import HeartSVG from '../assets/images/BsHeartPulse.svg';
import { colors } from '../styles/colors';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../App'; // Ajuste o caminho conforme necessário
import AsyncStorage from '@react-native-async-storage/async-storage';

type PetInfosNavigationProp = NavigationProp<RootStackParamList, 'PetInfos'>;

interface PetCardProps {
  pet: PetProps;  // Defina o tipo para a propriedade 'pet' como PetProps
}

function PetCard({ pet }: PetCardProps) {  // Agora 'pet' é passado como uma propriedade
  const navigation = useNavigation<PetInfosNavigationProp>();  // Tipagem correta da navegação

  async function handlePress() {
    try {
      await AsyncStorage.setItem('petInfo', JSON.stringify(pet)); // Salvar os dados
      navigation.navigate('PetInfos'); // Voltar para a tela Home
    } catch (e) {
      console.error('Error saving pet data: ', e);
    }
  }

  return (
    <TouchableOpacity style={styles.wrap} onPress={handlePress}>
      <View style={styles.cardContent}>
        <Image source={{ uri: pet.image }} style={styles.image} />
        <View style={styles.textContent}>
          <Text style={styles.petName}>{pet.name}, {pet.breed}</Text>
          <View style={styles.infos}>
            <Text style={styles.bpm}>Aperte para mais opções</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    justifyContent: 'center',
    backgroundColor: colors.blue,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 30,
    width: '100%',
    height: 150,
    marginBottom: 10, // Adicionado um espaçamento entre os cards
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    gap: 30,
    padding: 20,
  },
  image: {
    width: 100, // Ajuste do tamanho da imagem
    height: 100,
    borderRadius: 30, // Tornar a imagem circular
    borderWidth: 1,
    borderColor: colors.white,
  },
  textContent: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  petName: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infos: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  bpm: {
    color: colors['light-blue'],
    fontSize: 14,
    textAlign: 'center',
  },
});

export default PetCard;
