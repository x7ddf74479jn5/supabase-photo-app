import { camelizeDeeply } from '@/utils/caseConverter';
import { createClient, PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const makeClientProxy = <T extends Record<string, any>>() => {
  return {
    getList: async (fetcher: () => Promise<PostgrestResponse<T>>) => {
      const { data, error } = await fetcher();

      if (error) {
        throw new Error(`error: ${error.message}`);
      }

      if (!data) {
        return undefined;
      }

      return camelizeDeeply(data);
    },
    getItem: async (fetcher: () => Promise<PostgrestSingleResponse<T>>) => {
      const { data, error } = await fetcher();

      if (error) {
        throw new Error(`error: ${error.message}`);
      }

      if (!data) {
        return undefined;
      }

      return camelizeDeeply(data);
    },
  };
};
