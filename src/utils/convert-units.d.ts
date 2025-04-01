declare module 'convert-units' {
  interface ConvertUnitDescription {
    abbr: string;
    measure: string;
    system: string;
    singular: string;
    plural: string;
  }

  interface ConvertUnitInstance {
    from: (from: string) => {
      to: (to: string) => number;
    };
  }

  interface ConvertUnitFunction {
    (): {
      possibilities: (measure?: string) => string[];
      measures: () => string[];
      describe: (unit: string) => ConvertUnitDescription;
    };
    (value: number): ConvertUnitInstance;
  }

  const convert: ConvertUnitFunction;
  export default convert;
}
