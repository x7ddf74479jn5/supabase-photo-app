import useSWR from 'swr';

import { SLikeWithPhotoAndUser, Like, SLikeSchema } from '@/types';
import { SUPABASE_BUCKET_LIKES_PATH } from '@/utils/constants';
import { supabase } from '@/lib/supabaseClient';
import { makeClientProxy } from '@/lib/supabaseClient';
import { cacheKeyGenerator, makeFilterString } from '@/utils/cacheKeyGenerator';
import { camelizeDeeply } from '../utils/camerizeDeeply';

const { getItem, getList } = makeClientProxy<SLikeWithPhotoAndUser>();

const getLikeListByUserId = async (id: string) =>
  await supabase
    .from<SLikeWithPhotoAndUser>(SUPABASE_BUCKET_LIKES_PATH)
    .select(`*, photo: photos(*), user: userId(*)`)
    .eq('user_id', id)
    .order('created_at', { ascending: false });

export const getLikesServer = async (id: string) => {
  return await getList(() => getLikeListByUserId(id));
};

export const useLikes = (id: string) => {
  const filter = makeFilterString<Partial<SLikeWithPhotoAndUser>>({ user_id: id });

  return useSWR<Like[] | undefined>(cacheKeyGenerator('likes', getLikeListByUserId.name, filter), () =>
    getList(() => getLikeListByUserId(id))
  );
};

export const updateLike = async (data: Partial<SLikeSchema>) => {
  const { data: likes } = await supabase.from<SLikeSchema>(SUPABASE_BUCKET_LIKES_PATH).insert([data]);

  if (!likes) return null;

  return camelizeDeeply(likes);
};

export const deleteLike = async (id: number) => {
  return await supabase.from<SLikeSchema>(SUPABASE_BUCKET_LIKES_PATH).delete().eq('id', id);
};

export const getLikesByPhotoId = async (photoId: number) =>
  await supabase.from<SLikeSchema>(SUPABASE_BUCKET_LIKES_PATH).select(`*`).eq('photo_id', photoId);

export const deleteLikesByPhotoId = async (photoId: number) => {
  const { data: likes } = await getLikesByPhotoId(photoId);
  let _deleted: SLikeSchema[] = [];

  if (likes) {
    for (const like of likes) {
      const { data: deleted } = await deleteLike(like.id);
      deleted && _deleted.concat(deleted);
    }
  }

  return _deleted;
};

export const restoreLike = async (data: Partial<SLikeSchema>) => {
  await supabase.from<SLikeSchema>(SUPABASE_BUCKET_LIKES_PATH).upsert(data);
};
