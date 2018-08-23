// @flow

type Config = {
  ignoreCase?: boolean,
  ignoreAccents?: boolean,
  stringify?: Object => string,
  trim?: boolean,
  matchFrom?: 'any' | 'start',
};

import { stripDiacritics } from './diacritics';

const trimString = str => str.replace(/^\s+|\s+$/g, '');
const defaulStringify = option => `${option.label} ${option.value}`;

export const createFilter = (config: ?Config) => (
  option: { label: string, value: string, data: any },
  rawInput: string
) => {
  const { ignoreCase, ignoreAccents, stringify, trim, matchFrom } = {
    ignoreCase: true,
    ignoreAccents: true,
    stringify: defaulStringify,
    trim: true,
    matchFrom: 'any',
    ...config,
  };
  let input = trim ? trimString(rawInput) : rawInput;
  let candidate = trim ? trimString(stringify(option)) : stringify(option);
  if (ignoreCase) {
    input = input.toLowerCase();
    candidate = candidate.toLowerCase();
  }
  if (ignoreAccents) {
    input = stripDiacritics(input);
    candidate = stripDiacritics(candidate);
  }
  let splitInputWords = input.split(" ").filter(t => trimString(t) !== "");
  let matchingCount = 0;
  for (let i = 0; i < splitInputWords.length; i++) {
    if (candidate.substr(0, input.length) === splitInputWords[i]) {
      matchingCount++;
    }      
  }

  return matchingCount > 0;
};
