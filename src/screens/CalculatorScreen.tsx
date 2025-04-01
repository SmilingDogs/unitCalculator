import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Text } from 'react-native';
import CalcButton from '../components/CalcButton';
import CalcDisplay from '../components/CalcDisplay';
import { COLORS } from '../utils/constants';

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
    if (!operation || firstOperand === null) {return;}
    if (waitingForSecondOperand) {return;} // Block calculation if equals pressed right after operation

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
    if (waitingForSecondOperand || calculationComplete) {return;}

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

  return (
    <View style={styles.container}>
      <CalcDisplay value={displayValue} expression={expression} />

      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <CalcButton text="C" onPress={clearAll} />
          <CalcButton text="x²" onPress={handleSquare} />
          <CalcButton text="%" onPress={handlePercent} />
          <CalcButton text="÷" onPress={() => handleOperator('÷')} isOperation />
        </View>

        <View style={styles.row}>
          <CalcButton text="7" onPress={() => inputDigit('7')} />
          <CalcButton text="8" onPress={() => inputDigit('8')} />
          <CalcButton text="9" onPress={() => inputDigit('9')} />
          <CalcButton text="×" onPress={() => handleOperator('×')} isOperation />
        </View>

        <View style={styles.row}>
          <CalcButton text="4" onPress={() => inputDigit('4')} />
          <CalcButton text="5" onPress={() => inputDigit('5')} />
          <CalcButton text="6" onPress={() => inputDigit('6')} />
          <CalcButton text="-" onPress={() => handleOperator('-')} isOperation />
        </View>

        <View style={styles.row}>
          <CalcButton text="1" onPress={() => inputDigit('1')} />
          <CalcButton text="2" onPress={() => inputDigit('2')} />
          <CalcButton text="3" onPress={() => inputDigit('3')} />
          <CalcButton text="+" onPress={() => handleOperator('+')} isOperation />
        </View>

        <View style={styles.row}>
          <CalcButton text="." onPress={inputDecimal} />
          <CalcButton text="0" onPress={() => inputDigit('0')} />
          <CalcButton text="⌫" onPress={handleBackspace} />
          <CalcButton text="=" onPress={handleEquals} isOperation />
        </View>

        <TouchableOpacity
          style={styles.converterButton}
          onPress={onSwitchToConverter}
        >
          <View style={styles.converterButtonContent}>
            <Text style={styles.converterButtonText}>Units Converter</Text>
            <Text style={styles.chevronUp}>▲</Text>
          </View>
        </TouchableOpacity>
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
    flex: 1,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  converterButton: {
    width: '100%',
    padding: 5,
    marginTop: 40,
  },
  converterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  converterButtonText: {
    color: COLORS.operationButtons,
    fontSize: 22,
    fontWeight: 'bold',
    flex: 0.75
  },
  chevronUp: {
    color: COLORS.operationButtons,
    fontSize: 20,
  },
});

export default CalculatorScreen;
