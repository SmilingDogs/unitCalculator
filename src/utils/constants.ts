export const COLORS = {
  background: 'rgb(0, 0, 0)',
  operationButtons: 'rgb(234, 240, 125)',
  regularButtons: 'rgba(255, 255, 255, 0.208)',
  text: 'white',
  display: 'rgba(255, 255, 255, 0.1)',
};

export const UNIT_CATEGORIES = [
  'area',
  'length',
  'temperature',
  'volume',
  'mass',
  'speed',
  'time',
];

export type UnitCategory = typeof UNIT_CATEGORIES[number];
