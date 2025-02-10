import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/global'; // Importando os estilos globais
import SearchBar from '../components/SearchBar';
import AddPetButton from '../components/AddPetButton';
import { colors } from '../styles/colors';
import LogoSVG from '../assets/images/Logo.svg';

export default function HomeScreen() {
  return (
    <View style={[globalStyles.container, styles.wrap]}>
      <SearchBar onSearch={(query) => console.log(query)} />
        <View style={styles.NoAnimals}>
        <LogoSVG />
        <Text style={[globalStyles.text, styles.BigText]}>Nenhum animal adicionado até o momento</Text>
        </View>
      <AddPetButton />
    </View>
  );
}

/*
<Text style={globalStyles.text}>Home Screen</Text>
      <Button
        title="Ir para Detalhes"
        onPress={() => navigation.navigate('Details', { id: 42 })}
      />
*/

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
