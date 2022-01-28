import { User } from '@supabase/supabase-js';
import type { GetServerSidePropsContext, NextPage } from 'next';

import { DashboardLikes } from '@/components/page/DashboardLikes';
import { Layout } from '@/components/ui/Layout';
import { supabase } from '@/lib/supabaseClient';
import { useLikes } from '@/usecases/like';
import { useMemo } from 'react';

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  // If there is a user, return it.
  return { props: { user } };
}

type props = {
  user: User;
};

const DashboardLikesPage: NextPage<props> = ({ user }) => {
  const { data: likes } = useLikes(user.id);

  const publicPhotos = useMemo(() => {
    return likes
      ? likes.map((like) => {
          return {
            id: like.photo.id,
            title: like.photo.title,
            url: like.photo.url,
            isPublished: like.photo.isPublished,
            updatedAt: like.photo.updatedAt,
            createdAt: like.photo.createdAt,
            user: like.user,
            userId: like.userId,
          };
        })
      : [];
  }, [likes]);

  return (
    <Layout>
      <DashboardLikes user={user} publicPhotos={publicPhotos} />
    </Layout>
  );
};

export default DashboardLikesPage;
