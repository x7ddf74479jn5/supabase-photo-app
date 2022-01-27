import { User } from '@supabase/supabase-js';
import type { GetServerSidePropsContext, NextPage } from 'next';

import { Dashboard } from '@/components/page/Dashboard';
import { Layout } from '@/components/ui/Layout';
import { PublicPhoto } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { getPhotoListServer } from '@/usecases/photo';

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

  const publicPhotos = (await getPhotoListServer(user?.id)) ?? [];

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
