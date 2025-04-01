import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

interface IconProps {
  size?: number;
  color?: string;
}

export const CalculatorIcon: React.FC<IconProps> = ({
  size = 24,
  color = COLORS.text,
}) => {
  return (
    <View style={[styles.iconContainer, { width: size, height: size }]}>
      <View style={[styles.calculatorBody, { borderColor: color }]}>
        <View style={[styles.calculatorScreen, { backgroundColor: color }]} />
        <View style={styles.buttonRow}>
          <View style={[styles.calculatorButton, { backgroundColor: color }]} />
          <View style={[styles.calculatorButton, { backgroundColor: color }]} />
        </View>
        <View style={styles.buttonRow}>
          <View style={[styles.calculatorButton, { backgroundColor: color }]} />
          <View style={[styles.calculatorButton, { backgroundColor: color }]} />
        </View>
      </View>
    </View>
  );
};

export const ConverterIcon: React.FC<IconProps> = ({
  size = 24,
  color = COLORS.text,
}) => {
  return (
    <View style={[styles.iconContainer, { width: size, height: size }]}>
      <View style={styles.converterContainer}>
        <View style={[styles.ruler, { backgroundColor: color }]} />
        <View style={[styles.scale, { borderColor: color }]}>
          <View style={[styles.scaleLine, { backgroundColor: color }]} />
          <View style={[styles.scaleLine, { backgroundColor: color }]} />
          <View style={[styles.scaleLine, { backgroundColor: color }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculatorBody: {
    width: '90%',
    height: '90%',
    borderWidth: 2,
    borderRadius: 4,
    padding: 2,
    justifyContent: 'space-between',
  },
  calculatorScreen: {
    height: '30%',
    borderRadius: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '25%',
  },
  calculatorButton: {
    width: '45%',
    borderRadius: 2,
  },
  converterContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ruler: {
    width: '80%',
    height: 3,
    marginBottom: 4,
  },
  scale: {
    width: '80%',
    height: '60%',
    borderWidth: 2,
    borderRadius: 2,
    paddingVertical: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  scaleLine: {
    width: '70%',
    height: 2,
    borderRadius: 1,
  },
});
