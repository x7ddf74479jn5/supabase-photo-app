import { CamelCasedPropertiesDeep } from 'type-fest';

import { definitions } from './supabase';

export type SProfile = definitions['users'];
export type SPhoto = definitions['photos'];
export type SComment = definitions['comments'];
export type SLike = definitions['likes'];

export type Profile = CamelCasedPropertiesDeep<definitions['users']>;
export type Photo = CamelCasedPropertiesDeep<definitions['photos']>;
export type Comment = CamelCasedPropertiesDeep<definitions['comments']>;
export type Like = CamelCasedPropertiesDeep<definitions['likes']>;
