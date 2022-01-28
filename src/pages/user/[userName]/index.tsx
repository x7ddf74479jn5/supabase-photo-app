import type { GetServerSidePropsContext, NextPage } from 'next';

import { UserDetail } from '@/components/page/User';
import { Layout } from '@/components/ui/Layout';
import { Profile } from '@/types';

import { getProfileServer } from '@/usecases/user';
import { usePhotoList } from '@/usecases/photo';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  const user = await getProfileServer(String(params?.userName));

  if (!user) {
    return { notFound: true };
  }

  return { props: { user } };
}

type props = {
  user: Profile;
};

const UserPage: NextPage<props> = ({ user }) => {
  const { data: publicPhotos } = usePhotoList(user.id);
  return (
    <Layout>
      <UserDetail user={user} publicPhotos={publicPhotos ?? []} />
    </Layout>
  );
};

export default UserPage;
