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

export const convertValue = (
  value: number,
  fromUnit: string,
  toUnit: string
): number => {
  try {
    if (!fromUnit || !toUnit) {return 0;}
    return convert(value).from(fromUnit).to(toUnit);
  } catch (error) {
    console.error(`Error converting from ${fromUnit} to ${toUnit}:`, error);
    return 0;
  }
};

export const getUnitAbbreviation = (unit: string, category: UnitCategory): string => {
  try {
    if (!unit) {return '';}
    const abbr = convert().describe(unit).abbr;

    // Special cases for non-squared area units
    if (unit === 'ha' || unit === 'ac') {
      return abbr;
    }

    // Append ² to all other area units
    if (category === 'area') {
      return `${abbr}²`;
    }

    return abbr;
  } catch (error) {
    console.error(`Error getting abbreviation for ${unit}:`, error);
    return unit || '';
  }
};

export const getUnitFullName = (unit: string): string => {
  try {
    if (!unit) {return '';}
    const description = convert().describe(unit);

    // Fix for area unit names
    if (unit === 'mm2') {return 'Square Millimeter (mm²)';}
    if (unit === 'cm2') {return 'Square Centimeter (cm²)';}
    if (unit === 'm2') {return 'Square Meter (m²)';}
    if (unit === 'ha') {return 'Hectare (ha)';}
    if (unit === 'km2') {return 'Square Kilometer (km²)';}
    if (unit === 'in2') {return 'Square Inch (in²)';}
    if (unit === 'ft2') {return 'Square Foot (ft²)';}
    if (unit === 'ac') {return 'Acre (ac)';}
    if (unit === 'mi2') {return 'Square Mile (mi²)';}

    return `${description.singular} (${description.abbr})`;
  } catch (error) {
    console.error(`Error getting full name for ${unit}:`, error);
    return unit || '';
  }
};
