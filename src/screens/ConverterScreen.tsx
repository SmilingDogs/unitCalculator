import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { CONVERTER_BUTTONS, COLORS, UnitCategory } from '../utils/constants';
import UnitCategorySelector from '../components/UnitCategorySelector';
import UnitSelector from '../components/UnitSelector';
import { getUnitsForCategory, convertValue, getUnitAbbreviation } from '../utils/conversions';
import CalcButton from '../components/CalcButton';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome6';

interface ConverterScreenProps {
  onSwitchToCalculator: () => void;
}

const ConverterScreen: React.FC<ConverterScreenProps> = ({ onSwitchToCalculator }) => {
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory>('area');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [fromValue, setFromValue] = useState<string>('10');
  const [toValue, setToValue] = useState<string>('');
  const [unitOptions, setUnitOptions] = useState<string[]>([]);
  const [activeInput, setActiveInput] = useState<'from' | 'to'>('from');

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
            const result = convertValue(parseFloat(fromValue), defaultFromUnit, defaultToUnit);
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
    setActiveInput('from');
    setFromValue('0');
  };

  const handleFromUnitChange = (unit: string) => {
    prevFromUnitRef.current = fromUnit;
    setFromUnit(unit);
    setFromValue('0');
  };

  const handleToUnitChange = (unit: string) => {
    setToUnit(unit);
  };

  const handleDigitPress = useCallback(
    (digit: string) => {
      if (activeInput === 'from') {
        setFromValue(current => {
          // If current input is '0', replace it with the new digit
          if (current === '0' && digit !== '.') {
            return digit;
          }
          return current + digit;
        });
      }
    },
    [activeInput],
  );

  const handleClear = useCallback(() => {
    setFromValue('0');
  }, []);

  const handleDecimal = useCallback(() => {
    if (activeInput === 'from') {
      setFromValue(current => {
        if (current.includes('.')) {
          return current;
        }
        return current === '' || current === '0' ? '0.' : current + '.';
      });
    }
  }, [activeInput]);

  const handleBackspace = useCallback(() => {
    if (activeInput === 'from') {
      setFromValue(current => (current.length > 1 ? current.slice(0, -1) : '0'));
    }
  }, [activeInput]);

  const handleUpArrow = () => {
    setActiveInput('from');
  };

  const handleDownArrow = () => {
    // Placeholder for down arrow functionality
  };

  const handlePlusMinus = () => {
    // Placeholder for plus minus functionality
  };

  useEffect(() => {
    if (fromUnit && prevFromUnitRef.current && fromUnit !== prevFromUnitRef.current) {
      // Only sync when unit changes, not on input changes
      setFromValue(fromValue);
    }
  }, [fromUnit, fromValue]);

  const handleButtonPress = (value: string) => {
    if (value.match(/[0-9]/)) {
      return handleDigitPress(value);
    } else if (value === 'C') {
      return handleClear();
    } else if (value === '⌫') {
      return handleBackspace();
    } else if (value === '.') {
      return handleDecimal();
    } else if (value === '↑') {
      return handleUpArrow();
    } else if (value === '↓') {
      return handleDownArrow();
    } else if (value === '+/-') {
      return handlePlusMinus();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onSwitchToCalculator} style={styles.calculatorButton}>
          <AwesomeIcon name="chevron-left" size={30} color={COLORS.text} />
          <AwesomeIcon name="calculator" size={30} color={COLORS.text} />
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
          unitAbbreviation={getUnitAbbreviation(fromUnit)}
        />

        <UnitSelector
          label={toUnit}
          value={toValue}
          unitOptions={unitOptions}
          onSelect={handleToUnitChange}
          unitAbbreviation={getUnitAbbreviation(toUnit)}
        />
      </View>

      <View style={styles.keypad}>
        {CONVERTER_BUTTONS.map((button, i) => (
          <CalcButton
            key={i}
            text={button}
            onPress={() => handleButtonPress(button)}
            disabled={button === 'pm'}
          />
        ))}
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
    marginVertical: 20,
    marginHorizontal: 20,
  },
  calculatorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 20,
  },
  converterContainer: {
    flex: 1,
    padding: 10,
  },
  keypad: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ConverterScreen;
