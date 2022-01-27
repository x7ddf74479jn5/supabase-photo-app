import camelcaseKeys from 'camelcase-keys';

export const camelizeDeeply = <T extends Record<string, any> | readonly any[]>(arg: T) =>
  camelcaseKeys(arg, { deep: true });
