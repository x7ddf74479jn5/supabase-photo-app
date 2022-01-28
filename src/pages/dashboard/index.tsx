import { User } from '@supabase/supabase-js';
import type { GetServerSidePropsContext, NextPage } from 'next';

import { Dashboard } from '@/components/page/Dashboard';
import { Layout } from '@/components/ui/Layout';
import { supabase } from '@/lib/supabaseClient';
import { usePhotoList } from '@/usecases/photo';

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

const DashboardPage: NextPage<props> = ({ user }) => {
  const { data: publicPhotos } = usePhotoList(user.id);

  return (
    <Layout>
      <Dashboard user={user} publicPhotos={publicPhotos ?? []} />
    </Layout>
  );
};

export default DashboardPage;
