import useSWR from 'swr';

import { supabase, makeClientProxy } from '@/lib/supabaseClient';
import { SPublicPhotoSchema, PublicPhoto, SPhotoSchema } from '@/types';
import { SUPABASE_BUCKET_PHOTOS_PATH } from '@/utils/constants';
import { cacheKeyGenerator, makeFilterString } from '@/utils/cacheKeyGenerator';
import { localeDateNowSQL } from '@/utils/date';
import { removeBucketPath } from '@/utils/removeBucketPath';

const { getItem, getList } = makeClientProxy<SPublicPhotoSchema>();

const getPhotoById = async (id: string) =>
  await supabase
    .from<SPublicPhotoSchema>(SUPABASE_BUCKET_PHOTOS_PATH)
    .select(`*, user: userId(*), likes(*), comments(*, user: userId(*))`)
    .eq('id', id)
    .single();

export const getPhotoServer = async (id: string) => {
  return await getItem(() => getPhotoById(id));
};

export const usePhoto = async (id: number) => {
  const filter = makeFilterString<Partial<SPublicPhotoSchema>>({ id });

  return useSWR<PublicPhoto | undefined>(cacheKeyGenerator('photos', getPhotoById.name, filter), () =>
    getItem(() => getPhotoById(String(id)))
  );
};

const getPhotoListByIsPublished = async () =>
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

export const getPublishedPhotoListServer = async () => {
  return await getList(() => getPhotoListByIsPublished());
};

export const usePublishedPhotoList = async (id: number) => {
  const filter = makeFilterString<Partial<SPublicPhotoSchema>>({ id });

  return useSWR<PublicPhoto[] | undefined>(cacheKeyGenerator('photos', getPhotoListByIsPublished.name, filter), () =>
    getList(() => getPhotoListByIsPublished())
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

export const usePhotoList = async (userId: string) => {
  const filter = makeFilterString<Partial<SPublicPhotoSchema>>({ user_id: userId });

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
