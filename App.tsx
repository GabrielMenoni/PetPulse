import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import BluetoothConnect from './screens/BluetoothConnect';
import RegisterPet from './screens/RegisterPet';

export type RootStackParamList = {
  Home: undefined;
  BluetoothConnect: undefined;
  RegisterPet: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {

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
        />

        <Stack.Screen
          name="RegisterPet"
          component={RegisterPet}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
