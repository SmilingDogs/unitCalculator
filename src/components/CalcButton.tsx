import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle, View } from 'react-native';
import { COLORS } from '../utils/constants';

interface CalcButtonProps {
  text: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isOperation?: boolean;
  disabled?: boolean;
}

const CalcButton: React.FC<CalcButtonProps> = ({
  text,
  onPress,
  style,
  textStyle,
  isOperation = false,
  disabled = false,
}) => {
  // Special handling for x² button
  const renderButtonContent = () => {
    if (text === 'x²') {
      return (
        <View style={styles.powerContainer}>
          <Text style={[
            styles.buttonText,
            isOperation ? styles.operationButtonText : styles.regularButtonText,
            textStyle,
          ]}>
            x
          </Text>
          <Text style={[
            styles.superscript,
            isOperation ? styles.operationButtonText : styles.regularButtonText,
          ]}>
            2
          </Text>
        </View>
      );
    } else if (text === '%') {
      return (
        <Text
          style={[
            styles.buttonText,
            isOperation ? styles.operationButtonText : styles.regularButtonText,
            styles.percentText,
            textStyle,
          ]}
        >
          {text}
        </Text>
      );
    } else {
      return (
        <Text
          style={[
            styles.buttonText,
            isOperation ? styles.operationButtonText : styles.regularButtonText,
            textStyle,
          ]}
        >
          {text}
        </Text>
      );
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isOperation ? styles.operationButton : styles.regularButton,
        text === 'C' || text === 'x²' || text === '%' || text === '÷' ? styles.firstRowButton : null,
        style,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.buttonText,
          isOperation && styles.operationButtonText,
          disabled && styles.disabledButtonText,
        ]}
      >
        {renderButtonContent()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  firstRowButton: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  operationButton: {
    backgroundColor: COLORS.operationButtons,
  },
  regularButton: {
    backgroundColor: COLORS.regularButtons,
    borderWidth: 1,
    borderColor: COLORS.operationButtons,
  },
  buttonText: {
    fontSize: 30,
  },
  operationButtonText: {
    color: 'rgb(0, 0, 0)',
  },
  regularButtonText: {
    color: COLORS.operationButtons,
  },
  powerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  superscript: {
    fontSize: 20,
    lineHeight: 20,
    position: 'relative',
    top: 2,
    right: 1,
  },
  percentText: {
    paddingRight: 5,
  },
  disabledButton: {
    backgroundColor: COLORS.regularButtons,
    opacity: 0.6,
  },
  disabledButtonText: {
    color: COLORS.text,
    opacity: 0.7,
  },
});

export default CalcButton;
