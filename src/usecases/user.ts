import useSWR from 'swr';

import { SProfileSchema, Profile } from '@/types';
import { SUPABASE_BUCKET_USERS_PATH } from '@/utils/constants';
import { makeClientProxy, supabase } from '@/lib/supabaseClient';
import { makeFilterString, cacheKeyGenerator } from '@/utils/cacheKeyGenerator';
import { useMatchMutate } from '@/hooks/useMatchMutate';

const { getItem } = makeClientProxy<SProfileSchema>();

type MutateProfile = (data: any, opts?: boolean) => Promise<Profile[]>;

export const useProfile = (id?: string) => {
  const filter = makeFilterString<Partial<SProfileSchema>>({ id });

  const { data: profile } = useSWR<Profile | undefined>(
    id ? cacheKeyGenerator('users', getProfileByIdQuery.name, filter) : null,
    () => getItem(() => getProfileByIdQuery(id))
  );

  return profile;
};

export const useProfileMutator = () => {
  const matchMutate = useMatchMutate();

  const mutateUser = (data: any) => matchMutate(/^users/, data);

  return {
    updateProfile: (data: Partial<SProfileSchema>) => updateProfile(data, mutateUser),
  };
};

const getProfileByIdQuery = async (id?: string) => {
  return await supabase.from<SProfileSchema>(SUPABASE_BUCKET_USERS_PATH).select('*').eq('id', id).single();
};

export const getProfile = async (id: string) => {
  return await getItem(() => getProfileByIdQuery(id));
};

export const updateProfile = async ({ id, ...payload }: Partial<SProfileSchema>, mutate?: MutateProfile) => {
  const query = supabase.from<SProfileSchema>(SUPABASE_BUCKET_USERS_PATH).update(payload).match({ id }).single();

  const updatedProfile = await getItem(async () => await query);

  if (mutate) {
    await mutate((prev?: Profile) => {
      if (!prev) return;

      return { ...prev, ...updateProfile };
    }, false);
  }

  return updatedProfile;
};
