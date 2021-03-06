import React from 'react';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';
import { DateTime } from 'luxon';
import Router from 'next/router';

import { Main } from '@/components/ui/Main';
import { PublicPhoto } from '@/types';
import { useUser } from '@/hooks/useUser';

type props = {
  user: User;
  publicPhotos: PublicPhoto[];
};

export const Dashboard: React.FC<props> = ({ user, publicPhotos }) => {
  const { profile } = useUser();

  return (
    <Main>
      <div className='mb-6'>
        <h2 className='text-xl mb-4'>投稿画像一覧</h2>
      </div>
      <div className='py-2'>
        <ul className='flex flex-wrap'>
          {publicPhotos.map((photo) => {
            return (
              <li key={photo.id} className='mb-6 w-1/2'>
                <div className='flex'>
                  <div>
                    <Image src={photo.url ?? ''} width={300} height={200} alt={photo.title ?? ''} objectFit={'cover'} />
                  </div>
                  <div className='ml-4'>
                    <h3 className='text-xl mb-1'>{photo.title}</h3>
                    <p className='text-xs mb-1'>
                      投稿日: {DateTime.fromISO(photo.updatedAt ?? photo.createdAt).toFormat('yyyy.MM.dd')}
                    </p>
                    <p className='text-xs'>is_published: {photo.isPublished ? 'true' : 'false'}</p>
                    <button
                      onClick={() => Router.push(`/user/${profile?.id}/photo/${photo.id}/edit`)}
                      className='border-gray-300 border-2 rounded w-12 p-1 mt-2'
                    >
                      編集
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Main>
  );
};
