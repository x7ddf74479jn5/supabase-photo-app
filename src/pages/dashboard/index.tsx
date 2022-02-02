import { User } from '@supabase/supabase-js';
import type { GetServerSidePropsContext, NextPage } from 'next';

import { Dashboard } from '@/components/page/Dashboard';
import { Layout } from '@/components/ui/Layout';
import { getPublishedPhotoList } from '@/usecases/photo';
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

  const publicPhotos = await getPublishedPhotoList();

  // If there is a user, return it.
  return { props: { user, publicPhotos } };
}

type props = {
  user: User;
  publicPhotos: PublicPhoto[];
};

const DashboardPage: NextPage<props> = ({ user, publicPhotos }) => {
  return (
    <Layout>
      <Dashboard user={user} publicPhotos={publicPhotos} />
    </Layout>
  );
};

export default DashboardPage;
