import React from 'react';

import { useUser } from '@/hooks/useUser';
import { Profile, PublicPhoto } from '@/types';

import { UserPhotoItem } from '../UserPhotoItem';

type props = {
  user: Profile;
  publicPhotos: PublicPhoto[];
};

export const UserPhotoList: React.FC<props> = ({ user, publicPhotos }) => {
  const { user: sessionUser } = useUser();
  return (
    <ul className='flex flex-wrap'>
      {publicPhotos.map((p) => {
        if (sessionUser?.id !== user.id && !p.isPublished) return null;

        return <UserPhotoItem key={p.id} user={user} publicPhoto={p} />;
      })}
    </ul>
  );
};
