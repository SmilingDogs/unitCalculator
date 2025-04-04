import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../utils/constants';

interface CalcDisplayProps {
  value: string;
  expression: string;
}

const CalcDisplay: React.FC<CalcDisplayProps> = ({ value, expression }) => {
  return (
    <View style={styles.display}>
      <Text style={styles.expressionText} numberOfLines={1} adjustsFontSizeToFit>
        {expression}
      </Text>
      <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  display: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 20,
    paddingBottom: 0,
    marginTop: 20,
    marginBottom: 15,
    marginHorizontal: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  expressionText: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  displayText: {
    position: 'relative',
    top: 15,
    right: 0,
    fontSize: 70,
    color: COLORS.text,
  },
});

export default CalcDisplay;
