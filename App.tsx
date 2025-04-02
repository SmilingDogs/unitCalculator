/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Animated, Dimensions } from 'react-native';
import CalculatorScreen from './src/screens/CalculatorScreen';
import ConverterScreen from './src/screens/ConverterScreen';
import { COLORS } from './src/utils/constants';
import SplashScreen from 'react-native-splash-screen';

const { height } = Dimensions.get('window');

function App(): React.ReactElement {
  const [currentScreen, setCurrentScreen] = useState<'calculator' | 'converter'>('calculator');
  const slideAnim = useRef(new Animated.Value(height)).current;

  // Initialize converter as hidden but rendered
  const [converterVisible, setConverterVisible] = useState(false);

  useEffect(() => {
    // Initialize converter as hidden
    slideAnim.setValue(height);
  }, [slideAnim]);

  const switchToCalculator = () => {
    // Animate the converter screen out
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentScreen('calculator');
      // Hide converter after animation completes
      setTimeout(() => setConverterVisible(false), 50);
    });
  };

  const switchToConverter = () => {
    // Make converter visible before animation
    setConverterVisible(true);

    // Wait a frame for the component to render
    setTimeout(() => {
      setCurrentScreen('converter');
      // Animate the converter screen in
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 20);
  };

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />

      {/* Calculator screen is always at the bottom */}
      <CalculatorScreen onSwitchToConverter={switchToConverter} />

      {/* Converter screen slides up from the bottom */}
      {(currentScreen === 'converter' || converterVisible) && (
        <Animated.View
          style={[
            styles.converterContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ConverterScreen onSwitchToCalculator={switchToCalculator} />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  converterContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
  },
});

export default App;
