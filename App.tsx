import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import BluetoothConnect from './screens/BluetoothConnect';
import RegisterPet from './screens/RegisterPet';
import useBLE from './useBLE';
import { Device } from 'react-native-ble-plx';
import PetInfos from './screens/PetInfos';
import { PetProps } from './utils/interfaces';

export type RootStackParamList = {
  Home: undefined;
  BluetoothConnect: {
    devices: Device[];
    connectToPeripheral: (device: Device) => void;
    closeModal: () => void;
  };
  RegisterPet: undefined;
  PetInfos: {
    pet: PetProps;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    heartRate,
    disconnectFromDevice,
  } = useBLE();

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  console.log('allDevices', allDevices);
  console.log('connectedDevice', connectedDevice);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="BluetoothConnect"
          component={BluetoothConnect}
          options={{ headerShown: false }}
          initialParams={{
            devices: allDevices,
            connectToPeripheral: connectToDevice,
            closeModal: disconnectFromDevice,
          }}  // Passando os parâmetros necessários
        />

        <Stack.Screen
          name="RegisterPet"
          component={RegisterPet}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PetInfos"
          component={PetInfos}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
