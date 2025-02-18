import React, { FC, useCallback } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { Device } from 'react-native-ble-plx';
import BluetoothSVG from '../assets/images/bluetooth-svgrepo-com.svg';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/global';
import { useNavigation } from '@react-navigation/native';

type DeviceModalListItemProps = {
  item: ListRenderItemInfo<Device>;
  connectToPeripheral: (device: Device) => void;
  closeModal: () => void;
};

type DeviceModalProps = {
  devices: Device[];
  connectToPeripheral: (device: Device) => void;
  closeModal: () => void;
};

const DeviceModalListItem: FC<DeviceModalListItemProps> = (props) => {
  const navigation = useNavigation();
  const { item, connectToPeripheral, closeModal } = props;

  const connectAndCloseModal = useCallback(() => {
    connectToPeripheral(item.item);
    closeModal();
  }, [closeModal, connectToPeripheral, item.item]);

  const mockPress = () => {
    if(item.item.name !== 'PetPulse') {
      Alert.alert('O dispositivo selecionado não possui suporte para o PetPulse.');
      return;
    }

    navigation.navigate('RegisterPet');
  };

  return (
    <TouchableOpacity
      onPress={mockPress}
      style={modalStyle.ctaButton}
    >
      <Text style={modalStyle.ctaButtonText}>{item.item.name}</Text>
    </TouchableOpacity>
  );
};

function BluetoothConnect (props: { route: { params: DeviceModalProps } }) {
  let { devices, connectToPeripheral, closeModal } = props.route.params;

  //Devices Mock
  devices = [
    {
      id: '00:11:22:33:44:55',
      name: 'PetPulse',
      rssi: -50,
      mtu: 23,
      manufacturerData: 'Q29tcGFueU5hbWU=', // Base64 encoded
      rawScanRecord: 'UmF3U2NhbkRhdGE=', // Base64 encoded
      serviceData: {
        '1234-5678-9012': 'U2VydmljZURhdGE=',
      },
      serviceUUIDs: ['1234-5678-9012'],
      localName: 'Device_A_Local',
      txPowerLevel: 4,
      solicitedServiceUUIDs: null,
      isConnectable: true,
      overflowServiceUUIDs: null,

      // Métodos Mockados
      requestConnectionPriority: async () => devices[0],
      readRSSI: async () => devices[0],
      requestMTU: async (mtu: number) => {
        devices[0].mtu = mtu;
        return devices[0];
      },
      connect: async () => devices[0],
      cancelConnection: async () => devices[0],
      isConnected: async () => true,
      onDisconnected: () => ({ remove: () => {} }),
      discoverAllServicesAndCharacteristics: async () => devices[0],
      services: async () => [],
      characteristicsForService: async () => [],
      descriptorsForService: async () => [],
      readCharacteristicForService: async () => ({} as any),
      writeCharacteristicWithResponseForService: async () => ({} as any),
      writeCharacteristicWithoutResponseForService: async () => ({} as any),
      monitorCharacteristicForService: () => ({ remove: () => {} }),
      readDescriptorForService: async () => ({} as any),
      writeDescriptorForService: async () => ({} as any),
    },
    {
      id: 'AA:BB:CC:DD:EE:FF',
      name: 'Relógio Inteligente',
      rssi: -60,
      mtu: 23,
      manufacturerData: 'TWFudWZhY3R1cmVyX0JfRGF0YQ==', // Base64 encoded
      rawScanRecord: 'UmF3U2NhbkRhdGJfQnJhbmQ=', // Base64 encoded
      serviceData: {
        '5678-9012-3456': 'U2VydmljZURhdGJfQnJhbmQ=',
      },
      serviceUUIDs: ['5678-9012-3456'],
      localName: 'Device_B_Local',
      txPowerLevel: 3,
      solicitedServiceUUIDs: null,
      isConnectable: false,
      overflowServiceUUIDs: null,

      // Métodos Mockados
      requestConnectionPriority: async () => devices[1],
      readRSSI: async () => devices[1],
      requestMTU: async (mtu: number) => {
        devices[1].mtu = mtu;
        return devices[1];
      },
      connect: async () => devices[1],
      cancelConnection: async () => devices[1],
      isConnected: async () => false,
      onDisconnected: () => ({ remove: () => {} }),
      discoverAllServicesAndCharacteristics: async () => devices[1],
      services: async () => [],
      characteristicsForService: async () => [],
      descriptorsForService: async () => [],
      readCharacteristicForService: async () => ({} as any),
      writeCharacteristicWithResponseForService: async () => ({} as any),
      writeCharacteristicWithoutResponseForService: async () => ({} as any),
      monitorCharacteristicForService: () => ({ remove: () => {} }),
      readDescriptorForService: async () => ({} as any),
      writeDescriptorForService: async () => ({} as any),
    },
  ];

  console.log('devices: ', devices);

  const navigation = useNavigation();

  const renderDeviceModalListItem = useCallback(
    (item: ListRenderItemInfo<Device>) => {
      return (
        <DeviceModalListItem
          item={item}
          connectToPeripheral={connectToPeripheral}
          closeModal={closeModal}
        />
      );
    },
    [closeModal, connectToPeripheral]
  );

  return (
    <View style={[globalStyles.container, styles.wrap]}>
      <View style={styles.container}>
        <BluetoothSVG width={200} height={200} color={'#fff'} />
        <Text style={[globalStyles.text, styles.title]}>
          {devices.length > 0 ? 'Escolha o dispositivo a se conectar' : 'Nenhuma conexão encontrada, verifique se seu bluetooth está ativo.'}
        </Text>

        { devices.length > 0 && (
          <FlatList
          contentContainerStyle={modalStyle.modalFlatlistContiner}
          data={devices}
          renderItem={renderDeviceModalListItem}
        />
        )}
      </View>

      <TouchableOpacity onPress={() => { navigation.navigate('Home'); }} style={styles.button}>
        <Text style={styles.text}>Voltar a home</Text>
      </TouchableOpacity>
    </View>
  );
}

const modalStyle = StyleSheet.create({
  modalFlatlistContiner: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ctaButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
});

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
    fontSize: 24,
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

  deviceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },

  deviceText: {
    color: colors.white,
    fontSize: 16,
  },
});

export default BluetoothConnect;
