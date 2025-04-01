import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { COLORS, UnitCategory } from '../utils/constants';
import UnitCategorySelector from '../components/UnitCategorySelector';
import UnitSelector from '../components/UnitSelector';
import {
  getUnitsForCategory,
  convertValue,
  getUnitAbbreviation,
} from '../utils/conversions';
import CalcButton from '../components/CalcButton';

interface ConverterScreenProps {
  onSwitchToCalculator: () => void;
}

const ConverterScreen: React.FC<ConverterScreenProps> = ({
  onSwitchToCalculator,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory>('area');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [fromValue, setFromValue] = useState<string>('10');
  const [toValue, setToValue] = useState<string>('');
  const [unitOptions, setUnitOptions] = useState<string[]>([]);
  const [activeInput, setActiveInput] = useState<'from' | 'to'>('from');
  const [_currentInput, setCurrentInput] = useState<string>('');

  // Use ref to track previous fromUnit
  const prevFromUnitRef = useRef<string>('');

  useEffect(() => {
    const units = getUnitsForCategory(selectedCategory);
    setUnitOptions(units);

    if (units.length > 0) {
      // Only set default units if they're not already set for this category
      // This prevents units from changing when the user is entering values
      if (!fromUnit || !toUnit || !units.includes(fromUnit) || !units.includes(toUnit)) {
        const defaultFromUnit = units[0];
        const defaultToUnit = units.length > 1 ? units[1] : units[0];

        setFromUnit(defaultFromUnit);
        setToUnit(defaultToUnit);

        // Update conversion when default units are set
        if (fromValue && defaultFromUnit && defaultToUnit) {
          try {
            const result = convertValue(
              parseFloat(fromValue),
              defaultFromUnit,
              defaultToUnit
            );
            setToValue(result.toFixed(6).toString());
          } catch (error) {
            console.error('Error during initial conversion:', error);
            setToValue('0');
          }
        }
      }
    }
  }, [selectedCategory, fromUnit, toUnit, fromValue]);

  useEffect(() => {
    if (fromUnit && toUnit && fromValue) {
      try {
        const result = convertValue(parseFloat(fromValue), fromUnit, toUnit);
        setToValue(result.toFixed(6).toString());
      } catch (error) {
        console.error('Error during conversion:', error);
        setToValue('Error');
      }
    }
  }, [fromUnit, toUnit, fromValue]);

  const handleCategoryChange = (category: UnitCategory) => {
    setSelectedCategory(category);
    // Reset to default input state when changing categories
    setActiveInput('from');
    setCurrentInput('0');
    setFromValue('0');
  };

  const handleFromUnitChange = (unit: string) => {
    prevFromUnitRef.current = fromUnit;
    setFromUnit(unit);
    // Clear input when changing units
    setCurrentInput('0');
    setFromValue('0');
  };

  const handleToUnitChange = (unit: string) => {
    setToUnit(unit);
  };

  // Convert handleDigitPress to useCallback to avoid closure issues
  const handleDigitPress = useCallback((digit: string) => {
    if (activeInput === 'from') {
      setCurrentInput(currentInput => {
        // If current input is '0', replace it with the new digit
        let newValue;
        if (currentInput === '0' && digit !== '.') {
          newValue = digit;
        } else {
          newValue = currentInput + digit;
        }

        // Update fromValue whenever currentInput changes
        setFromValue(newValue);
        return newValue;
      });
    }
  }, [activeInput]);

  const handleClear = useCallback(() => {
    // Always reset to '0' instead of empty string to avoid issues
    const newValue = '0';
    setCurrentInput(newValue);
    setFromValue(newValue);
  }, []);

  const handleDecimal = useCallback(() => {
    if (activeInput === 'from') {
      setCurrentInput(currentInput => {
        // Don't add another decimal if one exists
        if (currentInput.includes('.')) {
          return currentInput;
        }

        // Ensure we have a leading zero if adding decimal to empty input
        const newValue = currentInput === '' || currentInput === '0' ? '0.' : currentInput + '.';
        setFromValue(newValue);
        return newValue;
      });
    }
  }, [activeInput]);

  const handleBackspace = useCallback(() => {
    if (activeInput === 'from') {
      setCurrentInput(currentInput => {
        const newValue = currentInput.length > 1
          ? currentInput.slice(0, -1)
          : '0';
        setFromValue(newValue);
        return newValue;
      });
    }
  }, [activeInput]);

  const handleUpArrow = () => {
    setActiveInput('from');
  };

  const handleDownArrow = () => {
    // Placeholder for down arrow functionality
  };

  useEffect(() => {
    if (fromUnit && prevFromUnitRef.current && fromUnit !== prevFromUnitRef.current) {
      // Only sync when unit changes, not on input changes
      setCurrentInput(fromValue);
    }
  }, [fromUnit, fromValue]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onSwitchToCalculator} style={styles.calculatorButton}>
          <View style={styles.calculatorButtonContent}>
            <Text style={styles.calculatorButtonText}>Calculator</Text>
            <Text style={styles.chevronDown}>▼</Text>
          </View>
        </TouchableOpacity>
      </View>

      <UnitCategorySelector
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />

      <View style={styles.converterContainer}>
        <UnitSelector
          label={fromUnit}
          value={fromValue}
          unitOptions={unitOptions}
          onSelect={handleFromUnitChange}
          unitAbbreviation={getUnitAbbreviation(fromUnit, selectedCategory)}
        />

        <UnitSelector
          label={toUnit}
          value={toValue}
          unitOptions={unitOptions}
          onSelect={handleToUnitChange}
          unitAbbreviation={getUnitAbbreviation(toUnit, selectedCategory)}
        />
      </View>

      <View style={styles.keypad}>
        <View style={styles.row}>
          <CalcButton text="7" onPress={() => handleDigitPress('7')} />
          <CalcButton text="8" onPress={() => handleDigitPress('8')} />
          <CalcButton text="9" onPress={() => handleDigitPress('9')} />
          <CalcButton text="⌫" onPress={handleBackspace} />
        </View>

        <View style={styles.row}>
          <CalcButton text="4" onPress={() => handleDigitPress('4')} />
          <CalcButton text="5" onPress={() => handleDigitPress('5')} />
          <CalcButton text="6" onPress={() => handleDigitPress('6')} />
          <CalcButton text="C" onPress={handleClear} />
        </View>

        <View style={styles.row}>
          <CalcButton text="1" onPress={() => handleDigitPress('1')} />
          <CalcButton text="2" onPress={() => handleDigitPress('2')} />
          <CalcButton text="3" onPress={() => handleDigitPress('3')} />
          <CalcButton text="↑" onPress={handleUpArrow} />
        </View>

        <View style={styles.row}>
          <CalcButton text="+/-" onPress={() => {}} disabled={true} />
          <CalcButton text="0" onPress={() => handleDigitPress('0')} />
          <CalcButton text="." onPress={handleDecimal} />
          <CalcButton text="↓" onPress={handleDownArrow} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  calculatorButton: {
    width: '100%',
    padding: 5,
    marginTop: 40,
  },
  calculatorButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculatorButtonText: {
    color: COLORS.operationButtons,
    fontSize: 22,
    fontWeight: 'bold',
    flex: 0.5
  },
  chevronDown: {
    color: COLORS.operationButtons,
    fontSize: 20,
  },
  converterContainer: {
    flex: 1,
    padding: 10,
  },
  keypad: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  button: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: COLORS.regularButtons,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
  operationButton: {
    backgroundColor: COLORS.operationButtons,
  },
  operationButtonText: {
    color: COLORS.background,
  },
});

export default ConverterScreen;
