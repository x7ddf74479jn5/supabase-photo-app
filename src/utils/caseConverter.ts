import camelcaseKeys from 'camelcase-keys';

export const camelizeDeeply = <T extends Record<string, any> | readonly any[]>(arg: T) =>
  camelcaseKeys(arg, { deep: true });

type SnakeToCamelCase<T extends string> = T extends `${infer R}_${infer U}`
  ? `${R}${Capitalize<SnakeToCamelCase<U>>}`
  : T;

type SnakeToCamel<T extends object> = {
  [K in keyof T as `${SnakeToCamelCase<string & K>}`]: T[K] extends object ? SnakeToCamel<T[K]> : T[K];
};

type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
  : S;

type CamelToSnake<T extends object> = {
  [K in keyof T as `${CamelToSnakeCase<string & K>}`]: T[K] extends object ? CamelToSnake<T[K]> : T[K];
};

export const camelToSnake = <T extends Record<string, any> | readonly any[]>(
  arg: T
): CamelToSnake<T> | CamelToSnake<T>[] => {
  if (Array.isArray(arg)) {
    return arg.map((a) => convertCamelToSnake(a));
  }

  return convertCamelToSnake(arg);
};

const convertCamelToSnake = <T extends Record<string, any> | readonly any[]>(arg: T): CamelToSnake<T> => {
  const replace = (k: string) => {
    const capital = /[A-Z]/g;
    return k.replaceAll(capital, (match) => {
      return '_' + match.toLowerCase();
    });
  };

  return Object.entries(arg).reduce((acc, cur) => {
    const [k, v] = cur;

    if (typeof v === 'object') {
      return {
        ...acc,
        [replace(k)]: convertCamelToSnake(v),
      };
    } else {
      return {
        ...acc,
        [replace(k)]: v,
      };
    }
  }, {} as CamelToSnake<T>);
};

export const snakeToCamel = <T extends Record<string, any> | readonly any[]>(
  arg: T
): SnakeToCamel<T> | SnakeToCamel<T>[] => {
  if (Array.isArray(arg)) {
    return arg.map((a) => convertSnakeToCamel(a));
  }

  return convertSnakeToCamel(arg);
};

export const convertSnakeToCamel = <T extends Record<string, any>>(obj: T): SnakeToCamel<T> => {
  const replace = (k: string) => {
    const underscore = /_./g;
    return k.replaceAll(underscore, (match) => {
      return match.charAt(1).toUpperCase();
    });
  };

  return Object.entries(obj).reduce((acc, cur) => {
    const [k, v] = cur;

    if (typeof v === 'object') {
      return {
        ...acc,
        [replace(k)]: convertSnakeToCamel(v),
      };
    } else {
      return {
        ...acc,
        [replace(k)]: v,
      };
    }
  }, {} as SnakeToCamel<T>);
};
