
import React from 'react';
import 'react-native-gesture-handler';
import { View, Image, StyleSheet } from 'react-native';
import BluetoothController from './src/components/BluetoothControl';
import HexapodControl from './src/components/HexapodControl';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const App = () => {
  return (
    <View style={styles.container}>
      <BluetoothController />
      <Image
        style={styles.background}
        source={require('./src/components/Images/background.png')}
      />
        <GestureHandlerRootView style={{ flex: 1 }}>
      <HexapodControl />
    </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',

  },
  background: {
    position: 'absolute',
    resizeMode:'stretch',
    top: 0,
    left: 0,
    width: 1600,
    height: 2560,
    zIndex: -1,
  },
});

export default App;
