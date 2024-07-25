import BleManager from 'react-native-ble-manager';
import { NativeModules, NativeEventEmitter } from 'react-native';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

class BluetoothService {
  static start() {
    BleManager.start({ showAlert: false }).then(() => {
      console.log('Bluetooth service started');
    }).catch(error => {
      console.error('Bluetooth service start error:', error);
    });
  }

  static scan() {
    return new Promise((resolve, reject) => {
      BleManager.scan([], 5, true).then(() => {
        console.log('Scanning...');
        resolve();
      }).catch(error => {
        console.error('Scan error:', error);
        reject(error);
      });
    });
  }

  static stopScan() {
    return new Promise((resolve, reject) => {
      BleManager.stopScan().then(() => {
        console.log('Scan stopped');
        resolve();
      }).catch(error => {
        console.error('Stop scan error:', error);
        reject(error);
      });
    });
  }

  static connect(deviceId) {
    return new Promise((resolve, reject) => {
      BleManager.connect(deviceId).then(() => {
        console.log('Connected to', deviceId);
        resolve();
      }).catch(error => {
        console.error('Connect error:', error);
        reject(error);
      });
    });
  }

  static disconnect(deviceId) {
    return new Promise((resolve, reject) => {
      BleManager.disconnect(deviceId).then(() => {
        console.log('Disconnected from', deviceId);
        resolve();
      }).catch(error => {
        console.error('Disconnect error:', error);
        reject(error);
      });
    });
  }

  static sendCommand(deviceId, command) {
    // Add your implementation for sending a command to the connected device.
    console.log(`Sending command to ${deviceId}: ${command}`);
    // Use the appropriate BleManager write method according to your device's characteristics.
  }

  static on(event, handler) {
    bleManagerEmitter.addListener(event, handler);
  }

  static off(event, handler) {
    bleManagerEmitter.removeListener(event, handler);
  }
};

export default BluetoothService;
