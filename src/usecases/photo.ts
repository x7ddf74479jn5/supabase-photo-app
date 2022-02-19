import useSWR from 'swr/immutable';

import { supabase, makeClientProxy } from '@/lib/supabaseClient';
import { SPublicPhotoSchema, PublicPhoto, SPhotoSchema } from '@/types';
import { SUPABASE_BUCKET_PHOTOS_PATH } from '@/utils/constants';
import { cacheKeyGenerator, makeFilterString } from '@/utils/cacheKeyGenerator';
import { localeDateNowSQL } from '@/utils/date';
import { removeBucketPath } from '@/utils/removeBucketPath';
import { useMatchMutate } from '@/hooks/useMatchMutate';

const { getItem, getList } = makeClientProxy<SPublicPhotoSchema>();

type MutatePublicPhoto = (data: any, opts?: boolean) => Promise<PublicPhoto[]>;

export const usePhoto = (id: number) => {
  const filter = makeFilterString<Partial<PublicPhoto>>({ id });

  const { data: photo } = useSWR<PublicPhoto | undefined>(
    cacheKeyGenerator('photos', getPhotoByIdQuery.name, filter),
    () => getPhoto(String(id))
  );

  return { photo };
};

export const usePhotoMutator = () => {
  const matchMutate = useMatchMutate();

  const mutatePhoto = (data: any) => matchMutate(/^photos/, data);

  return {
    createPhoto: (data: Partial<SPublicPhotoSchema>) => createPhoto(data, mutatePhoto),
    updatePhoto: (data: Partial<SPublicPhotoSchema>) => updatePhoto(data, mutatePhoto),
    deletePhoto: (id: number) => deletePhoto(id, mutatePhoto),
    restorePhoto: (data: Partial<SPublicPhotoSchema>) => restorePhoto(data, mutatePhoto),
  };
};

const getPhotoByIdQuery = async (id: string) =>
  await supabase
    .from<SPublicPhotoSchema>(SUPABASE_BUCKET_PHOTOS_PATH)
    .select(`*, user: userId(*), likes(*), comments(*, user: userId(*))`)
    .eq('id', id)
    .single();

export const getPhoto = async (id: string) => {
  return await getItem(() => getPhotoByIdQuery(id));
};

export const usePublishedPhotoList = () => {
  const { data: photos } = useSWR<PublicPhoto[] | undefined>(
    cacheKeyGenerator('photos', getPhotoListByIsPublishedQuery.name),
    () => getList(() => getPhotoListByIsPublishedQuery())
  );

  return photos;
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

export const usePhotoList = (userId: string) => {
  const filter = makeFilterString<Partial<PublicPhoto>>({ userId });

  const { data: photos } = useSWR<PublicPhoto[] | undefined>(
    cacheKeyGenerator('photos', getPhotoListByUserIdQuery.name, filter),
    () => getList(() => getPhotoListByUserIdQuery(userId))
  );

  return photos;
};

const getPhotoListByUserIdQuery = async (userId: string) =>
  await supabase
    .from<SPublicPhotoSchema>(SUPABASE_BUCKET_PHOTOS_PATH)
    .select(`*, comments(*), likes(*)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

export const getPhotoList = async (id: string): Promise<PublicPhoto[] | undefined> => {
  return await getList(() => getPhotoListByUserIdQuery(id));
};

export const updatePhoto = async ({ id, ...rest }: Partial<SPhotoSchema>, mutate: MutatePublicPhoto) => {
  const query = supabase
    .from<SPhotoSchema>(SUPABASE_BUCKET_PHOTOS_PATH)
    .update({
      ...rest,
      updated_at: localeDateNowSQL(),
    })
    .match({ id })
    .single();

  const updatedPhoto = await getItem(async () => await query);

  await mutate((prev?: PublicPhoto[]) => {
    if (!prev) return;

    return [...prev].map((c) => {
      if (c.id !== updatedPhoto?.id) return c;
      return updatedPhoto;
    });
  }, false);

  return updatedPhoto;
};

export const deletePhoto = async (id: number, mutate: MutatePublicPhoto) => {
  const query = supabase.from<SPhotoSchema>(SUPABASE_BUCKET_PHOTOS_PATH).delete().eq('id', id);

  const deletedPhotos = await getList(async () => await query);
  const deletedPhoto = deletedPhotos && deletedPhotos[0];

  await mutate((prev?: PublicPhoto[]) => {
    if (!prev) return;

    return [...prev].filter((c) => {
      return c.id !== deletedPhoto?.id;
    });
  }, false);

  return deletedPhoto;
};

export const createPhoto = async (data: Partial<SPhotoSchema>, mutate: MutatePublicPhoto) => {
  const query = supabase.from<SPhotoSchema>(SUPABASE_BUCKET_PHOTOS_PATH).insert([data]);

  const photos = await getList(async () => await query);

  await mutate(photos, false);

  return photos;
};

export const restorePhoto = async (data: Partial<SPhotoSchema>, mutate: MutatePublicPhoto) => {
  const query = supabase.from<SPhotoSchema>(SUPABASE_BUCKET_PHOTOS_PATH).upsert(data);

  const upsertedPhotos = await getList(async () => await query);
  const upsertedPhoto = upsertedPhotos && upsertedPhotos[0];

  await mutate((prev?: PublicPhoto[]) => {
    if (!prev) return;

    return [...prev].map((c) => {
      if (c.id !== upsertedPhoto?.id) return c;

      return upsertedPhoto;
    });
  }, false);

  return upsertedPhoto;
};

export const uploadPhoto = async (path: string, image: File) => {
  const { data } = await supabase.storage.from(SUPABASE_BUCKET_PHOTOS_PATH).upload(path, image, {
    cacheControl: '3600',
    upsert: false,
  });

  return data;
};

// .from() で bucket 指定しているので、getPublicUrl() に渡すパスからは、bucket 名は取り除く必要がある
// NG: photos/25aea8bc-aa5e-42ce-b099-da8815c2a50f/fdf945886dfd
// OK: 25aea8bc-aa5e-42ce-b099-da8815c2a50f/fdf945886dfd
export const getPhotoPublicURL = async (key: string) => {
  return await supabase.storage
    .from(SUPABASE_BUCKET_PHOTOS_PATH)
    .getPublicUrl(removeBucketPath(key, SUPABASE_BUCKET_PHOTOS_PATH));
};
