import useSWR from 'swr';

import { SProfileSchema, ProfileSchema, Profile } from '@/types';
import { SUPABASE_BUCKET_USERS_PATH } from '@/utils/constants';
import { makeClientProxy, supabase } from '@/lib/supabaseClient';
import { makeFilterString, cacheKeyGenerator } from '@/utils/cacheKeyGenerator';

const { getItem, getList } = makeClientProxy<SProfileSchema>();

const getProfileById = async (id: string) =>
  await supabase.from<SProfileSchema>(SUPABASE_BUCKET_USERS_PATH).select('*').eq('id', id).single();

export const getProfileServer = async (id: string) => {
  return await getItem(() => getProfileById(id));
};

export const useProfile = (id: string) => {
  const filter = makeFilterString<Partial<SProfileSchema>>({ id });

  return useSWR<Profile | undefined>(cacheKeyGenerator('users', getProfileById.name, filter), () =>
    getItem(() => getProfileById(id))
  );
};
