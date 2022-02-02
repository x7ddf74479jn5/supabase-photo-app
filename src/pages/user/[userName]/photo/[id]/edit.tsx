import type { GetServerSidePropsContext, NextPage } from 'next';

import { UserPhotoEdit } from '@/components/model/User';
import { Layout } from '@/components/ui/Layout';
import { PublicPhoto } from '@/types';
import { getPhoto } from '@/usecases/photo';
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

  const photoData = getPhoto(String(params?.id));

  if (!photoData) {
    return { notFound: true };
  }
  return { props: { photoData } };
}

type props = {
  photoData: PublicPhoto;
};

const UserPhotoEditPage: NextPage<props> = ({ photoData }) => {
  return (
    <Layout>
      <UserPhotoEdit photoData={photoData} />
    </Layout>
  );
};

export default UserPhotoEditPage;
