import useSWR from 'swr/immutable';

import { SLikeWithPhotoAndUser, SLikeSchema, LikeWithPhotoAndUser } from '@/types';
import { SUPABASE_BUCKET_LIKES_PATH } from '@/utils/constants';
import { supabase } from '@/lib/supabaseClient';
import { makeClientProxy } from '@/lib/supabaseClient';
import { cacheKeyGenerator, makeFilterString } from '@/utils/cacheKeyGenerator';
import { useMatchMutate } from '@/hooks/useMatchMutate';

const queryProxy = makeClientProxy<SLikeWithPhotoAndUser>();
const mutatorProxy = makeClientProxy<SLikeSchema>();

type MutateLike = (data: any, opts?: boolean) => Promise<SLikeWithPhotoAndUser[]>;

export const useLikes = (userId: string) => {
  const filter = makeFilterString<Partial<LikeWithPhotoAndUser>>({ userId });

  const { data: likes } = useSWR<LikeWithPhotoAndUser[] | undefined>(
    cacheKeyGenerator('likes', getLikeListByUserIdQuery.name, filter),
    () => queryProxy.getList(() => getLikeListByUserIdQuery(userId))
  );

  return likes;
};

export const useLikeMutator = () => {
  const matchMutate = useMatchMutate();

  const mutateLike = (data: any) => matchMutate(/^likes/, data);

  return {
    createLike: (data: Partial<SLikeWithPhotoAndUser>) => createLike(data, mutateLike),
    deleteLike: (id: number) => deleteLike(id, mutateLike),
    restoreLike: (data: Partial<SLikeWithPhotoAndUser>) => restoreLike(data, mutateLike),
  };
};

const getLikesByPhotoIdQuery = async (photoId: number) =>
  await supabase.from<SLikeSchema>(SUPABASE_BUCKET_LIKES_PATH).select(`*`).eq('photo_id', photoId);

const getLikeListByUserIdQuery = async (id: string) =>
  await supabase
    .from<SLikeWithPhotoAndUser>(SUPABASE_BUCKET_LIKES_PATH)
    .select(`*, photo: photos(*), user: userId(*)`)
    .eq('user_id', id)
    .order('created_at', { ascending: false });

export const getLikes = async (id: string) => {
  return await queryProxy.getList(() => getLikeListByUserIdQuery(id));
};

const createLike = async (data: Partial<SLikeSchema>, mutate: MutateLike) => {
  const query = supabase.from<SLikeSchema>(SUPABASE_BUCKET_LIKES_PATH).insert([data]);

  const likes = await mutatorProxy.getList(async () => await query);

  await mutate(likes, false);

  return likes;
};

const deleteLike = async (id: number, mutate: MutateLike) => {
  const query = supabase.from<SLikeSchema>(SUPABASE_BUCKET_LIKES_PATH).delete().eq('id', id);

  const deletedLikes = await mutatorProxy.getList(async () => await query);
  const deletedLike = deletedLikes && deletedLikes[0];

  await mutate((prev?: SLikeWithPhotoAndUser[]) => {
    if (!prev) return;

    return [...prev].filter((l) => {
      return l.id !== deletedLike?.id;
    });
  }, false);

  return deletedLike;
};

const restoreLike = async (data: Partial<SLikeSchema>, mutate: MutateLike) => {
  const query = supabase.from<SLikeSchema>(SUPABASE_BUCKET_LIKES_PATH).upsert(data);

  const upsertedLikes = await mutatorProxy.getList(async () => await query);
  const upsertedLike = upsertedLikes && upsertedLikes[0];

  await mutate((prev?: SLikeWithPhotoAndUser[]) => {
    if (!prev) return;

    return [...prev].map((l) => {
      if (l.id !== upsertedLike?.id) return l;

      return upsertedLike;
    });
  }, false);

  return upsertedLike;
};
