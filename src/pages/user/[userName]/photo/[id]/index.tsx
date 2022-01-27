import type { GetServerSidePropsContext, NextPage } from 'next';

import { UserPhoto } from '@/components/model/User/UserPhoto';
import { Layout } from '@/components/ui/Layout';
import { PublicPhoto } from '@/types';
import { getPhotoServer } from '@/usecases/photo';

export async function getServerSideProps({ params }: GetServerSidePropsContext) {
  const photoData = await getPhotoServer(String(params?.id));

  if (!photoData || !photoData.isPublished) {
    return { notFound: true };
  }
  return { props: { photoData } };
}

type props = {
  photoData: PublicPhoto;
};

const UserPhotoPage: NextPage<props> = ({ photoData }) => {
  return (
    <Layout>
      <UserPhoto photoData={photoData} />
    </Layout>
  );
};

export default UserPhotoPage;
