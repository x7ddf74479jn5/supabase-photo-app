import { SPhotoSchema, SProfileSchema } from './index';
import { CamelCasedPropertiesDeep } from 'type-fest';

import { definitions } from './supabase';

export type SLikeSchema = definitions['likes'];
export type LikeSchema = CamelCasedPropertiesDeep<definitions['likes']>;
export type Like = LikeSchema;

export type SLikeWithPhotoAndUser = SLikeSchema & { photo: SPhotoSchema; user: SProfileSchema };
export type LikeWithPhotoAndUser = CamelCasedPropertiesDeep<SLikeWithPhotoAndUser>;
