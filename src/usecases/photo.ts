import useSWR from 'swr';

import { supabase, makeClientProxy } from '@/lib/supabaseClient';
import { SPublicPhotoSchema, PublicPhoto, SPhotoSchema } from '@/types';
import { SUPABASE_BUCKET_PHOTOS_PATH } from '@/utils/constants';
import { cacheKeyGenerator, makeFilterString } from '@/utils/cacheKeyGenerator';
import { localeDateNowSQL } from '@/utils/date';
import { removeBucketPath } from '@/utils/removeBucketPath';

const { getItem, getList } = makeClientProxy<SPublicPhotoSchema>();

const getPhotoByIdQuery = async (id: string) =>
  await supabase
    .from<SPublicPhotoSchema>(SUPABASE_BUCKET_PHOTOS_PATH)
    .select(`*, user: userId(*), likes(*), comments(*, user: userId(*))`)
    .eq('id', id)
    .single();

export const getPhoto = async (id: string) => {
  return await getItem(() => getPhotoByIdQuery(id));
};

export const usePhoto = (id: number) => {
  const filter = makeFilterString<Partial<PublicPhoto>>({ id });

  return useSWR<PublicPhoto | undefined>(cacheKeyGenerator('photos', getPhotoByIdQuery.name, filter), () =>
    getItem(() => getPhotoByIdQuery(String(id)))
  );
};

const getPhotoListByIsPublishedQuery = async () =>
  await supabase
    .from(SUPABASE_BUCKET_PHOTOS_PATH)
    .select(
      `
    *,
    comments(*),
    user: userId(*),
    likes(*)
  `
    )
    .eq('is_published', true)
    .order('created_at', { ascending: false });

export const getPublishedPhotoList = async () => {
  return await getList(() => getPhotoListByIsPublishedQuery());
};

export const usePublishedPhotoList = () => {
  return useSWR<PublicPhoto[] | undefined>(cacheKeyGenerator('photos', getPhotoListByIsPublishedQuery.name), () =>
    getList(() => getPhotoListByIsPublishedQuery())
  );
};

const getPhotoListByUserId = async (userId: string) =>
  await supabase
    .from<SPublicPhotoSchema>(SUPABASE_BUCKET_PHOTOS_PATH)
    .select(`*, comments(*), likes(*)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

export const getPhotoListServer = async (id: string): Promise<PublicPhoto[] | undefined> => {
  return await getList(() => getPhotoListByUserId(id));
};

export const usePhotoList = (userId: string) => {
  const filter = makeFilterString<Partial<PublicPhoto>>({ userId });

  return useSWR<PublicPhoto[] | undefined>(cacheKeyGenerator('photos', getPhotoListByUserId.name, filter), () =>
    getList(() => getPhotoListByUserId(userId))
  );
};

export const updatePhoto = async ({ id, ...rest }: Partial<SPhotoSchema>) =>
  await supabase
    .from<SPhotoSchema>(SUPABASE_BUCKET_PHOTOS_PATH)
    .update({
      ...rest,
      updated_at: localeDateNowSQL(),
    })
    .match({ id });

export const deletePhoto = async (id: number) => {
  return await supabase.from<SPhotoSchema>(SUPABASE_BUCKET_PHOTOS_PATH).delete().eq('id', id);
};

export const createPhoto = async (data: Partial<SPhotoSchema>) => {
  await supabase.from<SPhotoSchema>(SUPABASE_BUCKET_PHOTOS_PATH).insert([data]);
};

export const restorePhoto = async (data: Partial<SPhotoSchema>) => {
  await supabase.from<SPhotoSchema>(SUPABASE_BUCKET_PHOTOS_PATH).upsert(data);
};

export const uploadPhoto = async (path: string, image: File) => {
  return await supabase.storage.from(SUPABASE_BUCKET_PHOTOS_PATH).upload(path, image, {
    cacheControl: '3600',
    upsert: false,
  });
};

// .from() で bucket 指定しているので、getPublicUrl() に渡すパスからは、bucket 名は取り除く必要がある
// NG: photos/25aea8bc-aa5e-42ce-b099-da8815c2a50f/fdf945886dfd
// OK: 25aea8bc-aa5e-42ce-b099-da8815c2a50f/fdf945886dfd
export const getPhotoPublicURL = async (key: string) => {
  return await supabase.storage
    .from(SUPABASE_BUCKET_PHOTOS_PATH)
    .getPublicUrl(removeBucketPath(key, SUPABASE_BUCKET_PHOTOS_PATH));
};
