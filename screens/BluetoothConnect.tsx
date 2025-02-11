import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { globalStyles } from '../styles/global';
import { colors } from '../styles/colors';
import BluetoothSVG from '../assets/images/bluetooth-svgrepo-com.svg';
import { BleManager } from 'react-native-ble-plx';

const BluetoothConnect = ({ navigation }: any) => {
  const [isConnected, setIsConnected] = useState(false);
  const manager = new BleManager();

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      if (
        granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Bluetooth permissions granted');
        openBluetoothSettings();
        scanForDevices();
      } else {
        console.log('Bluetooth permissions denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const openBluetoothSettings = async () => {
    try {
      setTimeout(() => {
        Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS');
      }, 1000);
    } catch (error) {
      console.error('Error opening Bluetooth settings:', error);
    }
  };

  const scanForDevices = () => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Bluetooth scan error', error);
        return;
      }

      // Substitua com o ID ou nome do seu dispositivo Bluetooth
      if (device!.name === 'PetPulse') {
        manager.stopDeviceScan();
        connectToDevice(device);
      }
    });
  };

  const connectToDevice = async (device: any) => {
    try {
      await device.connect();
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting to device', error);
    }
  };

  useEffect(() => {
    if (isConnected) {
      navigation.navigate('RegisterPet');
    }
  }, [isConnected]);

  return (
    <View style={[globalStyles.container, styles.wrap]}>
      <View style={styles.container}>
        <BluetoothSVG width={200} height={200} color={'#fff'} />
        <Text style={[globalStyles.text, styles.title]}>
          Aguardando a conexão bluetooth com a coleira PetPulse
        </Text>
      </View>

      <TouchableOpacity onPress={() => { navigation.navigate('Home'); }} style={styles.button}>
        <Text style={styles.text}>Voltar a home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
  },

  container: {
    display: 'flex',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: 'medium',
    color: colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  button: {
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue,
    borderRadius: 8,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },

  text: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 54,
  },
});

export default BluetoothConnect;
