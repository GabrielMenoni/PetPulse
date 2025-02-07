import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/global'; // Importando os estilos globais

export default function DetailsScreen({ route, navigation }: { route: any, navigation: any }) {
  const { id } = route.params;

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.text}>Detalhes da tela - ID: {id}</Text>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}
