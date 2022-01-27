import { SnakeCasedPropertiesDeep } from 'type-fest';

import { Profile, Like, Comment } from '.';

export type PublicPhoto = {
  id: number;
  title: string;
  url: string;
  isPublished: boolean;
  updatedAt: string | null;
  createdAt: string;
  key?: string;
  comments?: Comment[] | null;
  likes?: Like[];
  user?: Profile;
  userId?: string;
};

export type SPublicPhotoSchema = SnakeCasedPropertiesDeep<PublicPhoto>;
