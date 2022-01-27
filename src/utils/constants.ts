export const SUPABASE_BUCKET_PHOTOS_PATH = 'photos';
export const SUPABASE_BUCKET_USERS_PATH = 'users';
export const SUPABASE_BUCKET_COMMENTS_PATH = 'comments';
export const SUPABASE_BUCKET_LIKES_PATH = 'likes';

const bucket = [
  SUPABASE_BUCKET_COMMENTS_PATH,
  SUPABASE_BUCKET_LIKES_PATH,
  SUPABASE_BUCKET_PHOTOS_PATH,
  SUPABASE_BUCKET_USERS_PATH,
] as const;

export type Bucket = typeof bucket[number];
