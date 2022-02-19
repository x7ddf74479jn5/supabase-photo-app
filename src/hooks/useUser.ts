import Router from 'next/router';
import { Auth } from '@supabase/ui';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { useProfile, useProfileMutator } from '@/usecases/user';
import { listenAuthState, signInWithGoogle as _signInWithGoogle, signOut as _signOut } from '@/usecases/authUser';

const useUser = () => {
  const { user, session } = Auth.useUser();
  const profile = useProfile(session?.user?.id);
  const { updateProfile } = useProfileMutator();

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

    await updateProfile({ id: user?.id, nickname });
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
