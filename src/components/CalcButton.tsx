import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle, View } from 'react-native';
import { COLORS } from '../utils/constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome6';

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
  const getIcon = () => {
    if (text === '+') {
      return <Icon name="add" size={28} color="black" />;
    } else if (text === '-') {
      return <Icon name="remove" size={28} color="black" />;
    } else if (text === '×') {
      return <Icon name="close" size={28} color="black" />;
    } else if (text === '÷') {
      return <AwesomeIcon name="divide" size={24} color="black" />;
    }
    return null;
  };
  // Special handling for x² button
  const renderButtonContent = () => {
    if (text === 'x²') {
      return (
        <View style={styles.powerContainer}>
          <Text
            style={[
              styles.buttonText,
              isOperation ? styles.operationButtonText : styles.regularButtonText,
              textStyle,
            ]}>
            x
          </Text>
          <Text
            style={[
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
            textStyle,
          ]}>
          {<Icon name="percent" size={34} color="rgb(234, 240, 125)" />}
        </Text>
      );
    } else if (text.match(/[+\-×÷]/)) {
      const icon = getIcon();
      return (
        <Text
          style={[
            styles.buttonText,
            isOperation ? styles.operationButtonText : styles.regularButtonText,
            textStyle,
          ]}>
          {icon}
        </Text>
      );
    } else if (text === 'pm') {
      return (
        <Text
          style={[
            styles.buttonText,
            isOperation ? styles.operationButtonText : styles.regularButtonText,
            textStyle,
          ]}>
          <AwesomeIcon name="plus-minus" size={28} color="rgb(234, 240, 125)" />
        </Text>
      );
    } else {
      return (
        <Text
          style={[
            styles.buttonText,
            isOperation ? styles.operationButtonText : styles.regularButtonText,
            textStyle,
          ]}>
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
        style,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}>
      {renderButtonContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '25%',
    height: '25%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  disabledButton: {
    backgroundColor: COLORS.regularButtons,
    opacity: 0.5,
  },
  disabledButtonText: {
    color: COLORS.text,
    opacity: 1,
  },
});

export default CalcButton;
