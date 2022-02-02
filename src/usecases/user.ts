import useSWR from 'swr';

import { SProfileSchema, ProfileSchema, Profile } from '@/types';
import { SUPABASE_BUCKET_USERS_PATH } from '@/utils/constants';
import { makeClientProxy, supabase } from '@/lib/supabaseClient';
import { makeFilterString, cacheKeyGenerator } from '@/utils/cacheKeyGenerator';

const { getItem, getList } = makeClientProxy<SProfileSchema>();

const getProfileByIdQuery = async (id?: string) => {
  return await supabase.from<SProfileSchema>(SUPABASE_BUCKET_USERS_PATH).select('*').eq('id', id).single();
};

export const getProfileServer = async (id: string) => {
  return await getItem(() => getProfileByIdQuery(id));
};

export const useProfile = (id?: string) => {
  const filter = makeFilterString<Partial<SProfileSchema>>({ id });

  return useSWR<Profile | undefined>(id ? cacheKeyGenerator('users', getProfileByIdQuery.name, filter) : null, () =>
    getItem(() => getProfileByIdQuery(id))
  );
};

const updateNickNameMutate = async (id: string, nickname: string) => {
  return await supabase.from<SProfileSchema>(SUPABASE_BUCKET_USERS_PATH).update({ nickname }).match({ id }).single();
};

export const updateNickname = async (id: string, nickname: string) => {
  return await getItem(() => updateNickNameMutate(id, nickname));
};
