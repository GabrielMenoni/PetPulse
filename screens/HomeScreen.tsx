import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/global'; // Importando os estilos globais
import SearchBar from '../components/SearchBar';
import AddPetButton from '../components/AddPetButton';
import { colors } from '../styles/colors';
import LogoSVG from '../assets/images/Logo.svg';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage
import { PetProps } from '../types'; // Importando o tipo PetProps
import PetCard  from '../components/PetCard';

export default function HomeScreen() {
  const [pets, setPets] = useState<PetProps[]>([]); // Estado para armazenar os pets

  useEffect(() => {
    // Função para carregar os pets salvos
    const loadPets = async () => {
      try {
        const savedPets = await AsyncStorage.getItem('petData'); // Buscar os dados salvos
        if (savedPets) {
          const pets = JSON.parse(savedPets); // Converter para objeto
          // Garantir que pets seja um array, caso seja um único objeto, transformá-lo em um array
          const petsArray = Array.isArray(pets) ? pets : [pets];
          console.log(petsArray); // Exibir no console
          setPets(petsArray); // Atualizar o estado com os pets
        } else {
          console.log('Nenhum pet encontrado'); // Exibir no console
          setPets([]); // Garantir que o estado seja um array vazio se não houver pets
        }
      } catch (error) {
        console.error('Erro ao carregar os pets: ', error);
      }
    };

    const removeAllPets = async () => {
      try {
        await AsyncStorage.removeItem('petData'); // Remove a chave 'petData' do AsyncStorage
        console.log('Todos os pets foram removidos.');
      } catch (error) {
        console.error('Erro ao remover os pets: ', error);
      }
    };

    loadPets(); // Chamar a função para carregar os pets ao carregar a tela
    //removeAllPets(); // Remover todos os pets ao carregar a tela

  }, []);

  const getContent = () => {
    if (pets.length === 0) {
      return (
        <View style={styles.NoAnimals}>
          <LogoSVG />
          <Text style={[globalStyles.text, styles.BigText]}>Nenhum animal adicionado até o momento</Text>
        </View>
      );
    } else {
      return (
        <View style={{ width: '90%' }}>
          {pets.map((pet, index) => (
            <PetCard key={index} pet={pet} />
          ))}
        </View>
      );
    }
  };

  return (
    <View style={[globalStyles.container, styles.wrap]}>
      <SearchBar onSearch={(query) => console.log(query)} />
      {getContent()}
      <AddPetButton />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 55,
    paddingBottom: 55,
  },

  NoAnimals: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 60,
    width: '65%',
  },

  BigText: {
    fontSize: 30,
    fontWeight: 'medium',
    color: colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 1, height: 1 }, // Deslocamento da sombra (horizontal, vertical)
    textShadowRadius: 2, // Raio de difusão da sombra
  },
});
