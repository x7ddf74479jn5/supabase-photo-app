import { User } from '@supabase/supabase-js';
import type { GetServerSidePropsContext, NextPage } from 'next';

import { DashboardLikes } from '@/components/page/DashboardLikes';
import { Layout } from '@/components/ui/Layout';
import { getLikes } from '@/usecases/like';
import { getUserByCooke } from '@/usecases/authUser';
import { PublicPhoto } from '@/types';

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const { user } = await getUserByCooke(req);

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const likes = await getLikes(user.id);

  const publicPhotos = likes
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

  // If there is a user, return it.
  return { props: { user, publicPhotos } };
}

type props = {
  user: User;
  publicPhotos: PublicPhoto[];
};

const DashboardLikesPage: NextPage<props> = ({ user, publicPhotos }) => {
  return (
    <Layout>
      <DashboardLikes user={user} publicPhotos={publicPhotos} />
    </Layout>
  );
};

export default DashboardLikesPage;
