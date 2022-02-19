import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { toast } from 'react-toastify';
import Router from 'next/router';
import { DateTime } from 'luxon';
import Link from 'next/link';

import { CommentList } from '@/components/model/Comment';
import { Main } from '@/components/ui/Main';
import { useUser } from '@/hooks/useUser';
import { Like, PublicPhoto, SCommentSchema } from '@/types';
import { useLikeMutator } from '@/usecases/like';

type props = {
  photoData: PublicPhoto;
};

export const UserPhoto: React.FC<props> = ({ photoData }) => {
  const [comment, setComment] = useState<string>('');
  const [like, setLike] = useState<Like | null>();
  const [likeCount, setLikeCount] = useState<number>(0);

  const { profile } = useUser();
  const { deleteLike, createLike } = useLikeMutator();

  useEffect(() => {
    setLikeCount(photoData.likes && photoData.likes.length ? photoData.likes.length : 0);

    if (photoData && photoData.likes && photoData.likes.some((like) => like.userId === profile?.id)) {
      setLike(photoData.likes.filter((like) => like.userId === profile?.id)[0]);

      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profile) {
      toast.info('ログインしてください。');

      return;
    }

    const value: Partial<SCommentSchema> = {
      user_id: profile.id,
      photo_id: photoData.id,
      body: comment,
    };

    await fetch('/api/comment', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ value }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }

        toast.success('コメントを投稿しました！');
        Router.push(
          {
            pathname: `/user/${photoData?.user?.id}/photo/${photoData.id}`,
          },
          undefined,
          { scroll: false }
        );
      })
      .catch((error) => {
        toast.error('エラーが発生しました。');
      })
      .finally(() => {
        setComment('');
      });
  };

  const handleLike = useCallback(async () => {
    if (!profile) {
      toast.info('ログインしてください。');

      return;
    }

    try {
      if (like) {
        await deleteLike(like.id);
        setLike(null);
        setLikeCount(likeCount - 1);
      } else {
        const data = await createLike({ user_id: profile.id, photo_id: photoData.id });
        setLike(data && data[0]);
        setLikeCount(likeCount + 1);
      }
    } catch (error) {
      console.log(error);
      toast.error('エラーが発生しました。');
    }
  }, [createLike, deleteLike, like, likeCount, photoData.id, profile]);

  return (
    <Main>
      <div className='flex items-center mb-4'>
        {photoData?.user?.avatarUrl && (
          <div className='flex items-center mr-2'>
            <Link href={`/user/${photoData?.user?.id}`}>
              <a className=''>
                <Image
                  className='rounded-full'
                  src={photoData?.user?.avatarUrl}
                  width={30}
                  height={30}
                  alt={photoData?.user?.nickname ?? ''}
                ></Image>
              </a>
            </Link>
          </div>
        )}
        <p>{photoData?.user?.nickname}</p>
      </div>
      <p className='text-sm mb-2'>
        投稿日: {DateTime.fromISO(photoData.updatedAt ?? photoData.createdAt).toFormat('yyyy.MM.dd')}
      </p>
      <h2 className='text-2xl mb-2'>{photoData.title}</h2>
      <div>
        <Image src={photoData.url} alt='image' width={300} height={200} />
      </div>
      <div className='w-96 flex py-2'>
        <button className='mr-2' onClick={() => handleLike()}>
          {like ? <AiFillHeart size={24} /> : <AiOutlineHeart size={24} />}
        </button>
        <span>{likeCount}</span>
      </div>
      <div className='mt-4 pt-4 border-t-2'>
        <h3 id='comments' className='text-xl mb-4 font-bold'>
          コメント一覧
        </h3>
        <CommentList user={photoData?.user} photoData={photoData} />
        <div className='mt-6'>
          <h2 className='text-base font-bold mb-2'>コメントを投稿する</h2>
          <div>
            <form onSubmit={handleSend} className='flex flex-col'>
              <textarea
                required
                value={comment ?? ''}
                onChange={(e) => setComment(e.target.value)}
                placeholder=''
                className='border-gray-300 border-2 rounded p-1 mr-2 mb-2 w-96'
              />
              <button type='submit' className='border-gray-300 border-2 rounded p-1 w-12'>
                投稿
              </button>
            </form>
          </div>
        </div>
      </div>
    </Main>
  );
};
