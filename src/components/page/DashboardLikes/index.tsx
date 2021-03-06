import React from 'react';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';
import { DateTime } from 'luxon';
import Link from 'next/link';

import { Main } from '@/components/ui/Main';
import { PublicPhoto } from '@/types';

type props = {
  user: User;
  publicPhotos: PublicPhoto[];
};

export const DashboardLikes: React.FC<props> = ({ publicPhotos }) => {
  return (
    <Main>
      <div className='mb-6'>
        <h2 className='text-xl mb-4'>いいねした画像一覧</h2>
      </div>
      <div className='py-2'>
        <ul className='flex flex-wrap'>
          {publicPhotos.map((photo) => {
            return (
              <li key={photo.id} className='mb-6 w-1/2'>
                <div className='flex'>
                  <div>
                    <Link href={`/user/${photo.user?.id}/photo/${photo.id}`}>
                      <a>
                        <Image
                          src={photo.url ?? ''}
                          width={300}
                          height={200}
                          alt={photo.title ?? ''}
                          objectFit={'cover'}
                        />
                      </a>
                    </Link>
                  </div>
                  <div className='ml-4'>
                    <Link href={`/user/${photo.user?.id}`}>
                      <a className='underline'>
                        <p>{photo.user?.nickname ?? '名無しさん'}</p>
                      </a>
                    </Link>
                    <h3 className='text-xl mb-1'>{photo.title}</h3>
                    <p className='text-xs mb-1'>
                      投稿日: {DateTime.fromISO(photo.updatedAt ?? photo.createdAt).toFormat('yyyy.MM.dd')}
                    </p>
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
