import { Bucket } from './constants';

type Filter = `${string}`;
const queryMethod = ['get', 'create', 'update', 'delete'] as const;
type QueryMethod = typeof queryMethod[number];
type QueryFunc = `${QueryMethod}${string}`;

// posts:getPost:id=abc
type CacheKey = `${Bucket}:${QueryFunc}` | `${Bucket}:${QueryFunc}:${Filter}`;

const isQueryFunc = (func: string) => {
  return queryMethod.some((method) => func.startsWith(method));
};

export const cacheKeyGenerator = (bucket: Bucket, func: string, filter?: string): CacheKey => {
  console.assert(!isQueryFunc, `Function name should start with ${queryMethod.join(', ')}`);

  return `${bucket}:${func as QueryFunc}${filter && ':' + filter}`;
};

type FilterMap<T> = { readonly [key in keyof T]?: any };

export const makeFilterString = <T extends FilterMap<unknown>>(filter: T) => {
  return new URLSearchParams(filter).toString();
};
