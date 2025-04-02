import convert from 'convert-units';
import { UnitCategory } from './constants';

export const getUnitsForCategory = (category: UnitCategory): string[] => {
  try {
    return convert().possibilities(category);
  } catch (error) {
    console.error(`Error getting units for category ${category}:`, error);
    return [];
  }
};

export const convertValue = (value: number, fromUnit: string, toUnit: string): number => {
  try {
    if (!fromUnit || !toUnit) {
      return 0;
    }
    return convert(value).from(fromUnit).to(toUnit);
  } catch (error) {
    console.error(`Error converting from ${fromUnit} to ${toUnit}:`, error);
    return 0;
  }
};

export const getUnitAbbreviation = (unit: string): string => {
  try {
    if (!unit) {
      return '';
    }
    const abbr = convert().describe(unit).abbr;

    // Special cases for non-squared area units
    if (unit === 'ha' || unit === 'ac') {
      return abbr;
    }

    return abbr;
  } catch (error) {
    console.error(`Error getting abbreviation for ${unit}:`, error);
    return unit || '';
  }
};

export const getUnitFullName = (unit: string): string => {
  try {
    if (!unit) {
      return '';
    }
    const description = convert().describe(unit);

    if (description.measure === 'area' && description.singular === 'Centimeter') {
      return `Square ${description.singular}`;
    }

    return `${description.singular}`;
  } catch (error) {
    console.error(`Error getting full name for ${unit}:`, error);
    return unit || '';
  }
};
