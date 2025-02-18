import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { globalStyles } from '../styles/global';
import { colors } from '../styles/colors';
import VoltarSVG from '../assets/images/VoltarBTN.svg';
import LogoSVG from '../assets/images/Logo.svg';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PetProps } from '../utils/interfaces';
import HeartSVG from '../assets/images/BsHeartPulse.svg';
import PiDog from '../assets/images/PiDog.svg';
import PiCat from '../assets/images/PiCat.svg';
import Pencil from '../assets/images/BiPencil.svg';
import Trash from '../assets/images/BiTrash.svg';
import LogOut from '../assets/images/BiLogOut.svg';
import BPMGraph from '../components/BPMGraph';

function PetInfos() {
  const navigation = useNavigation();
  const [pet, setPet] = useState<PetProps | undefined>();
  const [BPM, setBPM] = useState<number[]>([]);

  useEffect(() => {
    // Inicializar o BPM com 30 valores aleatórios entre 60 e 140
    const initialBPM = Array.from({ length: 30 }, () => Math.floor(Math.random() * (140 - 60 + 1)) + 60);
    setBPM(initialBPM);

    // Função para atualizar o BPM a cada segundo
    const interval = setInterval(() => {
      setBPM(prevBPM => {
        const newBPM = Math.floor(Math.random() * (140 - 60 + 1)) + 60; // Novo valor aleatório
        return [...prevBPM.slice(1), newBPM]; // Remove o primeiro e adiciona um novo valor
      });
    }, 1000);

    return () => clearInterval(interval); // Limpar o intervalo ao desmontar o componente
  }, []);

  useEffect(() => {
    // Função para carregar os pets salvos
    const loadPet = async () => {
      try {
        const savedPet = await AsyncStorage.getItem('petInfo');
        if (savedPet) {
          const pet = JSON.parse(savedPet);
          setPet(pet);
        } else {
          setPet(undefined);
        }
      } catch (error) {
        console.error('Erro ao carregar os pets: ', error);
      }
    };

    loadPet();
  }, []);

  async function handleEdit() {
    await AsyncStorage.setItem('petEdit', JSON.stringify(pet));
    navigation.navigate('RegisterPet');
  }

  async function handleDelete() {
    await AsyncStorage.removeItem('petData');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  }

  return (
    <ScrollView style={[styles.scrollContainer, globalStyles.container]}>
      <View style={[globalStyles.container, styles.wrap]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <VoltarSVG />
          </TouchableOpacity>
          <LogoSVG height={50} width={50} style={{marginLeft: 35}} />
          <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
            <Pencil width={30} height={30}  onTouchStart={handleEdit}/>
            <Trash width={30} height={30} onTouchStart={handleDelete} />
          </View>
        </View>

        {/* Main Info */}
        <View style={styles.mainInfo}>
          <Image source={{ uri: pet?.image }} style={styles.image} />
          <View>
            <View style={styles.textContent}>
              {pet?.type === 'Cachorro' ? <PiDog width={50} height={50} /> : <PiCat width={50} height={50} />}
              <View>
                <Text style={[globalStyles.text, { fontSize: 24, fontWeight: 'bold', textAlign: 'center' }]}>{pet?.name}</Text>
                <Text style={[globalStyles.text, { fontSize: 20, textAlign: 'center' }]}>{pet?.breed}</Text>
              </View>
            </View>
            <View style={styles.bpm}>
              <HeartSVG width={30} height={30} />
              <Text style={[globalStyles.text, { fontSize: 20, fontWeight: 'bold' }]}> {BPM[BPM.length - 1]} bpm </Text>
            </View>
          </View>
        </View>

        {/* Graph */}
        <View style={styles.GraphContainer}>
          <BPMGraph data={BPM} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  wrap: {
    display: 'flex',
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 50,
    paddingBottom: 55,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.white,
  },
  mainInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
  },
  textContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: 10,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 20,
  },
  bpm: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#000',
    marginTop: 10,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    gap: 30,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 12,
    width: '60%',
    borderRadius: 6,
    gap: 15,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  GraphContainer: {
    marginTop: 30,
  },
});

export default PetInfos;
