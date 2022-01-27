import { CamelCasedPropertiesDeep } from 'type-fest';

import { definitions } from './supabase';
import { Profile } from './profile';

export type SCommentSchema = definitions['comments'];
export type CommentSchema = CamelCasedPropertiesDeep<definitions['comments']>;
export type Comment = CommentSchema & { user: Profile };
