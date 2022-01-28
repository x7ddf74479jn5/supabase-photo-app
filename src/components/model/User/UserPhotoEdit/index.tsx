import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Router from 'next/router';
import { toast } from 'react-toastify';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Main } from '@/components/ui/Main';

import { PublicPhoto, SCommentSchema, SLikeSchema, SPhotoSchema } from '@/types';

import { deletePhoto, restorePhoto, updatePhoto } from '@/usecases/photo';
import { deleteLikesByPhotoId, restoreLike } from '@/usecases/like';
import { deleteCommentsByPhotoId, restoreComment } from '@/usecases/comments';

type props = {
  photoData: PublicPhoto;
};

type Inputs = {
  title: string;
  is_published: boolean;
};

export const UserPhotoEdit: React.FC<props> = ({ photoData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Inputs>();

  const deletedLikesRef = useRef<SLikeSchema[] | null>([]);
  const deletedCommentsRef = useRef<SCommentSchema[] | null>([]);
  const deletedPhotoRef = useRef<SPhotoSchema | undefined>(undefined);

  useEffect(() => {
    setValue('title', photoData.title);
    setValue('is_published', photoData.isPublished);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data, event): Promise<void> => {
    try {
      // レコード更新
      await updatePhoto({ ...data, id: photoData.id });
      toast.success('画像を更新しました！');
      Router.push(`/user/${photoData?.user?.id}`);
    } catch (error) {
      console.log(error);
      toast.error('エラーが発生しました。');
    }
  };

  const restore = async () => {
    if (deletedLikesRef.current && deletedLikesRef.current.length > 0) {
      await Promise.all(deletedLikesRef.current.map((like) => restoreLike(like)));
      deletedLikesRef.current = null;
    }

    if (deletedCommentsRef.current && deletedCommentsRef.current.length > 0) {
      await Promise.all(deletedCommentsRef.current.map((comment) => restoreComment(comment)));
      deletedCommentsRef.current = null;
    }

    await restorePhoto(photoData);
  };

  // FIXME: Supabase functionsでトランザクションを実装
  // @see https://github.com/supabase/postgrest-js/issues/237#issuecomment-739537955
  // @see https://supabase.com/docs/reference/javascript/rpc
  const handleDelete = async (id: number) => {
    if (!window.confirm('削除しますか？')) return;

    try {
      // まずlikes, commentsを削除
      deletedLikesRef.current = await deleteLikesByPhotoId(id);
      deletedCommentsRef.current = await deleteCommentsByPhotoId(id);

      // レコード削除
      const { data: deletedPhoto } = await deletePhoto(id);
      deletedPhotoRef.current = deletedPhoto![0];
      toast.success('削除しました');
      Router.push(`/user/${photoData?.user?.id}`);
    } catch (error) {
      console.log(error);
      toast.error('削除に失敗しました。');

      await restore();
    }
  };

  return (
    <Main>
      <h2 className='text-xl mb-4'>画像編集</h2>
      <div>
        <Image
          className='w-4/12'
          src={photoData.url}
          alt='image'
          width={300}
          height={200}
          layout='fixed'
          objectFit={'cover'}
        />
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
          <label htmlFor='title'>画像タイトル</label>
          <input id='title' className='py-1 px-2 border-2 w-80' {...register('title', { required: true })} />
          {errors.title && <span>This field is required</span>}

          <label htmlFor='is_published' className='mt-4'>
            公開状態
          </label>
          <input type='checkbox' id='is_published' className='py-1 px-2 border-2' {...register('is_published')} />

          <input className='mt-6 border-gray-300 border-2 rounded p-1 w-12' type='submit' value={'更新'} />
        </form>
      </div>
      <div className='mt-4'>
        <button onClick={() => handleDelete(photoData.id)} className='border-gray-300 border-2 rounded p-1 w-12'>
          削除
        </button>
      </div>
    </Main>
  );
};
