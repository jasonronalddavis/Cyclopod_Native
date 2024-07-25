
import React, { useState, useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
  Gesture,
  PinchGestureHandler,
  PanGestureHandler,PanResponder
} from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import BluetoothService from '../services/BluetoothService';
import eyeBar from './Images/eyeBar.png';
import eyeBarCopy from './Images/eyeBarCopy.png';
import eyeWindow from './Images/eyeWindow.png';
import FrontEyeBar from './Images/FrontEyeBar.png';
import mouthWindow from './Images/mouthWindow.png';
import crawl_forward from './Images/crawl_forward.png';
import crawl_backward from './Images/crawl_backward.png';
import crawl_right from './Images/crawl_right.png';
import crawl_left from './Images/crawl_left.png';
import stand_image from './Images/stand.png';
import squat_down from './Images/squat_down.png';
import body_window from './Images/body_window.png';
import blink_button from './Images/blink_button.png';
import mouth from './Images/mouth.png';
import menu from './Images/menu.png';
import stretch_image from './Images/stretch_image.png';

const HexapodControl = ({ device }) => {

  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  const widthRef = useSharedValue(140);
  const heightRef = useSharedValue(140);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const renderButton = (onPressIn, onPressOut, source, style) => {
    const scale = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scale, {
        toValue: 1.2,
        useNativeDriver: true,
      }).start();
      if (onPressIn) onPressIn();
    };

    const handlePressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      if (onPressOut) onPressOut();
    };
    const pinchHandler = useAnimatedGestureHandler({
      onActive: (event) => {
        scale.value = event.scale;
      },
      onEnd: () => {
        scale.value = withSpring(1);
      },
    });
  
    const panHandler = useAnimatedGestureHandler({
      onStart: (_, ctx) => {
        ctx.startX = translateX.value;
        ctx.startY = translateY.value;
      },
      onActive: (event, ctx) => {
        translateX.value = ctx.startX + event.translationX;
        translateY.value = ctx.startY + event.translationY;
      },
      onEnd: () => {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      },
    });
  
    const animatedWidthStyle = useAnimatedStyle(() => ({
      width: widthRef.value,
    }));
    
    const animatedHeightStyle = useAnimatedStyle(() => ({
      height: heightRef.value,
    }));




    return (
      <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Image source={source} style={style} />
        </Animated.View>
      </TouchableOpacity>
    );
  };


  const startCrawl = (direction) => {
    if (device) {
      BluetoothService.sendCommand(device, direction);
    }
  };

  const stopCrawl = (direction) => {
    if (device) {
      BluetoothService.sendCommand(device, `${direction}0`);
    }
  };

  const handleLeftStart = () => {
    startCrawl('L');
  };

  const handleLeftStop = () => {
    stopCrawl('L');
  };

  const handleRightStart = () => {
    startCrawl('R');
  };

  const handleRightStop = () => {
    stopCrawl('R');
  };

  const handleBackStart = () => {
    startCrawl('Z');
  };

  const handleBackStop = () => {
    stopCrawl('Z');
  };

  const handleForwardStart = () => {
    startCrawl('F');
  };

  const handleForwardStop = () => {
    stopCrawl('F');
  };

  const handleStretch = () => {
    if (device) {
      BluetoothService.sendCommand(device, 'S');
    }
  };

  const handleMouseUp = () => {
    if (device) {
      BluetoothService.sendCommand(device, 'U');
      setTimeout(() => {
        BluetoothService.sendCommand(device, 'S');
      }, 500);
    }
  };

  const standLift = () => {
    if (device) {
      BluetoothService.sendCommand(device, 'U');
    }
  };

  const standUp = () => {
    if (device) {
      BluetoothService.sendCommand(device, 'T');
    }
  };

  const mouthDown = () => {
    if (device) {
      BluetoothService.sendCommand(device, 'L20');
    }
  };

  const mouthUp = () => {
    if (device) {
      BluetoothService.sendCommand(device, 'L21');
    }
  };

  const handleBend = () => {
    if (device) {
      BluetoothService.sendCommand(device, 'B');
    }
  };

  const handleBlink = () => {
    if (device) {
      BluetoothService.sendCommand(device, 'd');
    }
  };


  const panResponderX = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        setStartX(gestureState.x0);
      },
      onPanResponderMove: (evt, gestureState) => {
        const deltaX = gestureState.moveX - startX;
        const newWidth = Math.min(Math.max(140 + deltaX, 20), 160);
        widthRef.setValue(newWidth);
        if (device) {
          BluetoothService.sendCommand(device, `x${newWidth}`);
        }
      },
      onPanResponderRelease: () => {
        setStartX(null);
      },
    })
  ).current;

  const panResponderY = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        setStartY(gestureState.y0);
      },
      onPanResponderMove: (evt, gestureState) => {
        const deltaY = gestureState.moveY - startY;
        const newHeight = Math.min(Math.max(140 + deltaY, 20), 160);
        heightRef.setValue(newHeight);
        if (device) {
          BluetoothService.sendCommand(device, `y${newHeight}`);
        }
      },
      onPanResponderRelease: () => {
        setStartY(null);
      },
    })
  ).current;



  return (
    <GestureHandlerRootView style={styles.container}>
      <Image source={eyeWindow} style={styles.eyeWindow} />
      <Image source={menu} style={styles.menu} />
      <Image source={mouthWindow} style={styles.mouthWindow} />
      <Image source={FrontEyeBar} style={styles.yFrontBar} />
      <Image source={FrontEyeBar} style={styles.frontBar} />
      <Animated.View
        style={[styles.xrectangle, animatedWidthStyle]}
        {...panResponderX.panHandlers}
      >
        <Image source={eyeBar} style={styles.xRectangleImage} />
      </Animated.View>
      <Animated.View
        style={[styles.yRectangle, animatedHeightStyle]}
        {...panResponderY.panHandlers}
      >
        <Image source={eyeBarCopy} style={styles.yRectangleImage} />
      </Animated.View>
      <View style={styles.legs}>
        {renderButton(handleBackStart, handleBackStop, crawl_backward, styles.crawlbackward)}
        {renderButton(handleForwardStart, handleForwardStop, crawl_forward, styles.crawlForward)}
        {renderButton(handleRightStart, handleRightStop, crawl_right, styles.crawlRight)}
        {renderButton(handleLeftStart, handleLeftStop, crawl_left, styles.crawlLeft)}
      </View>
      <View style={styles.bend}>
        {renderButton(handleBend, handleMouseUp, squat_down, styles.bendbutton)}
        {renderButton(standLift, standUp, stand_image, styles.standbutton)}
        {renderButton(mouthDown, mouthUp, mouth, styles.mouthbutton)}
        <TouchableOpacity style={styles.stretchButton} onPress={handleStretch}>
          <Image source={stretch_image} style={styles.stretcher} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.blinkButton} onPress={handleBlink}>
          <Image source={blink_button} style={styles.blinkButton}/>
        </TouchableOpacity>
      </View>
      <Image source={body_window} style={styles.bodyWindow} />
      <View style={styles.container}>
        <PinchGestureHandler onGestureEvent={pinchHandler}>
          <Animated.View style={animatedStyle}>
            <PanGestureHandler onGestureEvent={panHandler}>
              <Animated.View>
                <Image source={eyeWindow} style={styles.eyeWindow} />
                <Image source={menu} style={styles.menu} />
                <Image source={mouthWindow} style={styles.mouthWindow} />
                <Image source={FrontEyeBar} style={styles.frontBar} />
                <Image source={body_window} style={styles.bodyWindow} />
                <Image source={blink_button} style={styles.blinkButton} />
                <Image source={stretch_image} style={styles.stretchImage} />
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </PinchGestureHandler>
      </View>
    </GestureHandlerRootView>
  );  
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    marginTop: 775,
    alignItems: 'center',
    flex: 1,
  },
  bodyWindow: {
    position: 'absolute',
    resizeMode: 'contain',
    left: 350,
    top: 100,
    height: 790,
    zIndex: 90,
    width: 850,
    pointerEvents: 'none',
  },
  xrectangle: {
    position: 'absolute',
    height: 20,
    top: -316,
    zIndex: 85,
    left: -2,
  },
  yRectangle: {
    transform: [{ rotate: '-180deg' }],
    position: 'absolute',
    resizeMode: 'stretch',
    top: -210,
    right: -900,
    zIndex: 80,
    width: 50,
    height: 280,
  },
  frontBar: {
    position: 'absolute',
    resizeMode: 'stretch',
    top: -690,
    zIndex: 105,
    right: -910,
    height: 50,
    width: 280,
    pointerEvents: 'none',
  },
  yFrontBar: {
    transform: [{ rotate: '90deg' }],
    position: 'absolute',
    resizeMode: 'stretch',
    top: -410,
    right: -620,
    zIndex: 90,
    width: 280,
    height: 50,
    pointerEvents: 'none',
  },
  eyeWindow: {
    position: 'absolute',
    pointerEvents: 'none',
    top: -620,
    zIndex: 80,
    left: 520,
    resizeMode: 'contain',
    height: 500,
    width: 500,
  },
  mouthWindow: {
    position: 'absolute',
    resizeMode: 'contain',
    top: 1150,
    zIndex: 80,
    left: 520,
    height: 500,
    width: 500,
  },
  yRectangleImage: {
    position: 'absolute',
    resizeMode: 'stretch',
    top: 175,
    right: -390,
    zIndex: 95,
    width: 38,
    height: 275,
  },
  xRectangleImage: {
    position: 'absolute',
    resizeMode: 'stretch',
    width: 265,
    height: 40,
    top: -365,
    zIndex: 95,
    left: 640,
  },
  legs: {
    position: 'relative',
    zIndex: 60,
    top: 1350,
    right: 175,
  },
  sliders: {
    position: 'absolute',
    resizeMode: 'contain',
    fontSize: 24,
    right: 215,
    zIndex: 20,
    top: 250,
  },
  eyeY: {
    position: 'absolute',
    resizeMode: 'contain',
    left: -65,
    top: -105,
  },
  menu: {
    position: 'absolute',
    resizeMode: 'stretch',
    left: 200,
    top: -750,
    height: 90,
    width: 90,
    zIndex: 95,
  },
  ySlider: {
    position: 'absolute',
    resizeMode: 'contain',
    transform: [{ rotate: '270deg' }],
    left: 5,
    zIndex: 20,
  },
  standbutton: {
    position: 'absolute',
    resizeMode: 'contain',
    top: 640,
    right: -350,
    height: 300,
    width: 300,
    zIndex: 105,
  },
  bendbutton: {
    position: 'absolute',
    resizeMode: 'contain',
    top: 790,
    right: -400,
    height: 350,
    width: 350,
    zIndex: 140,
  },
  crawlForward: {
    position: 'absolute',
    resizeMode: 'contain',
    top: -1480,
    left: 810,
    height: 300,
    width: 300,
    zIndex: 110,
  },
  crawlbackward: {
    position: 'absolute',
    resizeMode: 'contain',
    top: -530,
    left: 810,
    zIndex: 95,
    height: 300,
    width: 300,
  },
  crawlRight: {
    position: 'absolute',
    resizeMode: 'contain',
    right: -1580,
    top: -1000,
    zIndex: 90,
    height: 300,
    width: 300,
  },
  crawlLeft: {
    position: 'absolute',
    resizeMode: 'contain',
    top: -1010,
    right: -620,
    height: 300,
    width: 300,
    zIndex: 90,
  },
  mouthbutton: {
    position: 'absolute',
    resizeMode: 'contain',
    right: -330,
    top: 1220,
    zIndex: 55,
    height: 250,
    width: 250,
  },
  blinkButton: {
    position: 'absolute',
    resizeMode: 'contain',
    left: 635,
    top: -35,
    height: 320,
    width: 320,
    zIndex: 90,
    padding: 0,
    margin: 0
  },
  stretcher: {
    position: 'absolute',
    resizeMode: 'contain',
    left: 400,
    top: 355,
    height: 340,
    width: 500,
    zIndex: 650,
    margin: 650,
  },
});

export default HexapodControl;
