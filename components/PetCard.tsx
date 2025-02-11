import React from 'react';
import { PetProps } from '../utils/interfaces';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';
import HeartSVG from '../assets/images/BsHeartPulse.svg';
import { colors } from '../styles/colors';

interface PetCardProps {
  pet: PetProps;  // Defina o tipo para a propriedade 'pet' como PetProps
}

function PetCard({ pet }: PetCardProps) {  // Agora 'pet' é passado como uma propriedade
  return (
    <TouchableOpacity style={styles.wrap}>
      <View style={styles.cardContent}>
        <Image source={{ uri: pet.image }} style={styles.image} />
        <View style={styles.textContent}>
          <Text style={styles.petName}>{pet.name}, {pet.breed}</Text>
          <View style={styles.infos}>
            <HeartSVG />
            <Text style={styles.bpm}>112 bpm</Text>
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
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default PetCard;
