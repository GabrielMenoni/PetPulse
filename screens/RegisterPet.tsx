import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Image, ScrollView, Alert } from 'react-native';
import { globalStyles } from '../styles/global';
import { colors } from '../styles/colors';
import VoltarSVG from '../assets/images/VoltarBTN.svg';
import LogoSVG from '../assets/images/Logo.svg';
import CameraSVG from '../assets/images/Camera.svg';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PetProps } from '../utils/interfaces';

const RegisterPet: React.FC = () => {
  const nameInputRef = useRef(null); // Referência para o campo Nome
  const breedInputRef = useRef(null); // Referência para o campo Raça
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [petType, setPetType] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [size, setSize] = useState('');
  const [photo, setPhoto] = useState<any>(null); // Armazenar a imagem
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [sizeModalVisible, setSizeModalVisible] = useState(false);

  const navigation = useNavigation();

  const handleFocus = (inputRef: any) => {
    // Ativa o foco no TextInput específico
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSelectPetType = (type: string) => {
    setPetType(type);
  };

  const handleSelectYear = (year: string) => {
    setBirthYear(year);
    setYearModalVisible(false); // Fecha o modal após selecionar
  };

  const handleSelectMonth = (month: string) => {
    setBirthMonth(month);
    setMonthModalVisible(false); // Fecha o modal após selecionar
  };

  const handleSelectSize = (size: string) => {
    setSize(size);
    setSizeModalVisible(false); // Fecha o modal após selecionar
  };

  // Options for Year, Month, and Size
  const years = Array.from({ length: 26 }, (_, i) => (2000 + i).toString());
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  const sizes = ['Pequeno', 'Médio', 'Grande'];

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setPhoto(response.assets[0].uri); // Definir a URI da foto selecionada
      }
    });
  };

  const handleCaptureImage = () => {
    launchCamera({ mediaType: 'photo', quality: 0.5 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorMessage) {
        console.log('Camera Error: ', response.errorMessage);
      } else {
        setPhoto(response.assets[0].uri); // Definir a URI da foto capturada
      }
    });
  };

  const savePetData = async () => {
    if (!name || !petType || !breed || !birthYear || !birthMonth || !size || !photo) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
        return;
    }

    const petData: PetProps = {
      name: name,
      type: petType,
      breed: breed,
      birthday: `${birthYear}/${months.indexOf(birthMonth) + 1}/${birthYear}`, // Formatar a data
      size: size,
      image: photo || '',
    };

    try {
      await AsyncStorage.setItem('petData', JSON.stringify(petData)); // Salvar os dados
      console.log('Pet data saved');
      navigation.navigate('Home'); // Voltar para a tela Home
    } catch (e) {
      console.error('Error saving pet data: ', e);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={[globalStyles.container, styles.wrap]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {navigation.goBack();}}>
            <VoltarSVG />
          </TouchableOpacity>
          <LogoSVG height={50} width={50} />
          <View style={{ width: 45 }} />
        </View>
        <View>
          <Text style={[globalStyles.text, styles.text]}>Conte-nos sobre seu pet:</Text>

          {/* Nome Input */}
          <TouchableOpacity style={styles.input} onPress={() => handleFocus(nameInputRef)}>
            <Text style={[globalStyles.text, styles.inputPlaceholder]}>Nome</Text>
            <TextInput
              ref={nameInputRef} // Atribuindo a referência para o Nome
              style={[globalStyles.text, styles.inputText]}
              onChange={(e) => setName(e.nativeEvent.text)}
            />
          </TouchableOpacity>

          {/* Tipo de Pet (Cachorro ou Gato) */}
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[styles.radioButton, petType === 'Cachorro' && styles.selectedRadio]}
              onPress={() => handleSelectPetType('Cachorro')}
            >
              <Text style={[styles.radioButtonText, petType === 'Cachorro' && styles.radioButtonTextSelected]}>Cachorro</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.radioButton, petType === 'Gato' && styles.selectedRadio]}
              onPress={() => handleSelectPetType('Gato')}
            >
              <Text style={[styles.radioButtonText, petType === 'Gato' && styles.radioButtonTextSelected]}>Gato</Text>
            </TouchableOpacity>
          </View>

          {/* Raça Input */}
          <TouchableOpacity style={[styles.input]} onPress={() => handleFocus(breedInputRef)}>
            <Text style={[globalStyles.text, styles.inputPlaceholder]}>Raça</Text>
            <TextInput
              ref={breedInputRef} // Atribuindo a referência para a Raça
              style={[globalStyles.text, styles.inputText]}
              onChange={(e) => setBreed(e.nativeEvent.text)}
            />
          </TouchableOpacity>

          {/* Ano de Nascimento Input */}
          <TouchableOpacity style={styles.input} onPress={() => setYearModalVisible(true)}>
            <Text style={[globalStyles.text, styles.inputPlaceholder]}>Ano de Nascimento</Text>
            <Text style={[globalStyles.text, styles.inputText]}>{birthYear || 'Selecione o Ano'}</Text>
          </TouchableOpacity>

          {/* Mês de Nascimento Input */}
          <TouchableOpacity style={styles.input} onPress={() => setMonthModalVisible(true)}>
            <Text style={[globalStyles.text, styles.inputPlaceholder]}>Mês de Nascimento</Text>
            <Text style={[globalStyles.text, styles.inputText]}>{birthMonth || 'Selecione o Mês'}</Text>
          </TouchableOpacity>

          {/* Porte Input */}
          <TouchableOpacity style={styles.input} onPress={() => setSizeModalVisible(true)}>
            <Text style={[globalStyles.text, styles.inputPlaceholder]}>Porte</Text>
            <Text style={[globalStyles.text, styles.inputText]}>{size || 'Selecione o Porte'}</Text>
          </TouchableOpacity>

          {/* Foto Input */}
          <TouchableOpacity style={[styles.photoInput, { backgroundColor: photo ? 'transparent' : colors.white }]} onPress={handlePickImage}>
            {photo && (
              <Image source={{ uri: photo }} style={[styles.inputImage, { backgroundColor: 'transparent' }]} />
            )}
            <Text style={[globalStyles.text, {textAlign: 'center', marginBottom: 5}]}>{photo ? '' : 'Adicionar Foto'}</Text>
            {photo ? null : <CameraSVG width={80} height={80} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={savePetData}>
            <Text style={[globalStyles.text, styles.radioButtonTextSelected, {fontSize: 18}]}>Adicionar Pet</Text>
        </TouchableOpacity>



        {/* Modal for Year Selection */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={yearModalVisible}
        onRequestClose={() => setYearModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <FlatList
            data={years}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectYear(item)} style={styles.modalItem}>
                <Text style={styles.modalText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Modal for Month Selection */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={monthModalVisible}
        onRequestClose={() => setMonthModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <FlatList
            data={months}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectMonth(item)} style={styles.modalItem}>
                <Text style={styles.modalText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Modal for Size Selection */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={sizeModalVisible}
        onRequestClose={() => setSizeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <FlatList
            data={sizes}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectSize(item)} style={styles.modalItem}>
                <Text style={styles.modalText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,  // Ensures the scrollable content takes up the whole screen
  },
  wrap: {
    display: 'flex',
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 55,
    paddingBottom: 55,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginTop: 15,
    marginBottom: 15,
    position: 'relative',
  },
  inputPlaceholder: {
    color: '#605e5e',
    fontSize: 18,
    marginLeft: 8,
  },
  inputText: {
    color: '#000',
    fontSize: 20,
    marginLeft: 10,
  },
  inputImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    opacity: 1,
  },
  radioContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radioButton: {
    backgroundColor: colors.white,
    width: '40%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  selectedRadio: {
    backgroundColor: colors.blue,
  },
  radioButtonText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
  radioButtonTextSelected: {
    color: colors.white,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 40,
  },
  modalItem: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 24,
    color: '#000',
    textAlign: 'center',
  },
  photoInput: {
    backgroundColor: colors.white,
    width: '50%',
    height: 150,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    padding: 6,
    elevation: 5,
    marginTop: 15,
    marginBottom: 15,
  },
    button: {
        backgroundColor: colors.blue,
        width: '50%',
        height: 70,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        alignSelf: 'center',
    },
});

export default RegisterPet;
