import Router from 'next/router';
import { Auth } from '@supabase/ui';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { useProfile, updateNickname as _updateNickname } from '@/usecases/user';
import { listenAuthState, signInWithGoogle as _signInWithGoogle, signOut as _signOut } from '@/usecases/authUser';

const useUser = () => {
  const { user, session } = Auth.useUser();
  const { data: profile, mutate } = useProfile(session?.user?.id);

  useEffect(() => {
    const authListener = listenAuthState();
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    await _signInWithGoogle();
    toast.success('ログインしました！');
  };

  const signOut = async () => {
    await _signOut();
    toast.success('ログアウトしました！');
    Router.push('/');
  };

  const updateNickname = async (nickname: string) => {
    if (!user?.id) {
      toast.error('ログインしてください');
      return;
    }

    const newUser = await _updateNickname(user?.id, nickname);
    mutate(newUser);
    toast.success('ニックネームを更新しました！');
    Router.push('/account');
  };

  return {
    user,
    session,
    profile,
    signInWithGoogle,
    signOut,
    updateNickname,
  };
};

export { useUser };
