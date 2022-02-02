import type { GetServerSidePropsContext, NextPage } from 'next';

import { UserPhotoNew } from '@/components/model/User';
import { Layout } from '@/components/ui/Layout';
import { Profile } from '@/types';
import { getProfileServer } from '@/usecases/user';
import { getUserByCooke } from '@/usecases/authUser';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  const { token } = await getUserByCooke(req);

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
