import React, { useMemo } from 'react';

import { Profile, PublicPhoto } from '@/types';

import { CommentItem } from '../CommentItem';

type props = {
  user: Profile | undefined;
  photoData: PublicPhoto;
};

export const CommentList: React.FC<props> = ({ user, photoData }) => {
  const sortedData = useMemo(() => {
    if (!photoData || !photoData.comments) return null;

    return photoData.comments.sort((a, b) => {
      if (a.updatedAt < b.updatedAt) return 1;
      if (a.updatedAt > b.updatedAt) return -1;

      return 0;
    });
  }, [photoData]);

  return (
    <ul className=''>
      {sortedData ? (
        sortedData.map((c) => {
          return <CommentItem key={c.id} user={user} comment={c} photoData={photoData} />;
        })
      ) : (
        <div>
          <p>コメントはありません</p>
        </div>
      )}
    </ul>
  );
};
