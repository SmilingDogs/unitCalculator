import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import CalcButton from '../components/CalcButton';
import CalcDisplay from '../components/CalcDisplay';
import { COLORS, CALCULATOR_BUTTONS } from '../utils/constants';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome6';

interface CalculatorScreenProps {
  onSwitchToConverter: () => void;
}

type OperationType = '+' | '-' | '×' | '÷' | '' | '=';

const CalculatorScreen: React.FC<CalculatorScreenProps> = ({ onSwitchToConverter }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [expression, setExpression] = useState('');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<OperationType>('');
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [calculationComplete, setCalculationComplete] = useState(false);

  const clearAll = () => {
    setDisplayValue('0');
    setExpression('');
    setFirstOperand(null);
    setOperation('');
    setWaitingForSecondOperand(false);
    setCalculationComplete(false);
  };

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else if (calculationComplete) {
      // Clear display if a new number is entered after a calculation
      setDisplayValue(digit);
      setExpression('');
      setCalculationComplete(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (calculationComplete) {
      setDisplayValue('0.');
      setExpression('');
      setCalculationComplete(false);
      return;
    }

    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const handleOperator = (nextOperator: OperationType) => {
    const inputValue = parseFloat(displayValue);

    // If an operation button is pressed right after another,
    // just change the operation
    if (waitingForSecondOperand && operation !== '') {
      setOperation(nextOperator);
      setExpression(expression.slice(0, -1) + nextOperator);
      return;
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue);
      setExpression(displayValue + ' ' + nextOperator);
    } else if (operation) {
      // Check for division by zero
      if (operation === '÷' && inputValue === 0) {
        setDisplayValue('Err');
        setExpression(expression + ' ' + displayValue + ' =');
        setFirstOperand(null);
        setOperation('');
        setWaitingForSecondOperand(false);
        setCalculationComplete(true);
        return;
      }

      const result = performCalculation();

      // Round result to max 8 decimal places if it's a float
      let resultDisplay = String(result);
      if (resultDisplay.includes('.') && resultDisplay.split('.')[1].length > 8) {
        resultDisplay = result.toFixed(8);
      }

      setDisplayValue(resultDisplay);
      setExpression(resultDisplay + ' ' + nextOperator);
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperation(nextOperator);
    setCalculationComplete(false);
  };

  const performCalculation = (): number => {
    const inputValue = parseFloat(displayValue);

    if (firstOperand === null) {
      return inputValue;
    }

    switch (operation) {
      case '+':
        return firstOperand + inputValue;
      case '-':
        return firstOperand - inputValue;
      case '×':
        return firstOperand * inputValue;
      case '÷':
        if (inputValue === 0) {
          // Handle division by zero
          setTimeout(() => {
            setDisplayValue('Err');
          }, 0);
          return 0; // Return a placeholder value
        }
        return firstOperand / inputValue;
      default:
        return inputValue;
    }
  };

  const handleEquals = () => {
    if (!operation || firstOperand === null) {
      return;
    }
    if (waitingForSecondOperand) {
      return;
    } // Block calculation if equals pressed right after operation

    // Handle division by zero error
    if (operation === '÷' && parseFloat(displayValue) === 0) {
      setExpression(expression + ' ' + displayValue + ' =');
      setDisplayValue('Err');
      setFirstOperand(null);
      setOperation('');
      setWaitingForSecondOperand(false);
      setCalculationComplete(true);
      return;
    }

    const result = performCalculation();
    const fullExpression = expression + ' ' + displayValue;

    // Round result to max 8 decimal places if it's a float
    let resultDisplay = String(result);
    if (resultDisplay.includes('.') && resultDisplay.split('.')[1].length > 8) {
      resultDisplay = result.toFixed(8);
    }

    setExpression(fullExpression + ' =');
    setDisplayValue(resultDisplay);
    setFirstOperand(null);
    setOperation('');
    setWaitingForSecondOperand(false);
    setCalculationComplete(true);
  };

  const handleBackspace = () => {
    if (waitingForSecondOperand || calculationComplete) {
      return;
    }

    if (displayValue.length === 1 || (displayValue.length === 2 && displayValue.startsWith('-'))) {
      setDisplayValue('0');
    } else {
      setDisplayValue(displayValue.slice(0, -1));
    }
  };

  const handlePercent = () => {
    const value = parseFloat(displayValue);
    const result = value / 100;

    setDisplayValue(String(result));
    setCalculationComplete(true);
  };

  const handleSquare = () => {
    const value = parseFloat(displayValue);
    const result = value * value;

    setExpression(displayValue + '² =');
    setDisplayValue(String(result));
    setCalculationComplete(true);
  };

  const handleButtonPress = (button: string) => {
    if (button === 'C') {
      return clearAll();
    } else if (button === 'x²') {
      return handleSquare();
    } else if (button === '%') {
      return handlePercent();
    } else if (button.match(/[+\-×÷]/)) {
      return handleOperator(button as OperationType);
    } else if (button.match(/[0-9]/)) {
      return inputDigit(button);
    } else if (button === '=') {
      return handleEquals();
    } else if (button === '.') {
      return inputDecimal();
    } else if (button === '⌫') {
      return handleBackspace();
    }
  };

  return (
    <View style={styles.container}>
      <CalcDisplay value={displayValue} expression={expression} />

      <View style={styles.switchToConverterContainer}>
        <TouchableOpacity style={styles.switchButton} onPress={onSwitchToConverter}>
          <AwesomeIcon name="arrow-right-arrow-left" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          {CALCULATOR_BUTTONS.map((button, index) => (
            <CalcButton
              key={index}
              text={button}
              onPress={() => handleButtonPress(button)}
              isOperation={!!button.match(/[+\-×÷=]/)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  buttonContainer: {
    marginTop: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  switchToConverterContainer: {
    width: '90%',
    alignSelf: 'center',
    borderBottomColor: COLORS.operationButtons,
    borderBottomWidth: 1,
    // paddingHorizontal: 20,
    paddingVertical: 10,
  },
  switchButton: {},
});

export default CalculatorScreen;
