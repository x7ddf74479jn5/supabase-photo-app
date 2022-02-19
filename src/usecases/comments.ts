import useSWR from 'swr/immutable';

import { makeClientProxy, supabase } from '@/lib/supabaseClient';
import { SCommentSchema, Comment, CommentSchema } from '@/types';
import { cacheKeyGenerator, makeFilterString } from '@/utils/cacheKeyGenerator';
import { SUPABASE_BUCKET_COMMENTS_PATH } from '@/utils/constants';
import { localeDateNowSQL } from '@/utils/date';
import { useMatchMutate } from '@/hooks/useMatchMutate';

const { getList, getItem } = makeClientProxy<SCommentSchema>();

type MutateComment = (data: any, opts?: boolean) => Promise<Comment[]>;

export const useComment = (photoId: number) => {
  const filter = makeFilterString<Partial<Comment>>({ photoId });

  const { data: comments } = useSWR<CommentSchema[] | undefined>(
    cacheKeyGenerator('comments', getCommentsByPhotoIdQuery.name, filter),
    () => getList(() => getCommentsByPhotoIdQuery(photoId))
  );

  return comments;
};

export const useCommentMutator = () => {
  const matchMutate = useMatchMutate();

  const mutateComment = (data: any) => matchMutate(/^comments/, data);

  return {
    createComment: (data: Partial<SCommentSchema>) => createComment(data, mutateComment),
    updateComment: (data: Partial<SCommentSchema>) => updateComment(data, mutateComment),
    deleteComment: (id: number) => deleteComment(id, mutateComment),
    restoreComment: (data: Partial<SCommentSchema>) => restoreComment(data, mutateComment),
  };
};

const getCommentsByPhotoIdQuery = async (photoId: number) =>
  await supabase.from<SCommentSchema>(SUPABASE_BUCKET_COMMENTS_PATH).select(`*`).eq('photo_id', photoId);

export const createComment = async (sendData: Partial<SCommentSchema>, mutate?: MutateComment) => {
  const query = supabase.from<SCommentSchema>(SUPABASE_BUCKET_COMMENTS_PATH).insert([sendData]);

  const comments = await getList(async () => await query);

  if (mutate) {
    await mutate(comments, false);
  }

  return comments;
};

export const updateComment = async ({ id, body }: Partial<SCommentSchema>, mutate?: MutateComment) => {
  const query = supabase
    .from<SCommentSchema>(SUPABASE_BUCKET_COMMENTS_PATH)
    .update({ body, is_edited: true, updated_at: localeDateNowSQL() })
    .match({ id })
    .single();

  const updatedComment = await getItem(async () => await query);

  if (mutate) {
    await mutate((prev?: Comment[]) => {
      if (!prev) return;

      return [...prev].map((c) => {
        if (c.id !== updatedComment?.id) return c;
        return updatedComment;
      });
    }, false);
  }
  return updatedComment;
};

export const deleteComment = async (id: number, mutate?: MutateComment) => {
  const query = supabase.from<SCommentSchema>(SUPABASE_BUCKET_COMMENTS_PATH).delete().eq('id', id);

  const deletedComments = await getList(async () => await query);
  const deletedComment = deletedComments && deletedComments[0];

  if (mutate) {
    await mutate((prev?: Comment[]) => {
      if (!prev) return;

      return [...prev].filter((c) => {
        return c.id !== deletedComment?.id;
      });
    }, false);
  }

  return deletedComment;
};

const restoreComment = async (data: Partial<SCommentSchema>, mutate?: MutateComment) => {
  const query = supabase.from<SCommentSchema>(SUPABASE_BUCKET_COMMENTS_PATH).upsert(data);

  const upsertedComments = await getList(async () => await query);
  const upsertedComment = upsertedComments && upsertedComments[0];

  if (mutate) {
    await mutate((prev?: Comment[]) => {
      if (!prev) return;

      return [...prev].map((c) => {
        if (c.id !== upsertedComment?.id) return c;

        return upsertedComment;
      });
    }, false);
  }

  return upsertedComment;
};
