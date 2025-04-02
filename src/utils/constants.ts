export const COLORS = {
  background: 'rgb(0, 0, 0)',
  operationButtons: 'rgb(234, 240, 125)',
  regularButtons: 'rgba(255, 255, 255, 0.208)',
  text: 'white',
  display: 'rgba(255, 255, 255, 0.1)',
};

export const UNIT_CATEGORIES = ['area', 'length', 'temperature', 'volume', 'mass', 'speed', 'time'];

export type UnitCategory = (typeof UNIT_CATEGORIES)[number];
//prettier-ignore
export const CONVERTER_BUTTONS = ['7', '8', '9', '⌫', '4', '5', '6', 'C', '1', '2', '3', '↑', '+/-', '0', '.', '↓'];
//prettier-ignore
export const CALCULATOR_BUTTONS = ['C', 'x²', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '⌫', '='];
