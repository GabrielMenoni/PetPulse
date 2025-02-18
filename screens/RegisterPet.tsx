import React, { useRef, useState, useEffect } from 'react';
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
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {

    async function getData() {
      const savedPetData = await AsyncStorage.getItem('petEdit');
      if(savedPetData){
        const PetData: PetProps = JSON.parse(savedPetData);
        setEditMode(true);
        setName(PetData.name);
        setBreed(PetData.breed);
        setPetType(PetData.type);
        setBirthYear(PetData.birthday.split('/')[0]);
        setBirthMonth(PetData.birthday.split('/')[1]);
        setSize(PetData.size);
        setPhoto(PetData.image);

        await AsyncStorage.removeItem('petEdit');
      }
    }

    getData();
  }, []);

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
  const years = Array.from({ length: 26 }, (_, i) => (2025 - i).toString());
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
    const fields = [
      { value: petType, message: 'Por favor, selecione o tipo de pet' },
      { value: name, message: 'Por favor, preencha o campo Nome' },
      { value: breed, message: 'Por favor, preencha o campo Raça' },
      { value: birthYear, message: 'Por favor, selecione o ano de nascimento' },
      { value: birthMonth, message: 'Por favor, selecione o mês de nascimento' },
      { value: size, message: 'Por favor, selecione o porte' },
      { value: photo, message: 'Por favor, adicione uma foto' },
    ];

    const invalidField = fields.find(field => !field.value);

    if (invalidField) {
      Alert.alert('Erro', invalidField.message);
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

        <Text style={[globalStyles.text, styles.title, {marginBottom: 15}]}>{editMode ? 'Edite seu pet!' : 'Vamos cadastrar seu pet!'}</Text>

        {/* Tipo de Pet (Cachorro ou Gato) */}
        <Text style={[globalStyles.text, styles.text, {marginBottom: 15}]}>
          <Text style={{ color: 'red' }}>*</Text> Selecione o tipo de pet</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[styles.radioButton, petType === 'Cachorro' && styles.selectedRadio]}
              onPress={() => handleSelectPetType('Cachorro')}
            >
              <View style={[styles.radioCircle, petType === 'Cachorro' && styles.selectedCircle]}>
                {petType === 'Cachorro' && <View style={styles.selectedInnerCircle} />}
              </View>
              <Text style={[styles.radioButtonText, petType === 'Cachorro' && styles.radioButtonTextSelected]}>Cachorro</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.radioButton, petType === 'Gato' && styles.selectedRadio]}
              onPress={() => handleSelectPetType('Gato')}
            >
              <View style={[styles.radioCircle, petType === 'Gato' && styles.selectedCircle]}>
                {petType === 'Gato' && <View style={styles.selectedInnerCircle} />}
              </View>
              <Text style={[styles.radioButtonText, petType === 'Gato' && styles.radioButtonTextSelected]}>Gato</Text>
            </TouchableOpacity>
          </View>

          <Text style={[globalStyles.text, styles.text, {marginTop: 10}]}>Conte-nos sobre seu pet:</Text>

          {/* Nome Input */}
          <TouchableOpacity style={styles.input} onPress={() => handleFocus(nameInputRef)}>
            <Text style={[globalStyles.text, styles.inputPlaceholder]}>
              <Text style={{ color: 'red' }}>*</Text> Nome</Text>
            <TextInput
              ref={nameInputRef} // Atribuindo a referência para o Nome
              style={[globalStyles.text, styles.inputText]}
              onChange={(e) => setName(e.nativeEvent.text)}
              placeholder="Ex: Rex"
              placeholderTextColor={'#939393'}
              value={name}
            />
          </TouchableOpacity>

          {/* Raça Input */}
          <TouchableOpacity style={[styles.input]} onPress={() => handleFocus(breedInputRef)}>
            <Text style={[globalStyles.text, styles.inputPlaceholder]}>
            <Text style={{ color: 'red' }}>*</Text> Raça</Text>
            <TextInput
              ref={breedInputRef} // Atribuindo a referência para a Raça
              style={[globalStyles.text, styles.inputText]}
              onChange={(e) => setBreed(e.nativeEvent.text)}
              placeholder="Ex: Labrador"
              placeholderTextColor={'#939393'}
              value={breed}
            />
          </TouchableOpacity>

          {/* Ano de Nascimento Input */}
          <TouchableOpacity style={styles.input} onPress={() => setYearModalVisible(true)}>
            <Text style={[globalStyles.text, styles.inputPlaceholder]}>
            <Text style={{ color: 'red' }}>*</Text> Ano de Nascimento</Text>
            <Text style={[globalStyles.text, styles.inputText]}>{birthYear || 'Selecione o Ano'}</Text>
          </TouchableOpacity>

          {/* Mês de Nascimento Input */}
          <TouchableOpacity style={styles.input} onPress={() => setMonthModalVisible(true)}>
            <Text style={[globalStyles.text, styles.inputPlaceholder]}>
            <Text style={{ color: 'red' }}>*</Text> Mês de Nascimento</Text>
            <Text style={[globalStyles.text, styles.inputText]}>{birthMonth || 'Selecione o Mês'}</Text>
          </TouchableOpacity>

          {/* Porte Input */}
          <TouchableOpacity style={styles.input} onPress={() => setSizeModalVisible(true)}>
            <Text style={[globalStyles.text, styles.inputPlaceholder]}>
            <Text style={{ color: 'red' }}>*</Text> Porte</Text>
            <Text style={[globalStyles.text, styles.inputText]}>{size || 'Selecione o Porte'}</Text>
          </TouchableOpacity>

          {/* Foto Input */}
          <TouchableOpacity style={[styles.photoInput, { backgroundColor: photo ? 'transparent' : colors.white }]} onPress={handlePickImage}>
            {photo && (
              <Image source={{ uri: photo }} style={[styles.inputImage, { backgroundColor: 'transparent' }]} />
            )}
            <Text style={[globalStyles.text, {textAlign: 'center', marginBottom: 5}]}>{photo ? '' : (<><Text style={{ color: 'red' }}>* </Text> Adicionar Foto</>)}</Text>
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.white,
    paddingBottom: 10,
    paddingTop: 10,
  },
  text: {
    color: colors['light-blue'],
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
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 50,  // Fazendo o círculo
    borderWidth: 2,
    borderColor: colors.blue,  // Cor do círculo padrão
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    backgroundColor: colors.blue, // Cor de fundo quando selecionado
  },
  selectedInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 50,
    backgroundColor: colors.blue,  // Círculo interno branco quando selecionado
  },
  radioButtonText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
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
