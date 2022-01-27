import { CamelCasedPropertiesDeep, SnakeCasedPropertiesDeep } from 'type-fest';

import { definitions } from './supabase';
import { Profile, Like, Comment } from '.';

export type SPhotoSchema = definitions['photos'];
export type PhotoSchema = CamelCasedPropertiesDeep<definitions['photos']>;
export type Photo = PhotoSchema;

export type PublicPhoto = Photo & {
  key?: string;
  comments?: Comment[] | null;
  likes?: Like[];
  user?: Profile;
};

export type SPublicPhotoSchema = SnakeCasedPropertiesDeep<PublicPhoto>;
