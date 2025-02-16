import React, { FC, useCallback } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
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
  const { item, connectToPeripheral, closeModal } = props;

  const connectAndCloseModal = useCallback(() => {
    connectToPeripheral(item.item);
    closeModal();
  }, [closeModal, connectToPeripheral, item.item]);

  return (
    <TouchableOpacity
      onPress={connectAndCloseModal}
      style={modalStyle.ctaButton}
    >
      <Text style={modalStyle.ctaButtonText}>{item.item.name}</Text>
    </TouchableOpacity>
  );
};

function BluetoothConnect (props: { route: { params: DeviceModalProps } }) {
  const { devices, connectToPeripheral, closeModal } = props.route.params;

  console.log(devices);

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

{/* <Modal
      style={modalStyle.modalContainer}
      animationType="slide"
      transparent={false}
      visible={visible}
    >
      <SafeAreaView style={modalStyle.modalTitle}>
        <Text style={modalStyle.modalTitleText}>
          Tap on a device to connect
        </Text>
        <FlatList
          contentContainerStyle={modalStyle.modalFlatlistContiner}
          data={devices}
          renderItem={renderDeviceModalListItem}
        />
      </SafeAreaView>
    </Modal> */}

const modalStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  modalFlatlistContiner: {
    flex: 1,
    justifyContent: 'center',
  },
  modalCellOutline: {
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
  },
  modalTitle: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  modalTitleText: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: 'bold',
    marginHorizontal: 20,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#FF6060',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
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
