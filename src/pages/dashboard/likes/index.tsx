import { User } from '@supabase/supabase-js';
import type { GetServerSidePropsContext, NextPage } from 'next';

import { DashboardLikes } from '@/components/page/DashboardLikes';
import { Layout } from '@/components/ui/Layout';
import { PublicPhoto } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { getLikesServer } from '@/usecases/like';

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  const likes = user ? await getLikesServer(user.id) : [];

  const publicPhotos: PublicPhoto[] = [];

  async function setPublicPhotos() {
    if (likes) {
      for (const like of likes) {
        publicPhotos.push({
          id: like.photo.id,
          title: like.photo.title,
          url: like.photo.url,
          isPublished: like.photo.isPublished,
          updatedAt: like.photo.updatedAt,
          createdAt: like.photo.createdAt,
          user: like.user,
          userId: like.userId,
        });
      }
    }
  }
  await setPublicPhotos();

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
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
