import { supabase } from '@/lib/supabaseClient';
import { SCommentSchema, CommentSchema } from '@/types';
import { camelizeDeeply } from '@/utils/camerizeDeeply';
import { SUPABASE_BUCKET_COMMENTS_PATH } from '@/utils/constants';
import { localeDateNowSQL } from '@/utils/date';

export const createComment = async (sendData: Partial<SCommentSchema>) =>
  await supabase.from<SCommentSchema>(SUPABASE_BUCKET_COMMENTS_PATH).insert([sendData]);

export const updateComment = async ({ id, body }: Partial<SCommentSchema>) =>
  await supabase
    .from<SCommentSchema>(SUPABASE_BUCKET_COMMENTS_PATH)
    .update({ body, is_edited: true, updated_at: localeDateNowSQL() })
    .match({ id })
    .single();

export const deleteComment = async ({ id }: Partial<SCommentSchema>) => {
  return await supabase.from<SCommentSchema>(SUPABASE_BUCKET_COMMENTS_PATH).delete().eq('id', id);
};
export const getCommentsByPhotoId = async (photoId: number) =>
  await supabase.from<SCommentSchema>(SUPABASE_BUCKET_COMMENTS_PATH).select(`*`).eq('photo_id', photoId);

export const deleteCommentsByPhotoId = async (photoId: number) => {
  const { data: comments } = await getCommentsByPhotoId(photoId);
  let _deleted: SCommentSchema[] = [];

  if (comments) {
    for (const comment of comments) {
      const { data: deleted } = await deleteComment({ id: comment.id });
      deleted && _deleted.concat(deleted);
    }
  }

  return _deleted;
};

export const restoreComment = async (data: Partial<SCommentSchema>) => {
  await supabase.from<SCommentSchema>(SUPABASE_BUCKET_COMMENTS_PATH).upsert(data);
};
