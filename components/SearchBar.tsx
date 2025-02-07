import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "PetPulse", onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleChange = (text: string) => {
    setSearchQuery(text);
    onSearch(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={searchQuery}
        onChangeText={handleChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '85%',
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderColor: colors['light-blue'],
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 45,
    borderColor: '#ccc',
    borderRadius: 20,
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export default SearchBar;
