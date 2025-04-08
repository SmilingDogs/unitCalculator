/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import CalculatorScreen from './src/screens/CalculatorScreen';
import ConverterScreen from './src/screens/ConverterScreen';
import { COLORS } from './src/utils/constants';
import SplashScreen from 'react-native-splash-screen';

function App(): React.ReactElement {
  const [currentScreen, setCurrentScreen] = useState<'calculator' | 'converter'>('calculator');

  const switchToCalculator = () => {
    setCurrentScreen('calculator');
  };

  const switchToConverter = () => {
    setCurrentScreen('converter');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hide();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {currentScreen === 'calculator' ? (
        <CalculatorScreen onSwitchToConverter={switchToConverter} />
      ) : (
        <ConverterScreen onSwitchToCalculator={switchToCalculator} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default App;
