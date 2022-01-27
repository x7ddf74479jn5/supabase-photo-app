import { CamelCasedPropertiesDeep } from 'type-fest';

import { definitions } from './supabase';

export type SProfileSchema = definitions['users'];
export type ProfileSchema = CamelCasedPropertiesDeep<definitions['users']>;
export type Profile = ProfileSchema;
