import { supabase } from '@/lib/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';

export const signUpWithEmailAndPassword = async (email: string, password: string) => {
  await supabase.auth.signUp({
    email,
    password,
  });
};

export const signInWithGoogle = async () => {
  await supabase.auth.signIn({ provider: 'google' });
};

export const signInWithEmailAndPassword = async (email: string, password: string) => {
  return await supabase.auth.signIn({
    email,
    password,
  });
};

export const signOut = async () => {
  await supabase.auth.signOut();
};

export const listenAuthState = () => {
  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    fetch('/api/auth', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ event, session }),
    }).then((res) => res.json());
  });

  return authListener;
};

export const getUserByCooke = async (req: any) => {
  return await supabase.auth.api.getUserByCookie(req);
};

export const setAuthCookie = (req: NextApiRequest, res: NextApiResponse) => {
  supabase.auth.api.setAuthCookie(req, res);
};
