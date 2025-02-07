import { colors } from './colors';
import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.green, // Usando cor global
        flex: 1,
    },
    text: {
      fontSize: 16,
      fontFamily: 'Roboto',
    },
  });