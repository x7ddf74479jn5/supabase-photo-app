import type { GetServerSidePropsContext, NextPage } from 'next';

import { UserPhotoNew } from '@/components/model/User';
import { Layout } from '@/components/ui/Layout';
import { Profile } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { getProfileServer } from '@/usecases/user';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  const { token } = await supabase.auth.api.getUserByCookie(req);

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const user = await getProfileServer(String(params?.userName));

  if (!user) {
    return { notFound: true };
  }
  return { props: { user } };
}

type props = {
  user: Profile;
};

const UserPhotoNewPage: NextPage<props> = ({ user }) => {
  return (
    <Layout>
      <UserPhotoNew user={user} />
    </Layout>
  );
};

export default UserPhotoNewPage;
