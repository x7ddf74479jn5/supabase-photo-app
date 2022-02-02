import type { GetServerSidePropsContext, NextPage } from 'next';

import { UserDetail } from '@/components/page/User';
import { Layout } from '@/components/ui/Layout';
import { Profile, PublicPhoto } from '@/types';
import { getProfileServer } from '@/usecases/user';
import { getPublishedPhotoList } from '@/usecases/photo';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  const user = await getProfileServer(String(params?.userName));

  if (!user) {
    return { notFound: true };
  }

  const publicPhotos = await getPublishedPhotoList();

  return { props: { user, publicPhotos } };
}

type props = {
  user: Profile;
  publicPhotos: PublicPhoto[];
};

const UserPage: NextPage<props> = ({ user, publicPhotos }) => {
  return (
    <Layout>
      <UserDetail user={user} publicPhotos={publicPhotos} />
    </Layout>
  );
};

export default UserPage;
