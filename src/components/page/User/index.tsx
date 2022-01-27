import React from 'react';
import Image from 'next/image';

import { UserPhotoList } from '@/components/model/User';
import { Main } from '@/components/ui/Main';
import { PublicPhoto, Profile } from '@/types';

type props = {
  user: Profile;
  publicPhotos: PublicPhoto[];
};

export const UserDetail: React.FC<props> = ({ user, publicPhotos }) => {
  return (
    <Main>
      <div className='mb-6'>
        <h2 className='text-xl mb-4'>{user.nickname ?? '名無し'}さんの画像一覧</h2>
        {user.avatarUrl && (
          <Image src={user.avatarUrl ?? ''} width={48} height={48} alt={user.id ?? ''} className='rounded-full' />
        )}
      </div>
      <div className='py-2'>
        <UserPhotoList user={user} publicPhotos={publicPhotos} />
      </div>
    </Main>
  );
};
