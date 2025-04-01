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
    backgroundColor: COLORS.display,
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    marginBottom: 15,
    marginHorizontal: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
    minHeight: 120,
  },
  expressionText: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  displayText: {
    fontSize: 65,
    color: COLORS.text,
  },
});

export default CalcDisplay;
