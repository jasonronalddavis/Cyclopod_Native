import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import BluetoothService from '../services/BluetoothService';
import HexapodControl from './HexapodControl';

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #fff;
`;

const BluetoothView = styled.View`
  flex: 1;
`;

const ConnectView = styled.View`
  min-height: 100px;
  position: absolute;
  font-size: 20px;
  left: 250px;
  top: -45px;
  z-index: 50;
  color: rgb(255, 255, 255);
`;

const BluetoothController = () => {
  const [device, setDevice] = useState(null);
  const [connected, setConnected] = useState(false);

  const handleBluetoothConnect = async () => {
    try {
      const bluetoothDevice = await BluetoothService.connect();
      setDevice(bluetoothDevice);
      setConnected(true);
      BluetoothService.subscribeToCharacteristic(bluetoothDevice, handleCharacteristicChange);
    } catch (error) {
      console.error('Bluetooth connection failed:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (connected) {
        BluetoothService.disconnect(device);
        setConnected(false);
      }
    };
  }, [connected, device]);

  const handleCharacteristicChange = (event) => {
    const receivedValue = event.target.value;
    if (receivedValue === 'crawl_forward') {
      setIsMoving(true);
    }
  };

  return (
    <Container>
      <BluetoothView>
        <HexapodControl device={device} />
      </BluetoothView>
      <ConnectView>
        <Text>Connecting to Hexapod...</Text>
        <TouchableOpacity style={styles.bluetoothButton} onPress={handleBluetoothConnect}>
          <Text>Connect Bluetooth</Text>
        </TouchableOpacity>
      </ConnectView>
    </Container>
  );
};

const styles = StyleSheet.create({
  bluetoothButton: {
    backgroundColor: 'white', // Green backgroun
    alignItems: 'center',
    resizeMode:'stretch',
    fontSize: 10,
    width: 150,
    height: 80,
    right: -935,
    top: 178
  },
  bluetoothButtonText:{
    fontSize: 10
  }
});

export default BluetoothController;
