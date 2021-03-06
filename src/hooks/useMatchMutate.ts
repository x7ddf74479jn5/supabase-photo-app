import { useSWRConfig } from 'swr';

export const useMatchMutate = () => {
  const { cache, mutate } = useSWRConfig();
  return (matcher: RegExp, ...args: any[]) => {
    if (!(cache instanceof Map)) {
      throw new Error('matchMutate requires the cache provider to be a Map instance');
    }

    const keys = [];

    for (const key of Array.from(cache.keys())) {
      if (matcher.test(key)) {
        keys.push(key);
      }
    }

    const mutations = keys.map((key) => mutate(key, ...args));
    return Promise.all(mutations);
  };
};

export type useMatchMutateReturn = ReturnType<typeof useMatchMutate>;
